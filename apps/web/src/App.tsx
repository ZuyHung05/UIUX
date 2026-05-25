import { Routes, Route, Navigate } from 'react-router-dom'
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage'
import { ManagerReportAnalysisPage } from './pages/manager/ManagerReportAnalysisPage'
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
      <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
      <Route path="/manager/report" element={<ManagerReportAnalysisPage />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
    </Routes>
  )
}

export default App
