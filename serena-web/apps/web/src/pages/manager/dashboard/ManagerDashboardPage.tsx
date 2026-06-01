import {
  Area,
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts'
import type { ReactNode } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { managerSidebarConfig } from '../managerSidebarConfig'
import './ManagerDashboardPage.css'
import { MetricCard } from '../../../components/ui/MetricCard'
import { ClockMetricIcon, CurrencyMetricIcon, MessageMetricIcon, PulseMetricIcon } from '../../../components/ui/metricIcons'
import { FilterButton } from '../../../components/ui/FilterButton'

const AlertCircleIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
)

const emergencyAlerts = [
  "Cảnh báo: 2 ca tư vấn có dấu hiệu nguy cơ cao đang chờ xử lý!",
]

const metrics: Array<{
  label: string
  value: string
  delta: string
  iconClassName: string
  icon: ReactNode
}> = [
  {
    label: 'Tổng lượt tư vấn Chatbot',
    value: '3,452',
    delta: '+11.3% so với kỳ trước',
    iconClassName: 'metric-icon-blue',
    icon: <MessageMetricIcon />,
  },
  {
    label: 'Tổng lịch hẹn khám',
    value: '1,237',
    delta: '+5.2% so với kỳ trước',
    iconClassName: 'metric-icon-yellow',
    icon: <ClockMetricIcon />,
  },
  {
    label: 'Tỷ lệ chuyển sang Bác sĩ',
    value: '18.5%',
    delta: '-3.1% so với kỳ trước',
    iconClassName: 'metric-icon-green',
    icon: <PulseMetricIcon />,
  },
  {
    label: 'Doanh thu dự kiến',
    value: '1,456 trĐ',
    delta: '+8.7% so với kỳ trước',
    iconClassName: 'metric-icon-pink',
    icon: <CurrencyMetricIcon />,
  },
]

const chatbotResults = [
  { name: 'Đã xử lý', value: 64, color: '#dcebff', gradient: ['#d5fbff', '#dcebff'] },
  { name: 'Chuyển bác sĩ', value: 18, color: '#d8f8df', gradient: ['#f0ffd2', '#d8f8df'] },
  { name: 'Không rõ', value: 5, color: '#fff1c7', gradient: ['#ffe2f1', '#fff1c7'] },
  { name: 'Nguy hiểm', value: 13, color: '#ffdce3', gradient: ['#ffd5dc', '#ffdce3'] },
]

const heroChartData = [
  { time: '01-07', consultations: 42, appointments: 28, revenue: 35 },
  { time: '08-12', consultations: 38, appointments: 22, revenue: 30 },
  { time: '13-17', consultations: 55, appointments: 32, revenue: 45 },
  { time: '18-21', consultations: 48, appointments: 29, revenue: 38 },
  { time: '22-28', consultations: 60, appointments: 38, revenue: 52 },
]

const branchData = [
  { branch: 'Chi nhánh Quận 1', appointments: 420, chatbot: 980, revenue: 520 },
  { branch: 'Chi nhánh Quận 3', appointments: 278, chatbot: 635, revenue: 310 },
  { branch: 'Chi nhánh Quận 7', appointments: 342, chatbot: 782, revenue: 415 },
  { branch: 'Chi nhánh Tân Bình', appointments: 512, chatbot: 1100, revenue: 600 },
]

const topDoctorsData = [
  { name: 'BS. Trần Văn A', appointments: 145 },
  { name: 'BS. Nguyễn Thị B', appointments: 132 },
  { name: 'BS. Lê Minh C', appointments: 118 },
  { name: 'BS. Phạm Văn D', appointments: 95 },
  { name: 'BS. Hoàng Thị E', appointments: 80 },
]

const doctorPerformanceData = [
  { name: 'BS. Trần Văn A', appointments: 18, completion: 96 },
  { name: 'BS. Nguyễn Thị B', appointments: 16, completion: 94 },
  { name: 'BS. Lê Minh C', appointments: 15, completion: 91 },
  { name: 'BS. Phạm Văn D', appointments: 12, completion: 86 },
  { name: 'BS. Hoàng Thị E', appointments: 9, completion: 78 },
  { name: 'BS. Vũ Thu H', appointments: 20, completion: 83 },
  { name: 'BS. Đỗ Quang K', appointments: 7, completion: 72 },
  { name: 'BS. Mai Anh N', appointments: 13, completion: 89 },
]

const workforceSummary = [
  { label: 'Số bác sĩ', value: '42' },
  { label: 'Đạt công suất mục tiêu', value: '76%' },
  { label: 'Đang quá tải', value: '6' },
  { label: 'Đang thiếu lịch', value: '8' },
]

const businessTrends = [
  { month: 'T1', revenue: 950, consultations: 2100, appointments: 850 },
  { month: 'T2', revenue: 1050, consultations: 2400, appointments: 920 },
  { month: 'T3', revenue: 1200, consultations: 2800, appointments: 1050 },
  { month: 'T4', revenue: 1150, consultations: 2600, appointments: 980 },
  { month: 'T5', revenue: 1350, consultations: 3100, appointments: 1150 },
  { month: 'T6', revenue: 1456, consultations: 3452, appointments: 1237 },
]

function metricFormatter(value: number | string, name: string) {
  const labels: Record<string, string> = {
    consultations: 'Lượt tư vấn',
    appointments: 'Lịch hẹn',
    chatbot: 'Tư vấn Chatbot',
    revenue: 'Doanh thu (trĐ)',
    handled: 'Chatbot tự xử lý',
    transferred: 'Chuyển Bác sĩ',
    total: 'Tổng số ca',
  }

  return [`${value}`, labels[name] ?? name]
}

export function ManagerDashboardPage() {
  return (
    <div className="desktop-shell-page manager-dashboard-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main manager-dashboard-main" aria-label="Nội dung chính">
        <section className="manager-dashboard-content">
          
          {/* 1. Emergency Alert Bar */}
          {emergencyAlerts.length > 0 && (
            <div className="emergency-alert-bar">
              <AlertCircleIcon size={20} className="alert-icon" />
              <span>{emergencyAlerts[0]}</span>
              <button className="alert-action-btn">Xử lý ngay</button>
            </div>
          )}

          <div className="dashboard-heading-row">
            <div>
              <h1>Dashboard Quản trị</h1>
              <p>Tổng quan hiệu suất hoạt động, nguồn lực và xu hướng kinh doanh.</p>
            </div>
            <FilterButton label="Tháng này" />
          </div>

          {/* 2. Overview KPIs */}
          <div className="metrics-grid">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                delta={metric.delta}
                icon={metric.icon}
                iconClassName={metric.iconClassName}
              />
            ))}
          </div>

          {/* 3. Chatbot Performance & Hero Chart */}
          <div className="dashboard-hero-grid">
            {/* Left: Chatbot Result Donut */}
            <section className="dashboard-card donut-hero-card">
              <div className="card-header-flex">
                <h2>Kết quả xử lý Chatbot</h2>
              </div>
              <div className="hero-donut-container">
                <div className="donut-wrapper">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <defs>
                        <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
                        </filter>
                        {chatbotResults.map((entry, index) => (
                          <linearGradient key={entry.name} id={`chatbotResultGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={entry.gradient[0]} />
                            <stop offset="100%" stopColor={entry.gradient[1]} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={112}
                        outerRadius={114}
                        fill="#e6edf3"
                        stroke="none"
                        isAnimationActive={false}
                      />
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={76}
                        outerRadius={106}
                        fill="#f4f8fb"
                        stroke="none"
                        isAnimationActive={false}
                      />
                      <Pie
                        data={chatbotResults}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={76}
                        outerRadius={106}
                        paddingAngle={1}
                        cornerRadius={20}
                        stroke="none"
                        labelLine={false}
                        label={(props: any) => {
                          const RADIAN = Math.PI / 180;
                          const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
                          const radius = outerRadius; // Position on the outer edge
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <g>
                              <circle cx={x} cy={y} r="16" fill="#ffffff" filter="url(#badge-shadow)" />
                              <text x={x} y={y} fill="#0f172a" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="700">
                                {value}%
                              </text>
                            </g>
                          );
                        }}
                      >
                        {chatbotResults.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#chatbotResultGradient${index})`} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          const item = payload?.[0]?.payload
                          if (!active || !item?.name) return null
                          return (
                            <div className="chart-tooltip">
                              <strong>{item.name}</strong>
                              <span>{item.value}%</span>
                            </div>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-inner-text">
                    <span className="inner-label">Đã xử lý</span>
                    <span className="inner-value">64%</span>
                  </div>
                </div>
                
                <div className="hero-donut-legend">
                  {chatbotResults.map(item => (
                    <div className="hero-legend-item" key={item.name}>
                      <div className="legend-label-row">
                        <span className="dot-outline" style={{ borderColor: item.color }}></span>
                        <span className="label" style={{ color: item.name === 'Nguy hiểm' ? '#e11d48' : '#1e293b' }}>
                          {item.name}
                        </span>
                        <span className="legend-percent">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right: Hero Combined Chart */}
            <section className="dashboard-card combined-hero-card">
              <h2>Tổng quan Hoạt động</h2>
              <div className="chart-frame">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={heroChartData} margin={{ top: 12, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dcebff" stopOpacity={0.75}/>
                        <stop offset="100%" stopColor="#dcebff" stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="areaRevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f6ad55" stopOpacity={0.25}/>
                        <stop offset="100%" stopColor="#f6ad55" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[0, 70]} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="consultations" name="Lượt tư vấn" barSize={28} fill="url(#barGradient)" radius={[8, 8, 0, 0]} animationDuration={1000} />
                    <Line type="monotone" dataKey="appointments" name="Lịch hẹn" stroke="#82c98d" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} animationDuration={1200} />
                    <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#f6ad55" fill="url(#areaRevGradient)" strokeWidth={3} strokeDasharray="4 4" dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} animationDuration={1400} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="mixed-chart-legend" aria-hidden="true">
                  <span><i className="legend-bar-swatch" />Lượt tư vấn</span>
                  <span><i className="legend-line-swatch legend-line-green" />Lịch hẹn</span>
                  <span><i className="legend-line-swatch legend-line-amber" />Doanh thu</span>
                </div>
              </div>
            </section>
          </div>

          {/* 4. Doctor Performance */}
          <div className="doctor-insights-grid">
            <section className="dashboard-card doctor-scatter-card">
              <h2>Hiệu suất Bác sĩ</h2>
              <p className="card-subtitle">Tương quan giữa số lịch hẹn nhận trong ngày và tỷ lệ hoàn thành lịch khám.</p>
              <div className="chart-frame doctor-scatter-frame">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 14, right: 22, left: -8, bottom: 8 }}>
                    <CartesianGrid stroke="#edf2f7" strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="appointments"
                      name="Lịch hẹn"
                      domain={[0, 22]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="completion"
                      name="Hoàn thành"
                      unit="%"
                      domain={[60, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <ReferenceLine x={14} stroke="#dcebff" strokeDasharray="4 4" />
                    <ReferenceLine y={85} stroke="#d8f8df" strokeDasharray="4 4" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3', stroke: '#dcebff' }}
                      content={({ active, payload }) => {
                        const item = payload?.[0]?.payload
                        if (!active || !item) return null
                        return (
                          <div className="chart-tooltip">
                            <strong>{item.name}</strong>
                            <span>{item.appointments} lịch hẹn</span>
                            <span>{item.completion}% hoàn thành</span>
                          </div>
                        )
                      }}
                    />
                    <Scatter data={doctorPerformanceData} fill="#82c98d">
                      {doctorPerformanceData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.completion >= 90 ? '#82c98d' : entry.appointments >= 18 ? '#f6ad55' : '#dcebff'}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </section>

            <aside className="doctor-side-stack">
              <section className="dashboard-card leaderboard-card">
                <h2>Top bác sĩ nổi bật</h2>
                <div className="leaderboard-list">
                  {topDoctorsData.slice(0, 3).map((doctor, index) => (
                    <div className="leaderboard-row" key={doctor.name}>
                      <span className="leaderboard-rank">{index + 1}</span>
                      <span className="leaderboard-name">{doctor.name}</span>
                      <strong>{doctor.appointments}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dashboard-card workforce-card">
                <h2>Workforce Summary</h2>
                <div className="workforce-summary-grid">
                  {workforceSummary.map((item) => (
                    <div className="workforce-summary-item" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>

          {/* 4. Branch Performance */}
          <section className="dashboard-card branch-performance">
            <h2>Hiệu quả Chi nhánh</h2>
            <p className="card-subtitle">So sánh Lượt tư vấn, Lịch hẹn và Doanh thu giữa các chi nhánh</p>
            <div className="chart-frame branch-chart-frame">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={8}>
                  <CartesianGrid stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="branch" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 13 }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value, name) => metricFormatter(value as number | string, name as string)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="chatbot" name="Lượt tư vấn Chatbot" fill="#dcebff" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar yAxisId="left" dataKey="appointments" name="Số lịch hẹn" fill="#82c98d" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar yAxisId="right" dataKey="revenue" name="Doanh thu (trĐ)" fill="#f6ad55" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 6. Business Trends */}
          <section className="dashboard-card business-trends">
            <h2>Xu hướng Kinh doanh (6 Tháng)</h2>
            <p className="card-subtitle">Tầm nhìn chiến lược về tăng trưởng</p>
            <div className="chart-frame" style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={businessTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 13 }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    formatter={(value, name) => metricFormatter(value as number | string, name as string)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="consultations" name="Lượt tư vấn" stroke="#7fb4f1" strokeWidth={3} dot={{ r: 4, fill: '#7fb4f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="left" type="monotone" dataKey="appointments" name="Lịch hẹn" stroke="#82c98d" strokeWidth={3} dot={{ r: 4, fill: '#82c98d', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Doanh thu (trĐ)" stroke="#f6ad55" strokeWidth={3} dot={{ r: 4, fill: '#f6ad55', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

        </section>
      </main>
    </div>
  )
}
