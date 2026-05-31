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
    title: "Tư vấn với hệ thống",
    sub: "Tôi có thể giúp gì cho bạn?",
    time: "10:30",
    date: "30/05/2026",
    type: "bot",
    isNew: true,
  },
  {
    id: "2",
    title: "Tư vấn với bác sĩ",
    doctor: "BS. Nguyễn Văn A",
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
