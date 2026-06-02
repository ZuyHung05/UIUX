import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  X,
} from "lucide-react-native";
import Svg, { Path, Rect, G, ClipPath, Defs } from "react-native-svg";

import { COLORS, TYPOGRAPHY } from "../../utils/theme";

type DoctorCard = {
  name: string;
  specialty: string;
  highlight?: boolean;
  location?: string;
};

type Appointment = {
  name: string;
  specialty: string;
  schedule: string;
  time: string;
  locationName: string;
  locationAddress: string;
};

type TimeSlot = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
};

type DateChip = {
  dayLabel: string;
  date: string;
  selected?: boolean;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const initialAppointments: Appointment[] = [
  {
    name: "BS. Lê Minh K",
    specialty: "Bác sĩ đa khoa",
    schedule: "Thứ 4, 27/05/2026",
    time: "2:00 PM",
    locationName: "Phòng khám MN",
    locationAddress: "123 Main Street, Downtown",
  },
];

const dayNames = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

const doctors: DoctorCard[] = [
  {
    name: "BS. Nguyễn Văn M",
    specialty: "Đa khoa",
    highlight: true,
    location: "Phòng khám MN",
  },
  {
    name: "BS. Kiều Thanh N",
    specialty: "Khoa nội",
    highlight: true,
    location: "Phòng khám MN",
  },
  {
    name: "BS. Trần Văn A",
    specialty: "Khoa ngoại",
    highlight: true,
    location: "Phòng khám MN",
  },
];

const dateChips: DateChip[] = [
  { dayLabel: "Th 2", date: "15", selected: true },
  { dayLabel: "Th 3", date: "16" },
  { dayLabel: "Th 4", date: "17" },
  { dayLabel: "Th 5", date: "18" },
  { dayLabel: "Th 6", date: "19" },
];

const timeSlots: TimeSlot[] = [
  { label: "08:00" },
  { label: "09:30", selected: true },
  { label: "11:00", disabled: true },
  { label: "14:00" },
  { label: "15:30" },
  { label: "17:00" },
];

export default function AppointmentScreen() {
  const [bookingVisible, setBookingVisible] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = React.useState(1);
  const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorCard | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<Appointment[]>(initialAppointments);

  const handleBookDoctor = (doctor: DoctorCard) => {
    setSelectedDoctor(doctor);
    setBookingVisible(true);
  };

  const handleRequestConfirm = () => {
    setBookingVisible(false);
    setConfirmVisible(true);
  };

  const handleCancelConfirm = () => {
    setConfirmVisible(false);
    setBookingVisible(true);
  };

  const handleConfirmBooking = () => {
    if (selectedDoctor) {
      const selectedDate = dateChips[selectedDateIndex];
      const selectedTime = timeSlots[selectedTimeIndex];
      const dateNum = parseInt(selectedDate.date, 10);
      const refDate = new Date(2026, 4, dateNum); // May 2026
      const dayName = dayNames[refDate.getDay()];
      const scheduleStr = `${dayName}, ${String(dateNum).padStart(2, "0")}/05/2026`;

      const newAppointment: Appointment = {
        name: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        schedule: scheduleStr,
        time: selectedTime.label,
        locationName: selectedDoctor.location ?? "Phòng khám MN",
        locationAddress: "123 Main Street, Downtown",
      };
      setUpcomingAppointments((prev) => [newAppointment, ...prev]);
    }
    setConfirmVisible(false);
    setBookingVisible(false);
  };

  const getConfirmText = () => {
    const doctorName = selectedDoctor?.name ?? "";
    const time = timeSlots[selectedTimeIndex]?.label ?? "";
    const date = dateChips[selectedDateIndex]?.date ?? "";
    return { doctorName, time, date: `${date}/05/2026` };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/SerenaIcon.png")}
            style={styles.logo}
          />
          <View>
            <Text style={styles.headerTitle}>Lịch hẹn</Text>
            <Text style={styles.headerSubtitle}>Quản lý lịch khám của bạn</Text>
          </View>
        </View>
        <Pressable
          onPress={() => Alert.alert("Thông báo", "Chưa có thông báo mới.")}
          hitSlop={10}
          style={styles.bellButton}
        >
          <Bell size={28} color={COLORS.secondary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle label="Lịch hẹn sắp diễn ra" />

        {upcomingAppointments.map((appt, idx) => (
          <View key={`${appt.name}-${idx}`} style={styles.upcomingCard}>
            <View style={styles.cardDoctorRow}>
              <View style={styles.avatar} />
              <View style={styles.doctorMeta}>
                <Text style={styles.doctorName}>{appt.name}</Text>
                <Text style={styles.doctorSpecialty}>{appt.specialty}</Text>
              </View>
            </View>

            <View style={styles.infoPanel}>
              <View style={styles.infoRow}>
                <Calendar size={18} color="#64748B" />
                <View style={styles.infoTextBlock}>
                  <Text style={styles.infoPrimary}>{appt.schedule}</Text>
                  <Text style={styles.infoSecondary}>{appt.time}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MapPin size={18} color="#64748B" />
                <View style={styles.infoTextBlock}>
                  <Text style={styles.infoPrimary}>{appt.locationName}</Text>
                  <Text style={styles.infoSecondary}>{appt.locationAddress}</Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <ActionChip
                icon={<MapPin size={15} color="#244A6B" />}
                label="Địa chỉ"
              />
              <ActionChip
                icon={<Phone size={15} color="#244A6B" />}
                label="Liên hệ"
              />
            </View>
          </View>
        ))}

        <SectionTitle label="Đặt lịch với bác sĩ" />

        <View style={styles.doctorList}>
          {doctors.map((doctor) => (
            <DoctorCardItem key={doctor.name} doctor={doctor} onBook={() => handleBookDoctor(doctor)} />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>


      <Modal
        visible={bookingVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBookingVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setBookingVisible(false)}
          />

          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Đặt lịch khám</Text>
              <TouchableOpacity
                onPress={() => setBookingVisible(false)}
                style={styles.closeButton}
                hitSlop={10}
              >
                <X size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <View style={styles.selectedDoctorCard}>
              <View style={styles.modalAvatar} />
              <View style={styles.selectedDoctorMeta}>
                <Text style={styles.modalDoctorName}>{selectedDoctor?.name ?? "BS. Kiều Thanh N"}</Text>
                <Text style={styles.modalDoctorSpecialty}>{selectedDoctor?.specialty ?? "Khoa Da liễu"}</Text>
              </View>
            </View>

            <View style={styles.monthRow}>
              <TouchableOpacity style={styles.monthNav} hitSlop={8}>
                <ChevronLeft size={18} color="#1E3A52" />
              </TouchableOpacity>
              <Text style={styles.monthLabel}>Tháng 5, 2026</Text>
              <TouchableOpacity style={styles.monthNav} hitSlop={8}>
                <ChevronRight size={18} color="#1E3A52" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateRow}>
              {dateChips.map((item) => (
                <Pressable
                  key={`${item.dayLabel}-${item.date}`}
                  style={[
                    styles.dateChip,
                    selectedDateIndex === dateChips.indexOf(item) &&
                      styles.dateChipSelected,
                  ]}
                  onPress={() => setSelectedDateIndex(dateChips.indexOf(item))}
                >
                  <Text style={styles.dateChipDay}>{item.dayLabel}</Text>
                  <Text
                    style={[
                      styles.dateChipDate,
                      selectedDateIndex === dateChips.indexOf(item) &&
                        styles.dateChipDateSelected,
                    ]}
                  >
                    {item.date}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.slotTitle}>Chọn khung giờ</Text>

            <View style={styles.slotGrid}>
              {timeSlots.map((slot, index) => (
                <Pressable
                  key={slot.label}
                  style={[
                    styles.slotChip,
                    selectedTimeIndex === index && styles.slotChipSelected,
                    slot.disabled && styles.slotChipDisabled,
                  ]}
                  disabled={slot.disabled}
                  onPress={() => setSelectedTimeIndex(index)}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selectedTimeIndex === index && styles.slotTextSelected,
                      slot.disabled && styles.slotTextDisabled,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleRequestConfirm}
            >
              <Text style={styles.confirmButtonText}>Đặt lịch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelConfirm}
      >
        <View style={styles.confirmOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleCancelConfirm}
          />
          <View style={styles.confirmCard}>
            <View style={styles.confirmHeaderRow}>
              <View style={styles.confirmIconWrap}>
                <CalendarConfirmIcon />
              </View>
              <Text style={styles.confirmTitle}>Xác nhận đặt lịch</Text>
            </View>
            <Text style={styles.confirmDesc}>
              Bạn có chắc chắn muốn đặt lịch khám với{" "}
              <Text style={styles.confirmBold}>{getConfirmText().doctorName}</Text>{" "}
              vào lúc{" "}
              <Text style={styles.confirmHighlight}>{getConfirmText().time}</Text>{" "}
              ngày{" "}
              <Text style={styles.confirmBold}>{getConfirmText().date}</Text>{" "}
              không?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={handleCancelConfirm}
              >
                <Text style={styles.confirmCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmAcceptBtn}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmAcceptText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function DoctorCardItem({ doctor, onBook }: { doctor: DoctorCard; onBook: () => void }) {
  return (
    <View
      style={[
        styles.doctorCard,
        doctor.highlight && styles.doctorCardHighlight,
      ]}
    >
      <View style={styles.cardDoctorRow}>
        <View style={styles.avatar} />
        <View style={styles.doctorMeta}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <ActionChip
          icon={<MapPin size={15} color="#244A6B" />}
          label="Địa chỉ"
        />
        <ActionChip
          icon={<Phone size={15} color="#244A6B" />}
          label="Liên hệ"
        />
        <ActionChip
          icon={<CalendarBookIcon />}
          label="Đặt lịch"
          onPress={onBook}
        />
      </View>
    </View>
  );
}

function CalendarBookIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <G clipPath="url(#clip0_1309_591)">
        <Path d="M5.30322 1.32422V3.97589" stroke="#244A6B" strokeWidth={1.999} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10.6064 1.32422V3.97589" stroke="#244A6B" strokeWidth={1.999} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12.5954 2.65234H3.3146C2.58237 2.65234 1.98877 3.24594 1.98877 3.97818V13.259C1.98877 13.9912 2.58237 14.5848 3.3146 14.5848H12.5954C13.3277 14.5848 13.9213 13.9912 13.9213 13.259V3.97818C13.9213 3.24594 13.3277 2.65234 12.5954 2.65234Z" stroke="#244A6B" strokeWidth={1.999} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M1.98877 6.62891H13.9213" stroke="#244A6B" strokeWidth={1.999} strokeLinecap="round" strokeLinejoin="round" />
      </G>
      <Defs>
        <ClipPath id="clip0_1309_591">
          <Rect width={15.91} height={15.91} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function CalendarConfirmIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 16 16" fill="none">
      <G clipPath="url(#clip0_confirm)">
        <Path d="M5.30322 1.32422V3.97589" stroke="#5B9DFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10.6064 1.32422V3.97589" stroke="#5B9DFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12.5954 2.65234H3.3146C2.58237 2.65234 1.98877 3.24594 1.98877 3.97818V13.259C1.98877 13.9912 2.58237 14.5848 3.3146 14.5848H12.5954C13.3277 14.5848 13.9213 13.9912 13.9213 13.259V3.97818C13.9213 3.24594 13.3277 2.65234 12.5954 2.65234Z" stroke="#5B9DFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M1.98877 6.62891H13.9213" stroke="#5B9DFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </G>
      <Defs>
        <ClipPath id="clip0_confirm">
          <Rect width={15.91} height={15.91} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function ActionChip({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
    >
      {icon}
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.accent,
    lineHeight: 34,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtext,
    marginTop: 2,
  },
  bellButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: "#5B9DFF",
    marginBottom: 12,
  },
  upcomingCard: {
    backgroundColor: COLORS.white,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  doctorCard: {
    backgroundColor: COLORS.white,
    borderLeftWidth: 3,
    borderLeftColor: "#91C3FF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  doctorCardHighlight: {
    borderLeftColor: "#8DC1FF",
  },
  cardDoctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#A3B8CE",
  },
  doctorMeta: {
    flex: 1,
  },
  doctorName: {
    ...TYPOGRAPHY.h2,
    color: "#1E3A52",
    lineHeight: 28,
  },
  doctorSpecialty: {
    ...TYPOGRAPHY.body,
    color: COLORS.subtext,
    marginTop: 4,
  },
  infoPanel: {
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoTextBlock: {
    flex: 1,
  },
  infoPrimary: {
    ...TYPOGRAPHY.body,
    color: "#101828",
    lineHeight: 22,
  },
  infoSecondary: {
    ...TYPOGRAPHY.body,
    color: COLORS.subtext,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "rgba(141, 193, 255, 0.59)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  chipPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  chipText: {
    ...TYPOGRAPHY.button,
    color: "#244A6B",
    fontSize: 15,
    lineHeight: 18,
  },
  doctorList: {
    gap: 0,
  },
  bottomSpacer: {
    height: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20, // Chỉ bo góc trên
    borderTopRightRadius: 20,
    // borderBottomLeftRadius: 0,  // Đảm bảo góc dưới vuông
    // borderBottomRightRadius: 0,
    padding: 20, // Hoặc padding theo thiết kế của bạn
    marginBottom: 0, // QUAN TRỌNG: Đảm bảo không có margin dưới
    width: "100%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 99,
    backgroundColor: "#CBD5E1",
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: {
    ...TYPOGRAPHY.h2,
    color: "#1E293B",
    fontSize: 22,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDoctorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#A3B8CE",
  },
  selectedDoctorMeta: {
    flex: 1,
  },
  modalDoctorName: {
    ...TYPOGRAPHY.title,
    color: "#111827",
  },
  modalDoctorSpecialty: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtext,
    marginTop: 2,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthNav: {
    width: 24,
    height: 24,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    ...TYPOGRAPHY.title,
    color: "#1E3A52",
    fontSize: 18,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  dateChip: {
    width: 60,
    minHeight: 78,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  dateChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(91, 157, 255, 0.12)",
  },
  dateChipDay: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 12,
  },
  dateChipDate: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    fontSize: 22,
    lineHeight: 26,
    marginTop: 2,
  },
  dateChipDateSelected: {
    color: COLORS.primary,
  },
  slotTitle: {
    ...TYPOGRAPHY.title,
    color: "#1E293B",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12, // Dùng gap thay vì space-between để tạo khoảng cách đều nhau
    marginTop: 10,
  },

  slotChip: {
    width: "22%", // Giảm % xuống một chút (khoảng 22 - 23%) để chừa chỗ cho 3 cái gap ở giữa
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    // marginBottom: 12,     // XÓA dòng này đi, vì thẻ cha đã có "gap" lo luôn cả khoảng cách trên dưới rồi
    backgroundColor: "#FFFFFF",
  },
  slotChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotChipDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  slotText: {
    ...TYPOGRAPHY.body,
    color: "#334155",
    fontSize: 14,
  },
  slotTextSelected: {
    color: COLORS.white,
  },
  slotTextDisabled: {
    color: "#94A3B8",
  },
  confirmButton: {
    minHeight: 46,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginTop: 30,
  },
  confirmButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    fontSize: 17,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  confirmCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 27,
    paddingBottom: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  confirmHeaderRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    alignSelf: "flex-start" as const,
  },
  confirmIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 99,
    backgroundColor: "rgba(91, 157, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmTitle: {
    ...TYPOGRAPHY.h2,
    color: "#3F83F8",
    fontSize: 24,
  },
  confirmDesc: {
    ...TYPOGRAPHY.body,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  confirmBold: {
    fontWeight: "700" as const,
    color: "#1E3A52",
  },
  confirmHighlight: {
    fontWeight: "700" as const,
    color: "#5B9DFF",
  },
  confirmActions: {
    flexDirection: "row" as const,
    gap: 12,
    width: "100%",
  },
  confirmCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  confirmCancelText: {
    ...TYPOGRAPHY.button,
    color: "#4B5563",
    fontSize: 16,
  },
  confirmAcceptBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5B9DFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#5B9DFF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  confirmAcceptText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    fontSize: 16,
  },
});