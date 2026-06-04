import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import '../patients/PatientListTab.css'
import './LiveConsultationTab.css'

import { initialPatients } from '../patients/PatientListTab'

export type ChatMessage = {
  id: string
  sender: 'patient' | 'doctor' | 'system' | 'ai'
  text: string
}

export type ChatItem = {
  id: string
  name: string
  age: number
  time: string
  message: string
  isNew?: boolean
  status: 'new' | 'active' | 'ended'
  messages: ChatMessage[]
  aiExtract?: {
    symptoms: string
    history: string
    diagnosis: string
    severity: 'Khẩn cấp' | 'Cần khám' | 'Bình thường'
    vitals?: {
      bp?: string
      hr?: number
      temp?: number
      spo2?: number
    }
  }
}

type AiExtract = NonNullable<ChatItem['aiExtract']>

export const initialChats: ChatItem[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    age: 22,
    time: '10:30',
    message: 'AI sàng lọc: Đau đầu, chóng mặt và sốt nhẹ về chiều...',
    isNew: true,
    status: 'new',
    messages: [
      { 
        id: 'm1', 
        sender: 'patient', 
        text: 'Tư vấn trực tiếp với bác sĩ' 
      },
    ],
    aiExtract: {
      symptoms: 'Đau đầu, chóng mặt và sốt nhẹ về chiều diễn ra 3 ngày nay.',
      history: 'Không ghi nhận tiền sử bệnh lý mãn tính.',
      diagnosis: 'Theo dõi cơn đau đầu vận mạch / Sốt siêu vi đầu mùa.',
      severity: 'Cần khám',
      vitals: { bp: '120/80', hr: 82, temp: 37.8, spo2: 98 }
    }
  },
  {
    id: '4',
    name: 'Nguyễn Thị N',
    age: 29,
    time: '09:36',
    message: 'AI sàng lọc: Đau đầu âm ỉ kéo dài 3 ngày...',
    isNew: true,
    status: 'new',
    messages: [
      { 
        id: 'm1', 
        sender: 'patient', 
        text: 'Tư vấn trực tiếp với bác sĩ' 
      },
    ],
    aiExtract: {
      symptoms: 'Đau đầu âm ỉ kéo dài 3 ngày, mất ngủ, chóng mặt nhẹ.',
      history: 'Tăng huyết áp vô căn.',
      diagnosis: 'Cơn tăng huyết áp kịch phát / Đau đầu vận mạch.',
      severity: 'Cần khám',
      vitals: { bp: '145/95', hr: 88, temp: 36.6, spo2: 97 }
    }
  },
  {
    id: '2',
    name: 'Trần Thu Thảo',
    age: 28,
    time: '09:00',
    message: 'AI sàng lọc: Đau nhói vùng ngực bên trái...',
    isNew: true,
    status: 'new',
    messages: [
      { id: 'm1', sender: 'patient', text: 'Tư vấn trực tiếp với bác sĩ' }
    ],
    aiExtract: {
      symptoms: 'Đau nhói vùng ngực bên trái, đau lan ra sau vai và lưng.',
      history: 'Chưa có tiền sử bệnh lý tim mạch.',
      diagnosis: 'Theo dõi hội chứng vành cấp / Đau dây thần kinh liên sườn.',
      severity: 'Khẩn cấp',
      vitals: { bp: '110/70', hr: 104, temp: 36.8, spo2: 95 }
    }
  },
  {
    id: '5',
    name: 'Trần Thị B',
    age: 32,
    time: '09:15',
    message: 'Cảm ơn bác sĩ',
    status: 'ended',
    messages: [
      { id: 'm1', sender: 'patient', text: 'Xin chào bác sĩ.' },
      { id: 'm2', sender: 'doctor', text: 'Chào bạn, tôi có thể giúp gì cho bạn?' },
      { id: 'm3', sender: 'patient', text: 'Tôi đã uống thuốc theo đơn và thấy đỡ nhiều rồi.' },
      { id: 'm4', sender: 'doctor', text: 'Rất tốt, hãy tiếp tục theo dõi nhé.' },
      { id: 'm5', sender: 'patient', text: 'Cảm ơn bác sĩ' },
    ]
  },
  {
    id: '6',
    name: 'Nguyễn Hoàng G',
    age: 34,
    time: '14:30',
    message: 'AI sàng lọc: Hắt hơi liên tục, ngứa mũi...',
    isNew: true,
    status: 'new',
    messages: [
      { 
        id: 'm1', 
        sender: 'patient', 
        text: 'Tư vấn trực tiếp với bác sĩ' 
      },
    ],
    aiExtract: {
      symptoms: 'Hắt hơi liên tục, ngứa mũi dị ứng nhiều khi tiếp xúc phấn hoa.',
      history: 'Dị ứng phấn hoa mạn tính.',
      diagnosis: 'Viêm mũi dị ứng do tác nhân ngoại cảnh.',
      severity: 'Bình thường',
      vitals: { bp: '118/75', hr: 76, temp: 36.5, spo2: 99 }
    }
  },
  {
    id: '9',
    name: 'Lê Hoàng Nam',
    age: 45,
    time: '17:00',
    message: 'AI sàng lọc: Tư vấn tái khám định kỳ...',
    isNew: true,
    status: 'new',
    messages: [
      { 
        id: 'm1', 
        sender: 'patient', 
        text: 'Tư vấn trực tiếp với bác sĩ' 
      },
    ],
    aiExtract: {
      symptoms: 'Tư vấn tái khám định kỳ bệnh mãn tính.',
      history: 'Tăng huyết áp, đái tháo đường type 2.',
      diagnosis: 'Tái khám định kỳ tăng huyết áp và đái tháo đường.',
      severity: 'Bình thường',
      vitals: { bp: '135/85', hr: 72, temp: 36.7, spo2: 98 }
    }
  },
  {
    id: '3',
    name: 'Lê Văn C',
    age: 50,
    time: 'Hôm qua',
    message: 'Triệu chứng đã giảm',
    status: 'ended',
    messages: [
      { id: 'm1', sender: 'patient', text: 'Triệu chứng đã giảm' },
    ]
  },
]

export function LiveConsultationTab({ 
  onBackToDashboard,
  onViewPatientProfile,
  initialActiveChatId,
  onClearActiveChat,
  chats: propChats,
  setChats: propSetChats
}: { 
  onBackToDashboard?: () => void;
  onViewPatientProfile?: (patientId: string, encounterDate?: string) => void;
  initialActiveChatId?: string | null;
  onClearActiveChat?: () => void;
  chats?: ChatItem[];
  setChats?: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}) {
  const [internalChats, setInternalChats] = useState<ChatItem[]>(initialChats)
  const chats = propChats !== undefined ? propChats : internalChats
  const setChats = propSetChats !== undefined ? propSetChats : setInternalChats

  const [activeChatId, setActiveChatId] = useState<string | null>(initialActiveChatId || null)
  const [activeFilter, setActiveFilter] = useState<'pending' | 'history'>('pending')
  const [showChatbotSummaryModal, setShowChatbotSummaryModal] = useState(false)

  useEffect(() => {
    if (initialActiveChatId) {
      setActiveChatId(initialActiveChatId)
    }
  }, [initialActiveChatId])

  const pendingCount = chats.filter(c => c.status === 'new').length

  const filteredChats = chats.filter(c => {
    if (activeFilter === 'pending') {
      return c.status === 'new'
    }
    if (activeFilter === 'history') {
      return c.status === 'active' || c.status === 'ended'
    }
    return true
  })
  const [inputMessage, setInputMessage] = useState('')
  const inputTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastInfo, setToastInfo] = useState<{ day: number; time: string } | null>(null)
  const [selectedHistoryChat, setSelectedHistoryChat] = useState<{
    date: string;
    title: string;
    patientName: string;
    messages: { sender: 'patient' | 'doctor'; text: string; time: string }[];
  } | null>(null)
  const [noteDraft, setNoteDraft] = useState({
    symptoms: '',
    assessment: '',
    guidance: '',
  })
  const [savedNoteAt, setSavedNoteAt] = useState<string | null>(null)

  const activeChat = chats.find(c => c.id === activeChatId)
  const isChatActiveMode = activeChat && activeChat.status === 'active'

  const matchingPatient = activeChat ? initialPatients.find(p => p.id === activeChat.id || p.name === activeChat.name) : null
  const pastEncounters = matchingPatient?.pastEncounters || []

  const getSeverityClass = (severity: AiExtract['severity']) => {
    if (severity === 'Khẩn cấp') return 'urgent'
    if (severity === 'Cần khám') return 'warning'
    return 'normal'
  }

  const getHandoffReason = (extract: AiExtract) => {
    if (extract.severity === 'Khẩn cấp') {
      return 'Chatbot phát hiện dấu hiệu nguy cơ cao trong cuộc trò chuyện, cần bác sĩ kiểm tra ngay trước khi tiếp tục tư vấn.'
    }
    if (extract.severity === 'Cần khám') {
      return 'Triệu chứng kéo dài hoặc có yếu tố cần khai thác thêm, chatbot chuyển tiếp để bác sĩ xác nhận hướng xử trí.'
    }
    return 'Chatbot chuyển tiếp để bác sĩ xác nhận lại thông tin và đưa ra dặn dò phù hợp.'
  }

  const getFollowUpQuestions = (extract: AiExtract) => {
    const text = `${extract.symptoms} ${extract.diagnosis}`.toLowerCase()
    if (extract.severity === 'Khẩn cấp' || text.includes('ngực') || text.includes('vành')) {
      return [
        'Đau có lan ra tay trái, hàm, vai hoặc lưng không?',
        'Có khó thở, vã mồ hôi, ngất hoặc tím tái không?',
        'Cơn đau kéo dài bao lâu và có tăng khi gắng sức không?'
      ]
    }
    if (text.includes('đau đầu') || text.includes('huyết áp')) {
      return [
        'Đau đầu có tăng dần, nôn ói, nhìn mờ hoặc yếu liệt không?',
        'Huyết áp gần nhất đo lúc nào và có dùng thuốc đều không?',
        'Có sốt cao liên tục, co giật hoặc chấn thương đầu gần đây không?'
      ]
    }
    return [
      'Triệu chứng bắt đầu từ khi nào và yếu tố nào làm nặng hơn?',
      'Bệnh nhân đã dùng thuốc gì trước khi nhắn với chatbot?',
      'Có dấu hiệu mới xuất hiện sau khi chatbot sàng lọc không?'
    ]
  }

  const getTriageSuggestion = (extract: AiExtract) => {
    if (extract.severity === 'Khẩn cấp') {
      return 'Ưu tiên hỏi dấu hiệu đỏ và cân nhắc hướng dẫn đến cấp cứu nếu triệu chứng đang diễn tiến.'
    }
    if (extract.severity === 'Cần khám') {
      return 'Tiếp tục khai thác triệu chứng, xác nhận chẩn đoán sơ bộ rồi quyết định tư vấn, kê đơn hoặc hẹn tái khám.'
    }
    return 'Có thể tư vấn theo dõi tại nhà, dặn dấu hiệu cần quay lại và hẹn đánh giá lại nếu triệu chứng kéo dài.'
  }

  // Dynamic autocomplete phrase suggester ("mớm câu" logic with 20 premium medical prefix triggers)
  const getAutocompleteSuggestions = (text: string): string[] => {
    const query = text.toLowerCase().trim();
    if (!query) return [];

    // Comprehensive category mapping dictionary with 20 high-fidelity sets
    const suggestionsDb: Record<string, string[]> = {
      'hãy': ['đặt lịch tái khám trực tiếp', 'theo dõi sức khỏe tại nhà', 'hạn chế vận động mạnh'],
      'bạn': ['nên uống thuốc đúng giờ', 'cần tránh ăn đồ dầu mỡ', 'nên tái khám sau 7 ngày'],
      'yêu': ['cầu làm xét nghiệm máu tổng quát', 'cầu chụp X-quang phổi thẳng', 'cầu làm điện tâm đồ (ECG)'],
      'kê': ['đơn thuốc điều trị dạ dày', 'toa thuốc hạ sốt giảm đau', 'đơn kháng sinh điều trị viêm họng'],
      'triệu': ['chứng này có xuất hiện thường xuyên không?', 'chứng đau ngực có lan ra vai không?', 'chứng sốt xuất hiện từ khi nào?'],
      'kết': ['quả xét nghiệm của bạn hoàn toàn bình thường', 'quả siêu âm cho thấy có viêm nhẹ', 'quả chụp X-quang không có tổn thương'],
      'huyết': ['áp của bạn hiện tại hơi cao', 'áp cần được đo đều đặn mỗi sáng', 'áp tâm thu đạt mức bình thường'],
      'uống': ['thuốc sau khi ăn no 30 phút', 'nhiều nước lọc (tối thiểu 2 lít/ngày)', 'thuốc đều đặn và không tự ý ngắt quãng'],
      'tránh': ['các thực phẩm cay nóng, kích thích', 'thức khuya và làm việc quá sức', 'uống rượu bia trong thời gian điều trị'],
      'tái': ['khám ngay nếu có dấu hiệu khó thở', 'khám định kỳ sau khi uống hết thuốc', 'khám tại phòng khám Nội 102'],
      'theo': ['dõi nhiệt độ cơ thể mỗi 4 tiếng', 'dõi chỉ số đường huyết trước ăn sáng', 'dõi cơn đau và báo lại bác sĩ'],
      'chế': ['độ ăn uống cần giảm muối và đường', 'độ sinh hoạt lành mạnh, tập thể dục nhẹ', 'độ nghỉ ngơi hoàn toàn trong 3 ngày tới'],
      'thuốc': ['này uống 2 lần mỗi ngày (sáng/tối)', 'kháng sinh cần uống đủ liều 5 ngày', 'xịt mũi dùng tối đa 3 lần/ngày'],
      'đau': ['ngực có đi kèm cảm giác khó thở không?', 'đầu nhiều vào buổi sáng hay buổi tối?', 'bụng âm ỉ hay đau quặn từng cơn?'],
      'khám': ['lâm sàng cho thấy nhịp tim đều', 'lại sau khi hoàn thành liệu trình thuốc', 'chuyên khoa tim mạch để kiểm tra sâu'],
      'ăn': ['nhiều rau xanh và trái cây tươi', 'chín uống sôi, đảm bảo vệ sinh', 'các món mềm, dễ tiêu hóa như cháo, súp'],
      'nghỉ': ['ngơi tĩnh dưỡng tại nhà', 'ngơi và tránh stress, lo âu', 'ngơi hoàn toàn tại giường'],
      'giảm': ['áp lực công việc và thư giãn đầu óc', 'lượng tinh bột và chất béo bão hòa', 'liều lượng thuốc nếu triệu chứng thuyên giảm'],
      'nhịp': ['tim của bạn hiện tại hơi nhanh', 'thở đều và phổi thông khí tốt', 'tim ổn định ở mức 75 chu kỳ/phút'],
      'chỉ': ['số đường huyết cần được kiểm soát tốt', 'số SpO2 đạt mức an toàn 98%', 'số xét nghiệm mỡ máu hơi cao']
    };

    // 1. Direct matched triggers (e.g. typing "hãy" or "hãy ")
    for (const key of Object.keys(suggestionsDb)) {
      if (query === key || text.toLowerCase().startsWith(key + ' ')) {
        return suggestionsDb[key];
      }
    }

    // 2. Partial prefix word matching (e.g. typing "h" matches "Hãy đặt lịch khám", etc.)
    const matches: string[] = [];
    const keywords = Object.keys(suggestionsDb);
    for (const key of keywords) {
      if (key.startsWith(query)) {
        // Generate complete phrases for quick autocompletion
        suggestionsDb[key].forEach(val => {
          const capitalizedKey = key[0].toUpperCase() + key.slice(1);
          matches.push(`${capitalizedKey} ${val}`);
        });
      }
    }

    // Limit to top 3 best matches to keep UI clean and prevent overflow
    return matches.slice(0, 3);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const currentText = inputMessage;
    const currentLower = currentText.toLowerCase().trim();
    
    if (suggestion.toLowerCase().startsWith(currentLower)) {
      // Capitalize first letter if the original typed message had it capitalized
      const capitalizedSug = currentText && currentText[0] === currentText[0].toUpperCase()
        ? suggestion[0].toUpperCase() + suggestion.slice(1)
        : suggestion;
      setInputMessage(capitalizedSug);
    } else {
      const spacer = currentText.endsWith(' ') ? '' : ' ';
      setInputMessage(currentText + spacer + suggestion);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section)
  }

  useEffect(() => {
    setNoteDraft({
      symptoms: '',
      assessment: '',
      guidance: '',
    })
    setSavedNoteAt(null)
    setExpandedSection(null)
    setShowChatbotSummaryModal(false)
  }, [activeChatId])

  useEffect(() => {
    const textarea = inputTextareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 104)}px`
  }, [inputMessage])

  useEffect(() => {
    if (!activeChat) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeChat?.messages.length, activeChat?.status, inputMessage])

  const startConsultation = (chatId: string) => {
    let preparedMessage = ''

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        const handoffMessages: ChatMessage[] = c.aiExtract ? [
          {
            id: 'handoff-system',
            sender: 'system',
            text: `Chatbot đã chuyển cuộc trò chuyện đến bác sĩ Nguyễn Minh Anh lúc ${c.time}.`,
          },
          {
            id: 'handoff-ai-summary',
            sender: 'ai',
            text: `AI sàng lọc: ${c.aiExtract.symptoms} Mức độ: ${c.aiExtract.severity}.`,
          },
        ] : []
        preparedMessage = `Tôi là bác sĩ Nguyễn Minh Anh, tôi đã tiếp nhận ca tư vấn triệu chứng ${c.aiExtract?.symptoms || c.message} từ Chatbot. Để xác nhận lại, bác có thể mô tả rõ hơn thời điểm xuất hiện triệu chứng và mức độ hiện tại được không?`

        return { 
          ...c, 
          status: 'active', 
          isNew: false,
          messages: [
            ...c.messages,
            ...handoffMessages,
          ]
        }
      }
      return c
    }))

    setInputMessage(preparedMessage)
  }

  const endConsultation = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, status: 'ended' } : c))
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !activeChatId) return
    const sentText = inputMessage.trim()
    const currentChat = chats.find(chat => chat.id === activeChatId)
    const doctorMessageCount = currentChat?.messages.filter(msg => msg.sender === 'doctor').length ?? 0
    const demoReplies = [
      'Dạ triệu chứng bắt đầu khoảng 3 ngày trước. Hiện tại tôi vẫn thấy khá mệt và khó chịu, nhất là về chiều.',
      'Dạ tôi chưa dùng thuốc gì ngoài uống nhiều nước. Tôi không thấy khó thở, nhưng hạn chế vận động vì sợ tình trạng nặng hơn.',
    ]
    const doctorSuggestions = [
      'Bác tiếp tục theo dõi nhiệt độ, uống đủ nước và nghỉ ngơi. Nếu sốt cao, đau tăng hoặc xuất hiện khó thở thì cần đi khám ngay. Tôi sẽ hướng dẫn thêm một số dấu hiệu cần theo dõi.',
      'Tôi ghi nhận thông tin của bác. Hiện tại bác nên đặt lịch khám sớm để bác sĩ kiểm tra trực tiếp; trong thời gian chờ khám, tránh tự dùng thuốc nếu chưa có chỉ định.',
    ]

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        const newMsg: ChatMessage = {
          id: `m-${Date.now()}`,
          sender: 'doctor',
          text: sentText
        }
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          message: inputMessage.trim()
        }
      }
      return chat
    }))
    setInputMessage('')

    if (doctorMessageCount < demoReplies.length) {
      window.setTimeout(() => {
        setChats(prev => prev.map(chat => {
          if (chat.id !== activeChatId) return chat
          const patientReply: ChatMessage = {
            id: `p-${Date.now()}`,
            sender: 'patient',
            text: demoReplies[doctorMessageCount],
          }
          return {
            ...chat,
            messages: [...chat.messages, patientReply],
            message: patientReply.text,
          }
        }))
        setInputMessage(doctorSuggestions[doctorMessageCount] || '')
      }, 1000)
    }
  }

  const handleSaveNote = () => {
    if (!noteDraft.symptoms.trim() && !noteDraft.assessment.trim() && !noteDraft.guidance.trim()) {
      return
    }

    const timeLabel = new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())

    setSavedNoteAt(timeLabel)
  }

  return (
    <div className={`consultation-tab-outer ${isChatActiveMode ? 'active-chat-mode' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: '0' }}>
      {!isChatActiveMode && (
        <header className="patient-tab-header" style={{ padding: '24px 24px 0 24px', flexShrink: 0 }}>
          <div className="tab-titles">
            <h1>Danh sách tư vấn</h1>
            <p>Trang theo dõi và tư vấn sức khỏe trực tuyến cho bệnh nhân.</p>
          </div>
        </header>
      )}
      <div className={`consultation-tab-container ${isChatActiveMode ? 'active-chat-mode' : ''}`} style={{ flex: 1, minHeight: 0, marginTop: !isChatActiveMode ? '16px' : 0 }}>
        {/* Left Pane: Chat List (Hidden in active chat mode) */}
        {!isChatActiveMode && (
          <div className="consultation-sidebar-pane">
            <h2 className="consultation-title" style={{ display: 'none' }}>Danh sách tư vấn</h2>
            
            {/* Real-world Care Team Consultation Sub-tabs */}
            <div className="consultation-tab-filters">
              <button 
                type="button"
                className={`consultation-filter-btn ${activeFilter === 'history' ? 'active' : ''}`}
                onClick={() => setActiveFilter('history')}
              >
                Đã phản hồi
              </button>
              <button 
                type="button"
                className={`consultation-filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveFilter('pending')}
              >
                Chưa phản hồi
                {pendingCount > 0 && <span className="filter-badge">{pendingCount}</span>}
              </button>
            </div>

            <div className="consultation-list">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const isActive = chat.id === activeChatId
                  return (
                    <div 
                      key={chat.id} 
                      className={`consultation-card ${isActive ? 'active' : ''} ${chat.isNew ? 'unread' : ''}`}
                      onClick={() => { 
                        setActiveChatId(chat.id); 
                        onClearActiveChat?.(); 
                        setChats(prev => prev.map(c => c.id === chat.id ? { ...c, isNew: false } : c));
                      }}
                    >
                      <div className="consultation-card-avatar" style={{ display: 'grid', placeItems: 'center', backgroundColor: '#E6EFFE', color: '#244a6b', border: '1px solid rgba(36, 74, 107, 0.12)' }}>
                        <svg viewBox="0 0 24 24" style={{ width: '58%', height: '58%', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' }}>
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                        </svg>
                      </div>
                      <div className="consultation-card-content">
                        <div className="consultation-card-header">
                          <span className="consultation-card-name">{chat.name}</span>
                          <span className="consultation-card-time">{chat.time}</span>
                        </div>
                        <div className="consultation-card-message-row">
                          <div className="consultation-card-message">
                            {chat.aiExtract ? `AI sàng lọc: ${chat.aiExtract.symptoms}` : chat.message}
                          </div>
                          {chat.isNew && (
                            <span className="consultation-card-unread-dot"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '36px 12px', color: '#718096', fontSize: '13px', fontWeight: 500 }}>
                  Không có tin nhắn nào trong mục này
                </div>
              )}
            </div>
          </div>
        )}

      {/* Right Pane: Chat Area or Empty State */}
      <div className="consultation-main-pane">
        {activeChat ? (
          <div className="active-chat-state" style={{ position: 'relative' }}>
            {/* Success Toast Notification */}
            {showToast && toastInfo && (
              <div className="booking-toast-notification">
                <div className="toast-left-content">
                  <div className="toast-check-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="toast-text-group">
                    <span className="toast-main-msg">Đặt lịch thành công!</span>
                    <span className="toast-sub-msg">Lịch khám: {toastInfo.day < 10 ? `0${toastInfo.day}` : toastInfo.day}/05/2026 lúc {toastInfo.time}</span>
                  </div>
                </div>
                <button className="toast-dismiss-btn" onClick={() => setShowToast(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {/* Chat Header Card */}
            <div className="chat-header-card">
              <div className="chat-header-info">
                {activeChat.status === 'active' && (
                  <button className="back-to-list-btn" onClick={() => { setActiveChatId(null); onClearActiveChat?.(); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </button>
                )}
                <div className="chat-header-avatar" style={{ display: 'grid', placeItems: 'center', backgroundColor: '#E6EFFE', color: '#244a6b', border: '1px solid rgba(36, 74, 107, 0.12)' }}>
                  <svg viewBox="0 0 24 24" style={{ width: '58%', height: '58%', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' }}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                  </svg>
                </div>
                <div className="chat-header-details">
                  <h3>{activeChat.name}</h3>
                  <p>{activeChat.age} tuổi</p>
                </div>
              </div>
              {activeChat.status === 'active' ? (
                <div className="chat-header-actions">
                  {activeChat.aiExtract && (
                    <button className="chatbot-summary-header-btn" type="button" onClick={() => setShowChatbotSummaryModal(true)}>
                      Xem tóm tắt Chatbot
                    </button>
                  )}
                  <button className="end-consultation-btn" onClick={() => endConsultation(activeChat.id)}>
                    Kết thúc tư vấn
                  </button>
                </div>
              ) : activeChat.status !== 'new' ? (
                <button 
                  className="view-record-btn"
                  onClick={() => onViewPatientProfile?.(activeChat.id)}
                >
                  Xem hồ sơ bệnh án
                </button>
              ) : null}
            </div>

            {/* Chat Messages */}
            <div className="chat-messages-area">
              {activeChat.status === 'new' && activeChat.aiExtract ? (
                <div className={`preconsult-ai-summary severity-${getSeverityClass(activeChat.aiExtract.severity)}`}>
                  <div className="preconsult-ai-label">AI tóm tắt trước tư vấn</div>
                  <p>{activeChat.aiExtract.symptoms}</p>
                  <div className="preconsult-ai-meta">
                    <span>{activeChat.aiExtract.severity}</span>
                    <span>{activeChat.aiExtract.diagnosis}</span>
                  </div>
                </div>
              ) : (
                activeChat.messages.map(msg => {
                  const severityClass = (msg.sender === 'ai' && activeChat.aiExtract) 
                    ? `severity-${getSeverityClass(activeChat.aiExtract.severity)}` 
                    : '';
                  return (
                    <div key={msg.id} className={`chat-message-row ${msg.sender} ${severityClass}`}>
                      <div className="chat-message-bubble">
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Actions tag above input (Only when active and has autocomplete suggestions) */}
            {activeChat.status === 'active' && (
              <div className="chat-action-tags" style={{ minHeight: '36px', display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '8px' }}>
                {getAutocompleteSuggestions(inputMessage).map((sug, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    className="action-tag-btn autocompleted-tag"
                    onClick={() => handleSelectSuggestion(sug)}
                    style={{ border: '1px solid #3B82F6', color: '#3B82F6', background: '#F0F6FF', fontWeight: 600 }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Footer */}
            {activeChat.status === 'new' && (
              <div className="chat-footer-new">
                <button 
                  className="start-consultation-btn"
                  onClick={() => startConsultation(activeChat.id)}
                >
                  Bắt đầu tư vấn
                </button>
              </div>
            )}

            {activeChat.status === 'active' && (
              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <div className="chat-input-pill-wrapper">
                  <button type="button" className="input-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                  </button>
                  <button type="button" className="input-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                  </button>
                  <button type="button" className="input-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
                  </button>
                  <textarea
                    ref={inputTextareaRef}
                    rows={1}
                    placeholder="VD: Bác mô tả thêm thời điểm đau và mức độ đau giúp tôi..." 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button type="submit" className="send-msg-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {activeChat.status === 'ended' && (
              <div className="chat-footer-ended">
                <div className="ended-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Đã kết thúc tư vấn
                </div>
                <p>Cuộc tư vấn này đã kết thúc. Bạn chỉ có thể xem lại nội dung tư vấn.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-chat-state">
            <div className="empty-avatar-circle"></div>
            <p>Chọn cuộc hội thoại để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Left Pane / Clinical Workspace Sidebar (Only shown in active chat mode) */}
      {isChatActiveMode && (
        <div className="clinical-workspace-sidebar">
          {/* Thông tin y tế */}
          <div className={`workspace-accordion-section ${expandedSection === 'medical-info' ? 'expanded' : ''}`}>
            <div className="workspace-accordion-header" onClick={() => toggleSection('medical-info')}>
              <span className="section-title-wrapper medical-info-theme">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Thông tin y tế
              </span>
              <svg className={`chevron-icon ${expandedSection === 'medical-info' ? 'rotate-up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {expandedSection === 'medical-info' && (
              <div className="workspace-accordion-content">
                {matchingPatient ? (
                  <>
                    <div className="info-item-card">
                      <span className="info-item-label">Nhóm máu</span>
                      <span className="info-item-value">{matchingPatient.bloodType || 'Chưa khai báo'}</span>
                    </div>
                    <div className="info-item-card">
                      <span className="info-item-label">Dị ứng</span>
                      <span className="info-item-value">{matchingPatient.allergies?.length ? matchingPatient.allergies.join(', ') : 'Chưa ghi nhận dị ứng'}</span>
                    </div>
                    <div className="info-item-card">
                      <span className="info-item-label">Số điện thoại</span>
                      <span className="info-item-value">{matchingPatient.phone || 'Chưa khai báo'}</span>
                    </div>
                  </>
                ) : (
                  <div className="info-item-card empty-data-card">
                    <span className="info-item-value">Không có dữ liệu</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Tiền sử bệnh */}
          <div className={`workspace-accordion-section ${expandedSection === 'medical-history' ? 'expanded' : ''}`}>
            <div className="workspace-accordion-header" onClick={() => toggleSection('medical-history')}>
              <span className="section-title-wrapper history-theme">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Tiền sử bệnh
              </span>
              <svg className={`chevron-icon ${expandedSection === 'medical-history' ? 'rotate-up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {expandedSection === 'medical-history' && (
              <div className="workspace-accordion-content scrollable-content">
                {activeChat.aiExtract?.history ? (
                  <div className="info-item-card">
                    <span className="info-item-value">{activeChat.aiExtract.history}</span>
                    <span className="info-item-label">Nguồn: Chatbot sàng lọc</span>
                  </div>
                ) : (
                  <div className="info-item-card empty-data-card">
                    <span className="info-item-value">Không có dữ liệu</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Lịch sử khám bệnh */}
          <div className={`workspace-accordion-section ${expandedSection === 'visit-history' ? 'expanded' : ''}`}>
            <div className="workspace-accordion-header" onClick={() => toggleSection('visit-history')}>
              <span className="section-title-wrapper exam-theme">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Lịch sử khám bệnh
              </span>
              <svg className={`chevron-icon ${expandedSection === 'visit-history' ? 'rotate-up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {expandedSection === 'visit-history' && (
              <div className="workspace-accordion-content scrollable-content">
                {pastEncounters.map((enc, idx) => (
                  <div 
                    key={idx}
                    className="info-item-card clickable-history-card"
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onClick={() => {
                      if (matchingPatient) {
                        onViewPatientProfile?.(matchingPatient.id, enc.date);
                      }
                    }}
                  >
                    <span className="info-item-value" style={{ color: '#2563EB', fontWeight: 700 }}>{enc.date}</span>
                    <span className="info-item-label" style={{ fontWeight: 600 }}>{enc.diagnosis}</span>
                  </div>
                ))}
                {pastEncounters.length === 0 && (
                  <div className="info-item-card" style={{ opacity: 0.7 }}>
                    <span className="info-item-label">Chưa ghi nhận lịch sử khám bệnh.</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Lịch sử tư vấn */}
          <div className={`workspace-accordion-section ${expandedSection === 'consultation-history' ? 'expanded' : ''}`}>
            <div className="workspace-accordion-header" onClick={() => toggleSection('consultation-history')}>
              <span className="section-title-wrapper consult-theme">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                Lịch sử tư vấn
              </span>
              <svg className={`chevron-icon ${expandedSection === 'consultation-history' ? 'rotate-up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {expandedSection === 'consultation-history' && (
              <div className="workspace-accordion-content scrollable-content">
                <div 
                  className="info-item-card clickable-history-card"
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease', 
                    background: '#F0F6FF', 
                    border: '1px dashed #3B82F6' 
                  }}
                  onClick={() => {
                    setSelectedHistoryChat({
                      date: '01/05/2026',
                      title: 'Tư vấn về triệu chứng đau ngực',
                      patientName: activeChat?.name || 'Nguyễn Văn A',
                      messages: [
                        { sender: 'patient', text: 'Bác sĩ ơi, dạo này tôi hay bị nhói đau ở vùng ngực bên trái, thỉnh thoảng lan ra sau lưng. Rất lo lắng không biết có phải bị tim không ạ?', time: '10:00' },
                        { sender: 'doctor', text: 'Chào bác. Cơn đau ngực của bác xuất hiện khi nào? Có kèm theo khó thở hay vã mồ hôi không?', time: '10:02' },
                        { sender: 'patient', text: 'Dạ đau chủ yếu sau khi ăn no hoặc khi nằm xuống. Không có vã mồ hôi hay khó thở bác sĩ ạ. Chỉ thấy hơi ợ chua và nóng rát ở cổ.', time: '10:05' },
                        { sender: 'doctor', text: 'Triệu chứng của bác nghĩ nhiều đến trào ngược dạ dày thực quản (GERD). Tuy nhiên bác vẫn nên đi đo điện tâm đồ (ECG) sớm để loại trừ bệnh tim mạch nhé.', time: '10:07' },
                        { sender: 'patient', text: 'Dạ vâng cảm ơn bác sĩ nhiều lắm, tôi nghe bác sĩ tư vấn vậy cũng yên tâm hơn nhiều rồi ạ. Tôi sẽ đi làm ECG sớm ạ.', time: '10:10' }
                      ]
                    });
                  }}
                >
                  <span className="info-item-value" style={{ color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    01/05/2026
                    <span style={{ fontSize: '10px', background: '#3B82F6', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>XEM LẠI</span>
                  </span>
                  <span className="info-item-label" style={{ fontWeight: 600, color: '#4B5563' }}>Tư vấn về triệu chứng đau ngực</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Ghi chú */}
          <div className={`workspace-accordion-section notes-section ${expandedSection === 'notes' ? 'expanded' : ''}`}>
            <div className="workspace-accordion-header" onClick={() => toggleSection('notes')}>
              <span className="section-title-wrapper notes-theme">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Ghi chú tư vấn
              </span>
              <svg className={`chevron-icon ${expandedSection === 'notes' ? 'rotate-up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {expandedSection === 'notes' && (
              <div className="workspace-accordion-content notes-content-wrapper">
                <div className="note-input-group">
                  <label className="note-input-label">Triệu chứng bệnh nhân mô tả</label>
                  <textarea
                    className="note-textarea"
                    placeholder="Nhập triệu chứng chính"
                    rows={2}
                    value={noteDraft.symptoms}
                    onChange={(e) => setNoteDraft(prev => ({ ...prev, symptoms: e.target.value }))}
                  />
                </div>
                <div className="note-input-group">
                  <label className="note-input-label">Nhận định sơ bộ</label>
                  <textarea
                    className="note-textarea"
                    placeholder="Nhập nhận định sơ bộ"
                    rows={2}
                    value={noteDraft.assessment}
                    onChange={(e) => setNoteDraft(prev => ({ ...prev, assessment: e.target.value }))}
                  />
                </div>
                <div className="note-input-group">
                  <label className="note-input-label">Dặn dò / hướng xử lý</label>
                  <textarea
                    className="note-textarea"
                    placeholder="Nhập dặn dò hoặc hướng xử lý"
                    rows={2}
                    value={noteDraft.guidance}
                    onChange={(e) => setNoteDraft(prev => ({ ...prev, guidance: e.target.value }))}
                  />
                </div>
                <div className="note-footer-bar">
                  {savedNoteAt && (
                    <div className="note-save-status">
                      Đã lưu nội bộ lúc {savedNoteAt}
                    </div>
                  )}
                  <button
                    type="button"
                    className="save-note-btn"
                    onClick={handleSaveNote}
                    disabled={!noteDraft.symptoms.trim() && !noteDraft.assessment.trim() && !noteDraft.guidance.trim()}
                  >
                    Lưu ghi chú tư vấn
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      )}

      {/* Select Schedule Appointment Modal Popup */}
      {isModalOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="appointment-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chọn lịch khám</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="modal-body">
              <h3 className="month-indicator">Tháng 5, 2026</h3>
              
              {/* Calendar Grid */}
              <div className="modal-calendar-grid">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                  <div key={d} className="modal-calendar-day-header">{d}</div>
                ))}
                {/* Pad empty days for May 2026 (Starts on Friday, which is index 5) */}
                {Array(5).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="modal-calendar-day empty"></div>
                ))}
                {/* Days 1 to 30 */}
                {Array(30).fill(null).map((_, i) => {
                  const day = i + 1
                  const availableDays = [15, 16, 19, 20, 22, 23]
                  const isAvailable = availableDays.includes(day)
                  const isSelected = selectedDay === day
                  
                  return (
                    <button 
                      key={`day-${day}`}
                      className={`modal-calendar-day ${isAvailable ? 'available' : 'disabled'} ${isSelected ? 'selected' : ''}`}
                      disabled={!isAvailable}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              
              {/* Available hours section */}
              <div className="time-slots-section">
                <h4>Khung giờ khả dụng</h4>
                <div className="time-slots-grid">
                  {['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'].map(time => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Confirm Booking Action Button */}
              <button 
                className={`confirm-booking-btn ${selectedDay && selectedTime ? 'ready' : ''}`}
                disabled={!selectedDay || !selectedTime}
                onClick={() => {
                  setIsModalOpen(false)
                  // End consultation
                  setChats(prev => prev.map(c => c.id === activeChatId ? { 
                    ...c, 
                    status: 'ended',
                    time: '09:15',
                    message: 'Xin chào bạn, bạn cần tư vấn về điều gì?'
                  } : c))
                  // Trigger toast notification
                  setToastInfo({ day: selectedDay || 20, time: selectedTime || '09:30' })
                  setShowToast(true)
                  // Reset select state
                  setSelectedDay(null)
                  setSelectedTime(null)
                }}
              >
                Xác nhận đặt lịch
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Historical Chat Review Modal Overlay */}
      {selectedHistoryChat && createPortal(
        <div className="modal-overlay" onClick={() => setSelectedHistoryChat(null)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div className="history-chat-modal-card" onClick={(e) => e.stopPropagation()} style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '600px',
            maxWidth: '95%',
            maxHeight: '85vh',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}>
            {/* Modal Header */}
            <div className="modal-header" style={{
              padding: '20px 24px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #F0F6FF 0%, #E0F2FE 100%)'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#1E40AF', fontWeight: 800 }}>CHI TIẾT LỊCH SỬ TƯ VẤN</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#2563EB', fontWeight: 600 }}>
                  Bệnh nhân: {selectedHistoryChat.patientName} • Ngày {selectedHistoryChat.date}
                </p>
              </div>
              <button 
                onClick={() => setSelectedHistoryChat(null)}
                style={{
                  border: 'none',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563EB',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            {/* Subject Indicator */}
            <div style={{
              padding: '12px 24px',
              background: '#F9FAFB',
              borderBottom: '1px solid #F3F4F6',
              fontSize: '14px',
              color: '#374151',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: '#3B82F6',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700
              }}>CHỦ ĐỀ</span>
              {selectedHistoryChat.title}
            </div>

            {/* Chat Transcript Area */}
            <div className="modal-body" style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1,
              background: '#FAFAFA',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {selectedHistoryChat.messages.map((msg, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'doctor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'doctor' ? '#2563EB' : '#ffffff',
                    color: msg.sender === 'doctor' ? '#ffffff' : '#1F2937',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    border: msg.sender === 'doctor' ? 'none' : '1px solid #E5E7EB'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: '#9CA3AF',
                    marginTop: '4px',
                    marginRight: msg.sender === 'doctor' ? '4px' : '0',
                    marginLeft: msg.sender === 'doctor' ? '0' : '4px',
                    fontWeight: 500
                  }}>
                    {msg.sender === 'doctor' ? 'Bác sĩ' : selectedHistoryChat.patientName} • {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #F3F4F6',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#ffffff'
            }}>
              <button 
                onClick={() => setSelectedHistoryChat(null)}
                style={{
                  background: '#2563EB',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Đóng lịch sử
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Chatbot AI Summary Modal Popup */}
      {showChatbotSummaryModal && activeChat && activeChat.aiExtract && createPortal(
        <div className="modal-overlay" onClick={() => setShowChatbotSummaryModal(false)}>
          <div className="chatbot-summary-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="chatbot-modal-header">
              <div className="chatbot-modal-title-group">
                <div className="chatbot-modal-avatar-glow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h2>Tóm tắt chuyển tiếp từ Chatbot</h2>
                  <p>Bệnh nhân: {activeChat.name} ({activeChat.age} tuổi) • Chatbot sàng lọc trước khi chuyển bác sĩ</p>
                </div>
              </div>
              <button className="close-modal-btn" onClick={() => setShowChatbotSummaryModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="chatbot-modal-body">
              <div className={`chatbot-handoff-panel ${getSeverityClass(activeChat.aiExtract.severity)}`}>
                <div className="handoff-main-row">
                  <div>
                    <span className="handoff-kicker">Lý do chatbot chuyển bác sĩ</span>
                    <p className="handoff-reason">{getHandoffReason(activeChat.aiExtract)}</p>
                  </div>
                  <span className={`handoff-severity-badge ${getSeverityClass(activeChat.aiExtract.severity)}`}>
                    {activeChat.aiExtract.severity}
                  </span>
                </div>
                <div className="handoff-diagnosis-line">
                  <span>Giả định sàng lọc:</span>
                  <strong>{activeChat.aiExtract.diagnosis}</strong>
                </div>
                <p className="handoff-disclaimer">Thông tin do chatbot tóm tắt để bác sĩ tham khảo, cần xác nhận lại trực tiếp với bệnh nhân.</p>
              </div>

              <div className="chatbot-modal-grid triage-summary-grid">
                <div className="chatbot-modal-panel symptoms-panel">
                  <div className="panel-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <h3>Triệu chứng hiện tại</h3>
                  </div>
                  <div className="panel-content">
                    <p className="clinical-text">{activeChat.aiExtract.symptoms}</p>
                    <div className="clinical-timestamp-badge">Tóm tắt từ cuộc trò chuyện với chatbot</div>
                  </div>
                </div>

                <div className="chatbot-modal-panel declared-info-panel">
                  <div className="panel-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <h3>Thông tin đã khai báo</h3>
                  </div>
                  <div className="panel-content">
                    {activeChat.aiExtract.vitals && (
                      <div className="vitals-inline-row">
                        <span>BP {activeChat.aiExtract.vitals.bp || '--'}</span>
                        <span>HR {activeChat.aiExtract.vitals.hr || '--'}</span>
                        <span>{activeChat.aiExtract.vitals.temp || '--'}°C</span>
                        <span>SpO2 {activeChat.aiExtract.vitals.spo2 || '--'}%</span>
                      </div>
                    )}
                    <div className="history-info-list compact">
                      <div className="history-info-row">
                        <span className="row-label">Tiền sử:</span>
                        <span className="row-value">{activeChat.aiExtract.history}</span>
                      </div>
                      <div className="history-info-row">
                        <span className="row-label">Dị ứng:</span>
                        <span className="row-value">{matchingPatient?.allergies?.length ? matchingPatient.allergies.join(', ') : 'Chưa khai báo'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chatbot-modal-panel questions-panel">
                  <div className="panel-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <h3>Cần hỏi thêm trước khi tư vấn</h3>
                  </div>
                  <div className="panel-content">
                    <ul className="followup-question-list">
                      {getFollowUpQuestions(activeChat.aiExtract).slice(0, 2).map(question => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="chatbot-modal-panel action-panel">
                  <div className="panel-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    <h3>Hướng xử trí gợi ý</h3>
                  </div>
                  <div className="panel-content">
                    <p className="triage-val">{getTriageSuggestion(activeChat.aiExtract)}</p>
                    <div className="chatbot-summary-note">Bác sĩ là người quyết định kết luận và đơn thuốc cuối cùng.</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="chatbot-modal-footer">
              <button className="chatbot-close-action-btn secondary" onClick={() => setShowChatbotSummaryModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      </div>
    </div>
  )
}
