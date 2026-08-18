import { useMemo, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  isSameMonth,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { usePlanning } from '../context/PlanningContext'
import { getSiteById } from '../data/seed'
import { isDateInVacation } from '../lib/utils'

type ViewMode = 'month' | 'week'
type GroupMode = 'agent' | 'site'

const CORE_AGENTS = ['agent-yahmadi', 'agent-dembele', 'agent-djedia', 'agent-houngues']

export function CalendarPage() {
  const { agents, assignments, requirements, sites } = usePlanning()
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1))
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [groupMode, setGroupMode] = useState<GroupMode>('agent')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const displayDays = viewMode === 'month' ? monthDays : weekDays

  const calendarAgents = useMemo(() => {
    const core = agents.filter((a) => CORE_AGENTS.includes(a.id))
    return core.length > 0 ? core : agents.slice(0, 8)
  }, [agents])

  const getEventsForAgentAndDay = (agentId: string, day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    return assignments
      .filter((a) => a.agentId === agentId)
      .map((a) => requirements.find((r) => r.id === a.requirementId))
      .filter((r) => r && r.date === dateStr)
  }

  const getEventsForSiteAndDay = (siteId: string, day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    return requirements
      .filter((r) => r.siteId === siteId && r.date === dateStr)
      .map((req) => ({
        req,
        assignments: assignments.filter((a) => a.requirementId === req.id),
      }))
  }

  const rows =
    groupMode === 'agent'
      ? calendarAgents.map((a) => ({ id: a.id, label: a.lastName }))
      : sites.map((s) => ({ id: s.id, label: s.name.split(' ')[0] }))

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Calendrier de planification</h1>
          <p className="mt-1 text-navy-500">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-navy-200 bg-white">
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm ${viewMode === 'week' ? 'bg-navy-900 text-white' : 'text-navy-600'}`}
            >
              Semaine
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`rounded-r-lg px-3 py-1.5 text-sm ${viewMode === 'month' ? 'bg-navy-900 text-white' : 'text-navy-600'}`}
            >
              Mois
            </button>
          </div>

          <div className="flex rounded-lg border border-navy-200 bg-white">
            <button
              type="button"
              onClick={() => setGroupMode('agent')}
              className={`px-3 py-1.5 text-sm ${groupMode === 'agent' ? 'bg-accent-500 text-white' : 'text-navy-600'}`}
            >
              Par agent
            </button>
            <button
              type="button"
              onClick={() => setGroupMode('site')}
              className={`rounded-r-lg px-3 py-1.5 text-sm ${groupMode === 'site' ? 'bg-accent-500 text-white' : 'text-navy-600'}`}
            >
              Par site
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentDate((d) =>
                  viewMode === 'month' ? subMonths(d, 1) : addDays(d, -7),
                )
              }
              className="rounded-lg border border-navy-200 p-2 hover:bg-navy-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(2026, 8, 1))}
              className="rounded-lg border border-navy-200 px-3 py-1.5 text-sm hover:bg-navy-50"
            >
              Sept. 2026
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentDate((d) =>
                  viewMode === 'month' ? addMonths(d, 1) : addDays(d, 7),
                )
              }
              className="rounded-lg border border-navy-200 p-2 hover:bg-navy-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-navy-100 bg-white p-2 text-left font-medium text-navy-500">
                  {groupMode === 'agent' ? 'Agent' : 'Site'}
                </th>
                {displayDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`border-b border-navy-100 p-2 text-center font-medium ${
                      isSameMonth(day, currentDate) ? 'text-navy-700' : 'text-navy-300'
                    }`}
                  >
                    <div>{format(day, 'EEE', { locale: fr })}</div>
                    <div className="text-lg">{format(day, 'd')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const agent =
                  groupMode === 'agent' ? agents.find((a) => a.id === row.id) : null

                return (
                  <tr key={row.id} className="border-b border-navy-50">
                    <td className="sticky left-0 z-10 border-r border-navy-100 bg-white p-2 font-medium text-navy-900">
                      {row.label}
                    </td>
                    {displayDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd')
                      const onVacation =
                        agent && isDateInVacation(dateStr, agent.vacations)

                      if (groupMode === 'agent') {
                        const events = getEventsForAgentAndDay(row.id, day)
                        return (
                          <td key={dateStr} className="p-1 align-top">
                            {onVacation ? (
                              <div className="rounded bg-purple-100 px-1 py-0.5 text-purple-700">
                                Congé
                              </div>
                            ) : (
                              events.map((ev) => {
                                if (!ev) return null
                                const site = getSiteById(ev.siteId)
                                return (
                                  <div
                                    key={ev.id}
                                    className="mb-1 rounded bg-accent-500/10 px-1 py-0.5 text-accent-700"
                                    title={`${site?.name} ${ev.startTime}-${ev.endTime}`}
                                  >
                                    {ev.startTime.slice(0, 5)}
                                    <br />
                                    <span className="text-[10px] opacity-75">
                                      {site?.name.split(' ')[0]}
                                    </span>
                                  </div>
                                )
                              })
                            )}
                          </td>
                        )
                      }

                      const siteEvents = getEventsForSiteAndDay(row.id, day)
                      return (
                        <td key={dateStr} className="p-1 align-top">
                          {siteEvents.map(({ req, assignments: asgns }) => (
                            <div
                              key={req.id}
                              className={`mb-1 rounded px-1 py-0.5 ${
                                asgns.length >= req.agentsNeeded
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {req.startTime.slice(0, 5)} ({asgns.length}/{req.agentsNeeded})
                            </div>
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-navy-500">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-accent-500/20" /> Mission affectée
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-purple-100" /> Congé
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-100" /> Site couvert
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-amber-100" /> Couverture partielle
        </span>
      </div>
    </div>
  )
}
