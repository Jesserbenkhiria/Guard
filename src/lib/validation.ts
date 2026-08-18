import { parseISO, getDay } from 'date-fns'
import type { Agent, Assignment, Requirement, ValidationAlert, PlanningStats } from '../types'
import {
  getShiftDurationHours,
  isDateInVacation,
  isNightShift,
  timesOverlap,
} from './utils'
import { requirements } from '../data/seed'

function alertId(parts: string[]): string {
  return parts.join('-')
}

export function validateAssignment(
  agent: Agent,
  requirement: Requirement,
  allAssignments: Assignment[],
  allRequirements: Requirement[],
): ValidationAlert[] {
  const alerts: ValidationAlert[] = []
  const assignmentId = `pending-${requirement.id}-${agent.id}`

  if (isDateInVacation(requirement.date, agent.vacations)) {
    alerts.push({
      id: alertId(['vacation', requirement.id, agent.id]),
      requirementId: requirement.id,
      agentId: agent.id,
      level: 'error',
      message: `${agent.lastName} ${agent.firstName} est en congé à cette date.`,
    })
  }

  const night = isNightShift(requirement.startTime, requirement.endTime)
  if (agent.shiftRestriction === 'day' && night) {
    alerts.push({
      id: alertId(['night', requirement.id, agent.id]),
      requirementId: requirement.id,
      agentId: agent.id,
      level: 'error',
      message: `${agent.lastName} ${agent.firstName} ne peut pas être affecté(e) à une équipe de nuit.`,
    })
  }
  if (agent.shiftRestriction === 'night' && !night) {
    alerts.push({
      id: alertId(['day', requirement.id, agent.id]),
      requirementId: requirement.id,
      agentId: agent.id,
      level: 'error',
      message: `${agent.lastName} ${agent.firstName} ne peut travailler qu'en équipe de nuit.`,
    })
  }

  if (agent.preferredDays && agent.preferredDays.length > 0) {
    const day = getDay(parseISO(requirement.date)) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    if (!agent.preferredDays.includes(day)) {
      alerts.push({
        id: alertId(['pref', requirement.id, agent.id]),
        requirementId: requirement.id,
        agentId: agent.id,
        level: 'warning',
        message: `${agent.lastName} ${agent.firstName} travaille habituellement d'autres jours.`,
      })
    }
  }

  const agentAssignments = allAssignments.filter((a) => a.agentId === agent.id)
  for (const existing of agentAssignments) {
    if (existing.requirementId === requirement.id) continue
    const existingReq = allRequirements.find((r) => r.id === existing.requirementId)
    if (!existingReq || existingReq.date !== requirement.date) continue

    if (
      timesOverlap(
        requirement.startTime,
        requirement.endTime,
        existingReq.startTime,
        existingReq.endTime,
      )
    ) {
      alerts.push({
        id: alertId(['double', requirement.id, agent.id, existing.requirementId]),
        requirementId: requirement.id,
        agentId: agent.id,
        level: 'error',
        message: `${agent.lastName} ${agent.firstName} travaille déjà sur un autre site à cette heure.`,
      })
    }
  }

  const monthPrefix = requirement.date.slice(0, 7)
  const monthHours = agentAssignments.reduce((total, a) => {
    const req = allRequirements.find((r) => r.id === a.requirementId)
    if (!req || !req.date.startsWith(monthPrefix)) return total
    return total + getShiftDurationHours(req.startTime, req.endTime)
  }, 0)

  const shiftHours = getShiftDurationHours(requirement.startTime, requirement.endTime)
  const projectedHours = monthHours + shiftHours

  if (agent.cannotExceedContract && projectedHours > agent.contractHours) {
    alerts.push({
      id: alertId(['contract', requirement.id, agent.id]),
      requirementId: requirement.id,
      agentId: agent.id,
      level: 'error',
      message: `${agent.lastName} ${agent.firstName} dépasse son contrat de ${agent.contractHours}h (${projectedHours.toFixed(1)}h projetées).`,
    })
  } else if (projectedHours > agent.contractHours) {
    if (!agent.overtimeAllowed) {
      alerts.push({
        id: alertId(['overtime', requirement.id, agent.id]),
        requirementId: requirement.id,
        agentId: agent.id,
        level: 'error',
        message: `${agent.lastName} ${agent.firstName} dépasse ${agent.contractHours}h sans autorisation d'heures sup.`,
      })
    } else {
      alerts.push({
        id: alertId(['overtime-warn', requirement.id, agent.id]),
        requirementId: requirement.id,
        agentId: agent.id,
        level: 'warning',
        message: `${agent.lastName} ${agent.firstName} dépassera son contrat (${projectedHours.toFixed(1)}h projetées). Heures sup autorisées.`,
      })
    }
  }

  if (agent.maxVacations !== undefined && agent.vacations.length >= agent.maxVacations) {
    alerts.push({
      id: alertId(['maxvac', requirement.id, agent.id]),
      requirementId: requirement.id,
      agentId: agent.id,
      level: 'warning',
      message: `${agent.lastName} ${agent.firstName} a atteint le maximum de ${agent.maxVacations} congés.`,
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      id: alertId(['ok', requirement.id, agent.id]),
      assignmentId: assignmentId,
      requirementId: requirement.id,
      agentId: agent.id,
      level: 'success',
      message: `Affectation acceptée pour ${agent.lastName} ${agent.firstName}.`,
    })
  }

  return alerts
}

export function validateAllAssignments(
  agents: Agent[],
  assignments: Assignment[],
  allRequirements: Requirement[] = requirements,
): ValidationAlert[] {
  const allAlerts: ValidationAlert[] = []

  for (const assignment of assignments) {
    const agent = agents.find((a) => a.id === assignment.agentId)
    const requirement = allRequirements.find((r) => r.id === assignment.requirementId)
    if (!agent || !requirement) continue

    const others = assignments.filter((a) => a.id !== assignment.id)
    const alerts = validateAssignment(agent, requirement, others, allRequirements)
    const filtered = alerts.filter((a) => a.level !== 'success')
    for (const alert of filtered) {
      allAlerts.push({ ...alert, assignmentId: assignment.id })
    }
  }

  for (const requirement of allRequirements) {
    const assigned = assignments.filter((a) => a.requirementId === requirement.id)
    if (assigned.length < requirement.agentsNeeded) {
      allAlerts.push({
        id: alertId(['coverage', requirement.id]),
        requirementId: requirement.id,
        agentId: '',
        level: 'warning',
        message: `Couverture incomplète : ${assigned.length}/${requirement.agentsNeeded} agent(s) affecté(s).`,
      })
    }
  }

  return allAlerts
}

export function computeStats(
  agents: Agent[],
  sites: { id: string }[],
  assignments: Assignment[],
  alerts: ValidationAlert[],
): PlanningStats {
  const totalNeeded = requirements.reduce((s, r) => s + r.agentsNeeded, 0)
  const totalAssigned = assignments.length
  const pendingAssignments = Math.max(0, totalNeeded - totalAssigned)

  return {
    agentCount: agents.length,
    siteCount: sites.length,
    pendingAssignments,
    warningCount: alerts.filter((a) => a.level === 'warning').length,
    errorCount: alerts.filter((a) => a.level === 'error').length,
    validatedCount: assignments.length - alerts.filter((a) => a.level === 'error').length,
  }
}

export function getWorstLevel(alerts: ValidationAlert[]): 'success' | 'warning' | 'error' {
  if (alerts.some((a) => a.level === 'error')) return 'error'
  if (alerts.some((a) => a.level === 'warning')) return 'warning'
  return 'success'
}
