import { useRef, useState } from 'react'
import { FileText, Download, Printer } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { usePlanning } from '../context/PlanningContext'
import { getSiteById, getAgentById } from '../data/seed'
import { formatDate, formatAgentName } from '../lib/utils'

export function Documents() {
  const { assignments, requirements, agents } = usePlanning()
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id ?? '')
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrintGlobal = () => {
    window.print()
  }

  const agentAssignments = assignments.filter((a) => a.agentId === selectedAgent)
  const selectedAgentData = getAgentById(selectedAgent)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Documents</h1>
        <p className="mt-1 text-navy-500">
          Génération des plannings PDF — global et individuel par agent
        </p>
      </div>

      <div className="no-print grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Planning global">
          <p className="mb-4 text-sm text-navy-600">
            Génère un document récapitulatif de toutes les affectations du mois.
          </p>
          <button
            type="button"
            onClick={handlePrintGlobal}
            className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            <Download className="h-4 w-4" />
            Générer planning global PDF
          </button>
        </Card>

        <Card title="Planning individuel">
          <p className="mb-4 text-sm text-navy-600">
            Génère le planning d'un agent spécifique.
          </p>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="mb-4 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {formatAgentName(a.lastName, a.firstName)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handlePrintGlobal}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-600"
          >
            <FileText className="h-4 w-4" />
            Générer PDF agent
          </button>
        </Card>
      </div>

      <div ref={printRef} className="mt-8">
        <Card
          className="print:border-0 print:shadow-none"
          title="Aperçu du document"
          action={
            <button
              type="button"
              onClick={handlePrintGlobal}
              className="no-print inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
          }
        >
          <div className="space-y-6">
            <div className="border-b border-navy-200 pb-4 text-center">
              <h2 className="text-xl font-bold text-navy-900">GUARD — Planification Sécurité</h2>
              <p className="text-sm text-navy-500">Septembre 2026</p>
            </div>

            {selectedAgentData && (
              <div>
                <h3 className="mb-3 font-semibold text-navy-900">
                  Planning — {formatAgentName(selectedAgentData.lastName, selectedAgentData.firstName)}
                </h3>
                {agentAssignments.length === 0 ? (
                  <p className="text-sm text-navy-500">Aucune affectation.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-navy-500">
                        <th className="py-2 text-left">Site</th>
                        <th className="py-2 text-left">Date</th>
                        <th className="py-2 text-left">Horaires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentAssignments.map((a) => {
                        const req = requirements.find((r) => r.id === a.requirementId)
                        if (!req) return null
                        const site = getSiteById(req.siteId)
                        return (
                          <tr key={a.id} className="border-b border-navy-50">
                            <td className="py-2">{site?.name}</td>
                            <td className="py-2">{formatDate(req.date)}</td>
                            <td className="py-2">
                              {req.startTime} – {req.endTime}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <div>
              <h3 className="mb-3 font-semibold text-navy-900">Planning global</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-navy-500">
                    <th className="py-2 text-left">Site</th>
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Horaires</th>
                    <th className="py-2 text-left">Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const req = requirements.find((r) => r.id === a.requirementId)
                    const agent = getAgentById(a.agentId)
                    if (!req || !agent) return null
                    const site = getSiteById(req.siteId)
                    return (
                      <tr key={a.id} className="border-b border-navy-50">
                        <td className="py-2">{site?.name}</td>
                        <td className="py-2">{formatDate(req.date)}</td>
                        <td className="py-2">
                          {req.startTime} – {req.endTime}
                        </td>
                        <td className="py-2">
                          {formatAgentName(agent.lastName, agent.firstName)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-center text-xs text-navy-400">
              Document généré par GUARD v0 — Préparation pour transfert SEKUR
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
