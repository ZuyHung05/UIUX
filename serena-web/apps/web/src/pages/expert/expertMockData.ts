const padNumber = (value: number, length = 3) => value.toString().padStart(length, '0')

const conversationTopics = [
  'Đau bụng, tiêu chảy',
  'Sốt và dị ứng',
  'Đau đầu, chóng mặt',
  'Tư vấn thuốc',
  'Khó thở',
  'Ho kéo dài',
  'Đau ngực nhẹ',
  'Mất ngủ',
  'Đau lưng',
  'Phát ban da',
]

const conversationRatings = ['Cần rà soát', 'Có nghi vấn', 'Đã xác minh', 'Ổn định']
const riskLevels = ['Cao', 'Trung bình', 'Thấp']
const reviewStatuses = ['Chờ rà soát', 'Đã rà soát']

const errorGroups = ['Y tế', 'Kỹ thuật', 'Khác']
const errorTypes = [
  'Phản hồi chưa đủ an toàn',
  'Hội thoại bị đơ',
  'Thiếu thông tin quan trọng',
  'Phản hồi lặp lại',
  'Trả lời không tự nhiên',
  'Thiếu cảnh báo nguy cơ',
]
const errorStatuses = ['Mới', 'Đang xử lý', 'Đã xử lý']

const knowledgeTopics = [
  'Dấu hiệu cảnh báo đau bụng cấp',
  'Sốt kéo dài ở trẻ em',
  'Khó thở và dấu hiệu khẩn cấp',
  'Tư vấn sử dụng thuốc không kê đơn',
  'Dị ứng thức ăn',
  'Đau đầu nguy cơ cao',
  'Mất nước khi tiêu chảy',
  'Ho kéo dài sau cảm cúm',
]
const specialties = ['Tiêu hóa', 'Nhi khoa', 'Hô hấp', 'Dược lâm sàng', 'Da liễu', 'Thần kinh']
const knowledgeStatuses = ['Đã duyệt', 'Chờ duyệt', 'Cần cập nhật']

const trainingSentences = [
  'Tôi đau bụng dữ dội và đi ngoài nhiều lần',
  'Tôi có nên uống kháng sinh không?',
  'Tôi bị khó thở sau khi ăn hải sản',
  'Tôi sốt 3 ngày chưa khỏi',
  'Tôi nổi mẩn đỏ sau khi uống thuốc',
  'Tôi bị đau ngực khi leo cầu thang',
  'Tôi mất ngủ nhiều tuần',
  'Tôi ho kéo dài hơn 10 ngày',
]
const trainingGroups = ['Từ dữ liệu góp', 'Y tế an toàn', 'Nguy cơ cao', 'Cải thiện phản hồi']
const trainingStatuses = ['Chờ duyệt', 'Đã đào tạo', 'Nháp']

const historyActions = ['Duyệt và đóng', 'Lưu bản nháp', 'Tạo mẫu huấn luyện', 'Đóng lỗi', 'Cập nhật đề xuất']
const historyResults = ['Đã xử lý', 'Đang xử lý', 'Đã xử lý']

const baseConversationRows = [
  {
    id: 'CHT-000125',
    time: '26/05/2025 10:30',
    topic: 'Đau bụng, tiêu chảy',
    rating: 'Cần rà soát',
    risk: 'Cao',
    status: 'Chờ rà soát',
  },
  {
    id: 'CHT-000124',
    time: '26/05/2025 09:15',
    topic: 'Sốt và dị ứng',
    rating: 'Có nghi vấn',
    risk: 'Trung bình',
    status: 'Chờ rà soát',
  },
  {
    id: 'CHT-000123',
    time: '25/05/2025 21:40',
    topic: 'Đau đầu, chóng mặt',
    rating: 'Đã xác minh',
    risk: 'Cao',
    status: 'Đã rà soát',
  },
  {
    id: 'CHT-000122',
    time: '25/05/2025 20:10',
    topic: 'Tư vấn thuốc',
    rating: 'Ổn định',
    risk: 'Thấp',
    status: 'Đã rà soát',
  },
  {
    id: 'CHT-000121',
    time: '25/05/2025 18:05',
    topic: 'Khó thở',
    rating: 'Cần rà soát',
    risk: 'Cao',
    status: 'Chờ rà soát',
  },
]

export const conversationRows = [
  ...baseConversationRows,
  ...Array.from({ length: 35 }, (_item, index) => {
    const rowNumber = 120 - index
    const day = 24 - (index % 18)
    const hour = 8 + (index % 12)
    const minute = (index * 7) % 60

    return {
      id: `CHT-${padNumber(rowNumber, 6)}`,
      time: `${padNumber(day, 2)}/05/2025 ${padNumber(hour, 2)}:${padNumber(minute, 2)}`,
      topic: conversationTopics[index % conversationTopics.length],
      rating: conversationRatings[index % conversationRatings.length],
      risk: riskLevels[index % riskLevels.length],
      status: reviewStatuses[index % reviewStatuses.length],
    }
  }),
]

const baseErrorRows = [
  {
    id: 'ERI-000152',
    group: 'Y tế',
    type: 'Phản hồi chưa đủ an toàn',
    severity: 'Cao',
    status: 'Mới',
    owner: 'BS. Minh Anh',
    createdAt: '26/05/2025 14:20',
    conversationId: 'CHT-000125',
    reviewNote: 'Chatbot chưa khai thác dấu hiệu mất nước và trấn an quá sớm trong hội thoại đau bụng, tiêu chảy.',
  },
  {
    id: 'ERI-000151',
    group: 'Kỹ thuật',
    type: 'Hội thoại bị đơ',
    severity: 'Trung bình',
    status: 'Đang xử lý',
    owner: 'CN. Hoàng Nam',
    createdAt: '26/05/2025 11:45',
    conversationId: 'CHT-000124',
    reviewNote: 'Chatbot phản hồi chưa phù hợp khi người dùng có dấu hiệu dị ứng kèm khó thở nhẹ.',
  },
  {
    id: 'ERI-000150',
    group: 'Y tế',
    type: 'Thiếu thông tin quan trọng',
    severity: 'Cao',
    status: 'Mới',
    owner: 'BS. Minh Anh',
    createdAt: '25/05/2025 21:10',
    conversationId: 'CHT-000123',
    reviewNote: 'Chatbot bỏ sót dấu hiệu đau đầu đột ngột kèm nhìn mờ và buồn nôn.',
  },
  {
    id: 'ERI-000090',
    group: 'Khác',
    type: 'Phản hồi lặp lại',
    severity: 'Thấp',
    status: 'Đã xử lý',
    owner: 'Đã đóng',
    createdAt: '20/05/2025 16:30',
  },
  {
    id: 'ERI-000080',
    group: 'Kỹ thuật',
    type: 'Trả lời không tự nhiên',
    severity: 'Trung bình',
    status: 'Đang xử lý',
    owner: 'CN. Hoàng Nam',
    createdAt: '18/05/2025 09:05',
  },
]

export const errorRows = [
  ...baseErrorRows,
  ...Array.from({ length: 35 }, (_item, index) => {
    const rowNumber = 149 - index
    const day = 24 - (index % 18)
    const hour = 8 + (index % 11)
    const minute = (index * 9) % 60

    return {
      id: `ERI-${padNumber(rowNumber, 6)}`,
      group: errorGroups[index % errorGroups.length],
      type: errorTypes[index % errorTypes.length],
      severity: riskLevels[index % riskLevels.length],
      status: errorStatuses[index % errorStatuses.length],
      owner: index % 3 === 2 ? 'Đã đóng' : index % 2 === 0 ? 'BS. Minh Anh' : 'CN. Hoàng Nam',
      createdAt: `${padNumber(day, 2)}/05/2025 ${padNumber(hour, 2)}:${padNumber(minute, 2)}`,
    }
  }),
]

const baseKnowledgeRows = [
  {
    id: 'KB-001',
    topic: 'Dấu hiệu cảnh báo đau bụng cấp',
    specialty: 'Tiêu hóa',
    source: 'Bộ Y tế',
    status: 'Đã duyệt',
    updatedAt: '24/05/2025',
  },
  {
    id: 'KB-002',
    topic: 'Sốt kéo dài ở trẻ em',
    specialty: 'Nhi khoa',
    source: 'WHO',
    status: 'Chờ duyệt',
    updatedAt: '23/05/2025',
  },
  {
    id: 'KB-003',
    topic: 'Khó thở và dấu hiệu khẩn cấp',
    specialty: 'Hô hấp',
    source: 'Hướng dẫn nội bộ',
    status: 'Cần cập nhật',
    updatedAt: '20/05/2025',
  },
  {
    id: 'KB-004',
    topic: 'Tư vấn sử dụng thuốc không kê đơn',
    specialty: 'Dược lâm sàng',
    source: 'FDA',
    status: 'Đã duyệt',
    updatedAt: '18/05/2025',
  },
]

export const knowledgeRows = [
  ...baseKnowledgeRows,
  ...Array.from({ length: 36 }, (_item, index) => {
    const number = index + 5
    const day = 17 - (index % 14)

    return {
      id: `KB-${padNumber(number)}`,
      topic: `${knowledgeTopics[index % knowledgeTopics.length]} ${Math.floor(index / knowledgeTopics.length) + 1}`,
      specialty: specialties[index % specialties.length],
      source: index % 3 === 0 ? 'Bộ Y tế' : index % 3 === 1 ? 'WHO' : 'Hướng dẫn nội bộ',
      status: knowledgeStatuses[index % knowledgeStatuses.length],
      updatedAt: `${padNumber(day, 2)}/05/2025`,
    }
  }),
]

const baseTrainingRows = [
  {
    id: 'TR-001',
    userSentence: 'Tôi đau bụng dữ dội và đi ngoài nhiều lần',
    intent: 'triage_digestive_risk',
    group: 'Từ dữ liệu góp',
    expectedResponse: 'Hỏi thêm dấu hiệu mất nước và khuyến nghị khám sớm',
    status: 'Chờ duyệt',
  },
  {
    id: 'TR-002',
    userSentence: 'Tôi có nên uống kháng sinh không?',
    intent: 'medication_safety',
    group: 'Y tế an toàn',
    expectedResponse: 'Không tự kê đơn, hướng dẫn gặp bác sĩ',
    status: 'Đã đào tạo',
  },
  {
    id: 'TR-003',
    userSentence: 'Tôi bị khó thở sau khi ăn hải sản',
    intent: 'emergency_allergy',
    group: 'Nguy cơ cao',
    expectedResponse: 'Cảnh báo khẩn cấp và gọi cấp cứu',
    status: 'Chờ duyệt',
  },
]

export const trainingRows = [
  ...baseTrainingRows,
  ...Array.from({ length: 37 }, (_item, index) => {
    const number = index + 4

    return {
      id: `TR-${padNumber(number)}`,
      userSentence: trainingSentences[index % trainingSentences.length],
      intent: [
        'triage_digestive_risk',
        'medication_safety',
        'emergency_allergy',
        'fever_followup',
        'skin_reaction',
        'chest_pain_triage',
      ][index % 6],
      group: trainingGroups[index % trainingGroups.length],
      expectedResponse: [
        'Hỏi thêm dấu hiệu nguy cơ và hướng dẫn khám phù hợp',
        'Không tự kê đơn, khuyến nghị gặp bác sĩ',
        'Cảnh báo khẩn cấp khi có dấu hiệu nguy hiểm',
        'Gợi ý theo dõi triệu chứng và đặt lịch khám',
      ][index % 4],
      status: trainingStatuses[index % trainingStatuses.length],
    }
  }),
]

const baseProcessingHistoryRows = [
  {
    id: 'HIS-000231',
    errorId: 'ERI-000152',
    action: 'Duyệt và đóng',
    result: 'Đã xử lý',
    handler: 'Bạn',
    time: '26/05/2025 14:35',
    note: 'Đã tạo mẫu huấn luyện và cập nhật khuyến nghị an toàn.',
  },
  {
    id: 'HIS-000230',
    errorId: 'ERI-000151',
    action: 'Lưu bản nháp',
    result: 'Đang xử lý',
    handler: 'Bạn',
    time: '26/05/2025 13:20',
    note: 'Ghi nhận phân tích ban đầu về tình trạng hội thoại bị đơ.',
  },
  {
    id: 'HIS-000229',
    errorId: 'ERI-000150',
    action: 'Tạo mẫu huấn luyện',
    result: 'Đã xử lý',
    handler: 'Bạn',
    time: '25/05/2025 22:10',
    note: 'Bổ sung câu hỏi khai thác triệu chứng nguy cơ cao.',
  },
  {
    id: 'HIS-000228',
    errorId: 'ERI-000090',
    action: 'Đóng lỗi',
    result: 'Đã xử lý',
    handler: 'Bạn',
    time: '24/05/2025 16:45',
    note: 'Lỗi phản hồi lặp lại đã được xác minh và đóng.',
  },
  {
    id: 'HIS-000227',
    errorId: 'ERI-000080',
    action: 'Lưu bản nháp',
    result: 'Đang xử lý',
    handler: 'Bạn',
    time: '24/05/2025 10:05',
    note: 'Đang soạn đề xuất cải thiện câu trả lời tự nhiên hơn.',
  },
]

export const processingHistoryRows = [
  ...baseProcessingHistoryRows,
  ...Array.from({ length: 35 }, (_item, index) => {
    const rowNumber = 226 - index
    const errorNumber = 149 - index
    const day = 23 - (index % 16)
    const hour = 9 + (index % 10)
    const minute = (index * 11) % 60

    return {
      id: `HIS-${padNumber(rowNumber, 6)}`,
      errorId: `ERI-${padNumber(errorNumber, 6)}`,
      action: historyActions[index % historyActions.length],
      result: historyResults[index % historyResults.length],
      handler: 'Bạn',
      time: `${padNumber(day, 2)}/05/2025 ${padNumber(hour, 2)}:${padNumber(minute, 2)}`,
      note: [
        'Đã rà soát phản hồi và cập nhật hướng xử lý.',
        'Đang hoàn thiện đề xuất trước khi gửi duyệt.',
        'Đã tạo dữ liệu huấn luyện từ lỗi đã xác minh.',
        'Đã đóng lỗi sau khi kiểm tra lại hội thoại.',
      ][index % 4],
    }
  }),
]

export const trendData = [
  { label: 'T2', conversations: 210, errors: 42 },
  { label: 'T3', conversations: 260, errors: 38 },
  { label: 'T4', conversations: 310, errors: 52 },
  { label: 'T5', conversations: 390, errors: 49 },
  { label: 'T6', conversations: 480, errors: 61 },
  { label: 'T7', conversations: 520, errors: 44 },
]

export const errorTypeData = [
  { name: 'Y tế', value: 248, color: '#ef7777' },
  { name: 'Kỹ thuật', value: 126, color: '#f2b35d' },
  { name: 'Khác', value: 134, color: '#74c69d' },
]

export const conversationTypeData = [
  { name: 'Tự xử lý', value: 62, color: '#74c69d' },
  { name: 'Chuyển bác sĩ', value: 18, color: '#72b7e8' },
  { name: 'Cần rà soát', value: 13, color: '#f2b35d' },
  { name: 'Nguy cơ cao', value: 7, color: '#ef7777' },
]
