import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from './pages/auth/AuthPage'
import { ManagerDashboardPage } from './pages/manager/dashboard/ManagerDashboardPage'
import { ManagerReportAnalysisPage } from './pages/manager/report-analysis/ManagerReportAnalysisPage'
import { ChatbotMonitorPage } from './pages/manager/chatbot-monitor/ChatbotMonitorPage'
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage'
import { DoctorDetailPage } from './pages/manager/doctors/DoctorDetailPage'
import { DoctorManagementPage } from './pages/manager/doctors/DoctorManagementPage'
import { DoctorNewPage } from './pages/manager/doctors/DoctorNewPage'
import { DoctorsDataProvider } from './pages/manager/doctors/DoctorsDataContext'
import { ManagerServicesPricingPage } from './pages/manager/services-pricing/ManagerServicesPricingPage'
import { ManagerScheduleAssignmentPage } from './pages/manager/schedules/ManagerScheduleAssignmentPage'
import {
  ConversationReviewDetailPage,
  ConversationReviewPage,
  ErrorDetailPage,
  ExpertDashboardPage,
  FlaggedErrorsPage,
  KnowledgeBasePage,
  KnowledgeFormPage,
  ProcessingHistoryDetailPage,
  ProcessingHistoryPage,
  TrainingDataPage,
  TrainingFormPage,
} from './pages/expert/ExpertPages'

function App() {
  return (
    <DoctorsDataProvider>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
        <Route path="/manager/report" element={<ManagerReportAnalysisPage />} />
        <Route path="/manager/doctors" element={<DoctorManagementPage />} />
        <Route path="/manager/doctors/new" element={<DoctorNewPage />} />
        <Route path="/manager/doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/manager/schedules" element={<ManagerScheduleAssignmentPage />} />
        <Route path="/manager/clinic-settings" element={<ManagerServicesPricingPage />} />
        <Route path="/manager/services" element={<ManagerServicesPricingPage />} />

        <Route path="/manager/chatbot-monitor" element={<ChatbotMonitorPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        <Route path="/dashboard" element={<ExpertDashboardPage />} />
        <Route path="/conversations" element={<ConversationReviewPage />} />
        <Route path="/conversations/:id/review" element={<ConversationReviewDetailPage />} />
        <Route path="/errors" element={<FlaggedErrorsPage />} />
        <Route path="/errors/:id" element={<ErrorDetailPage />} />
        <Route path="/processing-history" element={<ProcessingHistoryPage />} />
        <Route path="/processing-history/:id" element={<ProcessingHistoryDetailPage />} />
        <Route path="/knowledge" element={<KnowledgeBasePage />} />
        <Route path="/knowledge/new" element={<KnowledgeFormPage />} />
        <Route path="/knowledge/:id/edit" element={<KnowledgeFormPage />} />
        <Route path="/training-data" element={<TrainingDataPage />} />
        <Route path="/training-data/new" element={<TrainingFormPage />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </DoctorsDataProvider>
  )
}

export default App
