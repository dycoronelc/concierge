import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Layout from './components/Layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import PatientsPage from './pages/PatientsPage'
import ProvidersPage from './pages/ProvidersPage'
import EventosPage from './pages/EventosPage'
import EncuentrosPage from './pages/EncuentrosPage'
import PatientClinicalHistoryPage from './pages/PatientClinicalHistoryPage'
import EnfermeriaPage from './pages/EnfermeriaPage'
import TransportePage from './pages/TransportePage'
import EstudiosPage from './pages/EstudiosPage'
import NutricionPage from './pages/NutricionPage'
import PsicologiaPage from './pages/PsicologiaPage'
import { useAuthStore } from './store/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/tickets" element={<TicketsPage />} />
                  <Route path="/tickets/:id" element={<TicketDetailPage />} />
                  <Route path="/patients" element={<PatientsPage />} />
                  <Route path="/patients/:patientId/history" element={<PatientClinicalHistoryPage />} />
                  <Route path="/providers" element={<ProvidersPage />} />
                  <Route path="/eventos" element={<EventosPage />} />
                  <Route path="/encuentros" element={<EncuentrosPage />} />
                  <Route path="/enfermeria" element={<EnfermeriaPage />} />
                  <Route path="/transporte" element={<TransportePage />} />
                  <Route path="/estudios" element={<EstudiosPage />} />
                  <Route path="/nutricion" element={<NutricionPage />} />
                  <Route path="/psicologia" element={<PsicologiaPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Box>
  )
}

export default App

