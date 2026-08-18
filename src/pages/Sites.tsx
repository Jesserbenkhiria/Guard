import { Building2, Calendar, Users } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { usePlanning } from '../context/PlanningContext'

export function Sites() {
  const { sites, requirements, assignments } = usePlanning()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Gestion des sites</h1>
        <p className="mt-1 text-navy-500">
          Sites clients et leurs exigences de couverture
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sites.map((site) => {
          const siteReqs = requirements.filter((r) => r.siteId === site.id)
          const siteAssignments = assignments.filter((a) =>
            siteReqs.some((r) => r.id === a.requirementId),
          )
          const totalNeeded = siteReqs.reduce((s, r) => s + r.agentsNeeded, 0)
          const coverage =
            totalNeeded > 0 ? Math.round((siteAssignments.length / totalNeeded) * 100) : 0

          return (
            <Card key={site.id}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-100">
                  <Building2 className="h-6 w-6 text-navy-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-navy-900">{site.name}</h3>
                    <Badge variant={site.scheduleType === 'fixed' ? 'default' : 'info'}>
                      {site.scheduleType === 'fixed' ? 'Fixe' : 'Variable'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-navy-500">{site.description}</p>

                  <div className="mt-4 flex items-center gap-4 text-sm text-navy-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {siteReqs.length} créneaux
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {siteAssignments.length}/{totalNeeded}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-navy-500">
                      <span>Couverture</span>
                      <span>{coverage}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-navy-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          coverage >= 80
                            ? 'bg-emerald-500'
                            : coverage >= 50
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${coverage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
