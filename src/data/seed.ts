import type { Agent, Assignment, Requirement, Site } from '../types'

export const agents: Agent[] = [
  {
    id: 'agent-djedia',
    lastName: 'DJEDIA',
    firstName: 'Dahmane',
    contractHours: 156,
    overtimeAllowed: true,
    preferredDays: [1, 2, 3, 4, 6],
    vacations: [],
    notes: 'Heures sup autorisées. Travaille habituellement lun, mar, mer, jeu, sam.',
  },
  {
    id: 'agent-lajimi',
    lastName: 'LAJIMI',
    firstName: 'Mohamed',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [{ start: '2026-07-01', end: '2026-08-24' }],
    notes: 'En congé jusqu\'au 24/08/2026.',
  },
  {
    id: 'agent-evina',
    lastName: 'EVINA',
    firstName: 'Pierre Marie',
    contractHours: 80,
    overtimeAllowed: false,
    preferredDays: [5],
    vacations: [{ start: '2026-09-14', end: '2026-10-01' }],
    notes: 'Principalement vendredi. Congé du 14/09 au 01/10/2026.',
  },
  {
    id: 'agent-mbodji',
    lastName: 'MBODJI',
    firstName: 'Adama',
    contractHours: 60,
    overtimeAllowed: false,
    cannotExceedContract: true,
    vacations: [],
    notes: 'Ne peut pas dépasser le contrat de 60h.',
  },
  {
    id: 'agent-dembele',
    lastName: 'DEMBELE',
    firstName: 'Ramata',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
  {
    id: 'agent-houngues',
    lastName: 'HOUNGUES',
    firstName: 'Evelyne',
    contractHours: 120,
    overtimeAllowed: false,
    shiftRestriction: 'day',
    vacations: [],
    notes: 'Équipe de jour uniquement.',
  },
  {
    id: 'agent-yahmadi',
    lastName: 'YAHMADI',
    firstName: 'Anis',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
  {
    id: 'agent-aoufi',
    lastName: 'AOUFI',
    firstName: 'Mohammed',
    contractHours: 156,
    overtimeAllowed: true,
    maxVacations: 5,
    vacations: [
      { start: '2026-06-01', end: '2026-06-05' },
      { start: '2026-07-10', end: '2026-07-14' },
    ],
    notes: 'Maximum 5 congés par an.',
  },
  {
    id: 'agent-camara-l',
    lastName: 'Camara',
    firstName: 'Lamine',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
  {
    id: 'agent-camara-o',
    lastName: 'Camara',
    firstName: 'Oumar',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
  {
    id: 'agent-extra-1',
    lastName: 'DIALLO',
    firstName: 'Fatou',
    contractHours: 120,
    overtimeAllowed: false,
    vacations: [],
  },
  {
    id: 'agent-extra-2',
    lastName: 'KONE',
    firstName: 'Ibrahim',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
  {
    id: 'agent-extra-3',
    lastName: 'TRAORE',
    firstName: 'Aissata',
    contractHours: 80,
    overtimeAllowed: false,
    vacations: [],
  },
  {
    id: 'agent-extra-4',
    lastName: 'SOW',
    firstName: 'Mamadou',
    contractHours: 156,
    overtimeAllowed: true,
    shiftRestriction: 'night',
    vacations: [],
    notes: 'Équipe de nuit uniquement.',
  },
  {
    id: 'agent-extra-5',
    lastName: 'BA',
    firstName: 'Mariama',
    contractHours: 120,
    overtimeAllowed: false,
    vacations: [],
  },
  {
    id: 'agent-extra-6',
    lastName: 'NDIAYE',
    firstName: 'Cheikh',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
  {
    id: 'agent-extra-7',
    lastName: 'FALL',
    firstName: 'Aminata',
    contractHours: 80,
    overtimeAllowed: false,
    vacations: [],
  },
  {
    id: 'agent-extra-8',
    lastName: 'SY',
    firstName: 'Ousmane',
    contractHours: 156,
    overtimeAllowed: true,
    vacations: [],
  },
]

export const sites: Site[] = [
  {
    id: 'site-gemeaux',
    name: 'Les Gémeaux / Mairie de Cergy',
    description: 'Lun–Sam : 3 agents 07:00–19:00, 1 agent 19:00–07:00. Dim : 1 agent jour, 1 agent nuit.',
    scheduleType: 'fixed',
  },
  {
    id: 'site-ordinal',
    name: 'ORDINAL',
    description: 'Lamine Camara 10:00–17:00, Oumar Camara 08:00–20:00.',
    scheduleType: 'fixed',
  },
  {
    id: 'site-douze',
    name: 'LE DOUZE',
    description: 'Horaires : 08:45–19:30.',
    scheduleType: 'fixed',
  },
  {
    id: 'site-pleyel',
    name: 'PLEYEL',
    description: 'Horaires variables selon les besoins client.',
    scheduleType: 'variable',
  },
  {
    id: 'site-visage',
    name: 'VISAGE DU MONDE',
    description: 'Horaires variables reçus du client.',
    scheduleType: 'variable',
  },
  {
    id: 'site-centre',
    name: 'Centre Commercial Evry',
    description: 'Surveillance générale, horaires flexibles.',
    scheduleType: 'variable',
  },
]

export const requirements: Requirement[] = [
  // VISAGE DU MONDE
  { id: 'req-v1', siteId: 'site-visage', date: '2026-09-13', startTime: '09:30', endTime: '17:30', agentsNeeded: 1 },
  { id: 'req-v2', siteId: 'site-visage', date: '2026-09-14', startTime: '18:00', endTime: '22:30', agentsNeeded: 1 },
  { id: 'req-v3', siteId: 'site-visage', date: '2026-09-15', startTime: '17:00', endTime: '22:30', agentsNeeded: 1 },
  // ORDINAL
  { id: 'req-o1', siteId: 'site-ordinal', date: '2026-09-13', startTime: '10:00', endTime: '17:00', agentsNeeded: 1 },
  { id: 'req-o2', siteId: 'site-ordinal', date: '2026-09-13', startTime: '08:00', endTime: '20:00', agentsNeeded: 1 },
  { id: 'req-o3', siteId: 'site-ordinal', date: '2026-09-14', startTime: '10:00', endTime: '17:00', agentsNeeded: 1 },
  { id: 'req-o4', siteId: 'site-ordinal', date: '2026-09-14', startTime: '08:00', endTime: '20:00', agentsNeeded: 1 },
  // LE DOUZE
  { id: 'req-d1', siteId: 'site-douze', date: '2026-09-13', startTime: '08:45', endTime: '19:30', agentsNeeded: 1 },
  { id: 'req-d2', siteId: 'site-douze', date: '2026-09-14', startTime: '08:45', endTime: '19:30', agentsNeeded: 1 },
  { id: 'req-d3', siteId: 'site-douze', date: '2026-09-15', startTime: '08:45', endTime: '19:30', agentsNeeded: 1 },
  // Les Gémeaux
  { id: 'req-g1', siteId: 'site-gemeaux', date: '2026-09-13', startTime: '07:00', endTime: '19:00', agentsNeeded: 3 },
  { id: 'req-g2', siteId: 'site-gemeaux', date: '2026-09-13', startTime: '19:00', endTime: '07:00', agentsNeeded: 1 },
  { id: 'req-g3', siteId: 'site-gemeaux', date: '2026-09-14', startTime: '07:00', endTime: '19:00', agentsNeeded: 3 },
  { id: 'req-g4', siteId: 'site-gemeaux', date: '2026-09-14', startTime: '19:00', endTime: '07:00', agentsNeeded: 1 },
  // PLEYEL
  { id: 'req-p1', siteId: 'site-pleyel', date: '2026-09-15', startTime: '06:00', endTime: '14:00', agentsNeeded: 2 },
  { id: 'req-p2', siteId: 'site-pleyel', date: '2026-09-16', startTime: '14:00', endTime: '22:00', agentsNeeded: 2 },
  // Centre Commercial
  { id: 'req-c1', siteId: 'site-centre', date: '2026-09-13', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
  { id: 'req-c2', siteId: 'site-centre', date: '2026-09-14', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
  { id: 'req-c3', siteId: 'site-centre', date: '2026-09-15', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
  { id: 'req-c4', siteId: 'site-centre', date: '2026-09-16', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
  { id: 'req-c5', siteId: 'site-centre', date: '2026-09-17', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
  { id: 'req-c6', siteId: 'site-centre', date: '2026-09-18', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
  { id: 'req-c7', siteId: 'site-centre', date: '2026-09-19', startTime: '09:00', endTime: '18:00', agentsNeeded: 2 },
]

export const initialAssignments: Assignment[] = [
  { id: 'asgn-1', requirementId: 'req-v1', agentId: 'agent-dembele' },
  { id: 'asgn-2', requirementId: 'req-v2', agentId: 'agent-yahmadi' },
  { id: 'asgn-3', requirementId: 'req-v3', agentId: 'agent-djedia' },
  { id: 'asgn-4', requirementId: 'req-o1', agentId: 'agent-camara-l' },
  { id: 'asgn-5', requirementId: 'req-o2', agentId: 'agent-camara-o' },
  { id: 'asgn-6', requirementId: 'req-d1', agentId: 'agent-extra-1' },
  { id: 'asgn-7', requirementId: 'req-g1', agentId: 'agent-extra-2' },
  { id: 'asgn-8', requirementId: 'req-g1', agentId: 'agent-extra-3' },
  { id: 'asgn-9', requirementId: 'req-g1', agentId: 'agent-extra-5' },
]

export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id)
}

export function getSiteById(id: string): Site | undefined {
  return sites.find((s) => s.id === id)
}

export function getRequirementById(id: string): Requirement | undefined {
  return requirements.find((r) => r.id === id)
}
