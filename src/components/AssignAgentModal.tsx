import { useState } from 'react'
import { Modal } from './ui/Modal'
import { AlertBanner } from './ui/StatusBadge'
import { Badge } from './ui/Badge'
import { usePlanning } from '../context/PlanningContext'
import { validateAssignment, getWorstLevel } from '../lib/validation'
import type { Requirement } from '../types'
import { formatAgentName, formatDate } from '../lib/utils'
import { getSiteById } from '../data/seed'
import { UserPlus } from 'lucide-react'

interface AssignAgentModalProps {
  requirement: Requirement | null
  open: boolean
  onClose: () => void
}

export function AssignAgentModal({ requirement, open, onClose }: AssignAgentModalProps) {
  const { agents, assignments, requirements, assignAgent } = usePlanning()
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [previewAlerts, setPreviewAlerts] = useState<ReturnType<typeof validateAssignment>>([])
  const [confirmed, setConfirmed] = useState(false)

  const handleSelect = (agentId: string) => {
    setSelectedAgentId(agentId)
    setConfirmed(false)
    if (!requirement) return
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) return
    const alerts = validateAssignment(agent, requirement, assignments, requirements)
    setPreviewAlerts(alerts)
  }

  const handleConfirm = () => {
    if (!requirement || !selectedAgentId) return
    const alerts = assignAgent(requirement.id, selectedAgentId)
    const level = getWorstLevel(alerts)
    if (level !== 'error') {
      onClose()
      setSelectedAgentId(null)
      setPreviewAlerts([])
      setConfirmed(false)
    } else {
      setPreviewAlerts(alerts)
      setConfirmed(true)
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedAgentId(null)
    setPreviewAlerts([])
    setConfirmed(false)
  }

  if (!requirement) return null

  const site = getSiteById(requirement.siteId)
  const worstLevel = getWorstLevel(previewAlerts)
  const canConfirm = selectedAgentId && worstLevel !== 'error'

  return (
    <Modal open={open} onClose={handleClose} title="Affecter un agent" size="lg">
      <div className="space-y-4">
        <div className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-900">{site?.name}</p>
          <p className="mt-1 text-sm text-navy-600">
            {formatDate(requirement.date)} · {requirement.startTime} – {requirement.endTime}
          </p>
          <p className="mt-1 text-xs text-navy-500">
            {requirement.agentsNeeded} agent(s) requis
          </p>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelect(agent.id)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-accent-500 bg-accent-500/5'
                    : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50'
                }`}
              >
                <div>
                  <p className="font-medium text-navy-900">
                    {formatAgentName(agent.lastName, agent.firstName)}
                  </p>
                  <p className="text-xs text-navy-500">
                    Contrat {agent.contractHours}h
                    {agent.overtimeAllowed && ' · HS autorisées'}
                  </p>
                </div>
                {agent.shiftRestriction && (
                  <Badge variant="info">
                    {agent.shiftRestriction === 'day' ? 'Jour' : 'Nuit'}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>

        {previewAlerts.length > 0 && (
          <div className="space-y-2">
            {previewAlerts.map((alert) => (
              <AlertBanner key={alert.id} level={alert.level} message={alert.message} />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-navy-100 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50"
          >
            Annuler
          </button>
          {worstLevel === 'warning' && selectedAgentId && (
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Confirmer malgré l'avertissement
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            Affecter
          </button>
        </div>

        {confirmed && worstLevel === 'error' && (
          <p className="text-center text-xs text-red-600">
            Problème bloquant — affectation impossible.
          </p>
        )}
      </div>
    </Modal>
  )
}
