import { useMemo, useState } from 'react'
import { ShieldCheck, Filter } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { StatusBadge, AlertBanner } from '../components/ui/StatusBadge'
import { usePlanning } from '../context/PlanningContext'
import { getAgentById, getSiteById } from '../data/seed'
import { formatDate } from '../lib/utils'
import type { AlertLevel } from '../types'

export function Validation() {
  const { alerts, requirements } = usePlanning()
  const [levelFilter, setLevelFilter] = useState<AlertLevel | 'all'>('all')

  const filtered = useMemo(() => {
    if (levelFilter === 'all') return alerts
    return alerts.filter((a) => a.level === levelFilter)
  }, [alerts, levelFilter])

  const counts = useMemo(
    () => ({
      error: alerts.filter((a) => a.level === 'error').length,
      warning: alerts.filter((a) => a.level === 'warning').length,
    }),
    [alerts],
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Validation & Alertes</h1>
        <p className="mt-1 text-navy-500">
          Contrôle automatique des règles avant confirmation du planning
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-800">Vert — Accepté</span>
          </div>
          <p className="mt-2 text-sm text-emerald-700">
            Affectation conforme à toutes les règles
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <span className="font-medium text-amber-800">Orange — Avertissement</span>
          <p className="mt-2 text-sm text-amber-700">
            {counts.warning} alerte(s) — confirmation possible avec validation manager
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <span className="font-medium text-red-800">Rouge — Bloquant</span>
          <p className="mt-2 text-sm text-red-700">
            {counts.error} problème(s) — affectation impossible
          </p>
        </div>
      </div>

      <Card
        title="Alertes actives"
        subtitle={`${filtered.length} alerte(s)`}
        action={
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-navy-400" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as AlertLevel | 'all')}
              className="rounded-lg border border-navy-200 px-2 py-1 text-sm"
            >
              <option value="all">Toutes</option>
              <option value="error">Bloquantes</option>
              <option value="warning">Avertissements</option>
            </select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="py-8 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-emerald-400" />
            <p className="mt-3 text-navy-600">Aucune alerte — planning conforme.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((alert) => {
              const req = requirements.find((r) => r.id === alert.requirementId)
              const agent = alert.agentId ? getAgentById(alert.agentId) : null
              const site = req ? getSiteById(req.siteId) : null

              return (
                <li key={alert.id}>
                  <div className="rounded-lg border border-navy-100 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <AlertBanner level={alert.level} message={alert.message} />
                      <StatusBadge level={alert.level} />
                    </div>
                    {req && (
                      <p className="mt-2 text-xs text-navy-500">
                        {site?.name} · {formatDate(req.date)} · {req.startTime}–{req.endTime}
                        {agent && ` · ${agent.lastName} ${agent.firstName}`}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Card className="mt-6" title="Règles de validation">
        <ul className="grid grid-cols-1 gap-2 text-sm text-navy-600 md:grid-cols-2">
          <li>• Heures contractuelles et maximum autorisé</li>
          <li>• Autorisation heures supplémentaires</li>
          <li>• Périodes de congé</li>
          <li>• Disponibilité agent</li>
          <li>• Double affectation (même créneau)</li>
          <li>• Restrictions jour / nuit</li>
          <li>• Maximum de congés annuels</li>
          <li>• Couverture des sites</li>
        </ul>
      </Card>
    </div>
  )
}
