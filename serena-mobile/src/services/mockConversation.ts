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
  // ... các item khác
];
