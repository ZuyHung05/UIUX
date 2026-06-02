import { useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { ClockMetricIcon, CurrencyMetricIcon, MessageMetricIcon, PulseMetricIcon } from '../../../components/ui/metricIcons'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { branchDashboardMetrics, branchMockData } from '../../../data/branchMockData'

type TimeRange = 'today' | 'week' | 'month'
type DeltaTrend = 'positive' | 'negative' | 'neutral'
type ChatbotResult = {
  key: string
  name: string
  value: number
  color: string
  softColor: string
  gradientId: string
}

const DONUT_CX = 130
const DONUT_CY = 130
const DONUT_RADIUS = 78
const DONUT_BUBBLE_RADIUS = 96
const DONUT_START_ANGLE = -205
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const FUNNEL_SLICE_WIDTHS = [84, 84, 62, 38] as const

const timeRangeOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
]

const dashboardData: Record<TimeRange, {
  heading: string
  kpis: Array<{
    label: string
    value: string
    delta: string
    deltaTrend: DeltaTrend
    iconClassName: string
    icon: ReactNode
  }>
  journey: Array<{
    label: string
    value: string
    unit: string
    percent: number
    note: string
  }>
  chatbotResults: ChatbotResult[]
}> = {
  today: {
    heading: 'Tổng quan hôm nay',
    kpis: [
      {
        label: 'Tổng lượt tư vấn Chatbot',
        value: '486',
        delta: '+8.4% so với hôm qua',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-blue',
        icon: <MessageMetricIcon />,
      },
      {
        label: 'Tỷ lệ chuyển đổi dịch vụ trả phí',
        value: '24.8%',
        delta: '-1.6% so với hôm qua',
        deltaTrend: 'negative',
        iconClassName: 'metric-icon-green',
        icon: <PulseMetricIcon />,
      },
      {
        label: 'Tổng số lịch hẹn',
        value: '138',
        delta: '+5.1% so với hôm qua',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-yellow',
        icon: <ClockMetricIcon />,
      },
      {
        label: 'Doanh thu',
        value: '164 trđ',
        delta: '+6.7% so với hôm qua',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-pink',
        icon: <CurrencyMetricIcon />,
      },
    ],
    journey: [
      { label: 'Chatbot sàng lọc', value: '486', unit: 'phiên', percent: 100, note: 'Miễn phí' },
      { label: 'Gợi ý dịch vụ trả phí', value: '121', unit: 'nhu cầu', percent: 24.8, note: 'Tư vấn bác sĩ / đặt lịch' },
      { label: 'Xác nhận lịch khám', value: '82', unit: 'lịch hẹn', percent: 16.9, note: 'Đã chọn chi nhánh' },
      { label: 'Hoàn tất dịch vụ', value: '64', unit: 'lượt khám', percent: 13.2, note: 'Ghi nhận doanh thu' },
    ],
    chatbotResults: [
      { key: 'handled', name: 'Tự xử lý thành công', value: 64, color: '#9eddf0', softColor: '#f1fbff', gradientId: 'donutBlue' },
      { key: 'doctor', name: 'Chuyển sang tư vấn bác sĩ', value: 18, color: '#b7df8c', softColor: '#f6ffe2', gradientId: 'donutGreen' },
      { key: 'booking', name: 'Đặt lịch tự động qua AI', value: 18, color: '#f6dc82', softColor: '#fff8dd', gradientId: 'donutYellow' },
    ],
  },
  week: {
    heading: 'Tổng quan tuần này',
    kpis: [
      {
        label: 'Tổng lượt tư vấn Chatbot',
        value: '3,452',
        delta: '+11.3% so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-blue',
        icon: <MessageMetricIcon />,
      },
      {
        label: 'Tỷ lệ chuyển đổi dịch vụ trả phí',
        value: '26.4%',
        delta: '+2.2% so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-green',
        icon: <PulseMetricIcon />,
      },
      {
        label: 'Tổng số lịch hẹn',
        value: '1,237',
        delta: '+5.2% so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-yellow',
        icon: <ClockMetricIcon />,
      },
      {
        label: 'Doanh thu',
        value: '1,456 trđ',
        delta: '+8.7% so với tuần trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-pink',
        icon: <CurrencyMetricIcon />,
      },
    ],
    journey: [
      { label: 'Chatbot sàng lọc', value: '3,452', unit: 'phiên', percent: 100, note: 'Miễn phí' },
      { label: 'Gợi ý dịch vụ trả phí', value: '911', unit: 'nhu cầu', percent: 26.4, note: 'Tư vấn bác sĩ / đặt lịch' },
      { label: 'Xác nhận lịch khám', value: '623', unit: 'lịch hẹn', percent: 18.0, note: 'Đã chọn chi nhánh' },
      { label: 'Hoàn tất dịch vụ', value: '502', unit: 'lượt khám', percent: 14.5, note: 'Ghi nhận doanh thu' },
    ],
    chatbotResults: [
      { key: 'handled', name: 'Tự xử lý thành công', value: 64, color: '#9eddf0', softColor: '#f1fbff', gradientId: 'donutBlue' },
      { key: 'doctor', name: 'Chuyển sang tư vấn bác sĩ', value: 18, color: '#b7df8c', softColor: '#f6ffe2', gradientId: 'donutGreen' },
      { key: 'booking', name: 'Đặt lịch tự động qua AI', value: 18, color: '#f6dc82', softColor: '#fff8dd', gradientId: 'donutYellow' },
    ],
  },
  month: {
    heading: 'Tổng quan tháng này',
    kpis: [
      {
        label: 'Tổng lượt tư vấn Chatbot',
        value: '14,820',
        delta: '+9.6% so với tháng trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-blue',
        icon: <MessageMetricIcon />,
      },
      {
        label: 'Tỷ lệ chuyển đổi dịch vụ trả phí',
        value: '25.9%',
        delta: '-0.8% so với tháng trước',
        deltaTrend: 'negative',
        iconClassName: 'metric-icon-green',
        icon: <PulseMetricIcon />,
      },
      {
        label: 'Tổng số lịch hẹn',
        value: '5,208',
        delta: '+4.4% so với tháng trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-yellow',
        icon: <ClockMetricIcon />,
      },
      {
        label: 'Doanh thu',
        value: '6.2 tỷ',
        delta: '+7.9% so với tháng trước',
        deltaTrend: 'positive',
        iconClassName: 'metric-icon-pink',
        icon: <CurrencyMetricIcon />,
      },
    ],
    journey: [
      { label: 'Chatbot sàng lọc', value: '14,820', unit: 'phiên', percent: 100, note: 'Miễn phí' },
      { label: 'Gợi ý dịch vụ trả phí', value: '3,839', unit: 'nhu cầu', percent: 25.9, note: 'Tư vấn bác sĩ / đặt lịch' },
      { label: 'Xác nhận lịch khám', value: '2,604', unit: 'lịch hẹn', percent: 17.6, note: 'Đã chọn chi nhánh' },
      { label: 'Hoàn tất dịch vụ', value: '2,112', unit: 'lượt khám', percent: 14.3, note: 'Ghi nhận doanh thu' },
    ],
    chatbotResults: [
      { key: 'handled', name: 'Tự xử lý thành công', value: 64, color: '#9eddf0', softColor: '#f1fbff', gradientId: 'donutBlue' },
      { key: 'doctor', name: 'Chuyển sang tư vấn bác sĩ', value: 18, color: '#b7df8c', softColor: '#f6ffe2', gradientId: 'donutGreen' },
      { key: 'booking', name: 'Đặt lịch tự động qua AI', value: 13, color: '#f6dc82', softColor: '#fff8dd', gradientId: 'donutYellow' },
    ],
  },
}

function metricFormatter(value: number | string, name: string) {
  const labels: Record<string, string> = {
    aiConsults: 'Lượt tư vấn AI',
    appointments: 'Số lịch hẹn',
    revenue: 'Doanh thu (trđ)',
  }

  return [`${value}`, labels[name] ?? name]
}

function getDonutSegments(results: ChatbotResult[]) {
  let start = 0

  return results.map((item) => {
    const valueRatio = item.value / 100
    const length = valueRatio * DONUT_CIRCUMFERENCE
    const midPct = start + valueRatio / 2
    const theta = (DONUT_START_ANGLE + midPct * 360) * (Math.PI / 180)
    const segment = {
      ...item,
      length,
      rotation: DONUT_START_ANGLE + start * 360,
      bubbleX: DONUT_CX + DONUT_BUBBLE_RADIUS * Math.cos(theta),
      bubbleY: DONUT_CY + DONUT_BUBBLE_RADIUS * Math.sin(theta),
    }
    start += valueRatio
    return segment
  })
}

export function ManagerDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const selectedData = dashboardData[timeRange]
  const donutSegments = getDonutSegments(selectedData.chatbotResults)
  const selectedBranchPerformance = branchMockData.map((branch) => ({
    branch: branch.shortName,
    ...branchDashboardMetrics[timeRange][branch.id],
  }))

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
                delta={metric.delta}
                deltaTrend={metric.deltaTrend}
                icon={metric.icon}
                iconClassName={metric.iconClassName}
              />
            ))}
          </div>

          <div className="dashboard-second-row">
            <section className="dashboard-card service-funnel-card">
              <div className="card-title-row">
                <div>
                  <span className="section-kicker">Luồng chuyển đổi dịch vụ</span>
                  <h2>Sàng lọc miễn phí đến doanh thu</h2>
                </div>
                <Link to="/manager/report" className="card-link-action">Báo cáo</Link>
              </div>
              <div className="service-funnel-layout" aria-label="Luồng chuyển đổi dịch vụ trả phí">
                <div className="funnel-stack">
                  {selectedData.journey.map((stage, index) => (
                    <article
                      className="funnel-row"
                      key={stage.label}
                      style={{ '--slice-width': `${FUNNEL_SLICE_WIDTHS[index]}%` } as CSSProperties}
                    >
                      <div
                        className={`funnel-slice funnel-slice-${index + 1}`}
                      >
                        <strong>{stage.percent}%</strong>
                        <span>{stage.value} {stage.unit}</span>
                      </div>
                      <span className={`funnel-connector funnel-connector-${index + 1}`} aria-hidden="true" />
                      <div className="funnel-callout-item">
                        <div className="funnel-callout-heading">
                          <h3>{stage.label}</h3>
                          <strong>{stage.percent}%</strong>
                        </div>
                        <p>
                          <span>{stage.value} {stage.unit}</span>
                          <em>{stage.note}</em>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="dashboard-card chatbot-result-card">
              <div className="card-title-row">
                <div>
                  <span className="section-kicker">Kết quả chatbot</span>
                  <h2>Phân loại sau sàng lọc AI</h2>
                </div>
                <Link to="/manager/chatbot-monitor" className="card-link-action">Chi tiết</Link>
              </div>
              <div className="chatbot-result-layout">
                <div className="donut-wrapper">
                  <svg className="donut-svg" viewBox="0 0 260 260" role="img" aria-label="Biểu đồ phân loại sau sàng lọc AI">
                    <defs>
                      <filter id="donutBadgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.6" floodColor="#244a6b" floodOpacity="0.12" />
                      </filter>
                      {selectedData.chatbotResults.map((entry) => (
                        <linearGradient key={entry.name} id={entry.gradientId} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={entry.softColor} stopOpacity="0.92" />
                          <stop offset="54%" stopColor={entry.softColor} stopOpacity="0.64" />
                          <stop offset="100%" stopColor={entry.color} stopOpacity="0.82" />
                        </linearGradient>
                      ))}
                    </defs>
                    <circle className="donut-outer-border" cx={DONUT_CX} cy={DONUT_CY} r="101" />
                    <circle className="donut-track" cx={DONUT_CX} cy={DONUT_CY} r={DONUT_RADIUS} />
                    {[...donutSegments].reverse().map((segment, index) => (
                      <circle
                        className="donut-segment"
                        key={segment.name}
                        cx={DONUT_CX}
                        cy={DONUT_CY}
                        r={DONUT_RADIUS}
                        stroke={`url(#${segment.gradientId})`}
                        strokeDasharray={`${segment.length} ${DONUT_CIRCUMFERENCE}`}
                        strokeDashoffset={0}
                        transform={`rotate(${segment.rotation} ${DONUT_CX} ${DONUT_CY})`}
                        style={{
                          '--segment-length': segment.length,
                          animationDelay: `${0.15 + index * 0.16}s`,
                        } as CSSProperties}
                      />
                    ))}
                    {donutSegments.map((segment, index) => (
                      <g className="donut-bubble" key={`bubble-${segment.name}`} style={{ animationDelay: `${0.45 + index * 0.12}s` }}>
                        <circle cx={segment.bubbleX} cy={segment.bubbleY} r="15" />
                        <text x={segment.bubbleX} y={segment.bubbleY}>{segment.value}%</text>
                      </g>
                    ))}
                  </svg>
                  <div className="donut-inner-text">
                    <span>Tự xử lý</span>
                    <strong>{selectedData.chatbotResults[0].value}%</strong>
                  </div>
                </div>
                <div className="chatbot-result-legend">
                  {selectedData.chatbotResults.map((item) => (
                    <div className="chatbot-result-row" key={item.name}>
                      <span className="dot-outline" style={{ borderColor: item.color }} />
                      <span>{item.name}</span>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="dashboard-card branch-performance-card">
            <div className="card-title-row">
              <div>
                <span className="section-kicker">Hiệu quả chi nhánh</span>
                <h2>Tư vấn AI, lịch hẹn và doanh thu</h2>
              </div>
              <Link to="/manager/report" className="card-link-action">Phân tích</Link>
            </div>
            <div className="branch-performance-layout">
              <div className="branch-chart-frame">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={selectedBranchPerformance} margin={{ top: 8, right: 10, left: -18, bottom: 2 }} barGap={8}>
                    <CartesianGrid stroke="#eef3f7" vertical={false} />
                    <XAxis dataKey="branch" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: '#f7fbff' }}
                      formatter={(value, name) => metricFormatter(value as number | string, name as string)}
                      contentStyle={{ borderRadius: '14px', border: '1px solid #eef3f7', boxShadow: 'none' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
                    <Bar dataKey="aiConsults" name="Lượt tư vấn AI" fill="#8dc1ff" radius={[8, 8, 0, 0]} barSize={22} isAnimationActive={false} />
                    <Bar dataKey="appointments" name="Số lịch hẹn" fill="#82c98d" radius={[8, 8, 0, 0]} barSize={22} isAnimationActive={false} />
                    <Bar dataKey="revenue" name="Doanh thu (trđ)" fill="#ffcf66" radius={[8, 8, 0, 0]} barSize={22} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="branch-comparison-table" aria-label="Bảng tỷ lệ chuyển đổi theo chi nhánh">
                {selectedBranchPerformance.map((branch) => (
                  <div className="branch-comparison-row" key={branch.branch}>
                    <span>{branch.branch}</span>
                    <strong>{branch.conversion}%</strong>
                    <em>Chuyển đổi</em>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
