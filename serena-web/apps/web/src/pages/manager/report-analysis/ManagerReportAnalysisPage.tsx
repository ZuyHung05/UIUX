import { useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { managerSidebarConfig } from '../managerSidebarConfig'
import './ManagerReportAnalysisPage.css'

import { MetricCard } from '../../../components/ui/MetricCard'
import { ClockMetricIcon, CurrencyMetricIcon, MessageMetricIcon, StarMetricIcon } from '../../../components/ui/metricIcons'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { SegmentedTabs } from '../../../components/ui/SegmentedTabs'
import { branchDashboardMetrics, branchMockData } from '../../../data/branchMockData'
import { chatbotMonitorConversations } from '../chatbot-monitor/chatbotMonitorMockData'

type ReportTab = 'chatbot' | 'revenue' | 'branch'
type DeltaTrend = 'positive' | 'negative' | 'neutral'

type ReportMetric = {
  label: string
  value: string
  deltaValue: string
  deltaNote: string
  deltaTrend: DeltaTrend
  iconClassName: string
  icon: ReactNode
}

type DonutData = Array<{ name: string; value: number; color: string }>

function parseReportTab(value: string | null): ReportTab {
  if (value === 'revenue' || value === 'branch') {
    return value
  }

  return 'chatbot'
}

const reportTabs: Array<{ value: ReportTab; label: string }> = [
  { value: 'chatbot', label: 'Báo cáo Chatbot' },
  { value: 'revenue', label: 'Báo cáo Doanh thu' },
  { value: 'branch', label: 'Báo cáo Chi nhánh' },
]

const branchOptions = [
  { value: 'all-branches', label: 'Tất cả chi nhánh' },
  ...branchMockData.map((branch) => ({ value: branch.id, label: branch.name })),
]

const uniqueSpecialties = Array.from(new Set(chatbotMonitorConversations.map((conversation) => conversation.specialty)))

const specialtyOptions = [
  { value: 'all-specialties', label: 'Tất cả chuyên khoa' },
  ...uniqueSpecialties.map((specialty) => ({ value: specialty, label: specialty })),
]

const periodOptions = [
  { value: 'this-month', label: 'Tháng này' },
  { value: 'last-month', label: 'Tháng trước' },
  { value: 'this-quarter', label: 'Quý này' },
  { value: 'this-year', label: 'Năm nay' },
  { value: 'custom', label: 'Tùy chỉnh' },
]

const exportReportOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'chatbot', label: 'Báo cáo chatbot' },
  { value: 'revenue', label: 'Báo cáo doanh thu' },
  { value: 'branch', label: 'Báo cáo chi nhánh' },
]

const reportPalette = {
  blue: '#8dc1ff',
  blueInk: '#4a93ff',
  green: '#9fe3b8',
  yellow: '#ffd97a',
  pink: '#ffb3d1',
  rose: '#f8a5b7',
} as const

const monthlyBranchMetrics = branchMockData.map((branch) => ({
  branch: branch.shortName,
  name: branch.name,
  ...branchDashboardMetrics.month[branch.id],
}))

const todayRevenue = branchMockData.reduce((sum, branch) => sum + branchDashboardMetrics.today[branch.id].revenue, 0)
const weeklyRevenue = branchMockData.reduce((sum, branch) => sum + branchDashboardMetrics.week[branch.id].revenue, 0)
const monthlyRevenue = branchMockData.reduce((sum, branch) => sum + branchDashboardMetrics.month[branch.id].revenue, 0)
const monthlyAppointments = monthlyBranchMetrics.reduce((sum, branch) => sum + branch.appointments, 0)
const monthlyAiConsults = monthlyBranchMetrics.reduce((sum, branch) => sum + branch.aiConsults, 0)
const monthlyDoctorConsults = monthlyBranchMetrics.reduce((sum, branch) => sum + branch.doctorConsults, 0)

const totalChatbotSessions = chatbotMonitorConversations.length
const transferredSessions = chatbotMonitorConversations.filter((conversation) => conversation.handlerType === 'doctor').length
const aiHandledSessions = totalChatbotSessions - transferredSessions
const aiHandledPercent = Math.round((aiHandledSessions / totalChatbotSessions) * 100)
const transferPercent = Math.round((transferredSessions / totalChatbotSessions) * 100)
const lowRatingSessions = chatbotMonitorConversations.filter((conversation) => conversation.rating <= 2).length
const averageRating = chatbotMonitorConversations.reduce((sum, conversation) => sum + conversation.rating, 0) / totalChatbotSessions
const lowRatingPercent = Math.round((lowRatingSessions / totalChatbotSessions) * 100)

const chatbotMetrics: ReportMetric[] = [
  {
    label: 'Tổng lượt tư vấn AI',
    value: monthlyAiConsults.toLocaleString('vi-VN'),
    deltaValue: '9.6%',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-blue',
    icon: <MessageMetricIcon />,
  },
  {
    label: 'AI tự xử lý thành công',
    value: `${aiHandledPercent}%`,
    deltaValue: '4.1%',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-green',
    icon: <StarMetricIcon />,
  },
  {
    label: 'Tỷ lệ chuyển bác sĩ',
    value: `${transferPercent}%`,
    deltaValue: '2.4%',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-yellow',
    icon: <ClockMetricIcon />,
  },
  {
    label: 'Hài lòng trung bình',
    value: `${averageRating.toFixed(1)}/5`,
    deltaValue: '0.2 điểm',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-pink',
    icon: <StarMetricIcon />,
  },
]

const revenueMetrics: ReportMetric[] = [
  {
    label: 'Tổng doanh thu',
    value: `${(monthlyRevenue / 1000).toFixed(1)} tỷ`,
    deltaValue: '7.9%',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-pink',
    icon: <CurrencyMetricIcon />,
  },
  {
    label: 'Tổng số giao dịch',
    value: monthlyAppointments.toLocaleString('vi-VN'),
    deltaValue: '4.4%',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-blue',
    icon: <MessageMetricIcon />,
  },
  {
    label: 'Giá trị giao dịch TB',
    value: `${Math.round((monthlyRevenue * 1000) / monthlyAppointments).toLocaleString('vi-VN')}K`,
    deltaValue: '3.3%',
    deltaNote: 'so với tháng trước',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-green',
    icon: <CurrencyMetricIcon />,
  },
  {
    label: 'Tăng trưởng doanh thu',
    value: '7.9%',
    deltaValue: '1.2%',
    deltaNote: 'cao hơn mục tiêu',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-yellow',
    icon: <StarMetricIcon />,
  },
]

const branchMetrics: ReportMetric[] = [
  {
    label: 'Chi nhánh hoạt động',
    value: String(branchMockData.length).padStart(2, '0'),
    deltaValue: '100%',
    deltaNote: 'chi nhánh online',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-blue',
    icon: <ClockMetricIcon />,
  },
  {
    label: 'Doanh thu cao nhất',
    value: monthlyBranchMetrics.reduce((best, branch) => (branch.revenue > best.revenue ? branch : best), monthlyBranchMetrics[0]).branch,
    deltaValue: `${monthlyBranchMetrics.reduce((best, branch) => (branch.revenue > best.revenue ? branch : best), monthlyBranchMetrics[0]).revenue.toLocaleString('vi-VN')} trđ`,
    deltaNote: 'trong tháng',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-pink',
    icon: <CurrencyMetricIcon />,
  },
  {
    label: 'Nhiều lịch hẹn nhất',
    value: monthlyBranchMetrics.reduce((best, branch) => (branch.appointments > best.appointments ? branch : best), monthlyBranchMetrics[0]).branch,
    deltaValue: `${monthlyBranchMetrics.reduce((best, branch) => (branch.appointments > best.appointments ? branch : best), monthlyBranchMetrics[0]).appointments.toLocaleString('vi-VN')}`,
    deltaNote: 'lịch hẹn',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-green',
    icon: <MessageMetricIcon />,
  },
  {
    label: 'Chuyển đổi cao nhất',
    value: monthlyBranchMetrics.reduce((best, branch) => (branch.conversion > best.conversion ? branch : best), monthlyBranchMetrics[0]).branch,
    deltaValue: `${monthlyBranchMetrics.reduce((best, branch) => (branch.conversion > best.conversion ? branch : best), monthlyBranchMetrics[0]).conversion}%`,
    deltaNote: 'tư vấn thành lịch hẹn',
    deltaTrend: 'positive',
    iconClassName: 'metric-icon-yellow',
    icon: <StarMetricIcon />,
  },
]

const chatbotConversionTrendData = ([
  { key: 'today', time: 'Hôm nay' },
  { key: 'week', time: 'Tuần này' },
  { key: 'month', time: 'Tháng này' },
] as const).map((period) => {
  const totals = branchMockData.reduce(
    (acc, branch) => {
      const metric = branchDashboardMetrics[period.key][branch.id]
      return {
        aiConsults: acc.aiConsults + metric.aiConsults,
        doctorConsults: acc.doctorConsults + metric.doctorConsults,
        appointments: acc.appointments + metric.appointments,
      }
    },
    { aiConsults: 0, doctorConsults: 0, appointments: 0 },
  )

  return {
    time: period.time,
    doctorConversion: Number(((totals.doctorConsults / totals.aiConsults) * 100).toFixed(1)),
    appointmentConversion: Number(((totals.appointments / totals.aiConsults) * 100).toFixed(1)),
  }
})

const chatbotHandlingStackData = ([
  { key: 'today', time: 'Hôm nay' },
  { key: 'week', time: 'Tuần này' },
  { key: 'month', time: 'Tháng này' },
] as const).map((period) => {
  const totals = branchMockData.reduce(
    (acc, branch) => {
      const metric = branchDashboardMetrics[period.key][branch.id]
      return {
        aiConsults: acc.aiConsults + metric.aiConsults,
        doctorConsults: acc.doctorConsults + metric.doctorConsults,
        appointments: acc.appointments + metric.appointments,
      }
    },
    { aiConsults: 0, doctorConsults: 0, appointments: 0 },
  )

  return {
    time: period.time,
    handled: Math.max(totals.aiConsults - totals.doctorConsults - totals.appointments, 0),
    doctor: totals.doctorConsults,
    booking: totals.appointments,
  }
})

const ratingDistributionData = [1, 2, 3, 4, 5].map((rating) => ({
  rating: `${rating} sao`,
  count: chatbotMonitorConversations.filter((conversation) => conversation.rating === rating).length,
}))

const revenueTrendData = [
  { time: 'Hôm nay', revenue: todayRevenue },
  { time: 'Tuần này', revenue: weeklyRevenue },
  { time: 'Tháng này', revenue: monthlyRevenue },
]

const revenueStructureData = [
  { name: 'Khám trực tiếp', value: Math.round((monthlyAppointments / (monthlyAppointments + monthlyDoctorConsults)) * 100), color: reportPalette.blue },
  { name: 'Tư vấn chuyên sâu', value: Math.round((monthlyDoctorConsults / (monthlyAppointments + monthlyDoctorConsults)) * 100), color: reportPalette.yellow },
]

const specialtyRevenueData = uniqueSpecialties
  .map((specialty) => {
    const sessionCount = chatbotMonitorConversations.filter((conversation) => conversation.specialty === specialty).length
    return { name: specialty, value: Math.round((sessionCount / totalChatbotSessions) * monthlyRevenue) }
  })
  .sort((a, b) => b.value - a.value)
  .slice(0, 5)

const branchComparisonData = monthlyBranchMetrics.map((branch) => ({
  branch: branch.branch,
  ai: branch.aiConsults,
  appointments: branch.appointments,
  revenue: branch.revenue,
}))

const branchSummaryRows = monthlyBranchMetrics.map((branch) => ({
  branch: branch.branch,
  ai: branch.aiConsults.toLocaleString('vi-VN'),
  appointments: branch.appointments.toLocaleString('vi-VN'),
  revenue: `${branch.revenue.toLocaleString('vi-VN')} trđ`,
  conversion: `${branch.conversion}%`,
  csat: averageRating.toFixed(1),
}))

const branchRankingData = [...monthlyBranchMetrics]
  .sort((a, b) => b.revenue - a.revenue)
  .map((branch) => ({ name: branch.branch, value: branch.revenue }))

function metricFormatter(value: number | string, name: string) {
  const labels: Record<string, string> = {
    consultations: 'Lượt tư vấn AI',
    revenue: 'Doanh thu',
    ai: 'Lượt tư vấn AI',
    appointments: 'Lịch hẹn',
    doctorConversion: 'Chuyển đổi tư vấn chuyên sâu bác sĩ',
    appointmentConversion: 'Chuyển đổi đặt lịch hẹn',
    handled: 'AI tự xử lý',
    doctor: 'Chuyển bác sĩ',
    booking: 'Đặt lịch hẹn',
    count: 'Số đánh giá',
    value: 'Giá trị',
  }

  if (name === 'doctorConversion' || name === 'appointmentConversion') {
    return [`${value}%`, labels[name]]
  }

  if (name === 'revenue' && typeof value === 'number' && value < 20) {
    return [`${value.toFixed(2)} tỷ`, labels[name]]
  }

  if (name === 'revenue') {
    return [`${value} triệu`, labels[name]]
  }

  return [value, labels[name] ?? name]
}

function DonutPanel({ data, centerValue, centerLabel }: { data: DonutData; centerValue: string; centerLabel: string }) {
  return (
    <div className="report-donut-layout">
      <div className="report-donut-frame">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={5} stroke="#fff" strokeWidth={4}>
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="report-donut-center">
          <strong>{centerValue}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
      <div className="report-donut-legend">
        {data.map((item) => (
          <div className="report-legend-row" key={item.name}>
            <span className="legend-dot" style={{ background: item.color }} />
            <p>{item.name}</p>
            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ManagerReportAnalysisPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<ReportTab>(() => parseReportTab(searchParams.get('tab')))
  const [periodFilter, setPeriodFilter] = useState('this-month')
  const [branchFilter, setBranchFilter] = useState('all-branches')
  const [specialtyFilter, setSpecialtyFilter] = useState('all-specialties')
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const [exportReportScope, setExportReportScope] = useState('all')

  const isBranchReport = activeTab === 'branch'
  const currentMetrics = activeTab === 'chatbot' ? chatbotMetrics : activeTab === 'revenue' ? revenueMetrics : branchMetrics
  const selectedExportLabel = exportReportOptions.find((option) => option.value === exportReportScope)?.label ?? 'Tất cả'
  const handleReportTabChange = (nextTab: ReportTab) => {
    setActiveTab(nextTab)
    setSearchParams({ tab: nextTab })
  }

  return (
    <div className="desktop-shell-page manager-report-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main manager-report-main" aria-label="Nội dung báo cáo">
        <section className="manager-report-content">
          <div className="report-topbar">
            <div className="report-title-block">
              <h1>Báo cáo</h1>
              <p>Dữ liệu lịch sử phục vụ đánh giá dài hạn và xuất báo cáo quản lý chuỗi phòng khám.</p>
            </div>
            <div className="report-control-row">
              <div className="report-filters" aria-label="Bộ lọc báo cáo">
                <FilterSelect
                  value={isBranchReport ? 'all-branches' : branchFilter}
                  onChange={(event) => setBranchFilter(event.target.value)}
                  options={branchOptions}
                  disabled={isBranchReport}
                />
                <FilterSelect
                  value={isBranchReport ? 'all-specialties' : specialtyFilter}
                  onChange={(event) => setSpecialtyFilter(event.target.value)}
                  options={specialtyOptions}
                  disabled={isBranchReport}
                />
                <FilterSelect
                  value={periodFilter}
                  onChange={(event) => setPeriodFilter(event.target.value)}
                  options={periodOptions}
                />
              </div>
              <div className="export-report-menu">
                <button
                  className="export-report-button"
                  type="button"
                  aria-expanded={isExportMenuOpen}
                  aria-label="Chọn phạm vi xuất báo cáo PDF"
                  onClick={() => setIsExportMenuOpen((open) => !open)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v10" />
                    <path d="m7 9 5 5 5-5" />
                    <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                  </svg>
                  <span>Xuất PDF</span>
                  <em>{selectedExportLabel}</em>
                  <svg className="export-report-chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isExportMenuOpen ? (
                  <div className="export-report-dropdown" role="menu" aria-label="Phạm vi xuất báo cáo PDF">
                    {exportReportOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitem"
                        className={option.value === exportReportScope ? 'is-selected' : undefined}
                        onClick={() => {
                          setExportReportScope(option.value)
                          setIsExportMenuOpen(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <SegmentedTabs
            className="report-tabs"
            options={reportTabs}
            value={activeTab}
            ariaLabel="Nhóm báo cáo"
            onChange={handleReportTabChange}
          />

          <div className="metrics-grid report-metrics-grid">
            {currentMetrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                delta={`${metric.deltaTrend === 'negative' ? '▼' : '▲'} ${metric.deltaValue} ${metric.deltaNote}`}
                deltaTrend={metric.deltaTrend}
                icon={metric.icon}
                iconClassName={metric.iconClassName}
              />
            ))}
          </div>

          {activeTab === 'chatbot' ? (
            <div className="chatbot-report-grid">
              <section className="report-card chatbot-conversion-card">
                <div className="report-card-heading">
                  <span>Xu hướng chuyển đổi theo thời gian</span>
                  <h2>Tư vấn chuyên sâu và đặt lịch hẹn</h2>
                </div>
                <div className="report-chart-frame">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chatbotConversionTrendData} margin={{ top: 10, right: 16, left: -18, bottom: 0 }}>
                      <CartesianGrid stroke="#e8eef6" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis unit="%" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip formatter={(value, name) => metricFormatter(value as number | string, name as string)} />
                      <Line type="monotone" dataKey="doctorConversion" stroke={reportPalette.blueInk} strokeWidth={3} dot={{ r: 4, fill: reportPalette.blueInk, strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="appointmentConversion" stroke="#f0ad2d" strokeWidth={3} dot={{ r: 4, fill: '#f0ad2d', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="report-inline-legend">
                  <span><i style={{ background: reportPalette.blueInk }} />Tư vấn chuyên sâu bác sĩ</span>
                  <span><i style={{ background: '#f0ad2d' }} />Đặt lịch hẹn</span>
                </div>
              </section>

              <section className="report-card chatbot-stack-card">
                <div className="report-card-heading">
                  <span>Cơ cấu xử lý theo thời gian</span>
                  <h2>Số lượng hội thoại theo kết quả xử lý</h2>
                </div>
                <div className="report-chart-frame">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chatbotHandlingStackData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }} barCategoryGap="34%">
                      <CartesianGrid stroke="#e8eef6" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip formatter={(value, name) => metricFormatter(value as number | string, name as string)} cursor={{ fill: '#f6f9ff' }} />
                      <Bar dataKey="handled" stackId="result" fill={reportPalette.green} radius={[0, 0, 6, 6]} />
                      <Bar dataKey="doctor" stackId="result" fill={reportPalette.blue} />
                      <Bar dataKey="booking" stackId="result" fill={reportPalette.yellow} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="report-inline-legend">
                  <span><i style={{ background: reportPalette.green }} />AI tự xử lý</span>
                  <span><i style={{ background: reportPalette.blue }} />Chuyển bác sĩ</span>
                  <span><i style={{ background: reportPalette.yellow }} />Đặt lịch hẹn</span>
                </div>
              </section>

              <section className="report-card chatbot-rating-card">
                <div className="report-card-heading">
                  <span>Phân bố đánh giá người dùng</span>
                  <h2>Số phiên theo mức sao</h2>
                </div>
                <div className="report-mini-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingDistributionData} layout="vertical" margin={{ top: 0, right: 18, left: 8, bottom: 0 }} barSize={17}>
                      <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 10.5, fill: '#64748b' }} />
                      <YAxis dataKey="rating" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#475569' }} width={54} />
                      <Tooltip formatter={(value, name) => metricFormatter(value as number | string, name as string)} cursor={{ fill: '#f6f9ff' }} />
                      <Bar dataKey="count" fill={reportPalette.rose} radius={[0, 7, 7, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="report-card chatbot-insight-card">
                <div className="report-card-heading report-inline-heading">
                  <div>
                    <span>Phiên hội thoại bất thường</span>
                    <h2>Đánh giá thấp cần theo dõi</h2>
                  </div>
                  <button className="report-link-button" type="button" onClick={() => navigate('/manager/chatbot-monitor')}>
                    Xem chi tiết
                  </button>
                </div>
                <div className="chatbot-insight-body">
                  <div className="insight-primary">
                    <span>Tổng số phiên đánh giá thấp</span>
                    <strong>{lowRatingSessions.toLocaleString('vi-VN')}</strong>
                  </div>
                  <div className="insight-secondary">
                    <div>
                      <span>Tỷ lệ đánh giá thấp</span>
                      <strong>{lowRatingPercent}%</strong>
                    </div>
                    <div>
                      <span>So sánh với kỳ trước</span>
                      <strong className="insight-positive">▼ 1.8%</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'revenue' ? (
            <div className="report-body-grid">
              <section className="report-card report-main-chart">
                <div className="report-card-heading">
                  <span>Doanh thu theo thời gian</span>
                  <h2>Xu hướng tăng trưởng doanh thu</h2>
                </div>
                <div className="report-chart-frame">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueTrendData} margin={{ top: 12, right: 18, left: -18, bottom: 2 }}>
                      <CartesianGrid stroke="#e8eef6" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip formatter={(value, name) => metricFormatter(value as number | string, name as string)} />
                      <Line type="monotone" dataKey="revenue" stroke="#f0627d" strokeWidth={3} dot={{ r: 4, fill: '#f0627d', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className="report-side-stack">
                <section className="report-card report-compact-card">
                  <div className="report-card-heading">
                    <span>Cơ cấu doanh thu</span>
                    <h2>Nguồn doanh thu chính</h2>
                  </div>
                  <DonutPanel data={revenueStructureData} centerValue="64%" centerLabel="trực tiếp" />
                </section>

                <section className="report-card report-compact-card">
                  <div className="report-card-heading">
                    <span>Doanh thu theo chuyên khoa</span>
                    <h2>Top chuyên khoa trong kỳ</h2>
                  </div>
                  <div className="report-mini-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={specialtyRevenueData} layout="vertical" margin={{ top: 0, right: 18, left: 8, bottom: 0 }} barSize={16}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#475569' }} width={104} />
                        <Tooltip formatter={(value) => [`${value} triệu`, 'Doanh thu']} cursor={{ fill: '#f6f9ff' }} />
                        <Bar dataKey="value" fill="#8dc1ff" radius={[0, 7, 7, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>
            </div>
          ) : null}

          {activeTab === 'branch' ? (
            <div className="report-body-grid">
              <section className="report-card report-main-chart">
                <div className="report-card-heading">
                  <span>So sánh hiệu quả giữa các chi nhánh</span>
                  <h2>Lượt tư vấn AI, lịch hẹn và doanh thu</h2>
                </div>
                <div className="report-chart-frame">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchComparisonData} margin={{ top: 12, right: 18, left: -18, bottom: 2 }} barGap={5}>
                      <CartesianGrid stroke="#e8eef6" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="branch" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip formatter={(value, name) => metricFormatter(value as number | string, name as string)} cursor={{ fill: '#f6f9ff' }} />
                      <Bar dataKey="ai" fill="#8dc1ff" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="appointments" fill="#9fe3b8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="revenue" fill="#ffd97a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="report-inline-legend">
                  <span><i style={{ background: '#8dc1ff' }} />Lượt tư vấn AI</span>
                  <span><i style={{ background: '#9fe3b8' }} />Lịch hẹn</span>
                  <span><i style={{ background: '#ffd97a' }} />Doanh thu</span>
                </div>
              </section>

              <div className="report-side-stack">
                <section className="report-card report-compact-card">
                  <div className="report-card-heading">
                    <span>Xếp hạng chi nhánh</span>
                    <h2>Theo doanh thu trong kỳ</h2>
                  </div>
                  <div className="report-mini-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={branchRankingData} layout="vertical" margin={{ top: 0, right: 18, left: 8, bottom: 0 }} barSize={18}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#475569' }} width={82} />
                        <Tooltip formatter={(value) => [`${value} triệu`, 'Doanh thu']} cursor={{ fill: '#f6f9ff' }} />
                        <Bar dataKey="value" fill="#f8a5b7" radius={[0, 7, 7, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="report-card report-compact-card branch-table-card">
                  <div className="report-card-heading">
                    <span>Bảng tổng hợp chi nhánh</span>
                    <h2>Hiệu quả vận hành từng cơ sở</h2>
                  </div>
                  <div className="branch-summary-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Chi nhánh</th>
                          <th>AI</th>
                          <th>Lịch</th>
                          <th>Doanh thu</th>
                          <th>Chuyển đổi</th>
                          <th>CSAT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchSummaryRows.map((row) => (
                          <tr key={row.branch}>
                            <td>{row.branch}</td>
                            <td>{row.ai}</td>
                            <td>{row.appointments}</td>
                            <td>{row.revenue}</td>
                            <td>{row.conversion}</td>
                            <td>{row.csat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}
