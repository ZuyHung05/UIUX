import { useEffect, useState } from 'react'
import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { IconButton } from '../../../components/ui/ActionButton'
import { MetricCard } from '../../../components/ui/MetricCard'
import { ClockMetricIcon, MessageMetricIcon, PulseMetricIcon, UsersMetricIcon, StarMetricIcon } from '../../../components/ui/metricIcons'
import { SearchInput } from '../../../components/ui/SearchInput'
import { ReturnButton } from '../../../components/ui/ReturnButton'
import './PatientListTab.css'

// Clinical-grade patient mock data with EMR elements matching the wireframe exactly
export const initialPatients = [
  {
    "id": "1",
    "code": "BN-2026-001",
    "name": "Nguyễn Văn A",
    "age": 22,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Cần khám",
    "lastVisit": "25/05/2026",
    "phone": "0934567890",
    "disease": "Sốt cao co giật nhẹ",
    "bloodType": "A+",
    "allergies": [
      "Penicillin",
      "Aspirin"
    ],
    "history": [
      "Chưa ghi nhận tiền sử bệnh lý mãn tính",
      "Mổ ruột thừa năm 2021 tại Bệnh viện Bạch Mai"
    ],
    "vitals": {
      "bp": "142/95",
      "hr": 98,
      "temp": 39.2,
      "spo2": 97,
      "weight": 68,
      "height": 172,
      "bmi": 23.0
    },
    "pastEncounters": [
      {
        "date": "25/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Sốt co giật do nhiễm siêu vi cấp tính",
        "symptoms": "Sốt cao liên tục 39.2 độ, co giật nhẹ cơ face và chi, đau họng, mệt mỏi nhiều.",
        "prescription": [
          "Paracetamol 500mg - 3 viên/ngày, uống khi sốt > 38.5 độ",
          "Oresol - Pha 1 gói với 1 lít nước lọc, uống rải rác",
          "Hapacol 150mg (sẵn trong tủ thuốc gia đình) - dự phòng"
        ]
      },
      {
        "date": "15/01/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm họng cấp tính",
        "symptoms": "Đau rát họng nuốt vướng, ho khan nhiều về đêm, sốt nhẹ 38.0 °C, mệt mỏi.",
        "prescription": [
          "Amoxicillin 500mg - 3 viên/ngày, uống sáng-trưa-tối sau ăn",
          "Siro ho thảo dược - 10ml/lần, 3 lần/ngày để dịu họng"
        ]
      }
    ]
  },
  {
    "id": "2",
    "code": "BN-2026-002",
    "name": "Trần Thu Thảo",
    "age": 28,
    "gender": "Nữ",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Khẩn cấp",
    "lastVisit": "24/05/2026",
    "phone": "0987654321",
    "disease": "Đau ngực trái kéo dài",
    "bloodType": "O+",
    "allergies": [
      "Hải sản"
    ],
    "history": [
      "Rối loạn lipid máu phát hiện năm 2024",
      "Tiền sử gia đình: Bố bị nhồi máu cơ tim ở tuổi 50"
    ],
    "vitals": {
      "bp": "135/85",
      "hr": 104,
      "temp": 36.8,
      "spo2": 98,
      "weight": 55,
      "height": 158,
      "bmi": 22.0
    },
    "pastEncounters": [
      {
        "date": "24/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Đau ngực trái không điển hình / Theo dõi thiếu máu cơ tim",
        "symptoms": "Đau nhói vùng ngực trái kéo dài khoảng 2-3 phút khi gắng sức, lan ra vai trái, không khó thở.",
        "prescription": [
          "Nitroglycerin 0.5mg - Ngậm dưới lưỡi khi đau ngực dữ dội",
          "Atorvastatin 10mg - 1 viên/ngày, uống tối trước đi ngủ",
          "Aspirin 81mg - 1 viên/ngày, uống sáng sau ăn"
        ]
      },
      {
        "date": "10/04/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Rối loạn lipid máu hỗn hợp / Tăng huyết áp độ I",
        "symptoms": "Khám định kỳ sức khỏe tim mạch, thỉnh thoảng đau đầu nhẹ khi căng thẳng, không đau ngực.",
        "prescription": [
          "Atorvastatin 10mg - 1 viên/ngày, uống tối trước đi ngủ",
          "Amlodipin 5mg - 1 viên/ngày, uống sáng sau ăn"
        ]
      }
    ]
  },
  {
    "id": "3",
    "code": "BN-2026-003",
    "name": "Lê Văn C",
    "age": 45,
    "gender": "Nam",
    "status": "Đã kết thúc",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "20/05/2026",
    "phone": "0901234567",
    "disease": "Ho khan kéo dài về đêm",
    "bloodType": "B+",
    "allergies": [],
    "history": [
      "Dị ứng thời tiết",
      "Trào ngược dạ dày thực quản (GERD)"
    ],
    "vitals": {
      "bp": "118/78",
      "hr": 72,
      "temp": 36.5,
      "spo2": 99,
      "weight": 74,
      "height": 175,
      "bmi": 24.2
    },
    "pastEncounters": [
      {
        "date": "20/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Ho khan do trào ngược dạ dày thực quản (GERD)",
        "symptoms": "Ho khan nhiều về đêm và sáng sớm, kèm ợ chua, rát nóng sau xương ức.",
        "prescription": [
          "Nexium (Esomeprazole) 40mg - 1 viên/ngày, uống trước ăn sáng 30 phút",
          "Gaviscon - 3 gói/ngày, uống sau ăn 1 giờ và trước đi ngủ",
          "Siro ho Prospan - 5ml/lần, 3 lần/ngày"
        ]
      },
      {
        "date": "05/03/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm phế quản cấp tính trên nền trào ngược GERD",
        "symptoms": "Ho khạc đờm trắng đục nhiều ngày, mệt mỏi, đau rát cổ họng, sốt nhẹ 37.8 °C.",
        "prescription": [
          "Augmentin 1g - 2 viên/ngày, uống sáng-tối sau ăn",
          "Paracetamol 500mg - 3 viên/ngày khi sốt > 38.5 °C",
          "Acetylcystein 200mg - 3 gói/ngày, uống sau ăn"
        ]
      }
    ]
  },
  {
    "id": "4",
    "code": "BN-2026-004",
    "name": "Phạm Thị D",
    "age": 50,
    "gender": "Nữ",
    "status": "Đang khám",
    "appointmentType": "Cả hai",
    "triage": "Khẩn cấp",
    "lastVisit": "18/05/2026",
    "phone": "0923456789",
    "disease": "Tiền sử huyết áp cao",
    "bloodType": "O+",
    "allergies": [],
    "history": [
      "Tăng huyết áp vô căn (đã 5 năm, đang uống thuốc duy trì)",
      "Gút mãn tính"
    ],
    "vitals": {
      "bp": "128/82",
      "hr": 76,
      "temp": 36.6,
      "spo2": 97,
      "weight": 80,
      "height": 170,
      "bmi": 27.7
    },
    "pastEncounters": [
      {
        "date": "18/05/2026",
        "doctor": "BS. Nguyễn An",
        "diagnosis": "Tăng huyết áp vô căn - Giai đoạn 2 ổn định / Rối loạn acid uric máu",
        "symptoms": "Khám định kỳ, không đau đầu, không chóng mặt. Acid uric tăng nhẹ.",
        "prescription": [
          "Amlodipin 5mg - 1 viên/ngày, uống sáng",
          "Allopurinol 300mg - 1 viên/ngày, uống sáng sau ăn"
        ]
      },
      {
        "date": "12/02/2026",
        "doctor": "BS. Nguyễn An",
        "diagnosis": "Cơn gút cấp tính khớp cổ chân trái",
        "symptoms": "Khớp cổ chân trái sưng nóng đỏ và đau dữ dội sau khi ăn lẩu hải sản, hạn chế đi lại.",
        "prescription": [
          "Colchicine 1mg - ngày 1 uống 3 viên (sáng-trưa-tối), ngày 2 uống 2 viên",
          "Meloxicam 7.5mg - 1 viên/ngày, uống sau ăn trưa để giảm đau kháng viêm"
        ]
      }
    ]
  },
  {
    "id": "5",
    "code": "BN-2026-005",
    "name": "Đỗ Thị F",
    "age": 39,
    "gender": "Nữ",
    "status": "Đã kết thúc",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "15/05/2026",
    "phone": "0945678901",
    "disease": "Đau khớp gối mãn tính",
    "bloodType": "AB-",
    "allergies": [
      "Sulfonamides"
    ],
    "history": [
      "Thoái hóa khớp gối độ III",
      "Loét dạ dày tá tràng đã điều trị ổn định"
    ],
    "vitals": {
      "bp": "130/80",
      "hr": 82,
      "temp": 36.9,
      "spo2": 96,
      "weight": 62,
      "height": 155,
      "bmi": 25.8
    },
    "pastEncounters": [
      {
        "date": "15/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Thoái hóa khớp gối hai bên tiến triển nặng",
        "symptoms": "Đau dữ dội hai khớp gối, khớp sưng đau, hạn chế vận động nhiều, khó đứng lên ngồi xuống.",
        "prescription": [
          "Meloxicam 7.5mg - 1 viên/ngày, uống trưa sau ăn (dùng ngắn ngày)",
          "Glucosamin Sulfat 1500mg - 1 gói/ngày, uống sáng",
          "Esomeprazole 20mg - 1 viên/ngày, uống trước ăn sáng 30 phút để bảo vệ dạ dày"
        ]
      },
      {
        "date": "20/12/2025",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Viêm loét dạ dày tá tràng đợt cấp tính",
        "symptoms": "Đau thượng vị âm ỉ kèm ợ nóng rát nhiều sau khi ăn đồ chua cay hoặc khi đói.",
        "prescription": [
          "Nexium (Esomeprazole) 40mg - 1 viên/ngày, uống trước ăn sáng 30 phút",
          "Phosphalugel - 3 gói/ngày, uống khi đau thượng vị nhiều"
        ]
      }
    ]
  },
  {
    "id": "6",
    "code": "BN-2026-006",
    "name": "Nguyễn Hoàng G",
    "age": 34,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "12/05/2026",
    "phone": "0912345006",
    "disease": "Dị ứng phấn hoa",
    "bloodType": "O+",
    "allergies": [
      "Phấn hoa"
    ],
    "history": [
      "Viêm mũi dị ứng"
    ],
    "vitals": {
      "bp": "120/80",
      "hr": 78,
      "temp": 36.6,
      "spo2": 99,
      "weight": 68,
      "height": 172,
      "bmi": 23.0
    },
    "pastEncounters": [
      {
        "date": "12/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm mũi dị ứng theo mùa",
        "symptoms": "Hắt hơi nhiều, ngứa mũi khi tiếp xúc phấn hoa.",
        "prescription": [
          "Telfast 180mg - 1 viên/ngày",
          "Xịt mũi Avamys - 2 xịt/ngày"
        ]
      }
    ]
  },
  {
    "id": "7",
    "code": "BN-2026-007",
    "name": "Vũ Thị H",
    "age": 41,
    "gender": "Nữ",
    "status": "Đang khám",
    "appointmentType": "Khám trực tiếp",
    "triage": "Khẩn cấp",
    "lastVisit": "10/05/2026",
    "phone": "0912345007",
    "disease": "Đau khớp vai phải",
    "bloodType": "A+",
    "allergies": [],
    "history": [
      "Thoái hóa khớp vai nhẹ"
    ],
    "vitals": {
      "bp": "125/82",
      "hr": 80,
      "temp": 36.7,
      "spo2": 98,
      "weight": 58,
      "height": 160,
      "bmi": 22.7
    },
    "pastEncounters": [
      {
        "date": "10/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Hội chứng chạm khớp vai / Viêm gân bán phần",
        "symptoms": "Đau chói khớp vai phải khi nhấc tay lên cao hoặc đưa tay ra sau lưng.",
        "prescription": [
          "Voltaren 75mg - 1 viên/ngày uống sau ăn",
          "Mydocalm 150mg - 2 viên/ngày chia 2 lần"
        ]
      }
    ]
  },
  {
    "id": "8",
    "code": "BN-2026-008",
    "name": "Hoàng Văn I",
    "age": 55,
    "gender": "Nam",
    "status": "Đã kết thúc",
    "appointmentType": "Cả hai",
    "triage": "Bình thường",
    "lastVisit": "08/05/2026",
    "phone": "0912345008",
    "disease": "Rối loạn tiêu hóa",
    "bloodType": "B+",
    "allergies": [],
    "history": [
      "Viêm đại tràng co thắt"
    ],
    "vitals": {
      "bp": "122/80",
      "hr": 74,
      "temp": 36.5,
      "spo2": 99,
      "weight": 70,
      "height": 170,
      "bmi": 24.2
    },
    "pastEncounters": [
      {
        "date": "08/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm đại tràng co thắt / Hội chứng ruột kích thích",
        "symptoms": "Đau quặn bụng dọc khung đại tràng, đầy hơi, đi ngoài nhiều lần sau khi ăn đồ lạ.",
        "prescription": [
          "Duspatalin 200mg - 2 viên/ngày uống trước ăn 20 phút",
          "Biolactovin - 2 lọ/ngày uống sáng-tối"
        ]
      }
    ]
  },
  {
    "id": "9",
    "code": "BN-2026-009",
    "name": "Phạm Minh K",
    "age": 29,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "06/05/2026",
    "phone": "0912345009",
    "disease": "Đau lưng cấp tính",
    "bloodType": "O+",
    "allergies": [],
    "history": [
      "Chưa ghi nhận bệnh lý"
    ],
    "vitals": {
      "bp": "118/76",
      "hr": 72,
      "temp": 36.4,
      "spo2": 99,
      "weight": 65,
      "height": 175,
      "bmi": 21.2
    },
    "pastEncounters": [
      {
        "date": "06/05/2026",
        "doctor": "BS. Nguyễn An",
        "diagnosis": "Căng cơ thắt lưng cấp do sai tư thế",
        "symptoms": "Đau mỏi vùng thắt lưng sau khi bê vác vật nặng đột ngột, cúi ngửa khó khăn.",
        "prescription": [
          "Mobic 7.5mg - 1 viên/ngày uống sau ăn",
          "Decontractyl 500mg - 3 viên/ngày chia 3 lần"
        ]
      }
    ]
  },
  {
    "id": "10",
    "code": "BN-2026-010",
    "name": "Đặng Thị L",
    "age": 62,
    "gender": "Nữ",
    "status": "Đã kết thúc",
    "appointmentType": "Khám trực tiếp",
    "triage": "Cần khám",
    "lastVisit": "04/05/2026",
    "phone": "0912345010",
    "disease": "Mắt nhìn mờ dần",
    "bloodType": "AB+",
    "allergies": [],
    "history": [
      "Đục thủy tinh thể hai mắt nhẹ"
    ],
    "vitals": {
      "bp": "132/84",
      "hr": 76,
      "temp": 36.6,
      "spo2": 97,
      "weight": 52,
      "height": 154,
      "bmi": 21.9
    },
    "pastEncounters": [
      {
        "date": "04/05/2026",
        "doctor": "BS. Nguyễn An",
        "diagnosis": "Đục thủy tinh thể tuổi già tiến triển độ II",
        "symptoms": "Nhìn mờ như có màn sương trước mắt, không đau nhức, nhìn rõ hơn lúc ánh sáng dịu.",
        "prescription": [
          "Phacophaco - Nhỏ mắt ngày 4 lần",
          "Tebonin 120mg - 1 viên/ngày uống sáng"
        ]
      }
    ]
  },
  {
    "id": "11",
    "code": "BN-2026-011",
    "name": "Bùi Văn M",
    "age": 47,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "02/05/2026",
    "phone": "0912345011",
    "disease": "Ho kéo dài, rát họng",
    "bloodType": "O-",
    "allergies": [
      "Penicillin"
    ],
    "history": [
      "Viêm họng mãn tính"
    ],
    "vitals": {
      "bp": "120/80",
      "hr": 78,
      "temp": 36.7,
      "spo2": 98,
      "weight": 70,
      "height": 171,
      "bmi": 23.9
    },
    "pastEncounters": [
      {
        "date": "02/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm họng hạt mãn tính đợt cấp",
        "symptoms": "Ngứa rát cổ họng nuốt vướng, ho khan nhiều đờm trong vào buổi sáng.",
        "prescription": [
          "Klacid 500mg - 2 viên/ngày chia 2 lần uống sau ăn",
          "Alpha Chymotrypsin - 4 viên/ngày ngậm dưới lưỡi"
        ]
      }
    ]
  },
  {
    "id": "12",
    "code": "BN-2026-012",
    "name": "Ngô Thị N",
    "age": 31,
    "gender": "Nữ",
    "status": "Đang khám",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "30/04/2026",
    "phone": "0912345012",
    "disease": "Mất ngủ kéo dài",
    "bloodType": "A-",
    "allergies": [],
    "history": [
      "Suy nhược thần kinh nhẹ"
    ],
    "vitals": {
      "bp": "110/70",
      "hr": 84,
      "temp": 36.5,
      "spo2": 99,
      "weight": 48,
      "height": 156,
      "bmi": 19.7
    },
    "pastEncounters": [
      {
        "date": "30/04/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Rối loạn giấc ngủ do căng thẳng kéo dài",
        "symptoms": "Khó vào giấc ngủ, ngủ chập chờn hay thức giấc giữa đêm, ban ngày mệt mỏi kém tập trung.",
        "prescription": [
          "Mimosa - 2 viên uống trước ngủ 30 phút",
          "Rotunda 30mg - 1 viên khi mất ngủ nhiều"
        ]
      }
    ]
  },
  {
    "id": "13",
    "code": "BN-2026-013",
    "name": "Dương Văn P",
    "age": 38,
    "gender": "Nam",
    "status": "Đã kết thúc",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "28/04/2026",
    "phone": "0912345013",
    "disease": "Đau dạ dày lúc đói",
    "bloodType": "B-",
    "allergies": [],
    "history": [
      "Viêm loét dạ dày tá tràng năm 2023"
    ],
    "vitals": {
      "bp": "116/78",
      "hr": 75,
      "temp": 36.4,
      "spo2": 99,
      "weight": 64,
      "height": 168,
      "bmi": 22.7
    },
    "pastEncounters": [
      {
        "date": "28/04/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm dạ dày cấp tính tái phát",
        "symptoms": "Đau rát vùng thượng vị âm ỉ xuất hiện lúc đói hoặc sau ăn chua cay, kèm ợ hơi nhẹ.",
        "prescription": [
          "Gastropulgite - 3 gói/ngày uống trước ăn 15 phút",
          "Esomeprazole 20mg - 1 viên uống trước ăn sáng"
        ]
      }
    ]
  },
  {
    "id": "14",
    "code": "BN-2026-014",
    "name": "Đỗ Thị Q",
    "age": 25,
    "gender": "Nữ",
    "status": "Đang chờ",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "26/04/2026",
    "phone": "0912345014",
    "disease": "Khám thai định kỳ",
    "bloodType": "AB-",
    "allergies": [],
    "history": [
      "Mang thai lần đầu tuần thứ 12"
    ],
    "vitals": {
      "bp": "115/75",
      "hr": 82,
      "temp": 36.8,
      "spo2": 98,
      "weight": 50,
      "height": 158,
      "bmi": 20.0
    },
    "pastEncounters": [
      {
        "date": "26/04/2026",
        "doctor": "BS. Nguyễn An",
        "diagnosis": "Thai 12 tuần phát triển bình thường",
        "symptoms": "Khám thai định kỳ, siêu âm đo độ mờ da gáy bình thường, thai phụ khỏe mạnh.",
        "prescription": [
          "Obimin Multivitamins - 1 viên/ngày uống sáng sau ăn",
          "Calcium Corbiere - 1 ống/ngày uống sáng"
        ]
      }
    ]
  },
  {
    "id": "15",
    "code": "BN-2026-015",
    "name": "Phan Văn R",
    "age": 53,
    "gender": "Nam",
    "status": "Đang khám",
    "appointmentType": "Cả hai",
    "triage": "Khẩn cấp",
    "lastVisit": "24/04/2026",
    "phone": "0912345015",
    "disease": "Tê bì chân tay",
    "bloodType": "O+",
    "allergies": [],
    "history": [
      "Đái tháo đường Type 2"
    ],
    "vitals": {
      "bp": "135/88",
      "hr": 80,
      "temp": 36.6,
      "spo2": 96,
      "weight": 75,
      "height": 172,
      "bmi": 25.4
    },
    "pastEncounters": [
      {
        "date": "24/04/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Biến chứng thần kinh ngoại vi do đái tháo đường Type 2",
        "symptoms": "Tê bì châm chích hai đầu ngón tay ngón chân đối xứng hai bên, tăng nhiều về đêm.",
        "prescription": [
          "Neuromultivit - 2 viên/ngày chia 2 lần uống sau ăn",
          "Glucophage 850mg - 2 viên/ngày uống sáng-tối"
        ]
      }
    ]
  },
  {
    "id": "16",
    "code": "BN-2026-016",
    "name": "Nguyễn Văn S",
    "age": 45,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345016",
    "disease": "Trĩ nội độ II chảy máu",
    "bloodType": "A+",
    "allergies": [],
    "history": [
      "Trĩ nội độ II nhiều năm",
      "Tăng huyết áp vô căn"
    ],
    "vitals": {
      "bp": "130/80",
      "hr": 72,
      "temp": 36.5,
      "spo2": 99,
      "weight": 72,
      "height": 170,
      "bmi": 24.9
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Trĩ nội xuất huyết / Tăng huyết áp độ I",
        "symptoms": "Đại tiện ra máu tươi thành giọt, ngứa rát hậu môn nhiều sau khi ăn đồ cay nóng.",
        "prescription": [
          "Daflon 500mg - 4 viên/ngày uống chia 2 lần",
          "Amlodipin 5mg - 1 viên/ngày uống sáng",
          "Proctolog - Thoa hậu môn tối"
        ]
      }
    ]
  },
  {
    "id": "17",
    "code": "BN-2026-017",
    "name": "Trần Thị T",
    "age": 32,
    "gender": "Nữ",
    "status": "Đang khám",
    "appointmentType": "Tư vấn",
    "triage": "Khẩn cấp",
    "lastVisit": "26/05/2026",
    "phone": "0912345017",
    "disease": "Đau thượng vị cấp",
    "bloodType": "O+",
    "allergies": [
      "Aspirin"
    ],
    "history": [
      "Viêm dạ dày tá tràng cấp tính năm 2024"
    ],
    "vitals": {
      "bp": "120/75",
      "hr": 88,
      "temp": 37.0,
      "spo2": 98,
      "weight": 54,
      "height": 160,
      "bmi": 21.1
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm dạ dày cấp tính đợt tiến triển",
        "symptoms": "Đau dữ dội vùng thượng vị lan lên ngực kèm ợ hơi, buồn nôn nhiều sau khi uống cà phê.",
        "prescription": [
          "Nexium 40mg - 1 viên/ngày uống trước ăn 30 phút",
          "Phosphalugel - 3 gói/ngày uống khi đau"
        ]
      }
    ]
  },
  {
    "id": "18",
    "code": "BN-2026-018",
    "name": "Lê Văn U",
    "age": 67,
    "gender": "Nam",
    "status": "Đã kết thúc",
    "appointmentType": "Khám trực tiếp",
    "triage": "Cần khám",
    "lastVisit": "26/05/2026",
    "phone": "0912345018",
    "disease": "Phì đại tuyến tiền liệt",
    "bloodType": "B+",
    "allergies": [],
    "history": [
      "Tăng sinh lành tính tuyến tiền liệt vô căn",
      "Đục thủy tinh thể"
    ],
    "vitals": {
      "bp": "138/85",
      "hr": 70,
      "temp": 36.6,
      "spo2": 97,
      "weight": 65,
      "height": 165,
      "bmi": 23.9
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Tăng sinh lành tính tuyến tiền liệt / Rối loạn tiểu tiện",
        "symptoms": "Tiểu ngập ngừng, tiểu nhiều lần về đêm (4-5 lần), dòng tiểu yếu, tiểu không hết bãi.",
        "prescription": [
          "Xatral XL 10mg - 1 viên/ngày uống tối sau ăn",
          "Avodart 0.5mg - 1 viên/ngày uống sáng"
        ]
      }
    ]
  },
  {
    "id": "19",
    "code": "BN-2026-019",
    "name": "Phạm Thị V",
    "age": 24,
    "gender": "Nữ",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345019",
    "disease": "Rối loạn kinh nguyệt",
    "bloodType": "O-",
    "allergies": [],
    "history": [
      "Buồng trứng đa nang (PCOS) phát hiện năm 2025"
    ],
    "vitals": {
      "bp": "110/70",
      "hr": 75,
      "temp": 36.5,
      "spo2": 99,
      "weight": 47,
      "height": 158,
      "bmi": 18.8
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Rối loạn kinh nguyệt do hội chứng buồng trứng đa nang (PCOS)",
        "symptoms": "Trễ kinh 2 tháng, thường xuyên nổi mụn nội tiết vùng cằm, mệt mỏi căng thẳng kéo dài.",
        "prescription": [
          "Duphaston 10mg - 2 viên/ngày uống 10 ngày",
          "Spironolactone 50mg - 1 viên/ngày",
          "Sắt Acid Folic - 1 viên/ngày"
        ]
      }
    ]
  },
  {
    "id": "20",
    "code": "BN-2026-020",
    "name": "Đỗ Văn X",
    "age": 58,
    "gender": "Nam",
    "status": "Đang khám",
    "appointmentType": "Cả hai",
    "triage": "Khẩn cấp",
    "lastVisit": "26/05/2026",
    "phone": "0912345020",
    "disease": "Đau vai gáy tê tay",
    "bloodType": "AB+",
    "allergies": [],
    "history": [
      "Thoái hóa đốt sống cổ C5-C6",
      "Rối loạn tuần hoàn não"
    ],
    "vitals": {
      "bp": "130/82",
      "hr": 78,
      "temp": 36.4,
      "spo2": 98,
      "weight": 70,
      "height": 168,
      "bmi": 24.8
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Hội chứng cổ vai cánh tay do thoái hóa cột sống cổ",
        "symptoms": "Đau nhức ê ẩm vùng cổ gáy, lan xuống bả vai và cánh tay phải kèm cảm giác tê bì 3 ngón tay đầu.",
        "prescription": [
          "Mobic 7.5mg - 1 viên/ngày uống sau ăn",
          "Mydocalm 150mg - 2 viên/ngày chia 2 lần",
          "Neurobion - 2 viên/ngày chia 2 lần"
        ]
      }
    ]
  },
  {
    "id": "21",
    "code": "BN-2026-021",
    "name": "Nguyễn Thị Y",
    "age": 29,
    "gender": "Nữ",
    "status": "Đã kết thúc",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345021",
    "disease": "Khô mắt, mỏi điều tiết",
    "bloodType": "A-",
    "allergies": [],
    "history": [
      "Chưa ghi nhận bệnh lý đặc biệt"
    ],
    "vitals": {
      "bp": "115/75",
      "hr": 80,
      "temp": 36.5,
      "spo2": 99,
      "weight": 50,
      "height": 162,
      "bmi": 19.1
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Khô mắt thể nhẹ / Mỏi cơ điều tiết mắt do dùng thiết bị điện tử",
        "symptoms": "Mắt khô rát, cộm đỏ như có cát, mờ nhẹ cuối ngày làm việc trước màn hình máy tính.",
        "prescription": [
          "Systane Ultra - Nhỏ mắt ngày 4-5 lần",
          "Bảo Xuân - 2 viên/ngày uống sáng"
        ]
      }
    ]
  },
  {
    "id": "22",
    "code": "BN-2026-022",
    "name": "Hoàng Văn Z",
    "age": 73,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Cần khám",
    "lastVisit": "26/05/2026",
    "phone": "0912345022",
    "disease": "Đau lưng lan xuống chân",
    "bloodType": "B-",
    "allergies": [],
    "history": [
      "Thoát vị đĩa đệm L4-L5 đã điều trị nội khoa nhiều đợt"
    ],
    "vitals": {
      "bp": "140/85",
      "hr": 72,
      "temp": 36.6,
      "spo2": 96,
      "weight": 68,
      "height": 170,
      "bmi": 23.5
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Thoát vị đĩa đệm cột sống thắt lưng L4-L5 chèn ép rễ thần kinh tọa",
        "symptoms": "Đau ê ẩm thắt lưng liên tục, lan xuống mông và mặt sau đùi chân trái, đi lại khó khăn.",
        "prescription": [
          "Ultracet - 2 viên/ngày uống khi đau nhiều",
          "Neurontin 300mg - 1 viên/ngày uống tối trước đi ngủ",
          "Methycobal 500mcg - 3 viên/ngày chia 3 lần"
        ]
      }
    ]
  },
  {
    "id": "23",
    "code": "BN-2026-023",
    "name": "Bùi Thị Lâm",
    "age": 35,
    "gender": "Nữ",
    "status": "Đã kết thúc",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345023",
    "disease": "Viêm xoang sàng dị ứng",
    "bloodType": "O+",
    "allergies": [
      "Sulfa"
    ],
    "history": [
      "Viêm mũi dị ứng từ nhỏ",
      "Lệch vách ngăn mũi trái"
    ],
    "vitals": {
      "bp": "120/80",
      "hr": 76,
      "temp": 36.8,
      "spo2": 99,
      "weight": 55,
      "height": 160,
      "bmi": 21.5
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm xoang sàng cấp tính / Viêm mũi dị ứng mạn",
        "symptoms": "Đau tức vùng gốc mũi trán, chảy dịch mũi vàng đục ra sau họng gây ho khan, nghẹt mũi.",
        "prescription": [
          "Clamentin 625mg - 2 viên/ngày chia 2 lần uống sau ăn",
          "Xịt mũi Coldy-B - xịt ngày 3 lần",
          "Telfast 180mg - 1 viên/ngày uống tối"
        ]
      }
    ]
  },
  {
    "id": "24",
    "code": "BN-2026-024",
    "name": "Ngô Văn Khánh",
    "age": 42,
    "gender": "Nam",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345024",
    "disease": "Trào ngược họng thanh quản",
    "bloodType": "AB-",
    "allergies": [],
    "history": [
      "Trào ngược dạ dày thực quản (GERD) 3 năm"
    ],
    "vitals": {
      "bp": "125/80",
      "hr": 74,
      "temp": 36.5,
      "spo2": 99,
      "weight": 74,
      "height": 172,
      "bmi": 25.0
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Viêm họng thanh quản do trào ngược dạ dày thực quản (LPR)",
        "symptoms": "Cảm giác vướng đờm cổ họng liên tục, thường khạc nhổ, ho khan nhiều sau ăn và khàn giọng nhẹ.",
        "prescription": [
          "Gastrylgite - 3 gói/ngày uống trước ăn 15 phút",
          "Nexium 40mg - 1 viên/ngày uống trước ăn sáng",
          "Singulair 10mg - 1 viên/ngày uống tối"
        ]
      }
    ]
  },
  {
    "id": "25",
    "code": "BN-2026-025",
    "name": "Dương Thị Hoa",
    "age": 51,
    "gender": "Nữ",
    "status": "Đang khám",
    "appointmentType": "Khám trực tiếp",
    "triage": "Khẩn cấp",
    "lastVisit": "26/05/2026",
    "phone": "0912345025",
    "disease": "Đau quặn hố chậu phải",
    "bloodType": "O+",
    "allergies": [],
    "history": [
      "U xơ tử cung kích thước nhỏ (theo dõi 2 năm)"
    ],
    "vitals": {
      "bp": "122/78",
      "hr": 82,
      "temp": 37.2,
      "spo2": 98,
      "weight": 58,
      "height": 156,
      "bmi": 23.8
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Đau quặn bụng dưới hố chậu phải / Cần loại trừ viêm ruột thừa cấp",
        "symptoms": "Đau quặn âm ỉ liên tục hố chậu phải tăng dần trong 6 giờ qua, có sốt nhẹ 37.2, không nôn.",
        "prescription": [
          "No-Spa 40mg - 2 viên uống giảm co thắt cơ trơn",
          "Chuyển viện đa khoa tuyến trên chụp CT bụng và theo dõi sát"
        ]
      }
    ]
  },
  {
    "id": "26",
    "code": "BN-2026-026",
    "name": "Đặng Văn Hải",
    "age": 48,
    "gender": "Nam",
    "status": "Đã kết thúc",
    "appointmentType": "Cả hai",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345026",
    "disease": "Mỡ máu cao, gan nhiễm mỡ",
    "bloodType": "A+",
    "allergies": [],
    "history": [
      "Hút thuốc lá nhiều (20 năm), thừa cân béo phì độ I"
    ],
    "vitals": {
      "bp": "132/88",
      "hr": 80,
      "temp": 36.6,
      "spo2": 97,
      "weight": 82,
      "height": 170,
      "bmi": 28.4
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Rối loạn lipid máu hỗn hợp / Gan nhiễm mỡ độ II trên siêu âm",
        "symptoms": "Khám sức khỏe định kỳ phát hiện cholesterol và triglycerid tăng cao, gan nhiễm mỡ.",
        "prescription": [
          "Lipanthyl Supra 160mg - 1 viên/ngày uống tối sau ăn",
          "Bổ gan Boganic - 4 viên/ngày chia 2 lần",
          "Tư vấn bỏ thuốc lá và giảm cân"
        ]
      }
    ]
  },
  {
    "id": "27",
    "code": "BN-2026-027",
    "name": "Phan Thị Lan",
    "age": 60,
    "gender": "Nữ",
    "status": "Đang chờ",
    "appointmentType": "Tư vấn",
    "triage": "Cần khám",
    "lastVisit": "26/05/2026",
    "phone": "0912345027",
    "disease": "Đau nhức các khớp ngón tay",
    "bloodType": "B+",
    "allergies": [],
    "history": [
      "Viêm khớp dạng thấp phát hiện năm 2023"
    ],
    "vitals": {
      "bp": "135/82",
      "hr": 78,
      "temp": 36.7,
      "spo2": 98,
      "weight": 50,
      "height": 154,
      "bmi": 21.1
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Viêm khớp dạng thấp tiến triển đợt cấp nhẹ",
        "symptoms": "Các khớp ngón tay hai bên sưng đau đối xứng, cứng khớp buổi sáng kéo dài khoảng 30 phút.",
        "prescription": [
          "Medrol 4mg - 1 viên/ngày uống sáng sau ăn",
          "Celebrex 200mg - 1 viên/ngày uống tối sau ăn",
          "Glucosamin 1500mg - 1 gói/ngày"
        ]
      }
    ]
  },
  {
    "id": "28",
    "code": "BN-2026-028",
    "name": "Vũ Văn Bình",
    "age": 31,
    "gender": "Nam",
    "status": "Đang khám",
    "appointmentType": "Khám trực tiếp",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345028",
    "disease": "Ù tai, giảm thính lực nhẹ",
    "bloodType": "O+",
    "allergies": [],
    "history": [
      "Chấn thương âm thanh do tai nghe (nghe nhạc to liên tục)"
    ],
    "vitals": {
      "bp": "118/76",
      "hr": 74,
      "temp": 36.5,
      "spo2": 99,
      "weight": 68,
      "height": 174,
      "bmi": 22.5
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Ù tai thần kinh thể nhẹ / Mệt mỏi thính giác tạm thời",
        "symptoms": "Tai phải nghe tiếng ve kêu u u liên tục 3 ngày nay kèm theo mệt mỏi đầu óc nhiều.",
        "prescription": [
          "Tanganil 500mg - 4 viên/ngày chia 2 lần uống",
          "Nootropyl 800mg - 2 viên/ngày chia 2 lần",
          "Tebonin 120mg - 1 viên/ngày uống sáng"
        ]
      }
    ]
  },
  {
    "id": "29",
    "code": "BN-2026-029",
    "name": "Bùi Thị Mai",
    "age": 27,
    "gender": "Nữ",
    "status": "Đã kết thúc",
    "appointmentType": "Tư vấn",
    "triage": "Bình thường",
    "lastVisit": "26/05/2026",
    "phone": "0912345029",
    "disease": "Ngứa da nổi sẩn mề đay",
    "bloodType": "AB+",
    "allergies": [
      "Hải sản",
      "Nhộng tằm"
    ],
    "history": [
      "Mề đay vô căn tái phát nhiều lần"
    ],
    "vitals": {
      "bp": "112/72",
      "hr": 82,
      "temp": 36.6,
      "spo2": 99,
      "weight": 49,
      "height": 160,
      "bmi": 19.1
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Lê Minh",
        "diagnosis": "Mày đay cấp do dị ứng thức ăn (nghi hải sản)",
        "symptoms": "Nổi sẩn ngứa đỏ hình tròn đa cung rải rác toàn thân sau khi ăn tôm ghẹ khoảng 2 giờ.",
        "prescription": [
          "Fexofenadine 180mg (Telfast) - 1 viên/ngày uống tối",
          "Medrol 4mg - 1 viên/ngày uống sáng (dùng ngắn 3 ngày)",
          "Kem bôi Gentrisone bôi mỏng vùng ngứa"
        ]
      }
    ]
  },
  {
    "id": "30",
    "code": "BN-2026-030",
    "name": "Nguyễn Thị Vân",
    "age": 64,
    "gender": "Nữ",
    "status": "Đang chờ",
    "appointmentType": "Khám trực tiếp",
    "triage": "Khẩn cấp",
    "lastVisit": "26/05/2026",
    "phone": "0912345030",
    "disease": "Đau khớp háng trái",
    "bloodType": "O-",
    "allergies": [],
    "history": [
      "Thoái hóa khớp háng trái độ II"
    ],
    "vitals": {
      "bp": "138/84",
      "hr": 76,
      "temp": 36.7,
      "spo2": 97,
      "weight": 56,
      "height": 155,
      "bmi": 23.3
    },
    "pastEncounters": [
      {
        "date": "26/05/2026",
        "doctor": "BS. Trần Hùng",
        "diagnosis": "Thoái hóa khớp háng trái gây đau hạn chế vận động",
        "symptoms": "Đau chói khớp háng trái khi đi lại hoặc đứng lâu, đứng lên ngồi xuống rất khó khăn.",
        "prescription": [
          "Meloxicam 7.5mg - 1 viên/ngày uống trưa sau ăn",
          "Diacerein 50mg - 2 viên/ngày chia 2 lần uống",
          "Esomeprazole 20mg - 1 viên/ngày uống trước ăn sáng"
        ]
      }
    ]
  }
]

const upcomingAppointments = {
  "1": {
    "time": "08:00 - 08:30",
    "date": "27/05/2026",
    "type": "Tư vấn",
    "reason": "Sốt cao co giật nhẹ",
    "status": "Đang chờ"
  },
  "2": {
    "time": "08:30 - 09:00",
    "date": "27/05/2026",
    "type": "Tư vấn",
    "reason": "Đau ngực trái kéo dài",
    "status": "Đang chờ"
  },
  "3": {
    "time": "09:00 - 09:30",
    "date": "27/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Ho khan kéo dài về đêm",
    "status": "Đã khám"
  },
  "4": {
    "time": "09:30 - 10:00",
    "date": "27/05/2026",
    "type": "Cả hai",
    "reason": "Tiền sử huyết áp cao",
    "status": "Đang khám"
  },
  "5": {
    "time": "10:00 - 10:30",
    "date": "27/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Đau khớp gối mãn tính",
    "status": "Đã khám"
  },
  "6": {
    "time": "10:30 - 11:00",
    "date": "27/05/2026",
    "type": "Tư vấn",
    "reason": "Dị ứng phấn hoa",
    "status": "Đang chờ"
  },
  "7": {
    "time": "14:00 - 14:30",
    "date": "27/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Đau khớp vai phải",
    "status": "Đang khám"
  },
  "8": {
    "time": "14:30 - 15:00",
    "date": "27/05/2026",
    "type": "Cả hai",
    "reason": "Rối loạn tiêu hóa",
    "status": "Đã khám"
  },
  "9": {
    "time": "15:00 - 15:30",
    "date": "27/05/2026",
    "type": "Tư vấn",
    "reason": "Đau lưng cấp tính",
    "status": "Đang chờ"
  },
  "10": {
    "time": "15:30 - 16:00",
    "date": "27/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Mắt nhìn mờ dần",
    "status": "Đã khám"
  },
  "11": {
    "time": "16:00 - 16:30",
    "date": "27/05/2026",
    "type": "Tư vấn",
    "reason": "Ho kéo dài, rát họng",
    "status": "Đang chờ"
  },
  "12": {
    "time": "16:30 - 17:00",
    "date": "27/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Mất ngủ kéo dài",
    "status": "Đang khám"
  },
  "13": {
    "time": "08:00 - 08:30",
    "date": "27/05/2026",
    "type": "Tư vấn",
    "reason": "Đau dạ dày lúc đói",
    "status": "Đã khám"
  },
  "14": {
    "time": "08:30 - 09:00",
    "date": "27/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Khám thai định kỳ",
    "status": "Đang chờ"
  },
  "15": {
    "time": "09:00 - 09:30",
    "date": "27/05/2026",
    "type": "Cả hai",
    "reason": "Tê bì chân tay",
    "status": "Đang khám"
  },
  "16": {
    "time": "09:30 - 10:00",
    "date": "28/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Trĩ nội độ II chảy máu",
    "status": "Đang chờ"
  },
  "17": {
    "time": "10:00 - 10:30",
    "date": "28/05/2026",
    "type": "Tư vấn",
    "reason": "Đau thượng vị cấp",
    "status": "Đang khám"
  },
  "18": {
    "time": "10:30 - 11:00",
    "date": "28/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Phì đại tuyến tiền liệt",
    "status": "Đã khám"
  },
  "19": {
    "time": "14:00 - 14:30",
    "date": "28/05/2026",
    "type": "Tư vấn",
    "reason": "Rối loạn kinh nguyệt",
    "status": "Đang chờ"
  },
  "20": {
    "time": "14:30 - 15:00",
    "date": "28/05/2026",
    "type": "Cả hai",
    "reason": "Đau vai gáy tê tay",
    "status": "Đang khám"
  },
  "21": {
    "time": "15:00 - 15:30",
    "date": "28/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Khô mắt, mỏi điều tiết",
    "status": "Đã khám"
  },
  "22": {
    "time": "15:30 - 16:00",
    "date": "28/05/2026",
    "type": "Tư vấn",
    "reason": "Đau lưng lan xuống chân",
    "status": "Đang chờ"
  },
  "23": {
    "time": "16:00 - 16:30",
    "date": "28/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Viêm xoang sàng dị ứng",
    "status": "Đã khám"
  },
  "24": {
    "time": "16:30 - 17:00",
    "date": "28/05/2026",
    "type": "Tư vấn",
    "reason": "Trào ngược họng thanh quản",
    "status": "Đang chờ"
  },
  "25": {
    "time": "08:00 - 08:30",
    "date": "28/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Đau quặn hố chậu phải",
    "status": "Đang khám"
  },
  "26": {
    "time": "08:30 - 09:00",
    "date": "29/05/2026",
    "type": "Cả hai",
    "reason": "Mỡ máu cao, gan nhiễm mỡ",
    "status": "Đã khám"
  },
  "27": {
    "time": "09:00 - 09:30",
    "date": "29/05/2026",
    "type": "Tư vấn",
    "reason": "Đau nhức các khớp ngón tay",
    "status": "Đang chờ"
  },
  "28": {
    "time": "09:30 - 10:00",
    "date": "29/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Ù tai, giảm thính lực nhẹ",
    "status": "Đang khám"
  },
  "29": {
    "time": "10:00 - 10:30",
    "date": "29/05/2026",
    "type": "Tư vấn",
    "reason": "Ngứa da nổi sẩn mề đay",
    "status": "Đã khám"
  },
  "30": {
    "time": "10:30 - 11:00",
    "date": "29/05/2026",
    "type": "Khám trực tiếp",
    "reason": "Đau khớp háng trái",
    "status": "Đang chờ"
  }
}

export function PatientListTab({
  onBackToDashboard,
  initialActivePatientId,
  onClearActivePatient,
  initialSelectedEncounterDate,
  onBackToReferrer,
  referrerTabName
}: {
  onBackToDashboard?: () => void
  initialActivePatientId?: string | null
  onClearActivePatient?: () => void
  initialSelectedEncounterDate?: string | null
  onBackToReferrer?: () => void
  referrerTabName?: string
}) {
  const [patients, setPatients] = useState(initialPatients)
  const [activePatientId, setActivePatientId] = useState<string | null>(initialActivePatientId || null)
  const [selectedEncounterIdx, setSelectedEncounterIdx] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceFilter, setServiceFilter] = useState<'Tất cả' | 'Tư vấn' | 'Khám trực tiếp' | 'Cả hai'>('Tất cả')
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Đang chờ' | 'Đang khám' | 'Đã kết thúc'>('Tất cả')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [timeFilter, setTimeFilter] = useState<'Hôm nay' | 'Tuần này' | 'Tháng này'>('Hôm nay')

  // When navigated from another tab with a pre-selected patient ID, open that patient
  useEffect(() => {
    if (initialActivePatientId) {
      setActivePatientId(initialActivePatientId)
      
      // Try to find the exact index matching the pre-selected encounter date
      if (initialSelectedEncounterDate) {
        const p = patients.find(pat => pat.id === initialActivePatientId)
        if (p) {
          const idx = p.pastEncounters.findIndex(enc => enc.date === initialSelectedEncounterDate)
          if (idx !== -1) {
            setSelectedEncounterIdx(idx)
            return
          }
        }
      }
      setSelectedEncounterIdx(0)
    }
  }, [initialActivePatientId, initialSelectedEncounterDate])

  // Find active patient details
  const activePatient = patients.find(p => p.id === activePatientId)

  // Handler for toast messages
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Calculate statistics for the 4 wireframe summary cards
  const filterMultiplier = timeFilter === 'Tuần này' ? 5 : timeFilter === 'Tháng này' ? 20 : 1
  const stats = {
    total: 50 * filterMultiplier,      // Total patients (Tổng số bệnh nhân: 50)
    waiting: 12 * filterMultiplier,    // Waiting (Đang chờ: 12)
    processing: 5 * filterMultiplier,  // In progress (Đang xử lý: 5)
    urgent: 2 * filterMultiplier,      // High priority (Ưu tiên cao: 2)
  }

  const getDeltaText = (baseDelta: string) => {
    if (timeFilter === 'Hôm nay') return `${baseDelta} so với hôm qua`
    if (timeFilter === 'Tuần này') return `${baseDelta} so với tuần trước`
    if (timeFilter === 'Tháng này') return `${baseDelta} so với tháng trước`
    return baseDelta
  }

  // Filter & Search logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)

    const matchesService = serviceFilter === 'Tất cả' || p.appointmentType === serviceFilter
    const matchesStatus = statusFilter === 'Tất cả' || p.status === statusFilter

    return matchesSearch && matchesService && matchesStatus
  })

  const paginatedPatients = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, serviceFilter, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // EMR Details view render (Matches the EMR Patient Detail Wireframe exactly + Interactive Visit History)
  if (activePatientId && activePatient) {
    const p = activePatient
    const enc = p.pastEncounters[selectedEncounterIdx] || p.pastEncounters[0]
    const appt = upcomingAppointments[p.id as keyof typeof upcomingAppointments]

    return (
      <div className="emr-view-container">
        {toastMessage && <div className="emr-toast">{toastMessage}</div>}

        {/* Return Button at top left */}
        <ReturnButton
          onClick={() => {
            if (onBackToReferrer) {
              onBackToReferrer()
            } else {
              setActivePatientId(null)
              setSelectedEncounterIdx(0)
              onClearActivePatient?.()
            }
          }}
          title={
            onBackToReferrer
              ? (referrerTabName === 'Tư vấn trực tiếp'
                  ? "Quay lại màn nhắn tin"
                  : referrerTabName === 'Dashboard'
                  ? "Quay lại Dashboard"
                  : referrerTabName === 'Ca khám'
                  ? "Quay lại ca khám"
                  : `Quay lại ${referrerTabName}`)
              : "Quay lại danh sách"
          }
          style={{ marginBottom: '16px' }}
        />

        {/* EMR Top Title Header */}
        <div className="emr-view-header-block">
          <h1 className="emr-view-title">HỒ SƠ BỆNH ÁN CHI TIẾT</h1>
        </div>

        {/* Profile Card Section */}
        <section className="emr-profile-section">
          <div className="emr-avatar-circle">
            {p.name.split(' ').pop()?.[0]}
          </div>

          <div className="emr-profile-box">
            <div className="profile-detail-item">
              <span className="detail-label">Mã bệnh nhân:</span>
              <strong className="detail-value">{p.code}</strong>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Họ tên & Tuổi:</span>
              <strong className="detail-value">{p.name} ({p.age} tuổi)</strong>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Giới tính & Nhóm máu:</span>
              <strong className="detail-value">{p.gender} • Nhóm máu {p.bloodType}</strong>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Số điện thoại:</span>
              <strong className="detail-value">{p.phone}</strong>
            </div>
          </div>
        </section>

        <hr className="emr-divider" />

        {/* Two-Column Info Cards (Visit History in Left Column, Medical History & Allergies in Right Column) */}
        <div className="emr-two-columns">
          {/* Column 1: Lịch sử lượt khám gần đây (Left) */}
          <div className="emr-col-left">
            <article className="emr-column-card" style={{ height: '100%' }}>
              <h3 className="emr-column-title">Lịch sử lượt khám gần đây</h3>
              <div className="encounter-history-list">
                {p.pastEncounters.map((item, idx) => (
                  <div
                    key={idx}
                    className={`encounter-history-item ${selectedEncounterIdx === idx ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedEncounterIdx(idx)
                    }}
                  >
                    <div className="history-item-meta">
                      <span className="visit-meta">{item.date} • {item.doctor}</span>
                      {selectedEncounterIdx === idx && <span className="active-badge">Đang chọn</span>}
                    </div>
                    <div className="history-item-diag">{item.diagnosis}</div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Column 2: Tiền sử & Cảnh báo dị ứng (Right) */}
          <div className="emr-col-right">
            <article className="emr-column-card" style={{ height: '100%' }}>
              <h3 className="emr-column-title">Tiền sử & Cảnh báo dị ứng</h3>
              <div className="emr-history-allergy-content">
                <div className="allergy-warn-box">
                  <span className="warn-label">Dị ứng ghi nhận:</span>
                  <strong className={`warn-val ${p.allergies.length > 0 ? 'alert-red' : ''}`}>
                    {p.allergies.length > 0 ? p.allergies.join(', ') : 'Chưa ghi nhận dị ứng'}
                  </strong>
                </div>

                <div className="history-box-section">
                  <span className="warn-label">Tiền sử bệnh lý:</span>
                  <ul className="history-bullets">
                    {p.history.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Vertical Records List Section (Displays detailed info of selected encounter) */}
        {enc && (
          <section className="emr-records-section">
            <div className="emr-encounter-block">
              {/* Row 1: Triệu chứng & Khám lâm sàng */}
              <div className="emr-records-row">
                <span className="emr-records-label">Triệu chứng & Lâm sàng</span>
                <div className="emr-records-value-box">
                  <strong style={{ display: 'block', marginBottom: '6px' }}>Khám ngày: {enc.date} (Đảm nhận: {enc.doctor})</strong>
                  <p style={{ margin: 0 }}>{enc.symptoms}</p>
                </div>
              </div>

              {/* Row 2: Chẩn đoán y khoa */}
              <div className="emr-records-row">
                <span className="emr-records-label">Chẩn đoán y khoa</span>
                <div className="emr-records-value-box">
                  <strong style={{ color: '#2563EB', fontWeight: 700 }}>{enc.diagnosis}</strong>
                </div>
              </div>

              {/* Row 3: Đơn thuốc chỉ định */}
              <div className="emr-records-row">
                <span className="emr-records-label">Đơn thuốc kê chi tiết</span>
                <div className="emr-records-value-box">
                  {enc.prescription.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {enc.prescription.map((drug, dIdx) => (
                        <li key={dIdx} style={{ fontWeight: 600 }}>{drug}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="emr-no-notes">Không kê đơn thuốc</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Function Actions Buttons at bottom right */}
        <div className="emr-buttons-group">
          <button className="emr-btn-outline" type="button" onClick={() => triggerToast(`Đang kết nối máy in để in đơn thuốc của bệnh nhân ${p.name}...`)}>
            In đơn thuốc
          </button>
          <button className="emr-btn-filled" type="button" onClick={() => triggerToast(`Đang xuất file bệnh án EMR (PDF) của bệnh nhân ${p.name}...`)}>
            Xuất file bệnh án (PDF)
          </button>
        </div>
      </div>
    )
  }

  const columns: Array<DataTableColumn<any>> = [
    {
      key: 'index',
      header: 'STT',
      width: '60px',
      align: 'center',
      render: (_item, index) => index + 1,
    },
    {
      key: 'patient',
      header: 'Bệnh nhân',
      width: '240px',
      render: (item) => (
        <div className="doctor-cell">
          <div className="doctor-avatar" aria-hidden="true" style={{ background: '#E6EFFE' }}>
            <svg viewBox="0 0 24 24" style={{ fill: '#244a6b', stroke: 'none' }}>
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0v1H5v-1Z" />
            </svg>
          </div>
          <div>
            <strong>{item.name}</strong>
            <span>{item.gender} • {item.age} tuổi</span>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      width: '140px',
      align: 'center',
      render: (item) => item.phone
    },
    {
      key: 'disease',
      header: 'Lý do khám',
      width: '220px',
      render: (item) => item.disease
    },
    {
      key: 'appointmentType',
      header: 'Loại hình',
      width: '140px',
      align: 'center',
      render: (item) => item.appointmentType
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '130px',
      align: 'center',
      render: (item) => (
        <span className={`status-pill ${item.status === 'Đang chờ' ? 'waiting' : item.status === 'Đang khám' ? 'processing' : 'done'}`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      width: '120px',
      align: 'left',
      render: (item) => (
        <div className="table-actions">
          <IconButton
            label="Xem bệnh án EMR"
            onClick={() => {
              setActivePatientId(item.id)
              setSelectedEncounterIdx(0)
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </IconButton>
        </div>
      )
    }
  ]

  // Dashboard / Table View Render (Perfect Wireframe representation + Clinically Valued Fields)
  return (
    <div className="patient-page-content">
      {toastMessage && <div className="emr-toast">{toastMessage}</div>}

      {/* Wireframe Metric Stats Summary Bar */}
      <header className="patient-tab-header">
        <div className="tab-titles">
          <h1>Danh sách bệnh nhân</h1>
          <p>Trang quản lý hồ sơ bệnh nhân trong chuỗi phòng khám.</p>
        </div>
        <div className="header-right-filter">
          <FilterSelect
            value={timeFilter}
            options={[
              { label: 'Hôm nay', value: 'Hôm nay' },
              { label: 'Tuần này', value: 'Tuần này' },
              { label: 'Tháng này', value: 'Tháng này' }
            ]}
            onChange={e => setTimeFilter(e.target.value as any)}
          />
        </div>
      </header>

      {/* Summary metric cards row */}
      <div className="metrics-grid doctor-metrics-grid" style={{ marginTop: '18px' }}>
        <MetricCard
          label="Tổng số bệnh nhân"
          value={stats.total}
          delta={getDeltaText("+2.4%")}
          icon={<UsersMetricIcon />}
          iconClassName="metric-icon-blue"
        />
        <MetricCard
          label="Đang chờ"
          value={stats.waiting}
          delta={getDeltaText("-2")}
          icon={<ClockMetricIcon />}
          iconClassName="metric-icon-yellow"
        />
        <MetricCard
          label="Đang khám"
          value={stats.processing}
          delta={getDeltaText("+1")}
          icon={<PulseMetricIcon />}
          iconClassName="metric-icon-green"
        />
        <MetricCard
          label="Ưu tiên cao"
          value={stats.urgent}
          delta={getDeltaText("+12%")}
          icon={<MessageMetricIcon />}
          iconClassName="metric-icon-yellow"
        />
      </div>

      {/* Title & Controls Toolbar */}
      <div className="patient-toolbar">
        <div className="patient-toolbar-filters">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="VD: Nhập mã BN (BN-2026-001) hoặc số điện thoại..."
          />

          <div className="sort-selector-container">
            <FilterSelect
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value as any)}
              options={[
                { value: 'Tất cả', label: 'Dịch vụ' },
                { value: 'Tư vấn', label: 'Tư vấn' },
                { value: 'Khám trực tiếp', label: 'Khám trực tiếp' },
                { value: 'Cả hai', label: 'Cả hai' },
              ]}
            />
          </div>

          <div className="sort-selector-container">
            <FilterSelect
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              options={[
                { value: 'Tất cả', label: 'Trạng thái' },
                { value: 'Đang chờ', label: 'Đang chờ' },
                { value: 'Đang khám', label: 'Đang khám' },
                { value: 'Đã kết thúc', label: 'Đã kết thúc' },
              ]}
            />
          </div>
        </div>

        {/* Top-Right Toolbar Pagination section */}
        <div className="patient-toolbar-pagination">
          <div className="page-size-selector">
            <span className="page-size-label">Hiển thị:</span>
            <select 
              value={pageSize} 
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="page-size-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <span className="page-size-suffix">dòng</span>
          </div>

          <div className="mini-pagination">
            <button 
              className="pag-nav-btn prev" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pag-icon">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`pag-num-btn ${currentPage === page ? 'active' : ''}`} 
                onClick={() => setCurrentPage(page)} 
                type="button"
              >
                {page}
              </button>
            ))}
            <button 
              className="pag-nav-btn next" 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pag-icon">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Upgraded Table Layout of Patients */}
      <div className="patient-table-frame">
        <DataTable
          rows={paginatedPatients}
          columns={columns}
          getRowKey={(p) => p.id}
          emptyState="Không tìm thấy bệnh nhân nào phù hợp."
        />
      </div>
    </div>
  )
}
