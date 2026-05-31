import { Bot, Calendar, CheckCheck, ChevronRight, Star, Trash2, UserCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../../components/common/AppButton';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

const MOCK_NOTIFICATIONS = [
    { id: '1', type: 'appointment', title: 'Lịch khám sắp tới', content: 'Bạn có lịch hẹn tại Phòng khám Tâm Anh lúc 10:00 sáng nay...', time: '10 phút trước', isUnread: true },
    { id: '2', type: 'ai', title: 'Trợ lý AI Serena', content: '"Chào bạn, dựa trên các chỉ số huyết áp sáng nay, bạn nên bổ sung thêm nước..."', time: '1 giờ trước', isUnread: true },
    { id: '3', type: 'rating', title: 'Đánh giá tư vấn', content: 'Bạn có một cuộc tư vấn chưa đánh giá, hãy chia sẻ cảm nhận của mình...', time: 'Hôm qua', isUnread: false },
    { id: '4', type: 'doctor', title: 'BS. Lê Mạnh Hùng', content: 'Bác sĩ đã gửi kết quả xét nghiệm tổng quát của bạn...', time: '2 ngày trước', isUnread: false },
];

export default function NotificationScreen() {
    const [filter, setFilter] = useState('all');
    const [menuVisible, setMenuVisible] = useState(false);

    const renderIcon = (type: string) => {
        switch (type) {
            case 'appointment': return <Calendar size={20} color={COLORS.secondary} />;
            case 'ai': return <Bot size={20} color={COLORS.primary} />;
            case 'rating': return <Star size={20} color="#FFD700" />;
            default: return <UserCheck size={20} color={COLORS.secondary} />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, item.isUnread && styles.unreadCard]}>
            {item.isUnread && <View style={styles.redDot} />}

            <View style={styles.cardHeader}>
                <View style={styles.iconBox}>{renderIcon(item.type)}</View>
                <View style={styles.titleArea}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                </View>
            </View>

            <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>

            {/* Nút hành động tùy theo loại thông báo */}
            <View style={styles.actionRow}>
                {item.type === 'appointment' && (
                    <>
                        <AppButton title="Xem chi tiết" variant="primary" size="small" onPress={() => { }} style={styles.btn} />
                        <AppButton title="Chỉ đường" variant="outline" size="small" onPress={() => { }} style={styles.btn} />
                    </>
                )}
                {item.type === 'ai' && (
                    <TouchableOpacity style={styles.linkAction}>
                        <Text style={styles.linkText}>Phản hồi ngay</Text>
                        <ChevronRight size={16} color={COLORS.secondary} />
                    </TouchableOpacity>
                )}
                {item.type === 'rating' && (
                    <AppButton title="Đánh giá ngay" variant="primary" size="small" onPress={() => { }} />
                )}
            </View>
        </View>
    );

    return (
        <MainLayout
            title="Thông báo"
            showBack={true}
            showRightIcon={true}
            isScrollable={false}
        >
            <Modal
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
                animationType="fade"
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
                            <CheckCheck size={18} color={COLORS.text} />
                            <Text style={styles.menuText}>Đánh dấu tất cả đã đọc</Text>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
                            <Trash2 size={18} color={COLORS.accent} />
                            <Text style={[styles.menuText, { color: COLORS.accent }]}>Xóa tất cả</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
            <FlatList
                data={filter === 'all' ? MOCK_NOTIFICATIONS : MOCK_NOTIFICATIONS.filter(n => n.isUnread)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: COLORS.secondary,
        padding: 2,
        marginBottom: 20,
    },
    tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 23 },
    activeTab: { backgroundColor: COLORS.secondary },
    tabText: { ...TYPOGRAPHY.tabLabel, color: COLORS.secondary },
    activeTabText: { color: 'white' },

    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
        position: 'relative',
        borderWidth: 1, borderColor: '#F0F0F0'
    },
    unreadCard: {
        borderColor: COLORS.secondary,
        borderLeftWidth: 4,
    },
    redDot: {
        position: 'absolute', top: 12, right: 12,
        width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    iconBox: {
        width: 40, height: 40, borderRadius: 10,
        backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center'
    },
    titleArea: { flex: 1, marginLeft: 12 },
    cardTitle: { ...TYPOGRAPHY.title, color: COLORS.text },
    cardTime: { ...TYPOGRAPHY.caption, color: COLORS.gray, marginTop: 2 },
    cardContent: { ...TYPOGRAPHY.body, color: '#555', lineHeight: 22, marginBottom: 12 },

    actionRow: { flexDirection: 'row', gap: 10 },
    btn: { paddingHorizontal: 15 },
    linkAction: { flexDirection: 'row', alignItems: 'center' },
    linkText: { color: COLORS.secondary, fontWeight: '700', marginRight: 4 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)', // Mờ cực nhẹ
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60, // Căn chỉnh theo vị trí nút 3 chấm
        paddingRight: 20,
    },
    dropdownMenu: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        width: 220,
        elevation: 5, shadowOpacity: 0.1, shadowRadius: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 10,
    },
    menuText: { ...TYPOGRAPHY.body, fontSize: 14 },
    menuDivider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 8 }
});