import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Bot,
    Calendar,
    ClipboardList,
    MessageSquare,
    UserPlus
} from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AppButton } from '../../components/common/AppButton';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    return (
        <MainLayout title="Serena Health" subtitle="Serena - Trợ lý y tế thông minh">
            <LinearGradient
                colors={['#3F83F8', '#2563EB']}
                style={styles.appointmentCard}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.appointmentTitle}>Bạn có lịch khám lúc{"\n"}10:00 hôm nay</Text>
                    <View style={styles.glassIcon}>
                        <Calendar size={18} color="#4E9FFF" />
                    </View>
                </View>
                <Text style={styles.appointmentSub}>Phòng khám Đa khoa Tâm Anh, Q.1</Text>

                {/* Hiệu ứng hình tròn mờ phía sau Card (Blur Effect) */}
                <View style={styles.blurCircle} />
            </LinearGradient>

            <LinearGradient
                colors={['rgba(252, 253, 250, 0.44)', 'rgba(174, 211, 255, 0.5)']}
                style={styles.aiCard}
            >
                <View style={styles.aiHeader}>
                    <View style={styles.botAvatar}>
                        <Bot size={28} color="white" />
                    </View>
                    <Text style={styles.aiTitle}>Serena - Trợ lý y tế</Text>
                </View>

                <Text style={styles.aiDescription}>
                    Tôi có thể giúp tư vấn triệu chứng, gợi ý cách cải thiện hoặc kết nối bạn với bác sĩ khi cần thiết.
                </Text>

                <AppButton
                    title="Bắt đầu tư vấn ngay"
                    onPress={() => navigation.navigate('Consultation')}
                    variant="primary"
                    style={styles.aiBtn}
                />
            </LinearGradient>

            <Text style={styles.sectionTitle}>Tính năng chính</Text>
            {/* <View style={styles.featureList}>
                <FeatureItem
                    icon={<MessageSquare color="#4E9FFF" size={24} />}
                    title="Tư vấn từ xa"
                    bgColor="rgba(186, 217, 255, 0.58)"
                />
                <FeatureItem
                    icon={<Calendar color="#34C759" size={24} />}
                    title="Đặt lịch khám"
                    bgColor="#E0FFE6"
                />
                <FeatureItem
                    icon={<ClipboardList color="#FFEB50" size={24} />}
                    title="Theo dõi hồ sơ sức khỏe"
                    bgColor="#FDF3E4"
                />
                <FeatureItem
                    icon={<UserPlus color="#004AC6" size={24} />}
                    title="Kết nối bác sĩ"
                    bgColor="rgba(247, 226, 255, 0.58)"
                />
            </View> */}
            <View style={styles.featureGrid}>
                <FeatureItem
                    icon={<MessageSquare color="#4E9FFF" size={24} />}
                    title="Tư vấn từ xa"
                    bgColor="rgba(186, 217, 255, 0.58)"
                />
                <FeatureItem
                    icon={<Calendar color="#34C759" size={24} />}
                    title="Đặt lịch khám"
                    bgColor="#E0FFE6"
                />
                <FeatureItem
                    icon={<ClipboardList color="#FFEB50" size={20} />}
                    title="Hồ sơ sức khỏe" // Rút ngắn tiêu đề để không bị nhảy dòng quá nhiều
                    bgColor="#FDF3E4"
                />
                <FeatureItem
                    icon={<UserPlus color="#004AC6" size={24} />}
                    title="Kết nối bác sĩ"
                    bgColor="rgba(247, 226, 255, 0.58)"
                />
            </View>

        </MainLayout>
    );
}
const FeatureItem = ({ icon, title, bgColor }: any) => (
    <TouchableOpacity style={styles.featureBox}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
            {icon}
        </View>
        <Text style={styles.featureLabel} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
);
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    scrollContent: {
        padding: 20,
        paddingBottom: 90,
    },

    // Appointment Card
    appointmentCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    appointmentTitle: {
        ...TYPOGRAPHY.h2,
        color: 'white',
        lineHeight: 28,
    },
    glassIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appointmentSub: {
        ...TYPOGRAPHY.body,
        color: 'white',
        marginTop: 10,
        opacity: 0.9,
    },
    blurCircle: {
        position: 'absolute',
        right: -40,
        top: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    // AI Card
    aiCard: {
        borderRadius: 30,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
    },
    botAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#4E9FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiTitle: {
        ...TYPOGRAPHY.h2,
        color: COLORS.text,
    },
    aiDescription: {
        ...TYPOGRAPHY.body,
        color: '#434655',
        lineHeight: 24,
        marginBottom: 20,
    },
    aiBtn: {
        borderRadius: 20,
    },

    // Features
    sectionTitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.primary,
        marginBottom: 15,
        marginLeft: 5,
    },
    featureList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#91C3FF',
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12, // Khoảng cách giữa các ô
    },

    // TỪNG Ô TÍNH NĂNG (DẠNG GRID)
    featureBox: {
        width: '48%', // Để 2 ô nằm trên 1 hàng (có chừa khoảng trống gap)
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center', // Căn giữa nội dung theo chiều dọc
        borderWidth: 1,
        borderColor: '#91C3FF',
        // Đổ bóng nhẹ
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
    },

    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    featureLabel: {
        ...TYPOGRAPHY.caption,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center', // Căn giữa chữ
        color: '#101828',
    },
});