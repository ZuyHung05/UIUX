import { Bot, Calendar, ChevronRight, Star, UserCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

const NOTIFICATION_SECTIONS = [
    {
        title: 'Hôm nay',
        data: [
            { id: '1', type: 'appointment', title: 'Lịch khám sắp tới', content: 'Bạn có lịch hẹn tại Tâm Anh lúc 10:00...', time: '10 phút trước', isUnread: true },
            { id: '2', type: 'ai', title: 'Trợ lý AI Serena', content: '"Bạn nên bổ sung thêm nước và nghỉ ngơi..."', time: '1 giờ trước', isUnread: true },
        ]
    },
    {
        title: 'Tuần này',
        data: [
            { id: '3', type: 'rating', title: 'Đánh giá tư vấn', content: 'Hãy chia sẻ cảm nhận về cuộc hội thoại ngày 30/05...', time: 'Thứ 2', isUnread: false },
        ]
    },
    {
        title: 'Cũ hơn',
        data: [
            { id: '4', type: 'doctor', title: 'BS. Lê Mạnh Hùng', content: 'Bác sĩ đã gửi kết quả xét nghiệm tổng quát...', time: '20/05', isUnread: false },
        ]
    }
];
export default function NotificationScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);

    const renderIcon = (type: string) => {
        const iconSize = 20;
        switch (type) {
            case 'appointment': return <Calendar size={iconSize} color={COLORS.primary} />;
            case 'ai': return <Bot size={iconSize} color={COLORS.primary} />;
            case 'rating': return <Star size={iconSize} color="#FFD700" />;
            default: return <UserCheck size={iconSize} color={COLORS.secondary} />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationRow, item.isUnread && styles.unreadRow]}
            onPress={() => {
                if (item.type === 'appointment') {
                    navigation.navigate('MainTabs', { screen: 'Appointment' });
                } else if (item.type === 'ai') {
                    navigation.navigate('Consultation');
                }
                else if (item.type === 'rating') {
                    navigation.navigate('MainTabs', { screen: 'History' });
                }
            }}
            activeOpacity={0.7}
        >
            {/* Cột 1: Icon */}
            < View style={styles.iconContainer} >
                <View style={styles.iconCircle}>
                    {renderIcon(item.type)}
                </View>
                {item.isUnread && <View style={styles.unreadDot} />}
            </View >

            {/* Cột 2: Nội dung */}
            < View style={styles.contentContainer} >
                <View style={styles.rowHeader}>
                    <Text style={[styles.title, item.isUnread && styles.boldText]}>{item.title}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.contentText} numberOfLines={2}>
                    {item.content}
                </Text>
            </View >

            {/* Cột 3: Mũi tên dẫn dắt (Affordance) */}
            < ChevronRight size={18} color={COLORS.placeholder} />
        </TouchableOpacity >
    );

    return (
        <MainLayout
            title="Thông báo"
            showBack={true}
            showRightIcon={true}
            isScrollable={false}
            padding={0}
        >
            <SectionList
                sections={NOTIFICATION_SECTIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionTitle: {
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
        color: COLORS.subtext,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 2,
        backgroundColor: COLORS.white,
    },
    unreadRow: {
        backgroundColor: COLORS.cardBlue
    },
    iconContainer: {
        position: 'relative',
        marginRight: 15,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    unreadDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    contentContainer: {
        flex: 1,
        marginRight: 10,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        fontSize: 15,
    },
    boldText: {
        fontWeight: '700',
    },
    timeText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.subtext,
        fontSize: 11,
    },
    contentText: {
        ...TYPOGRAPHY.caption,
        color: '#4A5565',
        lineHeight: 18,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 80, // Kẻ ngang bắt đầu từ sau Icon (đúng chuẩn iOS)
    },
});