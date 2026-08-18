import { useState, useMemo } from 'react'
import { UserPlus, Filter } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { AssignAgentModal } from '../components/AssignAgentModal'
import { usePlanning } from '../context/PlanningContext'
import { getSiteById, getAgentById } from '../data/seed'
import { formatDate, formatAgentName } from '../lib/utils'
import type { Requirement } from '../types'

export function Requirements() {
  const { requirements, sites, getAssignmentsForRequirement, unassignAgent } = usePlanning()
  const [selectedSite, setSelectedSite] = useState<string>('all')
  const [assignTarget, setAssignTarget] = useState<Requirement | null>(null)

  const filtered = useMemo(() => {
    if (selectedSite === 'all') return requirements
    return requirements.filter((r) => r.siteId === selectedSite)
  }, [requirements, selectedSite])

  const grouped = useMemo(() => {
    const map = new Map<string, Requirement[]>()
    for (const req of filtered) {
      const list = map.get(req.siteId) ?? []
      list.push(req)
      map.set(req.siteId, list)
    }
    return map
  }, [filtered])

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Besoins des sites</h1>
          <p className="mt-1 text-navy-500">
            Créneaux à couvrir — affectation des agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-navy-400" />
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-700"
          >
            <option value="all">Tous les sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([siteId, reqs]) => {
          const site = getSiteById(siteId)
          return (
            <Card key={siteId} title={site?.name ?? siteId}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 text-navy-500">
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Horaires</th>
                      <th className="pb-3 pr-4 font-medium">Requis</th>
                      <th className="pb-3 pr-4 font-medium">Affecté(s)</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reqs
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((req) => {
                        const assignments = getAssignmentsForRequirement(req.id)
                        const isFull = assignments.length >= req.agentsNeeded
                        return (
                          <tr key={req.id} className="border-b border-navy-50">
                            <td className="py-3 pr-4 font-medium text-navy-900">
                              {formatDate(req.date)}
                            </td>
                            <td className="py-3 pr-4 text-navy-600">
                              {req.startTime} – {req.endTime}
                            </td>
                            <td className="py-3 pr-4">{req.agentsNeeded}</td>
                            <td className="py-3 pr-4">
                              {assignments.length === 0 ? (
                                <Badge variant="warning">Non affecté</Badge>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {assignments.map((a) => {
                                    const agent = getAgentById(a.agentId)
                                    return (
                                      <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => unassignAgent(a.id)}
                                        className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 hover:bg-emerald-200"
                                        title="Retirer l'affectation"
                                      >
                                        {agent
                                          ? formatAgentName(agent.lastName, agent.firstName)
                                          : '?'}
                                        {' ×'}
                                      </button>
                                    )
                                  })}
                                  {!isFull && (
                                    <Badge variant="warning">
                                      {req.agentsNeeded - assignments.length} manquant(s)
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-3">
                              {!isFull && (
                                <button
                                  type="button"
                                  onClick={() => setAssignTarget(req)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-600"
                                >
                                  <UserPlus className="h-3.5 w-3.5" />
                                  Affecter
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        })}
      </div>

      <AssignAgentModal
        requirement={assignTarget}
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
      />
    </div>
  )
}
