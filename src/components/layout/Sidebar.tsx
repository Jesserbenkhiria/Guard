import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  CalendarDays,
  ShieldCheck,
  FileText,
  Settings,
  Shield,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/agents', icon: Users, label: 'Agents' },
  { to: '/sites', icon: Building2, label: 'Sites' },
  { to: '/requirements', icon: ClipboardList, label: 'Besoins sites' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendrier' },
  { to: '/validation', icon: ShieldCheck, label: 'Validation' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
]

export function Sidebar() {
  return (
    <aside className="no-print flex w-64 shrink-0 flex-col bg-navy-950 text-white">
      <div className="flex items-center gap-3 border-b border-navy-800 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide">GUARD</p>
          <p className="text-xs text-navy-400">Planification Sécurité</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-500 text-white'
                  : 'text-navy-300 hover:bg-navy-900 hover:text-white',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-navy-800 px-6 py-4">
        <p className="text-xs text-navy-500">Version 0 — Prototype</p>
        <p className="mt-1 text-xs text-navy-600">Préparation SEKUR</p>
      </div>
    </aside>
  )
}
