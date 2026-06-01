import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Plus,
  X,
} from "lucide-react-native";

import { COLORS, TYPOGRAPHY } from "../../utils/theme";

type DoctorCard = {
  name: string;
  specialty: string;
  highlight?: boolean;
  location?: string;
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

const upcomingAppointment = {
  name: "BS. Lê Minh K",
  specialty: "Bác sĩ đa khoa",
  schedule: "Thứ 4, 27/05/2026",
  time: "2:00 PM",
  locationName: "Phòng khám MN",
  locationAddress: "123 Main Street, Downtown",
};

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
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = React.useState(1);

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

        <View style={styles.upcomingCard}>
          <View style={styles.cardDoctorRow}>
            <View style={styles.avatar} />
            <View style={styles.doctorMeta}>
              <Text style={styles.doctorName}>{upcomingAppointment.name}</Text>
              <Text style={styles.doctorSpecialty}>
                {upcomingAppointment.specialty}
              </Text>
            </View>
          </View>

          <View style={styles.infoPanel}>
            <View style={styles.infoRow}>
              <Calendar size={18} color="#64748B" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoPrimary}>
                  {upcomingAppointment.schedule}
                </Text>
                <Text style={styles.infoSecondary}>
                  {upcomingAppointment.time}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={18} color="#64748B" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoPrimary}>
                  {upcomingAppointment.locationName}
                </Text>
                <Text style={styles.infoSecondary}>
                  {upcomingAppointment.locationAddress}
                </Text>
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

        <SectionTitle label="Đặt lịch với bác sĩ" />

        <View style={styles.doctorList}>
          {doctors.map((doctor) => (
            <DoctorCardItem key={doctor.name} doctor={doctor} />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.ctaWrap} pointerEvents="box-none">
        <Pressable
          onPress={() => setBookingVisible(true)}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <Plus size={22} color="white" />
          <Text style={styles.ctaText}>Đặt lịch hẹn khám</Text>
        </Pressable>
      </View>

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
                <Text style={styles.modalDoctorName}>BS. Kiều Thanh N</Text>
                <Text style={styles.modalDoctorSpecialty}>Khoa Da liễu</Text>
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
              onPress={() => {
                setBookingVisible(false);
                Alert.alert("Đặt lịch", "Đã ghi nhận lựa chọn đặt lịch.");
              }}
            >
              <Text style={styles.confirmButtonText}>Đặt lịch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function DoctorCardItem({ doctor }: { doctor: DoctorCard }) {
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
      </View>
    </View>
  );
}

function ActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Pressable
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
    paddingBottom: 170,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
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
    flex: 1,
    height: 30,
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
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 110,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  ctaButton: {
    width: "100%",
    maxWidth: 340,
    minHeight: 68,
    borderRadius: 24,
    backgroundColor: COLORS.primaryDark,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  ctaButtonPressed: {
    opacity: 0.95,
  },
  ctaText: {
    ...TYPOGRAPHY.h2,
    color: "white",
    fontSize: 19,
    lineHeight: 24,
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
    color: COLORS.primaryDark,
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
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
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
    backgroundColor: COLORS.primaryDark,
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
});
