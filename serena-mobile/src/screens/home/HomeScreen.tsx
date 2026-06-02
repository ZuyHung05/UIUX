import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Bot,
    Calendar,
    ChevronRight,
    ClipboardList,
    MessageSquare,
    Stethoscope
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
            <TouchableOpacity style={styles.appointmentCard}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.appointmentTitle}>Bạn có lịch khám lúc 10:00 hôm nay</Text>
                        <Text style={styles.appointmentSub}>Đa khoa Tâm Anh, Q.1</Text>
                    </View>
                    <View style={styles.arrowIcon}>
                        <ChevronRight size={18} color="white" />
                    </View>
                </View>
            </TouchableOpacity>

            <LinearGradient
                colors={['rgba(174, 211, 255, 0.5)', 'rgba(252, 253, 250, 0.44)']}
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

            <Text style={styles.sectionTitle}>Dịch vụ dành cho bạn</Text>
            <View style={styles.featureGrid}>
                <FeatureItem
                    icon={<MessageSquare color="#7EB9FF" size={26} />}
                    title="Tư vấn với AI"
                    subtitle="Tư vấn sức khỏe ban đầu với AI"
                    bgColor="#E3F0FF"
                />
                <FeatureItem
                    icon={<Stethoscope color="#B694FF" size={26} />}
                    title="Tư vấn Bác sĩ"
                    subtitle="Kết nối trực tiếp với bác sĩ"
                    bgColor="#F3E8FF"
                />
                <FeatureItem
                    icon={<Calendar color="#6BCF6B" size={26} />}
                    title="Đặt lịch khám"
                    subtitle="Đặt lịch hẹn trực tiếp với bác sĩ"
                    bgColor="#E8FFE8"
                />
                <FeatureItem
                    icon={<ClipboardList color="#FFA94D" size={26} />}
                    title="Hồ sơ sức khỏe"
                    subtitle="Quản lý thông tin y tế cá nhân"
                    bgColor="#FFF8E8"
                />
            </View>

        </MainLayout>
    );
}
const FeatureItem = ({ icon, title, subtitle, bgColor }: any) => (
    <TouchableOpacity style={styles.featureBox}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
            {icon}
        </View>
        <Text style={styles.featureLabel} numberOfLines={2}>
            {title}
        </Text>
        <Text style={styles.featureSubLabel} numberOfLines={2}>
            {subtitle}
        </Text>
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
        backgroundColor: COLORS.primary, // #3F6DC9
        borderRadius: 24,
        padding: 16,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // 'flex-start'
    },
    appointmentTitle: {
        ...TYPOGRAPHY.h2,
        color: COLORS.white,
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
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
        opacity: 0.9,
    },
    arrowIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: COLORS.primary,
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
        height: 56,
    },

    // Features
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 12,
        marginTop: -10,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    featureBox: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 28,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.27,
        borderColor: '#E3F0FF',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A202C',
        textAlign: 'center',
    },
    featureSubLabel: {
        fontSize: 9,
        color: '#A0AEC0',
        textAlign: 'center',
        marginTop: 4,
    },
});