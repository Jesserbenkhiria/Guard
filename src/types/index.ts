export type AlertLevel = 'success' | 'warning' | 'error'

export type ShiftRestriction = 'day' | 'night'

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface VacationPeriod {
  start: string
  end: string
}

export interface Agent {
  id: string
  firstName: string
  lastName: string
  contractHours: number
  overtimeAllowed: boolean
  maxVacations?: number
  shiftRestriction?: ShiftRestriction
  preferredDays?: DayOfWeek[]
  cannotExceedContract?: boolean
  vacations: VacationPeriod[]
  notes?: string
}

export interface Site {
  id: string
  name: string
  description: string
  scheduleType: 'fixed' | 'variable'
}

export interface Requirement {
  id: string
  siteId: string
  date: string
  startTime: string
  endTime: string
  agentsNeeded: number
}

export interface Assignment {
  id: string
  requirementId: string
  agentId: string
}

export interface ValidationAlert {
  id: string
  assignmentId?: string
  requirementId: string
  agentId: string
  level: AlertLevel
  message: string
}

export interface PlanningStats {
  agentCount: number
  siteCount: number
  pendingAssignments: number
  warningCount: number
  errorCount: number
  validatedCount: number
}
