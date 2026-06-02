export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  experience: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    image: "https://i.pravatar.cc/150?u=sarah",
    experience: "10 years",
  },
  // Thêm các bác sĩ khác ở đây...
];

export const CONSULTATION_HISTORY = [
  {
    id: "1",
    title: "Tư vấn với bác sĩ",
    doctorName: "BS. Nguyễn Văn A",
    date: "20/05/2026",
    specialty: "Khoa Nội tổng quát",
    symptoms: "Đau đầu kéo dài, sốt nhẹ về chiều",
    diagnosis: "Cảm cúm nhẹ do thay đổi thời tiết",
    advice:
      "Nghỉ ngơi tại chỗ, uống nhiều nước ấm (2-2.5L/ngày). Sử dụng Paracetamol nếu sốt > 38.5 độ.",
    price: "150.000đ",
    // Thêm mảng hội thoại lịch sử
    chatHistory: [
      {
        id: "m1",
        text: "Chào bác sĩ, tôi bị đau đầu từ sáng nay.",
        sender: "user",
      },
      {
        id: "m2",
        text: "Chào bạn, bạn có kèm theo sốt hay buồn nôn không?",
        sender: "bot",
      },
      { id: "m3", text: "Tôi có sốt nhẹ khoảng 37.8 độ ạ.", sender: "user" },
      {
        id: "m4",
        text: "Nghe có vẻ bạn bị cảm cúm. Tôi sẽ lập đơn thuốc và lời khuyên cho bạn nhé.",
        sender: "bot",
      },
    ],
  },
  {
    id: "2",
    title: "Tư vấn với bác sĩ",
    doctorName: "BS. Nguyễn Văn A",
    sub: "Bác sĩ ơi, dạo này tôi hay thấy chóng mặt...",
    time: "14:20",
    date: "29/05/2026",
    type: "doctor",
  },
  // ... thêm dữ liệu tùy ý
];

export const CLINIC_HISTORY = [
  {
    id: "1",
    doctor: "BS. Lê Minh K",
    specialty: "Bác sĩ đa khoa",
    status: "Sắp diễn ra",
    time: "10:00 - 25/05/2026",
    location: "Phòng khám Tâm Anh",
  },
  {
    id: "2",
    doctor: "BS. Nguyễn Văn M",
    specialty: "Đa khoa",
    status: "Hoàn thành",
    time: "14:00 - 18/05/2026",
    location: "Phòng khám Tâm Anh",
  },
  {
    id: "3",
    doctor: "BS. Kiều Thanh N",
    specialty: "Khoa nội",
    status: "Đã hủy",
    time: "09:00 - 15/05/2026",
    location: "Phòng khám Tâm Anh",
  },
];
