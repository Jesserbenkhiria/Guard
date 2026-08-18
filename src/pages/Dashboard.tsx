import {
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/ui/Card'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StatusBadge } from '../components/ui/StatusBadge'
import { usePlanning } from '../context/PlanningContext'
import { getSiteById, getAgentById } from '../data/seed'
import { formatDate, formatAgentName } from '../lib/utils'

export function Dashboard() {
  const { stats, alerts, assignments, requirements } = usePlanning()

  const recentAlerts = alerts.slice(0, 5)
  const recentAssignments = assignments.slice(-5).reverse()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Tableau de bord</h1>
        <p className="mt-1 text-navy-500">
          Vue d'ensemble de la planification de sécurité — Septembre 2026
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Agents"
          value={stats.agentCount}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          label="Sites"
          value={stats.siteCount}
          icon={<Building2 className="h-6 w-6" />}
        />
        <StatCard
          label="Affectations en attente"
          value={stats.pendingAssignments}
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
        <StatCard
          label="Planification validée"
          value={stats.validatedCount}
          icon={<CheckCircle2 className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          label="Avertissements"
          value={stats.warningCount}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
        <StatCard
          label="Problèmes bloquants"
          value={stats.errorCount}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="error"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Alertes récentes" subtitle="Validation automatique">
          {recentAlerts.length === 0 ? (
            <p className="text-sm text-navy-500">Aucune alerte active.</p>
          ) : (
            <ul className="space-y-3">
              {recentAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-navy-100 p-3"
                >
                  <p className="text-sm text-navy-700">{alert.message}</p>
                  <StatusBadge level={alert.level} showIcon={false} />
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/validation"
            className="mt-4 inline-block text-sm font-medium text-accent-500 hover:text-accent-600"
          >
            Voir toutes les alertes →
          </Link>
        </Card>

        <Card title="Dernières affectations" subtitle="Activité récente">
          <ul className="space-y-3">
            {recentAssignments.map((asgn) => {
              const req = requirements.find((r) => r.id === asgn.requirementId)
              const agent = getAgentById(asgn.agentId)
              const site = req ? getSiteById(req.siteId) : undefined
              if (!req || !agent) return null
              return (
                <li
                  key={asgn.id}
                  className="flex items-center justify-between rounded-lg border border-navy-100 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-navy-900">
                      {formatAgentName(agent.lastName, agent.firstName)}
                    </p>
                    <p className="text-xs text-navy-500">
                      {site?.name} · {formatDate(req.date)}
                    </p>
                  </div>
                  <Badge variant="info">
                    {req.startTime}–{req.endTime}
                  </Badge>
                </li>
              )
            })}
          </ul>
          <Link
            to="/requirements"
            className="mt-4 inline-block text-sm font-medium text-accent-500 hover:text-accent-600"
          >
            Gérer les besoins →
          </Link>
        </Card>
      </div>

      <Card className="mt-6" title="Workflow de planification">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { step: '1', title: 'Besoins sites', desc: 'Réception des créneaux clients', link: '/requirements' },
            { step: '2', title: 'Affectation', desc: 'Choix des agents disponibles', link: '/requirements' },
            { step: '3', title: 'Validation', desc: 'Contrôle automatique des règles', link: '/validation' },
            { step: '4', title: 'Documents', desc: 'Génération PDF planning', link: '/documents' },
          ].map((item) => (
            <Link
              key={item.step}
              to={item.link}
              className="rounded-lg border border-navy-200 p-4 transition-colors hover:border-accent-500 hover:bg-accent-500/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {item.step}
              </span>
              <p className="mt-3 font-semibold text-navy-900">{item.title}</p>
              <p className="mt-1 text-xs text-navy-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
