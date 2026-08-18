import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Paramètres</h1>
        <p className="mt-1 text-navy-500">Configuration de la plateforme de planification</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card title="Informations entreprise">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-700">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                defaultValue="Société de Sécurité Privée"
                className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-700">
                Responsable planification
              </label>
              <input
                type="text"
                defaultValue="Manager Planification"
                className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </Card>

        <Card title="Intégration SEKUR">
          <p className="mb-4 text-sm text-navy-600">
            Cette plateforme prépare les données pour transfert vers SEKUR, le système final de
            gestion.
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="warning">Non connecté</Badge>
            <span className="text-sm text-navy-500">Export manuel — Version 0</span>
          </div>
          <button
            type="button"
            disabled
            className="mt-4 rounded-lg bg-navy-100 px-4 py-2 text-sm font-medium text-navy-400"
          >
            Configurer l'export SEKUR (bientôt)
          </button>
        </Card>

        <Card title="Règles par défaut">
          <div className="space-y-3 text-sm text-navy-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Bloquer les double affectations
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Vérifier les congés automatiquement
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Alerter dépassement contractuel
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Respecter restrictions jour/nuit
            </label>
          </div>
        </Card>

        <Card title="À propos">
          <p className="text-sm text-navy-600">
            <strong>GUARD v0</strong> — Prototype de démonstration pour la gestion de planification
            de sécurité. Prépare les besoins clients, affecte les agents, valide les règles métier
            et génère les documents de planning.
          </p>
        </Card>
      </div>
    </div>
  )
}
