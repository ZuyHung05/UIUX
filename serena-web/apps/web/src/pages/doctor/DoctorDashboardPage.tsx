import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../../components/layout/DesktopShell.css'
import { Header } from '../../components/layout/header/Header'
import { Sidebar } from '../../components/layout/sidebar/Sidebar'
import { LiveConsultationTab, ChatItem, initialChats } from './consultation/LiveConsultationTab'
import { DashboardTab } from './dashboard/DashboardTab'
import './DoctorDashboardPage.css'
import { doctorSidebarConfig } from './doctorSidebarConfig'
import { PatientListTab } from './patients/PatientListTab'
import SchedulePage from './schedule/DoctorSchedulePage'

export function DoctorDashboardPage() {
  const [searchParams] = useSearchParams()
  const tabFromQuery = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<string>(tabFromQuery || 'Dashboard')

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery)
    }
  }, [tabFromQuery])
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [selectedEncounterDate, setSelectedEncounterDate] = useState<string | null>(null)
  const [referrerTab, setReferrerTab] = useState<string | null>(null)
  const [chats, setChats] = useState<ChatItem[]>(initialChats)

  // Create a customized config where activeLabel matches current activeTab state
  const dynamicSidebarConfig = {
    ...doctorSidebarConfig,
    activeLabel: activeTab,
  }

  const renderTabContent = () => {
    const handleBackToDashboard = () => setActiveTab('Dashboard')

    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardTab 
            onNavigateTab={setActiveTab} 
            onViewPatientProfile={(patientId) => {
              setSelectedPatientId(patientId)
              setReferrerTab('Dashboard')
              setActiveTab('Danh sách bệnh nhân')
            }}
            onViewChatMessage={(chatId) => {
              setSelectedChatId(chatId)
              setActiveTab('Tư vấn trực tiếp')
            }}
          />
        )
      case 'Tư vấn trực tiếp':
        return (
          <LiveConsultationTab 
            onBackToDashboard={handleBackToDashboard} 
            onViewPatientProfile={(patientId, encounterDate) => {
              setSelectedPatientId(patientId)
              setSelectedChatId(patientId) // Keep track of the active chat ID as well!
              setSelectedEncounterDate(encounterDate || null)
              setReferrerTab('Tư vấn trực tiếp')
              setActiveTab('Danh sách bệnh nhân')
            }}
            initialActiveChatId={selectedChatId}
            onClearActiveChat={() => setSelectedChatId(null)}
            chats={chats}
            setChats={setChats}
          />
        )
      case 'Danh sách bệnh nhân':
        return (
          <PatientListTab 
            onBackToDashboard={handleBackToDashboard} 
            initialActivePatientId={selectedPatientId}
            initialSelectedEncounterDate={selectedEncounterDate}
            onClearActivePatient={() => {
              setSelectedPatientId(null)
              setSelectedEncounterDate(null)
              setReferrerTab(null)
            }}
            onBackToReferrer={referrerTab ? () => {
              setActiveTab(referrerTab)
              setSelectedPatientId(null)
              setSelectedEncounterDate(null)
              setReferrerTab(null)
            } : undefined}
            referrerTabName={referrerTab || undefined}
          />
        )
      case 'Lịch làm việc':
        return <SchedulePage onBackToDashboard={handleBackToDashboard} />

      default:
        return <DashboardTab onNavigateTab={setActiveTab} />
    }
  }

  return (
    <div className="desktop-shell-page doctor-dashboard-page">
      <Sidebar
        config={dynamicSidebarConfig}
        onItemClick={(tab) => {
          setSelectedPatientId(null)
          setSelectedChatId(null)
          setSelectedEncounterDate(null)
          setReferrerTab(null)
          setActiveTab(tab)
        }}
      />
      <Header profileRole={dynamicSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-dashboard-main" aria-label="Nội dung chính">
        {renderTabContent()}
      </main>
    </div>
  )
}
