import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Beaker,
    Camera,
    ChevronDown,
    ChevronUp,
    Download,
    Edit2,
    FileText,
    Headphones, LogOut,
    Share2
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

import { ConfirmModal } from '../../components/common/ConfirmModal';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const [showLogout, setShowLogout] = useState(false);
    const [isEMRExpanded, setIsEMRExpanded] = useState(false);

    const toggleEMR = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsEMRExpanded(!isEMRExpanded);
    };
    return (
        <MainLayout title="Cá nhân" subtitle="Quản lý hồ sơ của bạn"
            isScrollable={false}
            padding={16}>

            <View style={styles.userSection}>
                <View style={styles.avatarPlaceholder}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=mai' }}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.userName}>Nguyễn Thị Mai</Text>
                        <TouchableOpacity style={styles.editBtn}>
                            <Edit2 size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.idBadge}>
                        <View style={styles.idDot} />
                        <Text style={styles.idText}>ID: YTAI-847291</Text>
                    </View>
                    <Text style={styles.userStats}>24 tuổi  •  1.65m  •  52kg</Text>
                </View>
            </View>

            {/* 2. Tiêu đề Hồ sơ (Có nút Toggle) */}
            <TouchableOpacity style={styles.sectionHeader} onPress={toggleEMR} activeOpacity={0.7}>
                <Text style={styles.sectionTitle}>Hồ sơ bệnh án</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.toggleText}>{isEMRExpanded ? "Thu gọn" : "Xem tất cả"}</Text>
                    {isEMRExpanded ? <ChevronUp size={20} color={COLORS.primary} /> : <ChevronDown size={20} color={COLORS.primary} />}
                </View>
            </TouchableOpacity>

            {/* 3. Vùng chứa nội dung Hồ sơ (Ẩn/Hiện) */}
            {isEMRExpanded ? (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                        <TouchableOpacity style={styles.uploadCard}>
                            <Camera size={24} color={COLORS.primary} />
                            <Text style={styles.uploadTitle}>Chụp / Tải đơn thuốc cũ</Text>
                        </TouchableOpacity>

                        {/* Danh sách chỉ hiện khi nhấn Xem tất cả */}
                        {isEMRExpanded && (
                            <View style={styles.recordList}>
                                <RecordCard icon={<FileText color={COLORS.primary} size={20} />} title="Đơn thuốc Viêm họng" date="12/08/2023" />
                                <RecordCard icon={<Beaker color={COLORS.primary} size={20} />} title="Xét nghiệm máu" date="05/07/2023" />
                            </View>
                        )}
                    </ScrollView>
                </View>) : (
                /* Khi thu gọn thì chỉ hiện mỗi nút Upload  */
                <TouchableOpacity style={styles.uploadCard}>
                    <Camera size={24} color={COLORS.primary} />
                    <Text style={styles.uploadTitle}>Chụp / Tải đơn thuốc cũ</Text>
                </TouchableOpacity>
            )}

            {/* 4. Băng rôn hỗ trợ*/}
            <View style={styles.bottomArea}>
                <LinearGradient
                    colors={['#2B7FFF', '#155DFC']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.supportBanner}
                >
                    <Headphones color="white" size={20} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.supportTitle}>Hỗ trợ khách hàng</Text>
                        <Text style={styles.supportSub}>Liên hệ với chúng tôi</Text>
                    </View>
                </LinearGradient>

                {/* 5. Nút Đăng xuất */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogout(true)}>
                    <LogOut size={18} color="#E7000B" />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

            <ConfirmModal
                isVisible={showLogout}
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Serena Health?"
                icon={<LogOut size={32} color="#E7000B" />}
                confirmText="Đăng xuất"
                type="danger"
                onCancel={() => setShowLogout(false)}
                onConfirm={() => {
                    setShowLogout(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                }}
            />

        </MainLayout>
    );
}

// Component con: RecordCard
const RecordCard = ({ icon, title, date, doctor }: any) => (
    <View style={styles.recordCard}>
        <View style={styles.recordIconBox}>{icon}</View>
        <View style={styles.recordInfo}>
            <Text style={styles.recordTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.recordSub}>{date}  •  {doctor}</Text>
        </View>
        <View style={styles.recordActions}>
            <TouchableOpacity style={styles.smallIcon}><Share2 size={16} color={COLORS.primary} /></TouchableOpacity>
            <TouchableOpacity style={styles.smallIcon}><Download size={16} color={COLORS.primary} /></TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    // User Section
    userSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#CBD5E0', overflow: 'hidden' },
    avatar: { width: '100%', height: '100%' },
    userInfo: { marginLeft: 20, flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    userName: { ...TYPOGRAPHY.h2, color: '#0A0A0A' },
    editBtn: { backgroundColor: '#EFF6FF', padding: 8, borderRadius: 10 },
    idBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(219, 225, 255, 0.5)',
        alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: 20, marginTop: 8
    },
    idDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 8 },
    idText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
    userStats: { ...TYPOGRAPHY.caption, color: '#4A5565', marginTop: 8 },

    // EMR Section
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { ...TYPOGRAPHY.h1, fontSize: 22, color: COLORS.primary },
    headerIcons: { flexDirection: 'row', gap: 10 },
    iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195, 198, 215, 0.3)' },

    // Upload Card
    uploadCard: {
        backgroundColor: 'rgba(126, 169, 240, 0.2)',
        borderRadius: 24, padding: 24, alignItems: 'center',
        borderWidth: 2, borderColor: 'rgba(0, 74, 198, 0.3)', borderStyle: 'dashed',
        marginBottom: 20
    },
    uploadTitle: { ...TYPOGRAPHY.title, color: COLORS.primary, marginTop: 10 },
    uploadSub: { ...TYPOGRAPHY.caption, fontWeight: '600', color: '#434655', marginTop: 5 },

    // Record Cards
    recordList: { gap: 12 },
    recordCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white', borderRadius: 20, padding: 15,
        elevation: 2, shadowColor: '#131B2E', shadowOpacity: 0.04, shadowRadius: 12
    },
    recordIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E6E8EA', justifyContent: 'center', alignItems: 'center' },
    recordInfo: { flex: 1, marginLeft: 15 },
    recordTitle: { ...TYPOGRAPHY.title, fontSize: 16, color: '#244A6B' },
    recordSub: { ...TYPOGRAPHY.caption, color: '#434655', marginTop: 4 },
    recordActions: { flexDirection: 'row', gap: 8 },
    smallIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F7F9FB', justifyContent: 'center', alignItems: 'center' },

    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    toggleText: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginRight: 5 },
    // Support Banner
    supportBanner: {
        flexDirection: 'row', alignItems: 'center',
        padding: 16, borderRadius: 15, marginTop: 30, marginBottom: 15
    },
    supportIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    supportTitle: { color: 'white', fontWeight: '700', fontSize: 16 },
    supportSub: { color: '#DBEAFE', fontSize: 14 },

    bottomArea: { marginTop: 'auto', paddingBottom: 20 },
    // Logout
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FFC9C9',
        marginBottom: 40
    },
    logoutText: { color: '#E7000B', fontWeight: '600', marginLeft: 10, fontSize: 14 }
});