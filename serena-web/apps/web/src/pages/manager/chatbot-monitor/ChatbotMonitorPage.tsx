import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { DetailModal } from '../../../components/ui/DetailModal'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { MetricCard } from '../../../components/ui/MetricCard'
import { CalendarMetricIcon, CheckMetricIcon, MessageMetricIcon, StarMetricIcon } from '../../../components/ui/metricIcons'
import { Pagination } from '../../../components/ui/Pagination'
import type { ChatConversation, ChatMessage, ChatSender } from '../../../components/chat/chatTypes'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { chatbotMonitorConversations } from './chatbotMonitorMockData'
import './ChatbotMonitorPage.css'

type OutcomeFilter = 'all' | 'ai' | 'doctor' | 'booking'
type RatingFilter = 'all' | 'low' | '3' | '4' | '5'
type ConversationOutcome = Exclude<OutcomeFilter, 'all'>

const pageSizeOptions = [3, 4, 5]

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
  { value: 'low', label: 'Đánh giá thấp' },
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

  if (ratingFilter === 'low') {
    return typeof conversation.rating === 'number' && conversation.rating <= 2
  }

  return conversation.rating === Number(ratingFilter)
}

function getRatingLabel(rating?: number) {
  return typeof rating === 'number' ? `${rating}/5` : 'Chưa đánh giá'
}

function getChatbotFeedbackText(conversation: ChatConversation) {
  return readableText(conversation.chatbotFeedback ?? conversation.feedback ?? 'Chưa có phản hồi riêng cho chatbot.')
}

function getDoctorFeedbackText(conversation: ChatConversation) {
  return readableText(conversation.doctorFeedback ?? 'Chưa có phản hồi riêng cho bác sĩ.')
}

function getFirstDoctorReply(messages: ChatMessage[]) {
  return messages.find((message) => message.sender === 'doctor')?.time ?? 'Chưa có'
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
  const [rowsPerPage, setRowsPerPage] = useState(pageSizeOptions[1])
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
              delta="Theo bộ lọc hiện tại"
              icon={<MessageMetricIcon />}
              iconClassName="metric-icon-blue"
            />
            <MetricCard
              label="Tỷ lệ AI tự xử lý"
              value={`${aiSelfHandledRate}%`}
              delta="Không cần bác sĩ"
              icon={<CheckMetricIcon />}
              iconClassName="metric-icon-green"
            />
            <MetricCard
              label="Tỷ lệ chuyển bác sĩ"
              value={`${doctorTransferRate}%`}
              delta="Có bác sĩ tiếp nhận"
              icon={<CalendarMetricIcon />}
              iconClassName="metric-icon-yellow"
            />
            <MetricCard
              label="Điểm hài lòng trung bình"
              value={averageRating ? averageRating.toFixed(1) : '0.0'}
              delta="CSAT / 5"
              icon={<StarMetricIcon />}
              iconClassName="metric-icon-pink"
            />
          </div>

          <div className="chatbot-monitor-layout">
            <aside className="chatbot-conversation-panel" aria-label="Danh sách hội thoại">
              <div className="chatbot-list-toolbar">
                <label className="chatbot-page-size">
                  Hiển thị
                  <select
                    value={rowsPerPage}
                    onChange={(event) => {
                      setRowsPerPage(Number(event.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    {pageSizeOptions.map((size) => (
                      <option value={size} key={size}>{size}</option>
                    ))}
                  </select>
                  dòng
                </label>
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
                  <article className="chatbot-info-card">
                    <span>Điểm đánh giá</span>
                    <strong>{getRatingLabel(activeConversation.rating)}</strong>
                  </article>
                  <article className="chatbot-info-card chatbot-info-card-wide">
                    <span>Loại xử lý cuối cùng</span>
                    <strong>{getOutcomeLabel(activeOutcome)}</strong>
                  </article>
                </div>

                <article className="chatbot-summary-card">
                  <div className="chatbot-card-title">
                    <span>Tóm tắt do AI sinh tự động</span>
                    <h3>Diễn giải nhanh nội dung phiên</h3>
                  </div>
                  <div className="chatbot-summary-list">
                    <p>{readableText(activeConversation.botSummary)}</p>
                    <p>Triệu chứng hoặc nhu cầu: {activeConversation.symptoms.map(readableText).join(', ')}.</p>
                    <p>Kết luận xử lý: {getOutcomeLabel(activeOutcome)}.</p>
                  </div>
                </article>

                <div className="chatbot-detail-bottom">
                  <article className="chatbot-timeline-card">
                    <div className="chatbot-card-title">
                      <span>Thông tin xử lý</span>
                      <h3>Các mốc thời gian</h3>
                    </div>
                    <div className="chatbot-timeline">
                      <div><span>Bắt đầu hội thoại</span><strong>{activeConversation.messages[0]?.time ?? 'Chưa có'}</strong></div>
                      <div><span>Chatbot chuyển bác sĩ</span><strong>{activeConversation.takeoverTime ?? 'Không có'}</strong></div>
                      <div><span>Bác sĩ tiếp nhận</span><strong>{activeConversation.takeoverTime ?? 'Không có'}</strong></div>
                      <div><span>Phản hồi đầu tiên</span><strong>{getFirstDoctorReply(activeConversation.messages)}</strong></div>
                    </div>
                  </article>

                  <article className="chatbot-user-rating-card">
                    <div className="chatbot-card-title">
                      <span>Đánh giá người dùng</span>
                      <h3>Phản hồi sau phiên</h3>
                    </div>
                    <div className="chatbot-rating-breakdown">
                      <div>
                        <span>Chatbot</span>
                        <strong>{getRatingLabel(activeConversation.chatbotRating ?? activeConversation.rating)}</strong>
                        <p>{getChatbotFeedbackText(activeConversation)}</p>
                      </div>
                      {activeConversation.handlerType === 'doctor' ? (
                        <div>
                          <span>Bác sĩ</span>
                          <strong>{getRatingLabel(activeConversation.doctorRating ?? activeConversation.rating)}</strong>
                          <p>{getDoctorFeedbackText(activeConversation)}</p>
                        </div>
                      ) : null}
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
