import { useState } from 'react'
import { Calendar, Clock, Sun, Moon } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { usePlanning } from '../context/PlanningContext'
import { formatAgentName, formatDate } from '../lib/utils'

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export function Agents() {
  const { agents, getAgentMonthlyHours } = usePlanning()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = agents.find((a) => a.id === selectedId)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Gestion des agents</h1>
        <p className="mt-1 text-navy-500">
          Base de données des agents de sécurité et leurs règles contractuelles
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-navy-500">
                <th className="pb-3 pr-4 font-medium">Agent</th>
                <th className="pb-3 pr-4 font-medium">Contrat</th>
                <th className="pb-3 pr-4 font-medium">Heures (sept.)</th>
                <th className="pb-3 pr-4 font-medium">Règles</th>
                <th className="pb-3 font-medium">Congés</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => {
                const hours = getAgentMonthlyHours(agent.id, '2026-09')
                const overContract = hours > agent.contractHours
                return (
                  <tr
                    key={agent.id}
                    onClick={() => setSelectedId(agent.id)}
                    className="cursor-pointer border-b border-navy-50 transition-colors hover:bg-navy-50"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-navy-900">
                        {formatAgentName(agent.lastName, agent.firstName)}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-navy-600">{agent.contractHours}h</td>
                    <td className="py-3 pr-4">
                      <span className={overContract ? 'font-medium text-amber-600' : 'text-navy-600'}>
                        {hours.toFixed(1)}h
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {agent.overtimeAllowed && <Badge variant="info">HS</Badge>}
                        {agent.cannotExceedContract && <Badge variant="warning">Plafond</Badge>}
                        {agent.shiftRestriction === 'day' && (
                          <Badge variant="success">
                            <Sun className="mr-1 inline h-3 w-3" />
                            Jour
                          </Badge>
                        )}
                        {agent.shiftRestriction === 'night' && (
                          <Badge variant="default">
                            <Moon className="mr-1 inline h-3 w-3" />
                            Nuit
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      {agent.vacations.length > 0 ? (
                        <span className="text-navy-600">
                          {agent.vacations.length} période(s)
                        </span>
                      ) : (
                        <span className="text-navy-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? formatAgentName(selected.lastName, selected.firstName) : ''}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-navy-50 p-3">
                <p className="text-xs text-navy-500">Contrat</p>
                <p className="text-lg font-semibold text-navy-900">{selected.contractHours}h</p>
              </div>
              <div className="rounded-lg bg-navy-50 p-3">
                <p className="text-xs text-navy-500">Heures sup.</p>
                <p className="text-lg font-semibold text-navy-900">
                  {selected.overtimeAllowed ? 'Autorisées' : 'Non autorisées'}
                </p>
              </div>
            </div>

            {selected.preferredDays && selected.preferredDays.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-navy-700">Jours habituels</p>
                <div className="flex gap-2">
                  {selected.preferredDays.map((d) => (
                    <Badge key={d}>{DAY_NAMES[d]}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selected.vacations.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-navy-700">
                  <Calendar className="h-4 w-4" />
                  Périodes de congé
                </p>
                <ul className="space-y-2">
                  {selected.vacations.map((v, i) => (
                    <li key={i} className="text-sm text-navy-600">
                      {formatDate(v.start)} → {formatDate(v.end)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.maxVacations && (
              <p className="text-sm text-navy-600">
                Maximum {selected.maxVacations} congés par an
              </p>
            )}

            {selected.notes && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{selected.notes}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-navy-500">
              <Clock className="h-4 w-4" />
              Heures planifiées en septembre :{' '}
              {getAgentMonthlyHours(selected.id, '2026-09').toFixed(1)}h
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
