import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SidebarProvider } from './context/SidebarContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import InstructorsPage from './pages/InstructorsPage.jsx'
import VehiclesPage from './pages/VehiclesPage.jsx'
import LicensesPage from './pages/LicensesPage.jsx'
import './styles/index.css'
import './styles/App.css'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructors"
              element={
                <ProtectedRoute>
                  <InstructorsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vehicles"
              element={
                <ProtectedRoute>
                  <VehiclesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/licenses"
              element={
                <ProtectedRoute>
                  <LicensesPage />
                </ProtectedRoute>
              }
            />

            {/* Redireccionar rutas no encontradas a login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

