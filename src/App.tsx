import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PlanningProvider } from './context/PlanningContext'
import { Dashboard } from './pages/Dashboard'
import { Agents } from './pages/Agents'
import { Sites } from './pages/Sites'
import { Requirements } from './pages/Requirements'
import { CalendarPage } from './pages/Calendar'
import { Validation } from './pages/Validation'
import { Documents } from './pages/Documents'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <PlanningProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="agents" element={<Agents />} />
            <Route path="sites" element={<Sites />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="validation" element={<Validation />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlanningProvider>
  )
}
