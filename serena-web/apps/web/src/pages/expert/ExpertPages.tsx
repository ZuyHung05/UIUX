import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Header } from '../../components/layout/header/Header'
import { Sidebar } from '../../components/layout/sidebar/Sidebar'
import { FilterSelect } from '../../components/ui/FilterSelect'
import { Pagination } from '../../components/ui/Pagination'
import { SearchInput } from '../../components/ui/SearchInput'
import '../../components/layout/DesktopShell.css'
import './ExpertPages.css'
import { getExpertSidebarConfig } from './expertSidebarConfig'
import {
  conversationRows,
  conversationTypeData,
  errorRows,
  errorTypeData,
  knowledgeRows,
  processingHistoryRows,
  trainingRows,
  trendData,
} from './expertMockData'

type Stat = {
  label: string
  value: string
  tone?: 'blue' | 'red' | 'green' | 'amber'
  icon: ExpertIconName
}

type BadgeProps = {
  label: string
  plain?: boolean
}

type ExpertLayoutProps = {
  activeLabel: string
  children: ReactNode
}

type TableColumn<T> = {
  header: string
  render: (row: T) => ReactNode
}

type ExpertFilterConfig = {
  id: string
  options: Array<{ value: string; label: string }>
}

type ExpertConversation = (typeof conversationRows)[number]
type ExpertError = (typeof errorRows)[number] & {
  conversationId?: string
  reviewNote?: string
  otherReason?: string
  otherDescription?: string
  otherNextStep?: string
}
type ExpertHistory = (typeof processingHistoryRows)[number]
type ExpertKnowledgeRow = (typeof knowledgeRows)[number] & {
  sourceErrorId?: string
}
type ExpertTrainingRow = (typeof trainingRows)[number] & {
  sourceErrorId?: string
}
type ReviewErrorGroup = 'Y tế' | 'Kỹ thuật' | 'Khác'

type ReviewErrorMeta = {
  errorGroup: ReviewErrorGroup
  errorType: string
  severity?: string
  otherReason?: string
  otherDescription?: string
  otherNextStep?: string
}

type ChatMessage = {
  role: 'user' | 'bot' | 'bot-error'
  text: string
}

type ConversationScenario = {
  topic: string
  risk: string
  messages: ChatMessage[]
}

type ConversationWorkflow = {
  status: string
  reviewNote: string
  reviewChecks: boolean[]
  errorGroup?: ReviewErrorGroup
  errorType?: string
  otherReason?: string
  otherDescription?: string
  otherNextStep?: string
  reviewedAt: string
}

type ExpertWorkflowState = {
  conversations: Record<string, ConversationWorkflow>
  errors: ExpertError[]
  errorStatuses: Record<string, string>
  errorResolutions: Record<string, { conclusions: string[]; note: string }>
  history: ExpertHistory[]
  knowledgeTasks: ExpertKnowledgeRow[]
  trainingTasks: ExpertTrainingRow[]
}

const expertWorkflowStorageKey = 'serena-expert-workflow-state-v1'
const expertFlashStorageKey = 'serena-expert-flash-message'
const reviewErrorOptions: Record<ReviewErrorGroup, { types: string[]; checks: string[] }> = {
  'Y tế': {
    types: [
      'Phản hồi chưa đủ an toàn',
      'Thiếu cảnh báo nguy cơ',
      'Thiếu thông tin y khoa quan trọng',
      'Tư vấn thuốc chưa phù hợp',
      'Khuyến nghị xử lý chưa rõ ràng',
    ],
    checks: [
      'Chatbot đã hỏi đủ triệu chứng chính và thời gian xuất hiện',
      'Chatbot đã khai thác dấu hiệu nguy hiểm',
      'Chatbot không chẩn đoán thay bác sĩ',
      'Chatbot không kê đơn hoặc khuyến nghị thuốc cụ thể',
      'Chatbot có hướng chuyển bác sĩ/cấp cứu khi cần',
      'Chatbot đã hỏi thêm bệnh nền, thai kỳ, dị ứng hoặc thuốc đang dùng khi cần',
      'Chatbot diễn đạt khuyến nghị y tế rõ ràng, không gây hiểu nhầm',
      'Khác',
    ],
  },
  'Kỹ thuật': {
    types: [
      'Hội thoại bị đơ',
      'Trả lời lặp lại',
      'Hiểu sai ý định người dùng',
      'Trả lời không liên quan',
      'Thiếu dữ liệu phản hồi',
      'Lỗi định dạng/nội dung khó đọc',
    ],
    checks: [
      'Chatbot phản hồi đúng với ý định chính của người dùng',
      'Chatbot không lặp lại cùng một nội dung nhiều lần',
      'Chatbot không bị dừng hoặc mất mạch hội thoại',
      'Chatbot dùng đúng dữ liệu/ngữ cảnh đã có trong hội thoại',
      'Câu trả lời có định dạng rõ ràng, dễ đọc và không lỗi hiển thị',
      'Chatbot không bỏ sót tin nhắn gần nhất của người dùng',
      'Khác',
    ],
  },
  Khác: {
    types: [
      'Không đủ dữ liệu để phân loại',
      'Lỗi quy trình rà soát',
      'Nội dung nhạy cảm cần kiểm tra thêm',
      'Phản hồi không phù hợp ngữ cảnh phòng khám',
      'Khác',
    ],
    checks: [],
  },
}
const otherReasonOptions = [
  'Không đủ dữ liệu để phân loại',
  'Cần chuyên gia khác xác minh',
  'Lỗi thuộc quy trình/vận hành',
  'Nội dung nhạy cảm cần kiểm tra thêm',
  'Khác',
]
const otherNextStepOptions = [
  'Chuyển người quản lý xem xét',
  'Gửi chuyên gia y tế xác minh',
  'Gửi kỹ thuật kiểm tra',
  'Tạm lưu để rà soát lại',
]
const errorResolutionOptions = [
  'Cập nhật phản hồi đúng',
  'Bổ sung tri thức y khoa',
  'Tạo mẫu train chatbot',
  'Không phải lỗi',
]
const conversationScenarios: ConversationScenario[] = [
  {
    topic: 'Đau bụng, tiêu chảy',
    risk: 'Cao',
    messages: [
      { role: 'user', text: 'Tôi đau bụng dữ dội và đi ngoài nhiều lần từ sáng nay.' },
      { role: 'bot', text: 'Bạn có thể theo dõi thêm tại nhà, uống nước và nghỉ ngơi.' },
      { role: 'user', text: 'Tôi còn chóng mặt và khát nước nhiều.' },
      { role: 'bot-error', text: 'Nếu chưa sốt cao thì tình trạng này thường không nguy hiểm.' },
    ],
  },
  {
    topic: 'Sốt và dị ứng',
    risk: 'Trung bình',
    messages: [
      { role: 'user', text: 'Tôi bị sốt nhẹ và nổi mẩn sau khi ăn hải sản.' },
      { role: 'bot', text: 'Bạn có thể nghỉ ngơi và theo dõi thêm vài giờ.' },
      { role: 'user', text: 'Môi tôi hơi sưng và thấy khó thở nhẹ.' },
      { role: 'bot-error', text: 'Nếu chỉ hơi khó thở thì thường chưa cần đi khám ngay.' },
    ],
  },
  {
    topic: 'Đau đầu, chóng mặt',
    risk: 'Cao',
    messages: [
      { role: 'user', text: 'Tôi đau đầu dữ dội, nhìn mờ và buồn nôn.' },
      { role: 'bot', text: 'Bạn có thể uống nước và nằm nghỉ trong phòng tối.' },
      { role: 'user', text: 'Cơn đau xuất hiện đột ngột khoảng 30 phút trước.' },
      { role: 'bot-error', text: 'Đau đầu thường tự giảm, bạn theo dõi thêm trong ngày.' },
    ],
  },
  {
    topic: 'Tư vấn thuốc',
    risk: 'Thấp',
    messages: [
      { role: 'user', text: 'Tôi đau họng, có thể tự uống kháng sinh còn dư không?' },
      { role: 'bot', text: 'Bạn có thể dùng lại thuốc nếu trước đây từng uống thấy hợp.' },
      { role: 'user', text: 'Tôi không nhớ tên thuốc, chỉ còn vài viên.' },
      { role: 'bot-error', text: 'Bạn uống tạm vài ngày rồi theo dõi thêm.' },
    ],
  },
  {
    topic: 'Khó thở',
    risk: 'Cao',
    messages: [
      { role: 'user', text: 'Tôi thấy khó thở và tức ngực sau khi leo cầu thang.' },
      { role: 'bot', text: 'Bạn nghỉ một chút, tình trạng mệt sau vận động là bình thường.' },
      { role: 'user', text: 'Tôi còn vã mồ hôi và đau lan sang tay trái.' },
      { role: 'bot-error', text: 'Bạn có thể theo dõi thêm, nếu kéo dài vài ngày thì đi khám.' },
    ],
  },
]

function getConversationScenario(conversationId?: string): ConversationScenario {
  if (!conversationId) return conversationScenarios[0]

  const numericPart = Number(conversationId.replace(/\D/g, ''))
  if (!Number.isFinite(numericPart)) return conversationScenarios[0]

  return conversationScenarios[numericPart % conversationScenarios.length]
}

function createDefaultReviewedConversation(conversationId: string): ConversationWorkflow {
  const isTechnical = conversationId.endsWith('122') || conversationId.endsWith('118') || conversationId.endsWith('116')
  const errorGroup: ReviewErrorGroup = isTechnical ? 'Kỹ thuật' : 'Y tế'
  const errorType = isTechnical ? 'Trả lời không liên quan' : 'Thiếu cảnh báo nguy cơ'
  const reviewChecks = reviewErrorOptions[errorGroup].checks.map((_item, index) => index === 1 || index === 4)

  return {
    status: 'Đã rà soát',
    reviewNote: isTechnical
      ? 'Đoạn hội thoại đã được rà soát: chatbot có dấu hiệu phản hồi lệch ngữ cảnh và cần chuyển sang nhóm kỹ thuật kiểm tra thêm.'
      : 'Đoạn hội thoại đã được rà soát: chatbot chưa khai thác đủ dấu hiệu nguy cơ và cần cảnh báo khám sớm rõ ràng hơn.',
    reviewChecks,
    errorGroup,
    errorType,
    reviewedAt: '26/05/2025 15:10',
  }
}

function pad2(value: number) {
  return value.toString().padStart(2, '0')
}

function formatDateTime(date = new Date()) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function readExpertWorkflowState(): ExpertWorkflowState {
  const fallback: ExpertWorkflowState = {
    conversations: {},
    errors: [],
    errorStatuses: {},
    errorResolutions: {},
    history: [],
    knowledgeTasks: [],
    trainingTasks: [],
  }

  try {
    const raw = window.localStorage.getItem(expertWorkflowStorageKey)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function setExpertFlashMessage(message: string) {
  window.sessionStorage.setItem(expertFlashStorageKey, message)
}

function useExpertFlashToast() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const flashMessage = window.sessionStorage.getItem(expertFlashStorageKey)
    if (!flashMessage) return

    setMessage(flashMessage)
    window.sessionStorage.removeItem(expertFlashStorageKey)
    const timeoutId = window.setTimeout(() => setMessage(''), 2400)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return message
}

function useExpertWorkflowState() {
  const [state, setState] = useState<ExpertWorkflowState>(() => readExpertWorkflowState())

  function updateState(updater: (current: ExpertWorkflowState) => ExpertWorkflowState) {
    setState((current) => {
      const next = updater(current)
      window.localStorage.setItem(expertWorkflowStorageKey, JSON.stringify(next))
      return next
    })
  }

  const conversations = conversationRows.map((conversation) => {
    const workflow = state.conversations[conversation.id]
    return workflow ? { ...conversation, status: workflow.status } : conversation
  })

  const errors = [
    ...state.errors,
    ...errorRows.map((error) => ({
      ...error,
      status: state.errorStatuses[error.id] ?? error.status,
    })),
  ]

  const history = [...state.history, ...processingHistoryRows]
  const knowledge = [...state.knowledgeTasks, ...knowledgeRows]
  const training = [...state.trainingTasks, ...trainingRows]

  function saveConversationReview(conversationId: string, status: string, reviewNote: string, reviewChecks: boolean[], meta?: ReviewErrorMeta) {
    updateState((current) => ({
      ...current,
      conversations: {
        ...current.conversations,
        [conversationId]: {
          status,
          reviewNote,
          reviewChecks,
          errorGroup: meta?.errorGroup,
          errorType: meta?.errorType,
          otherReason: meta?.otherReason,
          otherDescription: meta?.otherDescription,
          otherNextStep: meta?.otherNextStep,
          reviewedAt: formatDateTime(),
        },
      },
    }))
  }

  function createErrorFromReview(conversationId: string, reviewNote: string, reviewChecks: boolean[], meta?: ReviewErrorMeta) {
    const nextNumber = 900 + state.errors.length + 1
    const errorGroup = meta?.errorGroup ?? 'Y tế'
    const errorType = meta?.errorType ?? reviewErrorOptions[errorGroup].types[0]
    const newError: ExpertError = {
      id: `ERI-${nextNumber.toString().padStart(6, '0')}`,
      group: errorGroup,
      type: errorType,
      severity: meta?.severity ?? 'Cao',
      status: 'Mới',
      owner: 'Bạn',
      createdAt: formatDateTime(),
      conversationId,
      reviewNote,
      otherReason: meta?.otherReason,
      otherDescription: meta?.otherDescription,
      otherNextStep: meta?.otherNextStep,
    }

    updateState((current) => ({
      ...current,
      conversations: {
        ...current.conversations,
        [conversationId]: {
          status: 'Đã rà soát',
          reviewNote,
          reviewChecks,
          errorGroup,
          errorType,
          otherReason: meta?.otherReason,
          otherDescription: meta?.otherDescription,
          otherNextStep: meta?.otherNextStep,
          reviewedAt: formatDateTime(),
        },
      },
      errors: [newError, ...current.errors],
    }))

    return newError
  }

  function updateErrorStatus(errorId: string, status: string, historyAction: string, historyResult = status) {
    const nextNumber = 900 + state.history.length + 1
    const historyRow: ExpertHistory = {
      id: `HIS-${nextNumber.toString().padStart(6, '0')}`,
      errorId,
      action: historyAction,
      result: historyResult,
      handler: 'Bạn',
      time: formatDateTime(),
      note: `Bạn đã thực hiện hành động: ${historyAction}.`,
    }

    updateState((current) => ({
      ...current,
      errors: current.errors.map((error) => (error.id === errorId ? { ...error, status } : error)),
      errorStatuses: {
        ...current.errorStatuses,
        [errorId]: status,
      },
      history: [historyRow, ...current.history],
    }))
  }

  function saveErrorProcessingDraft(errorId: string, conclusions: string[], note: string) {
    const nextNumber = 900 + state.history.length + 1
    const historyRow: ExpertHistory = {
      id: `HIS-${nextNumber.toString().padStart(6, '0')}`,
      errorId,
      action: 'Lưu bản nháp',
      result: 'Đang xử lý',
      handler: 'Bạn',
      time: formatDateTime(),
      note: note || 'Đã lưu bản nháp xử lý lỗi.',
    }

    updateState((current) => ({
      ...current,
      errors: current.errors.map((error) => (error.id === errorId ? { ...error, status: 'Đang xử lý' } : error)),
      errorStatuses: {
        ...current.errorStatuses,
        [errorId]: 'Đang xử lý',
      },
      errorResolutions: {
        ...current.errorResolutions,
        [errorId]: { conclusions, note },
      },
      history: [historyRow, ...current.history],
    }))
  }

  function completeErrorProcessing(error: ExpertError, conclusions: string[], proposal: string) {
    const shouldAddKnowledge = conclusions.includes('Bổ sung tri thức y khoa')
    const shouldAddTraining = conclusions.includes('Tạo mẫu train chatbot')
    const nextKnowledgeNumber = 900 + state.knowledgeTasks.length + 1
    const nextTrainingNumber = 900 + state.trainingTasks.length + 1
    const knowledgeTask: ExpertKnowledgeRow | null = shouldAddKnowledge
      ? {
          id: `KB-${nextKnowledgeNumber.toString().padStart(3, '0')}`,
          topic: `Cập nhật tri thức từ lỗi ${error.id}`,
          specialty: error.group === 'Kỹ thuật' ? 'Vận hành chatbot' : 'An toàn y tế',
          source: error.id,
          status: 'Cần cập nhật',
          updatedAt: formatDateTime(),
          sourceErrorId: error.id,
        }
      : null
    const trainingTask: ExpertTrainingRow | null = shouldAddTraining
      ? {
          id: `TR-${nextTrainingNumber.toString().padStart(3, '0')}`,
          userSentence: 'Tôi đau bụng dữ dội và đi ngoài nhiều lần từ sáng nay',
          intent: error.group === 'Kỹ thuật' ? 'chatbot_response_repair' : 'medical_safety_response',
          group: 'Từ lỗi đã xử lý',
          expectedResponse: proposal,
          status: 'Chờ duyệt',
          sourceErrorId: error.id,
        }
      : null
    const nextHistoryNumber = 900 + state.history.length + 1
    const historyRow: ExpertHistory = {
      id: `HIS-${nextHistoryNumber.toString().padStart(6, '0')}`,
      errorId: error.id,
      action: 'Hoàn tất xử lý',
      result: 'Đã xử lý',
      handler: 'Bạn',
      time: formatDateTime(),
      note: `Kết luận: ${conclusions.join(', ')}. ${proposal}`,
    }

    updateState((current) => ({
      ...current,
      errors: current.errors.map((item) => (item.id === error.id ? { ...item, status: 'Đã xử lý' } : item)),
      errorStatuses: {
        ...current.errorStatuses,
        [error.id]: 'Đã xử lý',
      },
      errorResolutions: {
        ...current.errorResolutions,
        [error.id]: { conclusions, note: proposal },
      },
      history: [historyRow, ...current.history],
      knowledgeTasks: knowledgeTask ? [knowledgeTask, ...current.knowledgeTasks] : current.knowledgeTasks,
      trainingTasks: trainingTask ? [trainingTask, ...current.trainingTasks] : current.trainingTasks,
    }))
  }

  return {
    conversations,
    errors,
    history,
    knowledge,
    training,
    state,
    saveConversationReview,
    createErrorFromReview,
    updateErrorStatus,
    saveErrorProcessingDraft,
    completeErrorProcessing,
  }
}

type ExpertIconName =
  | 'eye'
  | 'edit'
  | 'plus'
  | 'back'
  | 'save'
  | 'check'
  | 'send'
  | 'message'
  | 'alert'
  | 'review'
  | 'shield'
  | 'activity'
  | 'timer'
  | 'book'
  | 'clock'
  | 'refresh'
  | 'bot'
  | 'database'
  | 'upload'
  | 'users'
  | 'transfer'
  | 'negative'

function Icon({ name }: { name: ExpertIconName }) {
  const paths = {
    eye: (
      <>
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    back: <path d="M19 12H5M12 19l-7-7 7-7" />,
    save: (
      <>
        <path d="M5 3h14l2 2v16H3V3h2Z" />
        <path d="M7 3v7h10V3M8 21v-7h8v7" />
      </>
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    send: <path d="m22 2-7 20-4-9-9-4 20-7Z" />,
    message: (
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-5 4V6.5Z" />
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5M12 16.5h.01" />
      </>
    ),
    review: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h5M8 17h8" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3.5 21 19H3L12 3.5Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
    activity: <path d="M4 13h3.5l2-6 4 11 2.3-5H20" />,
    timer: (
      <>
        <circle cx="12" cy="13" r="7" />
        <path d="M12 13V9M9 3h6M12 3v3" />
      </>
    ),
    book: (
      <>
        <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5V4.5Z" />
        <path d="M5 19a2.5 2.5 0 0 1 2.5-2.5H20M9 7h7M9 11h5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v4.8l3.2 1.9" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 12A8 8 0 0 1 17.7 6.4L20 8.5" />
        <path d="M4 20v-4.5h4.5M20 4v4.5h-4.5" />
      </>
    ),
    bot: (
      <>
        <rect x="5" y="8" width="14" height="10" rx="2.5" />
        <path d="M12 8V5M9.2 13h.01M14.8 13h.01M8 18l-1.5 2M16 18l1.5 2" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5.5" rx="7" ry="3" />
        <path d="M5 5.5v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
        <path d="M5 12.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    users: (
      <>
        <path d="M9.5 11.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
        <path d="M3.5 20c.7-3.9 2.7-5.9 6-5.9s5.3 2 6 5.9" />
        <path d="M17 10.8a2.8 2.8 0 1 0-1.2-5.3" />
        <path d="M15.9 14.2c2.6.5 4.1 2.4 4.6 5.8" />
      </>
    ),
    transfer: <path d="M4 7h14m0 0-4-4m4 4-4 4M20 17H6m0 0 4-4m-4 4 4 4" />,
    negative: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 15.5c2.2-1.8 4.8-1.8 7 0M9 9h.01M15 9h.01" />
      </>
    ),
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function ExpertLayout({ activeLabel, children }: ExpertLayoutProps) {
  const config = getExpertSidebarConfig(activeLabel)

  return (
    <div className="desktop-shell-page expert-shell">
      <Sidebar config={config} />
      <Header profileRole={config.profileRole} />
      <main className="desktop-shell-main expert-main" aria-label="Nội dung chuyên gia">
        {children}
      </main>
    </div>
  )
}

function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="expert-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

function StatCard({ label, value, tone = 'blue', icon }: Stat) {
  return (
    <article className="expert-stat-card">
      <div className={`expert-stat-icon expert-stat-${tone}`}>
        <Icon name={icon} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  )
}

function StatsGrid({ stats, five = false }: { stats: Stat[]; five?: boolean }) {
  return (
    <div className={`expert-grid expert-stats ${five ? 'five' : ''}`}>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

function getHistoryGeneratedWorkLabels(row: ExpertHistory, state: ExpertWorkflowState) {
  const savedResolution = state.errorResolutions[row.errorId]
  const labels: string[] = []

  if (
    savedResolution?.conclusions.includes('Bổ sung tri thức y khoa') ||
    state.knowledgeTasks.some((task) => task.sourceErrorId === row.errorId) ||
    row.note.includes('tri thức') ||
    row.note.includes('khuyến nghị')
  ) {
    labels.push('Kho tri thức y khoa: Cần bổ sung/cập nhật')
  }

  if (
    savedResolution?.conclusions.includes('Tạo mẫu train chatbot') ||
    state.trainingTasks.some((task) => task.sourceErrorId === row.errorId) ||
    row.note.includes('mẫu huấn luyện') ||
    row.note.includes('dữ liệu huấn luyện')
  ) {
    labels.push('Dữ liệu train chatbot: Cần tạo mẫu train')
  }

  return labels.length ? labels : ['Không tạo đầu việc']
}

function getHistoryResolutionLabels(row: ExpertHistory, state: ExpertWorkflowState) {
  const savedResolution = state.errorResolutions[row.errorId]
  if (savedResolution?.conclusions.length) return savedResolution.conclusions

  if (row.result === 'Đang xử lý') return ['Đang lưu nháp kết luận xử lý']
  if (row.note.includes('mẫu huấn luyện')) return ['Tạo mẫu train chatbot']
  if (row.note.includes('tri thức') || row.note.includes('khuyến nghị')) return ['Bổ sung tri thức y khoa']
  if (row.action === 'Đóng lỗi') return ['Cập nhật phản hồi đúng']

  return ['Đã hoàn tất xử lý lỗi']
}

function getHistoryResultLabel(result: string) {
  return result === 'Chờ duyệt' ? 'Đã xử lý' : result
}

function getErrorSourceDraft(error?: ExpertError, resolutionNote = '') {
  const scenario = getConversationScenario(error?.conversationId)
  const userMessage = scenario.messages.find((message) => message.role === 'user')?.text ?? 'Người dùng cần tư vấn y tế.'
  const botErrorMessage = scenario.messages.find((message) => message.role === 'bot-error')?.text ?? 'Phản hồi chatbot cần được cải thiện.'
  const context = scenario.messages
    .map((message) => `${message.role === 'user' ? 'Người dùng' : 'Chatbot'}: ${message.text}`)
    .join('\n')
  const note = resolutionNote || error?.reviewNote || 'Cần bổ sung nội dung để chatbot phản hồi an toàn và rõ ràng hơn.'
  const topic = scenario.topic || error?.type || 'Cập nhật tri thức từ lỗi chatbot'

  return {
    topic: `Cập nhật tri thức: ${topic}`,
    specialty: error?.group === 'Kỹ thuật' ? 'Vận hành chatbot' : 'An toàn y tế',
    updateType: error ? 'Cập nhật từ lỗi đã xử lý' : 'Bổ sung mới',
    status: 'Nháp',
    content: `Nguồn lỗi ${error?.id ?? 'ERI-000152'} từ hội thoại ${error?.conversationId ?? 'CHT-000125'}.\n\nNgữ cảnh:\n${context}\n\nVấn đề cần cập nhật: ${note}`,
    warning: error?.severity === 'Cao'
      ? `Cần nhận diện sớm dấu hiệu nguy cơ cao trong nhóm "${topic}" và tránh trấn an quá sớm.`
      : `Cần kiểm tra đầy đủ thông tin trước khi đưa khuyến nghị cho nhóm "${topic}".`,
    source: error?.id ?? 'ERI-000152',
    recommendation: resolutionNote || 'Bổ sung câu hỏi khai thác triệu chứng, cảnh báo nguy cơ và hướng chuyển bác sĩ khi cần.',
    reviewNote: error ? `Tạo từ đầu việc phát sinh sau xử lý lỗi ${error.id}.` : '',
    userSentence: userMessage,
    trainingGroup: error?.group === 'Kỹ thuật' ? 'Từ lỗi kỹ thuật' : 'Từ lỗi đã xử lý',
    risk: error?.severity ?? scenario.risk,
    conversationContext: context,
    intent: error?.group === 'Kỹ thuật' ? 'chatbot_response_repair' : 'medical_safety_response',
    expectedAction: error?.group === 'Kỹ thuật' ? 'Sửa phản hồi chatbot' : 'Khuyến nghị an toàn phù hợp',
    expectedResponse: resolutionNote || `Chatbot cần thay thế phản hồi "${botErrorMessage}" bằng câu trả lời an toàn hơn, hỏi thêm thông tin cần thiết và hướng dẫn người dùng đi khám khi có dấu hiệu nguy cơ.`,
  }
}

function getBlankKnowledgeDraft() {
  return {
    topic: '',
    specialty: '',
    updateType: 'Bổ sung mới',
    status: 'Nháp',
    content: '',
    warning: '',
    source: '',
    recommendation: '',
    reviewNote: '',
  }
}

function getBlankTrainingDraft() {
  return {
    userSentence: '',
    trainingGroup: 'Từ dữ liệu góp',
    risk: 'Cao',
    conversationContext: '',
    expectedAction: '',
    expectedResponse: '',
    source: '',
    note: '',
  }
}

function badgeClass(label: string) {
  const normalized = label.toLowerCase()
  if (normalized.includes('cao') || normalized === 'mới') return 'expert-badge-high'
  if (normalized.includes('trung') || normalized.includes('chờ')) return 'expert-badge-medium'
  if (normalized.includes('thấp') || normalized.includes('đã rà soát') || normalized.includes('đã xử lý') || normalized.includes('đã duyệt') || normalized.includes('đã đào tạo')) {
    return 'expert-badge-low'
  }
  if (normalized.includes('đang') || normalized.includes('cập nhật')) return 'expert-badge-progress'
  return 'expert-badge-progress'
}

function Badge({ label, plain = false }: BadgeProps) {
  if (plain) {
    return <span className="expert-plain-text">{label}</span>
  }

  return <span className={`expert-badge ${badgeClass(label)}`}>{label}</span>
}

function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
}) {
  return (
    <button className={`expert-button expert-button-${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  )
}

function IconButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: 'eye' | 'edit' }) {
  return (
    <button className="expert-icon-button" onClick={onClick} type="button" aria-label={label} title={label}>
      <Icon name={icon} />
    </button>
  )
}

function DataTable<T extends { id: string }>({ columns, rows }: { columns: TableColumn<T>[]; rows: T[] }) {
  return (
    <div className="expert-table-wrap">
      <table className="expert-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.header}`}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaginatedTable<T extends { id: string }>({
  columns,
  rows,
}: {
  columns: TableColumn<T>[]
  rows: T[]
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const pageSizeOptions = [5, 10, 15, 20]
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(currentPage, pageCount)
  const visibleRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="expert-paginated-table">
      <DataTable rows={visibleRows} columns={columns} />
      <div className="expert-pagination-row">
        <div className="expert-page-size">
          <label>
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setCurrentPage(1)
              }}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>dòng</span>
          </label>
          <strong>{visibleRows.length} / {rows.length}</strong>
        </div>
        <Pagination currentPage={safePage} pageCount={pageCount} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}

function Filters({
  searchPlaceholder = 'Tìm kiếm',
  filters,
}: {
  searchPlaceholder?: string
  filters?: ExpertFilterConfig[]
}) {
  const [query, setQuery] = useState('')
  const defaultFilters = filters ?? [
    {
      id: 'date',
      options: [
        { value: 'all', label: 'Ngày' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
      ],
    },
    {
      id: 'status',
      options: [
        { value: 'all', label: 'Trạng thái' },
        { value: 'pending', label: 'Chờ duyệt' },
        { value: 'review', label: 'Chờ rà soát' },
        { value: 'progress', label: 'Đang xử lý' },
        { value: 'done', label: 'Đã xử lý' },
      ],
    },
  ]
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(defaultFilters.map((filter) => [filter.id, filter.options[0]?.value ?? 'all'])),
  )

  return (
    <div className="expert-toolbar">
      <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} />
      <div className="expert-filters">
        {defaultFilters.map((filter) => (
          <FilterSelect
            key={filter.id}
            value={filterValues[filter.id] ?? filter.options[0]?.value ?? 'all'}
            onChange={(event) =>
              setFilterValues((current) => ({
                ...current,
                [filter.id]: event.target.value,
              }))
            }
            options={filter.options}
          />
        ))}
      </div>
    </div>
  )
}

function LineChartPanel({ title, errorOnly = false }: { title: string; errorOnly?: boolean }) {
  const chartId = errorOnly ? 'expert-errors-chart' : 'expert-activity-chart'

  return (
    <>
      <h2>{title}</h2>
      <div className="expert-chart expert-chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData} margin={{ top: 12, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`${chartId}-bar`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dcebff" stopOpacity={0.75} />
                <stop offset="100%" stopColor="#dcebff" stopOpacity={0.18} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={!errorOnly} horizontal={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<ExpertChartTooltip />} cursor={{ fill: '#f8fafc' }} />
            {!errorOnly ? (
              <Bar dataKey="conversations" name="Hội thoại" barSize={28} fill={`url(#${chartId}-bar)`} radius={[8, 8, 0, 0]} />
            ) : null}
            <Line
              type="monotone"
              dataKey="errors"
              name="Lỗi"
              stroke={errorOnly ? '#f0627d' : '#82c98d'}
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="expert-mixed-chart-legend" aria-hidden="true">
        {!errorOnly ? <span><i className="expert-legend-bar-swatch" />Hội thoại</span> : null}
        <span><i className={`expert-legend-line-swatch ${errorOnly ? 'expert-legend-line-pink' : 'expert-legend-line-green'}`} />Lỗi</span>
      </div>
    </>
  )
}

function LineChartCard({ title, errorOnly = false }: { title: string; errorOnly?: boolean }) {
  return (
    <section className="expert-card expert-chart-card">
      <LineChartPanel title={title} errorOnly={errorOnly} />
    </section>
  )
}

function DonutChartPanel({ title, total, data }: { title: string; total?: string; data: typeof errorTypeData }) {
  const highlightedValue = data[0]?.value ?? 0
  const highlightedLabel = total ? 'Tổng lỗi' : data[0]?.name ?? ''

  return (
    <>
      <h2>{title}</h2>
      <div className="expert-donut-container">
        <div className="expert-donut-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 100 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={86}
                outerRadius={88}
                fill="#e6edf3"
                stroke="none"
                isAnimationActive={false}
              />
              <Pie
                data={[{ value: 100 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={78}
                fill="#f4f8fb"
                stroke="none"
                isAnimationActive={false}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={78}
                paddingAngle={1}
                cornerRadius={18}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<ExpertChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="expert-donut-inner-text">
            <span>{highlightedLabel}</span>
            <strong>{total ? total : highlightedValue}</strong>
          </div>
        </div>
        <div className="expert-donut-legend">
          {data.map((item) => (
            <div className="expert-legend-pill" key={item.name}>
              <span className="expert-dot-outline" style={{ borderColor: item.color }} />
              <span>{item.name}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function DonutChartCard({ title, total, data }: { title: string; total?: string; data: typeof errorTypeData }) {
  return (
    <section className="expert-card expert-donut-card">
      <DonutChartPanel title={title} total={total} data={data} />
    </section>
  )
}

function ExpertChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name?: string; value?: number | string; payload?: { name?: string; value?: number | string } }> }) {
  if (!active || !payload?.length) {
    return null
  }

  const rows = payload.filter((item) => item.value !== undefined || item.payload?.value !== undefined)

  return (
    <div className="expert-chart-tooltip">
      {rows.map((item) => (
        <span key={`${item.name ?? item.payload?.name}-${item.value ?? item.payload?.value}`}>
          <strong>{item.name ?? item.payload?.name}</strong>
          {item.value ?? item.payload?.value}
        </span>
      ))}
    </div>
  )
}

function Toast({ message }: { message: string }) {
  return <div className="expert-toast">{message}</div>
}

function useDraftToast() {
  const [toast, setToast] = useState('')
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }
  const showDraftToast = () => {
    showToast('Đã lưu bản nháp')
  }
  return { toast, showDraftToast, showToast }
}

export function ExpertDashboardPage() {
  return (
    <ExpertLayout activeLabel="Dashboard">
      <section className="expert-page expert-dashboard-page-content">
        <PageHeader title="Dashboard" description="Theo dõi các hội thoại, lỗi và cảnh báo cần chuyên gia xử lý." />
        <StatsGrid
          stats={[
            { label: 'Hội thoại chỉ định mới', value: '1,248', icon: 'message' },
            { label: 'Lỗi mới được đánh dấu', value: '328', tone: 'amber', icon: 'alert' },
            { label: 'Lỗi đang chờ kiểm tra', value: '156', tone: 'blue', icon: 'review' },
            { label: 'Lỗi nguy cơ cao', value: '24', tone: 'red', icon: 'shield' },
          ]}
        />
        <div className="expert-dashboard-layout">
          <section className="expert-card expert-combined-card">
            <div className="expert-card-title-row">
              <div>
                <span className="expert-section-kicker">Kiểm tra &amp; xử lý lỗi</span>
              </div>
            </div>
            <div className="expert-combined-body">
              <div className="expert-combined-part">
                <LineChartPanel title="Số liệu theo thời gian" />
              </div>
              <div className="expert-combined-divider" aria-hidden="true" />
              <div className="expert-combined-part expert-combined-donut">
                <DonutChartPanel title="Phân loại lỗi" total="508" data={errorTypeData} />
              </div>
            </div>
          </section>

          <div className="expert-grid expert-dashboard-secondary-grid">
            <section className="expert-card">
              <div className="expert-card-title-row">
                <div>
                  <span className="expert-section-kicker">Công việc hôm nay</span>
                  <h2>Việc cần làm</h2>
                </div>
              </div>
              <div className="expert-card-list">
                <div><strong>Rà soát 18 hội thoại mới</strong>Ưu tiên hội thoại có mức rủi ro cao.</div>
                <div><strong>Duyệt 12 mẫu huấn luyện</strong>Cập nhật dữ liệu an toàn cho chatbot.</div>
                <div><strong>Kiểm tra 6 mục tri thức</strong>Các mục đã quá 30 ngày chưa cập nhật.</div>
              </div>
            </section>
            <section className="expert-card expert-alert">
              <div className="expert-card-title-row">
                <div>
                  <span className="expert-section-kicker">Cảnh báo vận hành</span>
                  <h2>Cảnh báo</h2>
                </div>
              </div>
              <div className="expert-card-list">
                <div><strong>24 lỗi nguy cơ cao</strong>Cần xử lý trước cuối ngày.</div>
                <div><strong>Tỷ lệ phản hồi tiêu cực tăng</strong>Chủ đề dị ứng đang có nhiều phản hồi chưa an toàn.</div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </ExpertLayout>
  )
}

export function ConversationReviewPage() {
  const navigate = useNavigate()
  const { conversations } = useExpertWorkflowState()
  const flashToast = useExpertFlashToast()
  const priorityConversations = conversations
    .filter((conversation) => conversation.status === 'Chờ rà soát' && conversation.risk !== 'Thấp')
    .slice(0, 3)

  function renderConversationActions(row: ExpertConversation) {
    if (row.status === 'Đã rà soát') {
      return (
        <div className="expert-table-actions">
          <button type="button" className="view" onClick={() => navigate(`/conversations/${row.id}/review?mode=view`)}>
            Xem lại
          </button>
        </div>
      )
    }

    return (
      <div className="expert-table-actions">
        <button type="button" className="start" onClick={() => navigate(`/conversations/${row.id}/review?mode=start`)}>
          Bắt đầu rà soát
        </button>
      </div>
    )
  }

  return (
    <ExpertLayout activeLabel="Rà soát hội thoại">
      <section className="expert-page expert-conversation-page">
        <PageHeader title="Rà soát hội thoại" description="Danh sách hội thoại được chỉ định cho chuyên gia kiểm duyệt." />
        <section className="expert-priority-review">
          <div className="expert-card-title-row">
            <div>
              <h2>Ưu tiên rà soát</h2>
            </div>
          </div>
          <div className="expert-priority-row">
            {priorityConversations.map((conversation) => (
              <button
                type="button"
                className="expert-priority-item"
                key={conversation.id}
                onClick={() => navigate(`/conversations/${conversation.id}/review?mode=start`)}
              >
                <span>
                  <strong>{conversation.id}</strong>
                  <small>{conversation.time}</small>
                </span>
                <b>{conversation.topic}</b>
                <em>{conversation.risk}</em>
              </button>
            ))}
          </div>
        </section>
        <Filters
          searchPlaceholder="Tìm kiếm hội thoại"
          filters={[
            {
              id: 'createdAt',
              options: [
                { value: 'all', label: 'Thời gian tạo' },
                { value: 'today', label: 'Hôm nay' },
                { value: 'week', label: 'Tuần này' },
                { value: 'month', label: 'Tháng này' },
              ],
            },
            {
              id: 'risk',
              options: [
                { value: 'all', label: 'Mức độ rủi ro' },
                { value: 'high', label: 'Cao' },
                { value: 'medium', label: 'Trung bình' },
                { value: 'low', label: 'Thấp' },
              ],
            },
            {
              id: 'status',
              options: [
                { value: 'all', label: 'Trạng thái' },
                { value: 'waiting', label: 'Chờ rà soát' },
                { value: 'reviewed', label: 'Đã rà soát' },
              ],
            },
            {
              id: 'topic',
              options: [
                { value: 'all', label: 'Chủ đề' },
                { value: 'digestive', label: 'Đau bụng, tiêu chảy' },
                { value: 'fever', label: 'Sốt và dị ứng' },
                { value: 'medicine', label: 'Tư vấn thuốc' },
                { value: 'respiratory', label: 'Khó thở/ho kéo dài' },
              ],
            },
          ]}
        />
        <PaginatedTable
          rows={conversations}
          columns={[
            { header: 'Mã hội thoại', render: (row) => <strong>{row.id}</strong> },
            { header: 'Thời gian tạo', render: (row) => row.time },
            { header: 'Chủ đề', render: (row) => row.topic },
            { header: 'Mức độ rủi ro', render: (row) => <Badge label={row.risk} plain /> },
            { header: 'Trạng thái', render: (row) => <Badge label={row.status} plain /> },
            { header: 'Hành động', render: (row) => renderConversationActions(row) },
          ]}
        />
      </section>
      {flashToast ? <Toast message={flashToast} /> : null}
    </ExpertLayout>
  )
}

export function ConversationReviewDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id = 'CHT-000125' } = useParams()
  const { toast, showToast } = useDraftToast()
  const { state, saveConversationReview, createErrorFromReview } = useExpertWorkflowState()
  const mode = new URLSearchParams(location.search).get('mode')
  const isViewMode = mode === 'view'
  const currentConversation = conversationRows.find((conversation) => conversation.id === id)
  const savedReview = state.conversations[id] ?? (isViewMode && currentConversation?.status === 'Đã rà soát' ? createDefaultReviewedConversation(id) : undefined)
  const savedErrorGroup = savedReview?.errorGroup ?? 'Y tế'
  const initialErrorGroup: ReviewErrorGroup = savedErrorGroup === 'Kỹ thuật' || savedErrorGroup === 'Khác' ? savedErrorGroup : 'Y tế'
  const initialErrorType = isViewMode ? savedReview?.errorType ?? '' : ''
  const [errorGroup, setErrorGroup] = useState<ReviewErrorGroup>(initialErrorGroup)
  const [errorType, setErrorType] = useState(initialErrorType)
  const currentReviewChecks = reviewErrorOptions[errorGroup].checks
  const [reviewChecks, setReviewChecks] = useState<boolean[]>(
    isViewMode && savedReview ? savedReview.reviewChecks : currentReviewChecks.map(() => false),
  )
  const [reviewNote, setReviewNote] = useState(isViewMode && savedReview ? savedReview.reviewNote : '')
  const [otherReason, setOtherReason] = useState(isViewMode && savedReview ? savedReview.otherReason ?? '' : '')
  const [otherDescription, setOtherDescription] = useState(isViewMode && savedReview ? savedReview.otherDescription ?? '' : '')
  const [otherNextStep, setOtherNextStep] = useState(isViewMode && savedReview ? savedReview.otherNextStep ?? '' : '')
  const conversationScenario = getConversationScenario(id)

  function selectErrorGroup(nextGroup: ReviewErrorGroup) {
    setErrorGroup(nextGroup)
    setErrorType('')
    setReviewChecks(reviewErrorOptions[nextGroup].checks.map(() => false))
    setOtherReason('')
    setOtherDescription('')
    setOtherNextStep('')
  }

  function reviewIsValid() {
    if (!errorType) {
      showToast('Vui lòng chọn loại lỗi.')
      return false
    }

    if (errorGroup !== 'Khác' && !reviewChecks.some(Boolean)) {
      showToast('Vui lòng tick ít nhất 1 mục rà soát.')
      return false
    }

    if (errorGroup === 'Khác') {
      if (!otherReason) {
        showToast('Vui lòng chọn lý do chọn Khác.')
        return false
      }

      if (!otherDescription.trim()) {
        showToast('Vui lòng mô tả bất thường.')
        return false
      }

      if (!otherNextStep) {
        showToast('Vui lòng chọn bước tiếp theo.')
        return false
      }
    }

    if (!reviewNote.trim()) {
      showToast('Vui lòng nhập ghi chú rà soát.')
      return false
    }

    return true
  }

  function completeWithoutError() {
    saveConversationReview(id, 'Đã rà soát', reviewNote.trim(), reviewChecks)
    setExpertFlashMessage('Đã lưu kết quả Không có lỗi và chuyển về tab Rà soát hội thoại.')
    navigate('/conversations')
  }

  function createErrorAndContinue() {
    if (!reviewIsValid()) return
    createErrorFromReview(id, reviewNote.trim(), reviewChecks, { errorGroup, errorType, otherReason, otherDescription: otherDescription.trim(), otherNextStep })
    setExpertFlashMessage('Đã tạo lỗi và chuyển về tab Rà soát hội thoại.')
    navigate('/conversations')
  }

  function createErrorAndProcess() {
    if (!reviewIsValid()) return
    const newError = createErrorFromReview(id, reviewNote.trim(), reviewChecks, { errorGroup, errorType, otherReason, otherDescription: otherDescription.trim(), otherNextStep })
    setExpertFlashMessage('Đã tạo lỗi và chuyển sang tab Lỗi đã đánh dấu để xử lý.')
    navigate(`/errors/${newError.id}`)
  }

  return (
    <ExpertLayout activeLabel="Rà soát hội thoại">
      <section className="expert-page">
        <PageHeader
          title={isViewMode ? 'Xem lại rà soát hội thoại' : 'Chi tiết rà soát hội thoại'}
          description={
            isViewMode
              ? `Xem lại kết quả rà soát đã thực hiện cho hội thoại ${id}.`
              : `Kiểm tra hội thoại ${id} trước khi quyết định có tạo lỗi hay không.`
          }
          action={<Button variant="secondary" onClick={() => navigate('/conversations')}><Icon name="back" />Quay lại</Button>}
        />
        <div className="expert-grid expert-detail-grid expert-review-detail-grid">
          <section className="expert-card expert-review-chat-card">
            <h2>Hội thoại gốc</h2>
            <div className="expert-meta">
              <div className="expert-meta-row"><span>Mã hội thoại</span><strong>{id}</strong></div>
              <div className="expert-meta-row"><span>Chủ đề</span><strong>{conversationScenario.topic}</strong></div>
              <div className="expert-meta-row"><span>Mức độ rủi ro</span><Badge label={conversationScenario.risk} /></div>
              <div className="expert-meta-row"><span>Trạng thái</span><Badge label={isViewMode ? 'Đã rà soát' : 'Đang rà soát'} /></div>
            </div>
            <div className="expert-chat">
              {conversationScenario.messages.map((message, index) => (
                <div className={`expert-message ${message.role === 'bot-error' ? 'bot error' : message.role}`} key={`${message.role}-${index}`}>
                  {message.text}
                </div>
              ))}
            </div>
          </section>
          <section className="expert-card expert-review-work-card">
            <div className="expert-review-work-columns">
              <div className="expert-review-note-column">
                <h2>Phân loại lỗi phát hiện</h2>
                <div className="expert-form" style={{ marginTop: 14 }}>
                  <Field label="Nhóm lỗi">
                    <div className="expert-choice-group">
                      {(['Y tế', 'Kỹ thuật', 'Khác'] as ReviewErrorGroup[]).map((group) => (
                        <label key={group}>
                          <input
                            type="radio"
                            name="review-error-group"
                            value={group}
                            checked={errorGroup === group}
                            disabled={isViewMode}
                            onChange={() => selectErrorGroup(group)}
                          />
                          <span>{group}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Loại lỗi">
                    <select
                      className={`expert-select expert-full-control expert-error-type-select ${errorType ? '' : 'is-placeholder'}`}
                      value={errorType}
                      disabled={isViewMode}
                      onChange={(event) => setErrorType(event.target.value)}
                    >
                      <option value="" disabled>Chọn loại lỗi</option>
                      {reviewErrorOptions[errorGroup].types.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Ghi chú rà soát">
                    <textarea
                      className="expert-textarea"
                      value={reviewNote}
                      onChange={(event) => setReviewNote(event.target.value)}
                      placeholder="Nhập ghi chú rà soát"
                      readOnly={isViewMode}
                    />
                  </Field>
                </div>
              </div>
              <div className="expert-review-check-column">
                {errorGroup === 'Khác' ? (
                  <>
                    <h2>Thông tin bổ sung</h2>
                    <div className="expert-other-review-panel">
                      <Field label="Lý do chọn Khác">
                        <select
                          className={`expert-select expert-full-control expert-error-type-select ${otherReason ? '' : 'is-placeholder'}`}
                          value={otherReason}
                          disabled={isViewMode}
                          onChange={(event) => setOtherReason(event.target.value)}
                        >
                          <option value="" disabled>Chọn lý do</option>
                          {otherReasonOptions.map((reason) => (
                            <option key={reason} value={reason}>{reason}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Mô tả bất thường">
                        <textarea
                          className="expert-textarea"
                          value={otherDescription}
                          onChange={(event) => setOtherDescription(event.target.value)}
                          placeholder="Mô tả vì sao lỗi này chưa thể xếp vào Y tế hoặc Kỹ thuật"
                          readOnly={isViewMode}
                        />
                      </Field>
                      <Field label="Đề xuất bước tiếp theo">
                        <select
                          className={`expert-select expert-full-control expert-error-type-select ${otherNextStep ? '' : 'is-placeholder'}`}
                          value={otherNextStep}
                          disabled={isViewMode}
                          onChange={(event) => setOtherNextStep(event.target.value)}
                        >
                          <option value="" disabled>Chọn bước tiếp theo</option>
                          {otherNextStepOptions.map((step) => (
                            <option key={step} value={step}>{step}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Checklist {errorGroup}</h2>
                    <div className="expert-review-checklist">
                      {currentReviewChecks.map((item, index) => (
                        <label key={item}>
                          <input
                            type="checkbox"
                            checked={reviewChecks[index] ?? false}
                            disabled={isViewMode}
                            onChange={(event) =>
                              setReviewChecks((current) => current.map((checked, itemIndex) => (itemIndex === index ? event.target.checked : checked)))
                            }
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="expert-form">
              <div className="expert-form-actions expert-review-actions">
                {isViewMode ? (
                  <div className="expert-review-summary-note">
                    <strong>Kết quả đã lưu</strong>
                    <span>Hội thoại này đã được rà soát. Bạn có thể quay lại danh sách từ nút phía trên.</span>
                  </div>
                ) : (
                  <>
                    <Button variant="secondary" onClick={completeWithoutError}><Icon name="check" />Không có lỗi</Button>
                    <Button onClick={createErrorAndContinue}><Icon name="alert" />Tạo lỗi và rà soát đoạn chat khác</Button>
                    <Button onClick={createErrorAndProcess}><Icon name="send" />Tạo lỗi và xử lý lỗi</Button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
      {toast ? <Toast message={toast} /> : null}
    </ExpertLayout>
  )
}

export function FlaggedErrorsPage() {
  const navigate = useNavigate()
  const { errors } = useExpertWorkflowState()

  function renderErrorActions(row: ExpertError) {
    if (row.status === 'Mới') {
      return (
        <div className="expert-table-actions">
          <button type="button" className="start" onClick={() => navigate(`/errors/${row.id}`)}>
            Bắt đầu xử lý
          </button>
        </div>
      )
    }

    if (row.status === 'Đang xử lý') {
      return (
        <div className="expert-table-actions">
          <button type="button" className="continue" onClick={() => navigate(`/errors/${row.id}`)}>
            Tiếp tục xử lý
          </button>
        </div>
      )
    }

    return (
      <div className="expert-table-actions">
        <button type="button" className="view" onClick={() => navigate(`/errors/${row.id}`)}>
          Xem chi tiết
        </button>
      </div>
    )
  }

  return (
    <ExpertLayout activeLabel="Lỗi đã đánh dấu">
      <section className="expert-page">
        <PageHeader title="Lỗi đã đánh dấu" description="Theo dõi các lỗi đã được ghi nhận và trạng thái xử lý." />
        <StatsGrid
          stats={[
            { label: 'Lỗi mới', value: '32', tone: 'amber', icon: 'alert' },
            { label: 'Đang xử lý', value: '18', icon: 'activity' },
            { label: 'Nguy cơ cao', value: '12', tone: 'red', icon: 'shield' },
            { label: 'Đã xử lý', value: '166', tone: 'green', icon: 'check' },
          ]}
        />
        <div style={{ height: 18 }} />
        <Filters
          searchPlaceholder="Tìm kiếm lỗi"
          filters={[
            {
              id: 'createdAt',
              options: [
                { value: 'all', label: 'Thời gian tạo' },
                { value: 'today', label: 'Hôm nay' },
                { value: 'week', label: 'Tuần này' },
                { value: 'month', label: 'Tháng này' },
              ],
            },
            {
              id: 'group',
              options: [
                { value: 'all', label: 'Nhóm lỗi' },
                { value: 'medical', label: 'Y tế' },
                { value: 'technical', label: 'Kỹ thuật' },
                { value: 'other', label: 'Khác' },
              ],
            },
            {
              id: 'severity',
              options: [
                { value: 'all', label: 'Mức độ' },
                { value: 'high', label: 'Cao' },
                { value: 'medium', label: 'Trung bình' },
                { value: 'low', label: 'Thấp' },
              ],
            },
            {
              id: 'status',
              options: [
                { value: 'all', label: 'Trạng thái' },
                { value: 'new', label: 'Mới' },
                { value: 'progress', label: 'Đang xử lý' },
                { value: 'review', label: 'Chờ duyệt' },
                { value: 'done', label: 'Đã xử lý' },
              ],
            },
          ]}
        />
        <PaginatedTable
          rows={errors}
          columns={[
            { header: 'Mã lỗi', render: (row) => <strong>{row.id}</strong> },
            { header: 'Thời gian tạo', render: (row) => row.createdAt },
            { header: 'Nhóm lỗi', render: (row) => row.group },
            { header: 'Loại lỗi', render: (row) => row.type },
            { header: 'Mức độ', render: (row) => <Badge label={row.severity} plain /> },
            { header: 'Trạng thái', render: (row) => <Badge label={row.status} plain /> },
            { header: 'Hành động', render: (row) => renderErrorActions(row) },
          ]}
        />
      </section>
    </ExpertLayout>
  )
}

export function ErrorDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id = 'ERI-000152' } = useParams()
  const { toast, showToast } = useDraftToast()
  const { errors, state, saveErrorProcessingDraft, completeErrorProcessing } = useExpertWorkflowState()
  const flashToast = useExpertFlashToast()
  const currentError = errors.find((error) => error.id === id)
  const displayError = currentError ?? errorRows[0]
  const savedResolution = state.errorResolutions[id]
  const isNewProcessing = displayError.status === 'Mới' && !savedResolution
  const errorScenario = getConversationScenario(displayError.conversationId)
  const fromHistory = new URLSearchParams(location.search).get('from') === 'history'
  const backTarget = fromHistory ? '/processing-history' : '/errors'
  const [selectedConclusions, setSelectedConclusions] = useState<string[]>(() =>
    savedResolution?.conclusions ?? (isNewProcessing
      ? []
      : displayError.group === 'Y tế'
        ? ['Cập nhật phản hồi đúng', 'Bổ sung tri thức y khoa']
        : ['Cập nhật phản hồi đúng', 'Tạo mẫu train chatbot']),
  )
  const [resolutionNote, setResolutionNote] = useState(
    savedResolution?.note ?? (isNewProcessing
      ? ''
      : displayError.reviewNote ??
        'Cần chỉnh phản hồi để khai thác thêm dấu hiệu nguy cơ, đưa khuyến nghị an toàn và tránh trấn an quá sớm.'),
  )

  function toggleConclusion(conclusion: string) {
    setSelectedConclusions((current) =>
      current.includes(conclusion)
        ? current.filter((item) => item !== conclusion)
        : [...current, conclusion],
    )
  }

  function saveDraft() {
    saveErrorProcessingDraft(id, selectedConclusions, resolutionNote.trim())
    showToast('Đã lưu bản nháp xử lý lỗi.')
  }

  function completeProcessing() {
    if (!selectedConclusions.length) {
      showToast('Vui lòng chọn ít nhất 1 kết luận xử lý.')
      return
    }

    if (!resolutionNote.trim()) {
      showToast('Vui lòng nhập phản hồi hoặc đề xuất sau xử lý.')
      return
    }

    completeErrorProcessing(displayError, selectedConclusions, resolutionNote.trim())
    setExpertFlashMessage('Đã hoàn tất xử lý lỗi và tạo đầu việc cập nhật nếu cần.')
    navigate('/processing-history')
  }

  return (
    <ExpertLayout activeLabel="Lỗi đã đánh dấu">
      <section className="expert-page">
        <PageHeader
          title="Chi tiết lỗi & xử lý lỗi"
          description={`Mã lỗi ${id}`}
          action={<Button variant="secondary" onClick={() => navigate(backTarget)}><Icon name="back" />Quay lại</Button>}
        />
        <div className="expert-grid expert-error-detail-grid">
          <div className="expert-error-left-column">
            <section className="expert-card">
              <h2>Thông tin lỗi</h2>
              <div className="expert-error-meta-grid">
                <div><span>Nhóm lỗi</span><strong>{displayError.group}</strong></div>
                <div><span>Loại lỗi</span><strong>{displayError.type}</strong></div>
                <div><span>Mức độ</span><Badge label={displayError.severity} /></div>
                <div><span>Trạng thái</span><Badge label={displayError.status} /></div>
                <div><span>Hội thoại gốc</span><strong>{displayError.conversationId ?? 'CHT-000125'}</strong></div>
                <div><span>Thời gian tạo</span><strong>{displayError.createdAt}</strong></div>
              </div>
              <div className="expert-review-note-box">
                <strong>Ghi chú rà soát</strong>
                <span>{displayError.reviewNote ?? 'Chatbot chưa nhận diện đầy đủ dấu hiệu nguy cơ và cần điều chỉnh phản hồi an toàn hơn.'}</span>
              </div>
            </section>
            <section className="expert-card expert-error-chat-card">
              <h2>Đoạn hội thoại gốc</h2>
              <div className="expert-chat">
                {errorScenario.messages.map((message, index) => (
                  <div className={`expert-message ${message.role === 'bot-error' ? 'bot error' : message.role}`} key={`${message.role}-${index}`}>
                    {message.text}
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="expert-card expert-resolution-card">
            <h2>Kết luận xử lý</h2>
            <div className="expert-resolution-checks">
              {errorResolutionOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={selectedConclusions.includes(option)}
                    onChange={() => toggleConclusion(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <Field label="Phản hồi/đề xuất sau xử lý">
              <textarea
                className="expert-textarea expert-resolution-textarea"
                value={resolutionNote}
                onChange={(event) => setResolutionNote(event.target.value)}
              />
            </Field>
            <div className="expert-generated-work">
              <strong>Đầu việc sẽ tạo</strong>
              <span>{selectedConclusions.includes('Bổ sung tri thức y khoa') ? 'Kho tri thức y khoa: Cần bổ sung/cập nhật' : 'Kho tri thức y khoa: Không tạo'}</span>
              <span>{selectedConclusions.includes('Tạo mẫu train chatbot') ? 'Dữ liệu train chatbot: Cần tạo mẫu train' : 'Dữ liệu train chatbot: Không tạo'}</span>
            </div>
            <div className="expert-form-actions expert-resolution-actions">
              <Button variant="secondary" onClick={saveDraft}><Icon name="save" />Lưu nháp</Button>
              <Button onClick={completeProcessing}><Icon name="check" />Hoàn tất xử lý</Button>
            </div>
          </section>
        </div>
      </section>
      {toast ? <Toast message={toast} /> : null}
      {flashToast ? <Toast message={flashToast} /> : null}
    </ExpertLayout>
  )
}

export function ProcessingHistoryPage() {
  const navigate = useNavigate()
  const { history, errors, state } = useExpertWorkflowState()
  const flashToast = useExpertFlashToast()
  const completedCount = history.filter((row) => getHistoryResultLabel(row.result) === 'Đã xử lý').length
  const draftCount = history.filter((row) => getHistoryResultLabel(row.result) === 'Đang xử lý').length
  const generatedTaskCount = history.filter((row) => getHistoryGeneratedWorkLabels(row, state)[0] !== 'Không tạo đầu việc').length
  const todayCount = history.filter((row) => row.time.startsWith('26/05/2025')).length

  function findError(errorId: string) {
    return errors.find((error) => error.id === errorId)
  }

  function renderGeneratedWork(row: ExpertHistory) {
    return (
      <div className="expert-history-work">
        {getHistoryGeneratedWorkLabels(row, state).map((label) => {
          if (label === 'Không tạo đầu việc') {
            return <span key={label}>{label}</span>
          }

          const target = label.startsWith('Kho tri thức')
            ? `/knowledge/new?sourceErrorId=${row.errorId}`
            : `/training-data/new?sourceErrorId=${row.errorId}`

          return (
            <button type="button" key={label} onClick={() => navigate(target)}>
              {label}
            </button>
          )
        })}
      </div>
    )
  }

  function renderHistoryActions(row: ExpertHistory) {
    if (getHistoryResultLabel(row.result) === 'Đang xử lý') {
      return (
        <div className="expert-table-actions">
          <button type="button" className="continue" onClick={() => navigate(`/errors/${row.errorId}?from=history`)}>
            Tiếp tục xử lý
          </button>
        </div>
      )
    }

    return (
      <div className="expert-table-actions">
        <button type="button" className="view" onClick={() => navigate(`/processing-history/${row.id}`)}>
          Xem chi tiết
        </button>
      </div>
    )
  }

  return (
    <ExpertLayout activeLabel="Lịch sử xử lý">
      <section className="expert-page expert-history-page">
        <PageHeader
          title="Lịch sử xử lý"
          description="Tổng kết các lỗi bạn đã xử lý, kết luận đã chọn và đầu việc được tạo sau xử lý."
        />
        <StatsGrid
          stats={[
            { label: 'Lỗi đã xử lý', value: completedCount.toString(), icon: 'activity' },
            { label: 'Xử lý hôm nay', value: todayCount.toString(), tone: 'green', icon: 'check' },
            { label: 'Có đầu việc phát sinh', value: generatedTaskCount.toString(), tone: 'amber', icon: 'refresh' },
            { label: 'Bản nháp của tôi', value: draftCount.toString(), icon: 'save' },
          ]}
        />
        <div style={{ height: 18 }} />
        <Filters
          searchPlaceholder="Tìm kiếm lịch sử xử lý"
          filters={[
            {
              id: 'time',
              options: [
                { value: 'all', label: 'Thời gian tạo' },
                { value: 'today', label: 'Hôm nay' },
                { value: 'week', label: 'Tuần này' },
                { value: 'month', label: 'Tháng này' },
              ],
            },
            {
              id: 'action',
              options: [
                { value: 'all', label: 'Hành động xử lý' },
                { value: 'draft', label: 'Lưu bản nháp' },
                { value: 'complete', label: 'Hoàn tất xử lý' },
                { value: 'close', label: 'Đóng lỗi' },
              ],
            },
            {
              id: 'result',
              options: [
                { value: 'all', label: 'Kết quả' },
                { value: 'progress', label: 'Đang xử lý' },
                { value: 'done', label: 'Đã xử lý' },
                { value: 'not-error', label: 'Không phải lỗi' },
              ],
            },
            {
              id: 'errorId',
              options: [
                { value: 'all', label: 'Mã lỗi' },
                { value: 'newest', label: 'Lỗi mới nhất' },
                { value: 'generated', label: 'Có đầu việc phát sinh' },
              ],
            },
          ]}
        />
        <PaginatedTable
          rows={history}
          columns={[
            { header: 'Mã lịch sử', render: (row) => <strong>{row.id}</strong> },
            { header: 'Thời gian xử lý', render: (row) => row.time },
            { header: 'Mã lỗi', render: (row) => row.errorId },
            { header: 'Hội thoại gốc', render: (row) => findError(row.errorId)?.conversationId ?? 'Không có' },
            { header: 'Nhóm lỗi', render: (row) => findError(row.errorId)?.group ?? 'Khác' },
            { header: 'Loại lỗi', render: (row) => findError(row.errorId)?.type ?? 'Chưa xác định' },
            { header: 'Kết quả xử lý', render: (row) => <Badge label={getHistoryResultLabel(row.result)} plain /> },
            { header: 'Đầu việc phát sinh', render: (row) => renderGeneratedWork(row) },
            { header: 'Hành động', render: (row) => renderHistoryActions(row) },
          ]}
        />
      </section>
      {flashToast ? <Toast message={flashToast} /> : null}
    </ExpertLayout>
  )
}

export function ProcessingHistoryDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { history, errors, state } = useExpertWorkflowState()
  const historyRow = history.find((row) => row.id === id)
  const relatedError = historyRow ? errors.find((error) => error.id === historyRow.errorId) : undefined
  const scenario = getConversationScenario(relatedError?.conversationId)
  const generatedWork = historyRow ? getHistoryGeneratedWorkLabels(historyRow, state) : []
  const conclusions = historyRow ? getHistoryResolutionLabels(historyRow, state) : []
  const savedResolution = historyRow ? state.errorResolutions[historyRow.errorId] : undefined

  function openGeneratedWork(item: string) {
    if (!historyRow) return

    if (item.startsWith('Kho tri thức')) {
      navigate(`/knowledge/new?sourceErrorId=${historyRow.errorId}`)
      return
    }

    if (item.startsWith('Dữ liệu train')) {
      navigate(`/training-data/new?sourceErrorId=${historyRow.errorId}`)
    }
  }

  if (!historyRow) {
    return (
      <ExpertLayout activeLabel="Lịch sử xử lý">
        <section className="expert-page">
          <PageHeader
            title="Không tìm thấy lịch sử"
            description="Mục lịch sử này không còn tồn tại trong dữ liệu mẫu."
            action={<Button variant="secondary" onClick={() => navigate('/processing-history')}><Icon name="back" />Quay lại</Button>}
          />
        </section>
      </ExpertLayout>
    )
  }

  return (
    <ExpertLayout activeLabel="Lịch sử xử lý">
      <section className="expert-page expert-history-detail-page">
        <PageHeader
          title="Chi tiết lịch sử xử lý"
          description={`Mã lịch sử ${historyRow.id} - lỗi ${historyRow.errorId}.`}
          action={<Button variant="secondary" onClick={() => navigate('/processing-history')}><Icon name="back" />Quay lại</Button>}
        />
        <div className="expert-grid expert-history-detail-grid">
          <div className="expert-error-left-column">
            <section className="expert-card">
              <h2>Thông tin xử lý</h2>
              <div className="expert-error-meta-grid">
                <div><span>Mã lỗi</span><strong>{historyRow.errorId}</strong></div>
                <div><span>Thời gian xử lý</span><strong>{historyRow.time}</strong></div>
                <div><span>Nhóm lỗi</span><strong>{relatedError?.group ?? 'Khác'}</strong></div>
                <div><span>Loại lỗi</span><strong>{relatedError?.type ?? 'Chưa xác định'}</strong></div>
                <div><span>Kết quả</span><Badge label={getHistoryResultLabel(historyRow.result)} /></div>
                <div><span>Hội thoại gốc</span><strong>{relatedError?.conversationId ?? 'Không có'}</strong></div>
              </div>
              <div className="expert-review-note-box">
                <strong>Ghi chú rà soát ban đầu</strong>
                <span>{relatedError?.reviewNote ?? 'Không có ghi chú rà soát trong dữ liệu mẫu.'}</span>
              </div>
            </section>
            <section className="expert-card expert-error-chat-card">
              <h2>Đoạn hội thoại gốc</h2>
              <div className="expert-chat">
                {scenario.messages.map((message, index) => (
                  <div className={`expert-message ${message.role === 'bot-error' ? 'bot error' : message.role}`} key={`${message.role}-${index}`}>
                    {message.text}
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="expert-card expert-resolution-card">
            <h2>Kết luận đã lưu</h2>
            <div className="expert-history-conclusion-list">
              {conclusions.map((conclusion) => (
                <span key={conclusion}>{conclusion}</span>
              ))}
            </div>
            <div className="expert-review-note-box">
              <strong>Phản hồi/đề xuất sau xử lý</strong>
              <span>{savedResolution?.note || historyRow.note}</span>
            </div>
            <div className="expert-generated-work expert-history-generated-work">
              <strong>Đầu việc phát sinh</strong>
              {generatedWork.map((item) =>
                item === 'Không tạo đầu việc' ? (
                  <span key={item}>{item}</span>
                ) : (
                  <button type="button" key={item} onClick={() => openGeneratedWork(item)}>{item}</button>
                ),
              )}
            </div>
            <div className="expert-history-next-actions">
              {state.knowledgeTasks.some((task) => task.sourceErrorId === historyRow.errorId) ? (
                <Button variant="secondary" onClick={() => navigate('/knowledge')}><Icon name="book" />Xem kho tri thức</Button>
              ) : null}
              {state.trainingTasks.some((task) => task.sourceErrorId === historyRow.errorId) ? (
                <Button variant="secondary" onClick={() => navigate('/training-data')}><Icon name="bot" />Xem mẫu train</Button>
              ) : null}
              <Button onClick={() => navigate(`/errors/${historyRow.errorId}?from=history`)}><Icon name="eye" />Xem lỗi gốc</Button>
            </div>
          </section>
        </div>
      </section>
    </ExpertLayout>
  )
}

export function KnowledgeBasePage() {
  const navigate = useNavigate()
  const { knowledge } = useExpertWorkflowState()

  return (
    <ExpertLayout activeLabel="Kho tri thức y khoa">
      <section className="expert-page">
        <PageHeader
          title="Kho tri thức y khoa"
          description="Quản lý nguồn tri thức và quy tắc an toàn y tế cho chatbot."
          action={<Button onClick={() => navigate('/knowledge/new')}><Icon name="plus" />Thêm tri thức Y khoa</Button>}
        />
        <StatsGrid stats={[
          { label: 'Tổng mục tri thức', value: '1,024', icon: 'book' },
          { label: 'Chờ duyệt', value: '86', tone: 'amber', icon: 'clock' },
          { label: 'Đã duyệt', value: '876', tone: 'green', icon: 'check' },
          { label: 'Cần cập nhật', value: '62', tone: 'red', icon: 'refresh' },
        ]} />
        <div style={{ height: 18 }} />
        <Filters searchPlaceholder="Tìm kiếm tri thức" />
        <PaginatedTable
          rows={knowledge}
          columns={[
            { header: 'Chủ đề', render: (row) => <strong>{row.topic}</strong> },
            { header: 'Chuyên khoa', render: (row) => row.specialty },
            { header: 'Nguồn', render: (row) => row.source },
            { header: 'Trạng thái tri thức', render: (row) => <Badge label={row.status} /> },
            { header: 'Cập nhật cuối', render: (row) => row.updatedAt },
            { header: 'Hành động', render: (row) => <IconButton label="Sửa mục tri thức" icon="edit" onClick={() => navigate(`/knowledge/${row.id}/edit`)} /> },
          ]}
        />
      </section>
    </ExpertLayout>
  )
}

function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return <div className={`expert-field ${full ? 'full' : ''}`}><label>{label}</label>{children}</div>
}

export function KnowledgeFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: knowledgeId } = useParams()
  const { toast, showDraftToast } = useDraftToast()
  const { errors, state, knowledge } = useExpertWorkflowState()
  const sourceErrorId = new URLSearchParams(location.search).get('sourceErrorId')
  const sourceError = sourceErrorId ? errors.find((error) => error.id === sourceErrorId) : undefined
  const existingKnowledge = knowledgeId ? knowledge.find((row) => row.id === knowledgeId) : undefined
  const sourceDraft = sourceErrorId
    ? getErrorSourceDraft(sourceError, state.errorResolutions[sourceErrorId]?.note)
    : existingKnowledge
      ? {
          ...getBlankKnowledgeDraft(),
          topic: existingKnowledge.topic,
          specialty: existingKnowledge.specialty,
          source: existingKnowledge.source,
          status: existingKnowledge.status,
          updateType: existingKnowledge.status === 'Cần cập nhật' ? 'Cập nhật nội dung hiện có' : 'Bổ sung mới',
        }
      : getBlankKnowledgeDraft()

  return (
    <ExpertLayout activeLabel="Kho tri thức y khoa">
      <section className="expert-page expert-knowledge-form-page">
        <PageHeader
          title={knowledgeId ? 'Sửa tri thức Y khoa' : 'Thêm tri thức Y khoa'}
          description="Biên tập nội dung, cảnh báo an toàn và khuyến nghị trước khi gửi duyệt."
          action={<Button variant="secondary" onClick={() => navigate('/knowledge')}><Icon name="back" />Quay lại</Button>}
        />
        <section className="expert-card expert-knowledge-form-card">
          <div className="expert-form expert-form-grid">
            <Field label="Chủ đề"><input className="expert-input" defaultValue={sourceDraft.topic} /></Field>
            <Field label="Chuyên khoa"><input className="expert-input" defaultValue={sourceDraft.specialty} /></Field>
            <Field label="Loại cập nhật">
              <select className="expert-select" defaultValue={sourceDraft.updateType}>
                <option>Bổ sung mới</option>
                <option>Cập nhật nội dung hiện có</option>
                <option>Cập nhật từ lỗi đã xử lý</option>
              </select>
            </Field>
            <Field label="Nguồn tham khảo"><input className="expert-input" defaultValue={sourceDraft.source} /></Field>
            <Field label="Nội dung tri thức" full><textarea className="expert-textarea" defaultValue={sourceDraft.content} placeholder="Nhập nội dung tri thức, tiêu chí nhận diện, câu hỏi cần khai thác..." /></Field>
            <Field label="Quy tắc an toàn/cảnh báo" full><textarea className="expert-textarea" defaultValue={sourceDraft.warning} placeholder="Nhập dấu hiệu nguy cơ, giới hạn tư vấn, điều kiện chuyển bác sĩ/cấp cứu..." /></Field>
            <Field label="Ghi chú kiểm duyệt" full><textarea className="expert-textarea" defaultValue={sourceError ? `Tạo từ đầu việc phát sinh sau xử lý lỗi ${sourceError.id}.` : sourceDraft.reviewNote} placeholder="Nhập ghi chú cho người duyệt" /></Field>
          </div>
          <div className="expert-form-actions">
            <Button variant="secondary" onClick={() => navigate('/knowledge')}>Hủy</Button>
            <Button variant="secondary" onClick={showDraftToast}>Lưu nháp</Button>
            <Button onClick={() => navigate('/knowledge')}><Icon name="send" />Gửi duyệt</Button>
          </div>
        </section>
      </section>
      {toast ? <Toast message={toast} /> : null}
    </ExpertLayout>
  )
}

export function TrainingDataPage() {
  const navigate = useNavigate()
  const { training } = useExpertWorkflowState()

  return (
    <ExpertLayout activeLabel="Dữ liệu train chatbot">
      <section className="expert-page">
        <PageHeader
          title="Dữ liệu train chatbot"
          description="Quản lý mẫu hội thoại dùng để huấn luyện và cải thiện chatbot."
          action={<Button onClick={() => navigate('/training-data/new')}><Icon name="plus" />Thêm mẫu huấn luyện</Button>}
        />
        <StatsGrid stats={[
          { label: 'Tổng mẫu train', value: '2,458', icon: 'database' },
          { label: 'Chờ duyệt', value: '134', tone: 'amber', icon: 'clock' },
          { label: 'Đã đào tạo train', value: '2,102', tone: 'green', icon: 'bot' },
          { label: 'Từ dữ liệu góp', value: '756', icon: 'upload' },
        ]} />
        <div style={{ height: 18 }} />
        <Filters searchPlaceholder="Tìm kiếm mẫu train" />
        <PaginatedTable
          rows={training}
          columns={[
            { header: 'Câu người dùng', render: (row) => <strong>{row.userSentence}</strong> },
            { header: 'Intent động', render: (row) => row.intent },
            { header: 'Nhóm dữ liệu', render: (row) => row.group },
            { header: 'Phản hồi mong muốn', render: (row) => row.expectedResponse },
            { header: 'Trạng thái', render: (row) => <Badge label={row.status} /> },
            { header: 'Hành động', render: () => <IconButton label="Sửa mẫu huấn luyện" icon="edit" onClick={() => navigate('/training-data/new')} /> },
          ]}
        />
      </section>
    </ExpertLayout>
  )
}

export function TrainingFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast, showDraftToast } = useDraftToast()
  const { errors, state } = useExpertWorkflowState()
  const sourceErrorId = new URLSearchParams(location.search).get('sourceErrorId')
  const sourceError = sourceErrorId ? errors.find((error) => error.id === sourceErrorId) : undefined
  const sourceDraft = sourceErrorId
    ? getErrorSourceDraft(sourceError, state.errorResolutions[sourceErrorId]?.note)
    : getBlankTrainingDraft()

  return (
    <ExpertLayout activeLabel="Dữ liệu train chatbot">
      <section className="expert-page expert-training-form-page">
        <PageHeader
          title="Thêm mẫu huấn luyện"
          description="Tạo mẫu phản hồi mong muốn cho chatbot."
          action={<Button variant="secondary" onClick={() => navigate('/training-data')}><Icon name="back" />Quay lại</Button>}
        />
        <section className="expert-card expert-training-form-card">
          <div className="expert-form expert-form-grid">
            <Field label="Câu người dùng mẫu" full><input className="expert-input" defaultValue={sourceDraft.userSentence} /></Field>
            <Field label="Nhóm dữ liệu"><select className="expert-select" defaultValue={sourceDraft.trainingGroup}><option>Từ dữ liệu góp</option><option>Y tế an toàn</option><option>Nguy cơ cao</option><option>Từ lỗi đã xử lý</option><option>Từ lỗi kỹ thuật</option></select></Field>
            <Field label="Mức độ rủi ro"><select className="expert-select" defaultValue={sourceDraft.risk}><option>Cao</option><option>Trung bình</option><option>Thấp</option></select></Field>
            <Field label="Ngữ cảnh hội thoại" full><textarea className="expert-textarea" defaultValue={sourceDraft.conversationContext} /></Field>
            <Field label="Hành động mong muốn"><input className="expert-input" defaultValue={sourceDraft.expectedAction} /></Field>
            <Field label="Nguồn dữ liệu"><input className="expert-input" defaultValue={sourceDraft.source} /></Field>
            <Field label="Phản hồi mong muốn" full><textarea className="expert-textarea" defaultValue={sourceDraft.expectedResponse} /></Field>
            <Field label="Ghi chú"><input className="expert-input" defaultValue={sourceError ? `Tạo từ đầu việc phát sinh sau xử lý lỗi ${sourceError.id}.` : sourceDraft.note} placeholder="Nhập ghi chú" /></Field>
          </div>
          <div className="expert-form-actions">
            <Button variant="secondary" onClick={() => navigate('/training-data')}>Hủy</Button>
            <Button variant="secondary" onClick={showDraftToast}>Lưu nháp</Button>
            <Button onClick={() => navigate('/training-data')}><Icon name="send" />Gửi duyệt</Button>
          </div>
        </section>
      </section>
      {toast ? <Toast message={toast} /> : null}
    </ExpertLayout>
  )
}

export function ChatbotStatisticsPage() {
  return (
    <ExpertLayout activeLabel="Thống kê chatbot">
      <section className="expert-page">
        <PageHeader
          title="Thống kê chatbot"
          description="Phân tích hiệu suất, lỗi và các vấn đề thường gặp."
          action={<select className="expert-select expert-date-select"><option>30 ngày gần nhất</option><option>7 ngày gần nhất</option><option>Quý này</option></select>}
        />
        <StatsGrid five stats={[
          { label: 'Tổng hội thoại', value: '12,458', icon: 'message' },
          { label: 'Lỗi', value: '5.2%', tone: 'red', icon: 'alert' },
          { label: 'Phản hồi tiêu cực', value: '3.1%', tone: 'amber', icon: 'negative' },
          { label: 'Thời gian phản hồi TB', value: '1m 32s', icon: 'timer' },
          { label: 'Tỷ lệ chuyển bác sĩ', value: '8.7%', tone: 'green', icon: 'transfer' },
        ]} />
        <div className="expert-grid expert-dashboard-grid">
          <DonutChartCard title="Phân loại hội thoại" data={conversationTypeData} />
          <LineChartCard title="Số lượng lỗi theo thời gian" errorOnly />
          <section className="expert-card">
            <h2>Top vấn đề thường gặp</h2>
            <div className="expert-card-list">
              <div><strong>Đau bụng, tiêu chảy</strong>1,248 hội thoại</div>
              <div><strong>Dị ứng và phát ban</strong>986 hội thoại</div>
              <div><strong>Sốt kéo dài</strong>742 hội thoại</div>
            </div>
          </section>
          <section className="expert-card">
            <h2>Câu hỏi bị lỗi nhiều</h2>
            <div className="expert-card-list">
              <div><strong>Tôi có nên uống kháng sinh không?</strong>42 lỗi</div>
              <div><strong>Khó thở sau khi ăn hải sản thì sao?</strong>31 lỗi</div>
              <div><strong>Đau bụng dữ dội có nguy hiểm không?</strong>28 lỗi</div>
            </div>
          </section>
        </div>
      </section>
    </ExpertLayout>
  )
}
