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
  ResponsiveContainer,
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
  { name: 'Đã xử lý', value: 64, color: '#bdf2e4' }, // Pastel Teal (Low)
  { name: 'Chuyển bác sĩ', value: 18, color: '#eaf49b' }, // Pastel Yellow-Green (Moderate)
  { name: 'Không rõ', value: 13, color: '#e2dcf4' }, // Pastel Lavender
  { name: 'Nguy hiểm', value: 5, color: '#ffc1cc' }, // Pastel Pink (Urgent)
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

const doctorResourceStatus = [
  { name: 'Quá tải (>8h/ngày)', value: 15, color: '#ff6b8b' },
  { name: 'Bình thường (4-8h/ngày)', value: 65, color: '#2bc155' },
  { name: 'Nhàn rỗi (<4h/ngày)', value: 20, color: '#ffba08' },
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
                      </defs>
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={105}
                        fill="#f8fafc"
                        stroke="none"
                        isAnimationActive={false}
                      />
                      <Pie
                        data={chatbotResults}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={105}
                        paddingAngle={2}
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
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
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={heroChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bee3f8" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#bee3f8" stopOpacity={0.3}/>
                      </linearGradient>
                      <linearGradient id="areaApptGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25}/>
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="areaRevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f6ad55" stopOpacity={0.25}/>
                        <stop offset="100%" stopColor="#f6ad55" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    
                    <Bar dataKey="consultations" name="Lượt tư vấn" barSize={40} fill="url(#barGradient)" radius={[8, 8, 0, 0]} animationDuration={1000} />
                    <Area type="monotone" dataKey="appointments" name="Lịch hẹn" stroke="#38bdf8" fill="url(#areaApptGradient)" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} animationDuration={1200} />
                    <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#f6ad55" fill="url(#areaRevGradient)" strokeWidth={3} strokeDasharray="4 4" dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} animationDuration={1400} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>
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
                  <Bar yAxisId="left" dataKey="chatbot" name="Lượt tư vấn Chatbot" fill="#4a93ff" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar yAxisId="left" dataKey="appointments" name="Số lịch hẹn" fill="#2bc155" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar yAxisId="right" dataKey="revenue" name="Doanh thu (trĐ)" fill="#ffba08" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 5. Doctor Resource Performance */}
          <div className="dashboard-split-grid">
            <section className="dashboard-card">
              <h2>Top Bác sĩ được đặt lịch</h2>
              <p className="card-subtitle">5 bác sĩ có số lượng lịch hẹn cao nhất</p>
              <div className="chart-frame" style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDoctorsData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid stroke="#f0f0f0" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: '#4a5568', fontSize: 13, fontWeight: 500 }} width={120} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [`${value} lịch hẹn`, 'Số lịch hẹn']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="appointments" fill="#4a93ff" radius={[0, 6, 6, 0]} barSize={24}>
                      {topDoctorsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4a93ff' : '#8dc1ff'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
            
            <section className="dashboard-card">
              <h2>Tình trạng Nguồn lực Bác sĩ</h2>
              <p className="card-subtitle">Phân bổ tải làm việc trong toàn hệ thống</p>
              <div className="donut-chart-container" style={{ height: 280, display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie
                      data={doctorResourceStatus}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {doctorResourceStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="custom-legend" style={{ width: '45%' }}>
                  {doctorResourceStatus.map(item => (
                    <div className="legend-item-soft" key={item.name}>
                      <span className="dot" style={{ backgroundColor: item.color }}></span>
                      <div className="legend-text">
                        <span className="label">{item.name}</span>
                        <span className="value">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

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
                  <Line yAxisId="left" type="monotone" dataKey="consultations" name="Lượt tư vấn" stroke="#4a93ff" strokeWidth={3} dot={{ r: 4, fill: '#4a93ff', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="left" type="monotone" dataKey="appointments" name="Lịch hẹn" stroke="#2bc155" strokeWidth={3} dot={{ r: 4, fill: '#2bc155', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Doanh thu (trĐ)" stroke="#ffba08" strokeWidth={3} dot={{ r: 4, fill: '#ffba08', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

        </section>
      </main>
    </div>
  )
}
