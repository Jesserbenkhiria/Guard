import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Agent, Assignment, Requirement, Site, ValidationAlert } from '../types'
import {
  agents as seedAgents,
  sites as seedSites,
  requirements as seedRequirements,
  initialAssignments,
} from '../data/seed'
import { validateAllAssignments, computeStats, validateAssignment } from '../lib/validation'

interface PlanningContextValue {
  agents: Agent[]
  sites: Site[]
  requirements: Requirement[]
  assignments: Assignment[]
  alerts: ValidationAlert[]
  stats: ReturnType<typeof computeStats>
  assignAgent: (requirementId: string, agentId: string) => ValidationAlert[]
  unassignAgent: (assignmentId: string) => void
  getAssignmentsForRequirement: (requirementId: string) => Assignment[]
  getAgentMonthlyHours: (agentId: string, month: string) => number
}

const PlanningContext = createContext<PlanningContextValue | null>(null)

export function PlanningProvider({ children }: { children: ReactNode }) {
  const [agents] = useState<Agent[]>(seedAgents)
  const [sites] = useState<Site[]>(seedSites)
  const [requirements] = useState<Requirement[]>(seedRequirements)
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)

  const alerts = useMemo(
    () => validateAllAssignments(agents, assignments, requirements),
    [agents, assignments, requirements],
  )

  const stats = useMemo(
    () => computeStats(agents, sites, assignments, alerts),
    [agents, sites, assignments, alerts],
  )

  const assignAgent = useCallback(
    (requirementId: string, agentId: string): ValidationAlert[] => {
      const agent = agents.find((a) => a.id === agentId)
      const requirement = requirements.find((r) => r.id === requirementId)
      if (!agent || !requirement) return []

      const validationAlerts = validateAssignment(agent, requirement, assignments, requirements)
      const hasBlocking = validationAlerts.some((a) => a.level === 'error')
      if (hasBlocking) return validationAlerts

      const existing = assignments.find(
        (a) => a.requirementId === requirementId && a.agentId === agentId,
      )
      if (existing) return validationAlerts

      const currentCount = assignments.filter((a) => a.requirementId === requirementId).length
      if (currentCount >= requirement.agentsNeeded) {
        return [
          {
            id: `full-${requirementId}`,
            requirementId,
            agentId,
            level: 'error',
            message: 'Nombre d\'agents requis déjà atteint pour ce créneau.',
          },
        ]
      }

      setAssignments((prev) => [
        ...prev,
        { id: `asgn-${Date.now()}`, requirementId, agentId },
      ])

      return validationAlerts
    },
    [agents, requirements, assignments],
  )

  const unassignAgent = useCallback((assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
  }, [])

  const getAssignmentsForRequirement = useCallback(
    (requirementId: string) => assignments.filter((a) => a.requirementId === requirementId),
    [assignments],
  )

  const getAgentMonthlyHours = useCallback(
    (agentId: string, month: string) => {
      return assignments
        .filter((a) => a.agentId === agentId)
        .reduce((total, a) => {
          const req = requirements.find((r) => r.id === a.requirementId)
          if (!req || !req.date.startsWith(month)) return total
          const start = req.startTime.split(':').map(Number)
          const end = req.endTime.split(':').map(Number)
          let hours = end[0] + end[1] / 60 - (start[0] + start[1] / 60)
          if (hours <= 0) hours += 24
          return total + hours
        }, 0)
    },
    [assignments, requirements],
  )

  const value: PlanningContextValue = {
    agents,
    sites,
    requirements,
    assignments,
    alerts,
    stats,
    assignAgent,
    unassignAgent,
    getAssignmentsForRequirement,
    getAgentMonthlyHours,
  }

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>
}

export function usePlanning() {
  const ctx = useContext(PlanningContext)
  if (!ctx) throw new Error('usePlanning must be used within PlanningProvider')
  return ctx
}
