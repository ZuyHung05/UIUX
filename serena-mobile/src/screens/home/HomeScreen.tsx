import {
    Calendar, Droplets,
    MessageSquare,
    Navigation
} from 'lucide-react-native';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SearchBar } from '../../components/common/SearchBar';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS } from '../../utils/theme';

export default function HomeScreen() {
    return (
        <MainLayout title="Serena Health" subtitle="Tôi có thể giúp gì cho bạn ?">
            <View style={styles.appointmentCard}>
                <Text style={styles.appointmentTitle}>Bạn có lịch khám lúc 10:00 hôm nay</Text>
                <Text style={styles.appointmentSub}>Phòng khám Đa khoa Tâm Anh, Q.1</Text>
                <View style={styles.appointmentFooter}>
                    <TouchableOpacity style={styles.detailBtn}>
                        <Navigation size={14} color={COLORS.text} style={{ marginRight: 4 }} />
                        <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                    <View style={styles.smallIconCircle}>
                        <Calendar size={14} color={COLORS.white} />
                    </View>
                </View>
            </View>
            <SearchBar />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {['Đau đầu', 'Sốt cao', 'Mất ngủ', 'Chóng mặt'].map((item) => (
                    <TouchableOpacity key={item} style={styles.chip}>
                        <Text style={styles.chipText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionCard}>
                    <View style={[styles.iconBox, { backgroundColor: COLORS.lightBlue }]}>
                        <MessageSquare color={COLORS.primary} size={24} />
                    </View>
                    <Text style={styles.actionText}>Kết nối với{"\n"}bác sĩ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                    <View style={[styles.iconBox, { backgroundColor: COLORS.lightGreen }]}>
                        <Calendar color={COLORS.green} size={24} />
                    </View>
                    <Text style={styles.actionText}>Đặt lịch khám</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                    <Droplets size={18} color={COLORS.secondary} />
                    <Text style={styles.tipTitle}>Thói quen lành mạnh</Text>
                </View>
                <Text style={styles.tipContent}>
                    Uống đủ nước mỗi ngày giúp cải thiện trí nhớ và giảm sương mù não
                </Text>
                <Image
                    source={require('../../assets/drinkWater.png')}
                    style={styles.tipImage}
                />
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    scrollContent: {
        padding: 20,
        paddingBottom: 90,
    },

    // Appointment Card
    appointmentCard: { backgroundColor: COLORS.secondary, borderRadius: 24, padding: 20, marginBottom: 15 },
    appointmentTitle: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
    appointmentSub: { color: 'rgba(255,255,255,0.8)', marginTop: 5 },
    appointmentFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' },
    detailBtn: { backgroundColor: COLORS.white, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
    detailBtnText: { fontWeight: 'bold', fontSize: 13 },
    smallIconCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },

    // Search
    sectionTitleCenter: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 15 },
    searchContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 30, paddingHorizontal: 15, height: 60, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14 },
    micBtn: { backgroundColor: '#F0F7FF', padding: 10, borderRadius: 20 },

    // Chips
    chipScroll: { marginVertical: 20 },
    chip: { backgroundColor: COLORS.lightBlue, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
    chipText: { fontSize: 14, color: COLORS.accent },

    // Action Cards
    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    actionCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 20, padding: 15, alignItems: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#F0F0F0' },
    iconBox: { padding: 12, borderRadius: 15, marginRight: 10 },
    actionText: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },

    // Tip Card
    tipCard: { borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden' },
    tipHeader: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    tipTitle: { color: COLORS.secondary, fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
    tipContent: { paddingHorizontal: 15, paddingBottom: 15, fontSize: 15, color: '#444' },
    tipImage: { width: '100%', height: 150, resizeMode: 'cover' }
});