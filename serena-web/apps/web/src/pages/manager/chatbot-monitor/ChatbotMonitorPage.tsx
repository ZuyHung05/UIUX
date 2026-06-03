import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { DetailModal } from '../../../components/ui/DetailModal'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { MetricCard } from '../../../components/ui/MetricCard'
import { CalendarMetricIcon, CheckMetricIcon, MessageMetricIcon, StarMetricIcon } from '../../../components/ui/metricIcons'
import { Pagination } from '../../../components/ui/Pagination'
import { PageSizeSelect } from '../../../components/ui/PageSizeSelect'
import type { ChatConversation, ChatMessage, ChatSender } from '../../../components/chat/chatTypes'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { chatbotMonitorConversations } from './chatbotMonitorMockData'
import './ChatbotMonitorPage.css'

type OutcomeFilter = 'all' | 'ai' | 'doctor' | 'booking'
type RatingFilter = 'all' | '1' | '2' | '3' | '4' | '5'
type ConversationOutcome = Exclude<OutcomeFilter, 'all'>

const pageSizeOptions = [5, 10, 15]

const cp1252ByteMap = new Map<string, number>([
  ['€', 0x80],
  ['‚', 0x82],
  ['ƒ', 0x83],
  ['„', 0x84],
  ['…', 0x85],
  ['†', 0x86],
  ['‡', 0x87],
  ['ˆ', 0x88],
  ['‰', 0x89],
  ['Š', 0x8a],
  ['‹', 0x8b],
  ['Œ', 0x8c],
  ['Ž', 0x8e],
  ['‘', 0x91],
  ['’', 0x92],
  ['“', 0x93],
  ['”', 0x94],
  ['•', 0x95],
  ['–', 0x96],
  ['—', 0x97],
  ['˜', 0x98],
  ['™', 0x99],
  ['š', 0x9a],
  ['›', 0x9b],
  ['œ', 0x9c],
  ['ž', 0x9e],
  ['Ÿ', 0x9f],
])

const mojibakePattern = /Ã|Ä|Å|Æ|Â|áº|á»|ð|Ð/

function readableText(value?: string) {
  if (!value || !mojibakePattern.test(value)) {
    return value ?? ''
  }

  try {
    const bytes = Uint8Array.from(Array.from(value), (char) => {
      const mappedByte = cp1252ByteMap.get(char)
      if (mappedByte !== undefined) {
        return mappedByte
      }

      return char.charCodeAt(0) & 0xff
    })
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return value
  }
}

function uniqueOptions(values: string[], allLabel: string) {
  return [
    { value: 'all', label: allLabel },
    ...Array.from(new Set(values)).map((value) => ({ value, label: readableText(value) })),
  ]
}

const outcomeOptions: Array<{ value: OutcomeFilter; label: string }> = [
  { value: 'all', label: 'Tất cả loại xử lý' },
  { value: 'ai', label: 'AI tự xử lý' },
  { value: 'doctor', label: 'Chuyển bác sĩ' },
  { value: 'booking', label: 'Đặt lịch hẹn' },
]

const ratingOptions: Array<{ value: RatingFilter; label: string }> = [
  { value: 'all', label: 'Tất cả điểm đánh giá' },
  { value: '1', label: '1 sao' },
  { value: '2', label: '2 sao' },
  { value: '3', label: '3 sao' },
  { value: '4', label: '4 sao' },
  { value: '5', label: '5 sao' },
]

function getConversationOutcome(conversation: ChatConversation): ConversationOutcome {
  const searchableText = [
    conversation.lastMessage,
    conversation.botSummary,
    ...conversation.messages.map((message) => message.text),
  ].map(readableText).join(' ').toLowerCase()
  const hasBookingSignal = /đặt lịch|kê lịch|lịch khám|khám trực tiếp/.test(searchableText)

  if (hasBookingSignal) {
    return 'booking'
  }

  return conversation.handlerType === 'doctor' ? 'doctor' : 'ai'
}

function getOutcomeLabel(outcome: ConversationOutcome) {
  if (outcome === 'booking') {
    return 'Đặt lịch hẹn'
  }

  return outcome === 'doctor' ? 'Chuyển bác sĩ' : 'AI tự xử lý'
}

function matchesRatingFilter(conversation: ChatConversation, ratingFilter: RatingFilter) {
  if (ratingFilter === 'all') {
    return true
  }

  return conversation.rating === Number(ratingFilter)
}

function getRatingLabel(rating?: number) {
  return typeof rating === 'number' ? `${rating}/5` : 'Chưa đánh giá'
}

function getRatingScoreLabel(rating?: number) {
  return typeof rating === 'number' ? `${rating}/5` : '--'
}

function StarIcon() {
  return (
    <svg className="chatbot-rating-star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3.4 2.6 5.25 5.8.84-4.2 4.1.99 5.77L12 16.63 6.81 19.36l.99-5.77-4.2-4.1 5.8-.84L12 3.4Z" />
    </svg>
  )
}

function getChatbotFeedbackText(conversation: ChatConversation) {
  return readableText(conversation.chatbotFeedback ?? conversation.feedback ?? 'Chưa có phản hồi riêng cho chatbot.')
}

function getDoctorFeedbackText(conversation: ChatConversation) {
  return readableText(conversation.doctorFeedback ?? 'Chưa có phản hồi riêng cho bác sĩ.')
}

function getDoctorAssignment(conversation: ChatConversation) {
  if (conversation.handlerType !== 'doctor' || !conversation.doctorName) {
    return 'Không áp dụng'
  }

  return `${readableText(conversation.doctorName)} - BS-${conversation.sessionCode}`
}

function getProcessingResult(outcome: ConversationOutcome) {
  if (outcome === 'booking') {
    return 'Đã đặt lịch hẹn thành công'
  }

  if (outcome === 'doctor') {
    return 'Đã chuyển tư vấn chuyên sâu bác sĩ'
  }

  return 'AI tự xử lý thành công'
}

function getSenderLabel(sender: ChatSender, message: ChatMessage) {
  if (sender === 'patient') {
    return 'Người dùng'
  }

  if (sender === 'chatbot') {
    return 'Chatbot'
  }

  if (sender === 'doctor') {
    return message.doctorName ? readableText(message.doctorName) : 'Bác sĩ'
  }

  return 'Hệ thống'
}

function formatUpdatedTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} phút trước`
  }

  const hours = Math.floor(minutes / 60)
  return `${hours} giờ trước`
}

export function ChatbotMonitorPage() {
  const [branchFilter, setBranchFilter] = useState('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
  const [activeConversationId, setActiveConversationId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(pageSizeOptions[0])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const branchOptions = useMemo(
    () => uniqueOptions(chatbotMonitorConversations.map((conversation) => conversation.branch), 'Tất cả chi nhánh'),
    [],
  )
  const specialtyOptions = useMemo(
    () => uniqueOptions(chatbotMonitorConversations.map((conversation) => conversation.specialty), 'Tất cả chuyên khoa'),
    [],
  )

  const filteredConversations = useMemo(() => {
    return chatbotMonitorConversations.filter((conversation) => {
      const outcome = getConversationOutcome(conversation)
      const matchesBranch = branchFilter === 'all' || conversation.branch === branchFilter
      const matchesSpecialty = specialtyFilter === 'all' || conversation.specialty === specialtyFilter
      const matchesOutcome = outcomeFilter === 'all' || outcome === outcomeFilter

      return matchesBranch && matchesSpecialty && matchesOutcome && matchesRatingFilter(conversation, ratingFilter)
    })
  }, [branchFilter, outcomeFilter, ratingFilter, specialtyFilter])

  const totalPages = Math.max(1, Math.ceil(filteredConversations.length / rowsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedConversations = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * rowsPerPage
    return filteredConversations.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredConversations, rowsPerPage, safeCurrentPage])

  const activeConversation =
    filteredConversations.find((conversation) => conversation.id === activeConversationId) ?? filteredConversations[0]
  const activeOutcome = activeConversation ? getConversationOutcome(activeConversation) : 'ai'
  const ratedConversations = filteredConversations.filter((conversation) => typeof conversation.rating === 'number')
  const averageRating = ratedConversations.length
    ? ratedConversations.reduce((sum, conversation) => sum + (conversation.rating ?? 0), 0) / ratedConversations.length
    : 0
  const aiSelfHandledRate = filteredConversations.length
    ? Math.round((filteredConversations.filter((conversation) => conversation.handlerType === 'bot').length / filteredConversations.length) * 100)
    : 0
  const doctorTransferRate = filteredConversations.length
    ? Math.round((filteredConversations.filter((conversation) => conversation.handlerType === 'doctor').length / filteredConversations.length) * 100)
    : 0

  return (
    <div className="desktop-shell-page chatbot-monitor-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main chatbot-monitor-main" aria-label="Giám sát Chatbot">
        <section className="chatbot-monitor-content">
          <div className="chatbot-monitor-heading">
            <div>
              <h1>Giám sát Chatbot</h1>
              <p>Theo dõi chất lượng hội thoại, phiên đánh giá thấp và các ca cần bác sĩ hoặc đặt lịch hẹn.</p>
            </div>
          </div>

          <div className="chatbot-filter-row">
            <FilterSelect
              options={branchOptions}
              value={branchFilter}
              onChange={(event) => {
                setBranchFilter(event.target.value)
                setCurrentPage(1)
              }}
            />
            <FilterSelect
              options={specialtyOptions}
              value={specialtyFilter}
              onChange={(event) => {
                setSpecialtyFilter(event.target.value)
                setCurrentPage(1)
              }}
            />
            <FilterSelect
              options={outcomeOptions}
              value={outcomeFilter}
              onChange={(event) => {
                setOutcomeFilter(event.target.value as OutcomeFilter)
                setCurrentPage(1)
              }}
            />
            <FilterSelect
              options={ratingOptions}
              value={ratingFilter}
              onChange={(event) => {
                setRatingFilter(event.target.value as RatingFilter)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="metrics-grid chatbot-monitor-metrics">
            <MetricCard
              label="Tổng số hội thoại"
              value={filteredConversations.length}
              icon={<MessageMetricIcon />}
              iconClassName="metric-icon-blue"
            />
            <MetricCard
              label="Tỷ lệ AI tự xử lý"
              value={`${aiSelfHandledRate}%`}
              icon={<CheckMetricIcon />}
              iconClassName="metric-icon-green"
            />
            <MetricCard
              label="Tỷ lệ chuyển bác sĩ"
              value={`${doctorTransferRate}%`}
              icon={<CalendarMetricIcon />}
              iconClassName="metric-icon-yellow"
            />
            <MetricCard
              label="Điểm hài lòng trung bình (CSAT)"
              value={averageRating ? averageRating.toFixed(1) : '0.0'}
              icon={<StarMetricIcon />}
              iconClassName="metric-icon-pink"
            />
          </div>

          <div className="chatbot-monitor-layout">
            <aside className="chatbot-conversation-panel" aria-label="Danh sách hội thoại">
              <div className="chatbot-list-toolbar">
                <PageSizeSelect
                  value={rowsPerPage}
                  options={pageSizeOptions}
                  suffix="dòng"
                  onChange={(value) => {
                    setRowsPerPage(value)
                    setCurrentPage(1)
                  }}
                />
                <Pagination
                  className="chatbot-pagination"
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>

              <div className="chatbot-conversation-list">
                {paginatedConversations.length > 0 ? (
                  paginatedConversations.map((conversation) => {
                    const outcome = getConversationOutcome(conversation)
                    const isLowRating = typeof conversation.rating === 'number' && conversation.rating <= 2
                    const hasDoctor = conversation.handlerType === 'doctor'
                    const isBooking = outcome === 'booking'

                    return (
                      <button
                        type="button"
                        className={[
                          'chatbot-session-card',
                          conversation.id === activeConversation?.id ? 'is-active' : '',
                          isLowRating ? 'is-low-rating' : '',
                        ].filter(Boolean).join(' ')}
                        key={conversation.id}
                        onClick={() => setActiveConversationId(conversation.id)}
                      >
                        <div className="chatbot-session-top">
                          <div>
                            <strong>{readableText(conversation.patientName)}</strong>
                            <span>Mã hội thoại #{conversation.sessionCode}</span>
                          </div>
                          <time>{formatUpdatedTime(conversation.updatedMinutesAgo)}</time>
                        </div>
                        <div className="chatbot-session-badges">
                          {isLowRating ? <span className="session-badge session-badge-low">Đánh giá thấp</span> : null}
                          {hasDoctor ? (
                            <span className="session-badge session-badge-doctor">Chuyển bác sĩ</span>
                          ) : (
                            <span className="session-badge session-badge-ai">AI tự xử lý</span>
                          )}
                          {isBooking ? <span className="session-badge session-badge-booking">Đặt lịch hẹn</span> : null}
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="chatbot-empty-state">Không có hội thoại phù hợp với bộ lọc hiện tại.</div>
                )}
              </div>
            </aside>

            {activeConversation ? (
              <section className="chatbot-detail-panel" aria-label="Thông tin phiên hội thoại">
                <div className="chatbot-detail-header">
                  <div>
                    <span>Thông tin phiên hội thoại</span>
                    <h2>#{activeConversation.sessionCode} · {readableText(activeConversation.patientName)}</h2>
                  </div>
                  <button type="button" className="chatbot-history-button" onClick={() => setIsHistoryOpen(true)}>
                    Xem lịch sử hội thoại
                  </button>
                </div>

                <div className="chatbot-detail-grid">
                  <article className="chatbot-info-card">
                    <span>Mã hội thoại</span>
                    <strong>#{activeConversation.sessionCode}</strong>
                  </article>
                  <article className="chatbot-info-card">
                    <span>Chi nhánh</span>
                    <strong>{readableText(activeConversation.branch)}</strong>
                  </article>
                  <article className="chatbot-info-card">
                    <span>Chuyên khoa</span>
                    <strong>{readableText(activeConversation.specialty)}</strong>
                  </article>
                  <article
                    className={[
                      'chatbot-info-card',
                      typeof activeConversation.rating === 'number' && activeConversation.rating <= 2 ? 'chatbot-info-card-warning' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span>Điểm đánh giá</span>
                    <strong>{getRatingLabel(activeConversation.rating)}</strong>
                  </article>
                  <article className={`chatbot-info-card chatbot-info-card-wide chatbot-info-card-outcome outcome-${activeOutcome}`}>
                    <span>Loại xử lý cuối cùng</span>
                    <strong>{getOutcomeLabel(activeOutcome)}</strong>
                  </article>
                  <article className="chatbot-info-card chatbot-info-card-full">
                    <span>Bác sĩ phụ trách</span>
                    <strong>{getDoctorAssignment(activeConversation)}</strong>
                  </article>
                </div>

                <article className="chatbot-summary-card">
                  <div className="chatbot-card-title">
                    <span>Tóm tắt do AI sinh tự động</span>
                    <h3>Theo thứ tự xử lý</h3>
                  </div>
                  <div className="chatbot-summary-list">
                    <section>
                      <span>1. Triệu chứng/Nhu cầu</span>
                      <ul>
                        {activeConversation.symptoms.map((symptom) => (
                          <li key={symptom}>{readableText(symptom)}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <span>2. Nhận định</span>
                      <p>{readableText(activeConversation.botSummary)}</p>
                    </section>
                    <section>
                      <span>3. Kết quả xử lý</span>
                      <p>{getProcessingResult(activeOutcome)}.</p>
                    </section>
                  </div>
                </article>

                <div className="chatbot-detail-bottom">
                  <article className="chatbot-user-rating-card">
                    <div className="chatbot-card-title">
                      <span>Đánh giá người dùng</span>
                      <h3>Phản hồi sau phiên</h3>
                    </div>
                    <div className="chatbot-rating-breakdown">
                      <div
                        className={
                          typeof (activeConversation.chatbotRating ?? activeConversation.rating) === 'number' &&
                          (activeConversation.chatbotRating ?? activeConversation.rating ?? 0) <= 2
                            ? 'is-low-rating'
                            : undefined
                        }
                      >
                        <header className="chatbot-rating-item-header">
                          <span>Chatbot</span>
                          <strong>
                            <StarIcon />
                            {getRatingScoreLabel(activeConversation.chatbotRating ?? activeConversation.rating)}
                          </strong>
                        </header>
                        <p>{getChatbotFeedbackText(activeConversation)}</p>
                      </div>
                      <div
                        className={
                          activeConversation.handlerType === 'doctor' &&
                          typeof (activeConversation.doctorRating ?? activeConversation.rating) === 'number' &&
                          (activeConversation.doctorRating ?? activeConversation.rating ?? 0) <= 2
                            ? 'is-low-rating'
                            : undefined
                        }
                      >
                        <header className="chatbot-rating-item-header">
                          <span>Bác sĩ</span>
                          <strong>
                            <StarIcon />
                            {activeConversation.handlerType === 'doctor'
                              ? getRatingScoreLabel(activeConversation.doctorRating ?? activeConversation.rating)
                              : '--'}
                          </strong>
                        </header>
                        <p>{activeConversation.handlerType === 'doctor' ? getDoctorFeedbackText(activeConversation) : 'Không áp dụng'}</p>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            ) : (
              <section className="chatbot-detail-panel chatbot-detail-empty" aria-label="Thông tin phiên hội thoại">
                Chọn một hội thoại để xem tóm tắt phiên.
              </section>
            )}
          </div>
        </section>
      </main>

      {activeConversation ? (
        <DetailModal
          open={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          title="Lịch sử hội thoại"
          subtitle={`${readableText(activeConversation.patientName)} · Phiên #${activeConversation.sessionCode}`}
        >
          <div className="chatbot-history-log" aria-label="Lịch sử hội thoại chi tiết">
            {activeConversation.messages.map((message) => (
              <div className={`chatbot-history-row history-${message.sender}`} key={message.id}>
                <div className="chatbot-history-bubble">
                  <strong>{getSenderLabel(message.sender, message)}</strong>
                  <p>{readableText(message.text)}</p>
                  <time>{message.time}</time>
                </div>
              </div>
            ))}
          </div>
        </DetailModal>
      ) : null}
    </div>
  )
}
