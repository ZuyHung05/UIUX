import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import './ManagerDashboardPage.css'
import { MetricCard } from '../../../components/ui/MetricCard'
import {
  ClockMetricIcon,
  CurrencyMetricIcon,
  MessageMetricIcon,
  PulseMetricIcon,
} from '../../../components/ui/metricIcons'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { branchDashboardMetrics, branchMockData } from '../../../data/branchMockData'

type TimeRange = 'today' | 'week' | 'month'
type DeltaTrend = 'positive' | 'negative' | 'neutral'

type Kpi = {
  label: string
  value: string
  deltaValue: string
  deltaNote: string
  deltaTrend: DeltaTrend
  iconClassName: string
  icon: ReactNode
}

type TrendPoint = { label: string; consults: number }
type StackedPoint = { label: string; handled: number; doctor: number; booking: number }
type AssignmentRow = { name: string; filled: number; total: number } // chi nhánh + tiến độ phân công

// === Pastel theme — tối đa 5 màu ===
// blue: tư vấn AI · green: bác sĩ · yellow: lịch hẹn · pink: doanh thu · (+ neutral)
const palette = {
  blue: '#8dc1ff',
  blueInk: '#4a93ff',
  green: '#9fe3b8',
  yellow: '#ffd97a',
  pink: '#ffb3d1',
} as const

const timeRangeOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
]

// Các nhóm kết quả xử lý sau sàng lọc AI (dùng cho donut)
const resultSeries = [
  { key: 'handled', name: 'Tự xử lý thành công', color: palette.blue },
  { key: 'doctor', name: 'Chuyển tư vấn bác sĩ', color: palette.green },
  { key: 'booking', name: 'Đặt lịch hẹn', color: palette.yellow },
] as const

const dashboardData: Record<TimeRange, {
  heading: string
  kpis: Kpi[]
  trend: TrendPoint[]
  stacked: StackedPoint[]
  assignment: AssignmentRow[]
}> = {
  today: {
    heading: 'Tổng quan hôm nay',
    kpis: [
      {
        label: 'Tổng lượt tư vấn AI',
        value: '486',
        deltaValue: '8.4%',
        deltaNote: 'so với hôm qua',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-blue',
        icon: <MessageMetricIcon />,
      },
      {
        label: 'Tỷ lệ chuyển đổi dịch vụ trả phí',
        value: '24.8%',
        deltaValue: '1.6%',
        deltaNote: 'so với hôm qua',
        deltaTrend: 'negative',
        iconClassName: 'metric-icon-green',
        icon: <PulseMetricIcon />,
      },
      {
        label: 'Tổng số lịch hẹn',
        value: '138',
        deltaValue: '5.1%',
        deltaNote: 'so với hôm qua',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-yellow',
        icon: <ClockMetricIcon />,
      },
      {
        label: 'Doanh thu',
        value: '164 trđ',
        deltaValue: '6.7%',
        deltaNote: 'so với hôm qua',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-pink',
        icon: <CurrencyMetricIcon />,
      },
    ],
    trend: [
      { label: '08h', consults: 28 },
      { label: '09h', consults: 46 },
      { label: '10h', consults: 63 },
      { label: '11h', consults: 58 },
      { label: '12h', consults: 34 },
      { label: '13h', consults: 41 },
      { label: '14h', consults: 67 },
      { label: '15h', consults: 72 },
      { label: '16h', consults: 49 },
      { label: '17h', consults: 28 },
    ],
    stacked: [
      { label: 'Sáng', handled: 96, doctor: 28, booking: 22 },
      { label: 'Trưa', handled: 52, doctor: 14, booking: 9 },
      { label: 'Chiều', handled: 118, doctor: 36, booking: 31 },
      { label: 'Tối', handled: 34, doctor: 10, booking: 6 },
    ],
    assignment: [
      { name: 'Hồ Chí Minh', filled: 24, total: 24 },
      { name: 'Hà Nội', filled: 15, total: 18 },
      { name: 'Đà Nẵng', filled: 0, total: 14 },
    ],
  },
  week: {
    heading: 'Tổng quan tuần này',
    kpis: [
      {
        label: 'Tổng lượt tư vấn AI',
        value: '3,452',
        deltaValue: '11.3%',
        deltaNote: 'so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-blue',
        icon: <MessageMetricIcon />,
      },
      {
        label: 'Tỷ lệ chuyển đổi dịch vụ trả phí',
        value: '26.4%',
        deltaValue: '2.2%',
        deltaNote: 'so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-green',
        icon: <PulseMetricIcon />,
      },
      {
        label: 'Tổng số lịch hẹn',
        value: '1,237',
        deltaValue: '5.2%',
        deltaNote: 'so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-yellow',
        icon: <ClockMetricIcon />,
      },
      {
        label: 'Doanh thu',
        value: '1,456 trđ',
        deltaValue: '8.7%',
        deltaNote: 'so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-pink',
        icon: <CurrencyMetricIcon />,
      },
    ],
    trend: [
      { label: 'T2', consults: 432 },
      { label: 'T3', consults: 498 },
      { label: 'T4', consults: 521 },
      { label: 'T5', consults: 486 },
      { label: 'T6', consults: 564 },
      { label: 'T7', consults: 612 },
      { label: 'CN', consults: 339 },
    ],
    stacked: [
      { label: 'T2', handled: 286, doctor: 84, booking: 62 },
      { label: 'T3', handled: 322, doctor: 96, booking: 80 },
      { label: 'T4', handled: 348, doctor: 102, booking: 71 },
      { label: 'T5', handled: 318, doctor: 92, booking: 76 },
      { label: 'T6', handled: 372, doctor: 108, booking: 84 },
      { label: 'T7', handled: 408, doctor: 116, booking: 88 },
      { label: 'CN', handled: 224, doctor: 64, booking: 51 },
    ],
    assignment: [
      { name: 'Hồ Chí Minh', filled: 40, total: 40 },
      { name: 'Hà Nội', filled: 26, total: 32 },
      { name: 'Đà Nẵng', filled: 18, total: 28 },
    ],
  },
  month: {
    heading: 'Tổng quan tháng này',
    kpis: [
      {
        label: 'Tổng lượt tư vấn AI',
        value: '14,820',
        deltaValue: '9.6%',
        deltaNote: 'so với tháng trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-blue',
        icon: <MessageMetricIcon />,
      },
      {
        label: 'Tỷ lệ chuyển đổi dịch vụ trả phí',
        value: '25.9%',
        deltaValue: '0.8%',
        deltaNote: 'so với tháng trước',
        deltaTrend: 'negative',
        iconClassName: 'metric-icon-green',
        icon: <PulseMetricIcon />,
      },
      {
        label: 'Tổng số lịch hẹn',
        value: '5,208',
        deltaValue: '4.4%',
        deltaNote: 'so với tháng trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-yellow',
        icon: <ClockMetricIcon />,
      },
      {
        label: 'Doanh thu',
        value: '6.2 tỷ',
        deltaValue: '7.9%',
        deltaNote: 'so với tháng trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-pink',
        icon: <CurrencyMetricIcon />,
      },
    ],
    trend: [
      { label: 'Tuần 1', consults: 3210 },
      { label: 'Tuần 2', consults: 3680 },
      { label: 'Tuần 3', consults: 3942 },
      { label: 'Tuần 4', consults: 3988 },
    ],
    stacked: [
      { label: 'Tuần 1', handled: 2140, doctor: 612, booking: 458 },
      { label: 'Tuần 2', handled: 2452, doctor: 704, booking: 524 },
      { label: 'Tuần 3', handled: 2618, doctor: 762, booking: 562 },
      { label: 'Tuần 4', handled: 2664, doctor: 778, booking: 546 },
    ],
    assignment: [
      { name: 'Hồ Chí Minh', filled: 64, total: 64 },
      { name: 'Hà Nội', filled: 48, total: 52 },
      { name: 'Đà Nẵng', filled: 30, total: 44 },
    ],
  },
}

function branchMetricFormatter(value: number | string, name: string) {
  const labels: Record<string, string> = {
    aiConsults: 'Lượt tư vấn AI (lượt)',
    appointments: 'Số lịch hẹn (lịch)',
    revenue: 'Doanh thu (trđ)',
  }

  return [`${value}`, labels[name] ?? name]
}

function trendFormatter(value: number | string) {
  return [`${value} lượt`, 'Tư vấn AI']
}

function assignmentStatus(percent: number, empty: number) {
  if (percent >= 100) return { tone: 'completed', text: 'Đã hoàn thành phân công' }
  if (percent <= 0) return { tone: 'waiting', text: 'Chờ phân công' }
  return { tone: 'in-progress', text: `Còn ${empty} ca trống` }
}

export function ManagerDashboardPage() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const selectedData = dashboardData[timeRange]

  const branchPerformance = branchMockData.map((branch) => ({
    branch: branch.shortName,
    ...branchDashboardMetrics[timeRange][branch.id],
  }))

  // Donut: tổng hợp kết quả xử lý sau sàng lọc AI từ dữ liệu theo khung giờ
  const resultTotals = selectedData.stacked.reduce(
    (acc, point) => ({
      handled: acc.handled + point.handled,
      doctor: acc.doctor + point.doctor,
      booking: acc.booking + point.booking,
    }),
    { handled: 0, doctor: 0, booking: 0 },
  )
  const resultSum = resultTotals.handled + resultTotals.doctor + resultTotals.booking
  const donutData = resultSeries.map((entry) => ({
    name: entry.name,
    color: entry.color,
    value: resultTotals[entry.key as keyof typeof resultTotals],
  }))
  const handledPercent = resultSum ? Math.round((resultTotals.handled / resultSum) * 100) : 0

  return (
    <div className="desktop-shell-page manager-dashboard-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main manager-dashboard-main" aria-label="Nội dung dashboard quản lý">
        <section className="manager-dashboard-content">
          <div className="dashboard-heading-row">
            <h1>{selectedData.heading}</h1>
            <FilterSelect
              className="dashboard-time-filter"
              options={timeRangeOptions}
              value={timeRange}
              onChange={(event) => setTimeRange(event.target.value as TimeRange)}
            />
          </div>

          <div className="metrics-grid dashboard-metrics-grid">
            {selectedData.kpis.map((metric) => (
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

          {/* HÀNG 1 — Hiệu quả Chatbot (cao hơn) */}
          <div className="dashboard-charts-row dashboard-row-chatbot">
            <section className="dashboard-card chatbot-combined-card">
              <div className="card-title-row">
                <div>
                  <span className="section-kicker">Vận hành &amp; kết quả</span>
                  <h2>Hiệu quả Chatbot</h2>
                </div>
                <button
                  type="button"
                  className="card-link-button"
                  onClick={() => navigate('/manager/report')}
                >
                  Xem báo cáo Chatbot
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              <div className="chatbot-combined-body">
                <div className="chatbot-part chatbot-trend-part">
                  <h3 className="chatbot-part-title">Lượt tư vấn Chatbot theo thời gian</h3>
                  <div className="dashboard-chart-frame">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedData.trend} margin={{ top: 8, right: 14, left: 6, bottom: 0 }}>
                        <defs>
                          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={palette.blue} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={palette.blue} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#eef3f7" strokeDasharray="3 4" vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#718096', fontSize: 11 }}
                          width={44}
                        />
                        <Tooltip
                          formatter={(value) => trendFormatter(value as number | string)}
                          contentStyle={{ borderRadius: '14px', border: '1px solid #eef3f7', boxShadow: 'none' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="consults"
                          name="Lượt tư vấn AI"
                          stroke={palette.blueInk}
                          strokeWidth={3}
                          fill="url(#trendFill)"
                          dot={{ r: 3, fill: palette.blueInk, strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chatbot-divider" aria-hidden="true" />

                <div className="chatbot-part chatbot-result-part">
                  <h3 className="chatbot-part-title">Kết quả xử lý sau sàng lọc AI</h3>
                  <div className="donut-area">
                    <div className="donut-wrapper">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="88%"
                            paddingAngle={2}
                            cornerRadius={8}
                            stroke="none"
                            isAnimationActive={false}
                          >
                            {donutData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              const item = payload?.[0]?.payload as { name?: string; value?: number } | undefined
                              if (!active || !item?.name) return null
                              const pct = resultSum ? Math.round(((item.value ?? 0) / resultSum) * 100) : 0
                              return (
                                <div className="donut-tooltip">
                                  <strong>{item.name}</strong>
                                  <span>{item.value} · {pct}%</span>
                                </div>
                              )
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="donut-center">
                        <span className="donut-center-value">{handledPercent}%</span>
                        <span className="donut-center-label">Tự xử lý</span>
                      </div>
                    </div>
                    <ul className="donut-legend">
                      {donutData.map((entry) => {
                        const pct = resultSum ? Math.round((entry.value / resultSum) * 100) : 0
                        return (
                          <li className="donut-legend-item" key={entry.name}>
                            <span className="legend-swatch" style={{ background: entry.color }} />
                            <span className="donut-legend-name">{entry.name}</span>
                            <span className="donut-legend-pct">{pct}%</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* HÀNG 2 — So sánh chi nhánh & Phân công lịch (thấp hơn) */}
          <div className="dashboard-charts-row dashboard-row-branch">
            <section className="dashboard-card branch-performance-card">
              <div className="card-title-row">
                <div>
                  <span className="section-kicker">Hiệu quả chi nhánh</span>
                  <h2>So sánh hiệu quả chi nhánh</h2>
                </div>
                <button
                  type="button"
                  className="card-link-button"
                  onClick={() => navigate('/manager/report')}
                >
                  Xem báo cáo Chi nhánh
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="dashboard-chart-frame">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchPerformance} margin={{ top: 8, right: 14, left: 6, bottom: 0 }} barGap={5} barCategoryGap="28%">
                    <CartesianGrid stroke="#eef3f7" strokeDasharray="3 4" vertical={false} />
                    <XAxis dataKey="branch" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 11 }} width={44} />
                    <Tooltip
                      cursor={{ fill: '#f7fbff' }}
                      formatter={(value, name) => branchMetricFormatter(value as number | string, name as string)}
                      contentStyle={{ borderRadius: '14px', border: '1px solid #eef3f7', boxShadow: 'none' }}
                    />
                    <Bar dataKey="aiConsults" name="Lượt tư vấn AI" fill={palette.blue} radius={[8, 8, 4, 4]} barSize={22} isAnimationActive={false} />
                    <Bar dataKey="appointments" name="Số lịch hẹn" fill={palette.yellow} radius={[8, 8, 4, 4]} barSize={22} isAnimationActive={false} />
                    <Bar dataKey="revenue" name="Doanh thu" fill={palette.pink} radius={[8, 8, 4, 4]} barSize={22} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="dashboard-inline-legend">
                <span className="inline-legend-item"><span className="legend-swatch" style={{ background: palette.blue }} />Lượt tư vấn AI <em>(lượt)</em></span>
                <span className="inline-legend-item"><span className="legend-swatch" style={{ background: palette.yellow }} />Số lịch hẹn <em>(lịch)</em></span>
                <span className="inline-legend-item"><span className="legend-swatch" style={{ background: palette.pink }} />Doanh thu <em>(trđ)</em></span>
              </div>
            </section>

            <section className="dashboard-card assignment-progress-card">
              <div className="card-title-row">
                <div>
                  <span className="section-kicker">Phân công lịch</span>
                  <h2>Tiến độ phân công lịch</h2>
                </div>
                <button
                  type="button"
                  className="card-link-button"
                  onClick={() => navigate('/manager/schedules')}
                >
                  Phân công lịch làm việc
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="assignment-list">
                {selectedData.assignment.map((row) => {
                  const percent = row.total ? Math.round((row.filled / row.total) * 100) : 0
                  const empty = row.total - row.filled
                  const status = assignmentStatus(percent, empty)
                  return (
                    <div className="assignment-row" key={row.name}>
                      <div className="assignment-row-head">
                        <span className="assignment-branch">Chi nhánh {row.name}</span>
                        <strong className="assignment-percent">{percent}%</strong>
                      </div>
                      <div className="assignment-progress-track" aria-hidden="true">
                        <span
                          className={`assignment-progress-fill assignment-progress-${status.tone}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className={`assignment-status assignment-status-${status.tone}`}>{status.text}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}
