import { Bot, LogOut, Plus, Send, User, X } from 'lucide-react-native'; // Thêm icon LogOut
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../../components/common/AppButton';
import { ConfirmModal } from '../../components/common/ConfirmModal'; // Thêm ConfirmModal
import { RatingModal } from '../../components/common/RatingModal';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

export default function ConsultationScreen() {
    // 1. STATES
    const [messages, setMessages] = useState<any[]>([
        { id: '1', text: 'Chào bạn, tôi là Serena AI. Hôm nay bạn cảm thấy thế nào?', sender: 'bot', quickReplies: ['Tôi bị đau đầu', 'Tôi bị sốt', 'Tư vấn bác sĩ ngay'] }
    ]);
    const [phase, setPhase] = useState<'SCREENING' | 'PAYMENT' | 'DOCTOR_CHAT'>('SCREENING');
    const [isPaymentVisible, setPaymentVisible] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRatingVisible, setIsRatingVisible] = useState(false);

    // Thêm các State mới xử lý đóng phiên chat
    const [isConfirmEndVisible, setIsConfirmEndVisible] = useState(false);

    // 2. LOGIC TƯƠNG TÁC
    const handleSend = useCallback((text: string) => {
        const userMsg = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setTimeout(() => {
            if (text === 'Tư vấn bác sĩ ngay' || text.includes('bác sĩ')) {
                triggerUpsell();
            } else if (phase === 'SCREENING') {
                botReplyWithDiagnosis();
            } else if (text === 'Cảm ơn Serena') {
                const ratingTriggerMsg = {
                    id: Date.now().toString(),
                    text: 'Rất vui được hỗ trợ bạn! Để giúp Serena hoàn thiện hơn, bạn vui lòng dành chút thời gian đánh giá cuộc tư vấn này nhé.',
                    sender: 'bot',
                    isRatingAction: true
                };
                setMessages(prev => [...prev, ratingTriggerMsg]);
            }
        }, 1000);
    }, [phase]);

    // Giai đoạn 2: Đề xuất bác sĩ
    const triggerUpsell = () => {
        const upsellMsg = {
            id: Date.now().toString(),
            text: 'Để có chẩn đoán chính xác nhất, bạn nên tư vấn trực tiếp với bác sĩ chuyên khoa.\n\nPhí tư vấn: 150.000đ/lượt.',
            sender: 'bot',
            isAction: true
        };
        setMessages(prev => [...prev, upsellMsg]);
    };

    // Giai đoạn 3: Giả lập thanh toán
    const handlePaymentConfirm = () => {
        setPaymentVisible(false);
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setPhase('DOCTOR_CHAT');
            const successMsg = {
                id: Date.now().toString(),
                text: 'Thanh toán thành công! BS. Nguyễn Văn A đang kết nối với bạn...',
                sender: 'bot',
                isSuccess: true
            };
            setMessages(prev => [...prev, successMsg]);
        }, 3000);
    };

    const botReplyWithDiagnosis = () => {
        const reply = {
            id: Date.now().toString(),
            text: 'Dựa trên triệu chứng của bạn, có thể bạn đang bị cảm cúm nhẹ. Bạn nên nghỉ ngơi và uống nhiều nước.',
            sender: 'bot',
            quickReplies: ['Kết nối bác sĩ để kê đơn', 'Cảm ơn Serena']
        };
        setMessages(prev => [...prev, reply]);
    };

    // Xử lý sau khi người dùng bấm "Xác nhận kết thúc tư vấn bác sĩ"
    const handleConfirmEndDoctorChat = () => {
        setIsConfirmEndVisible(false);

        // Tránh xung đột animation giữa 2 modal bằng setTimeout nhỏ
        setTimeout(() => {
            setIsRatingVisible(true); // Kích hoạt form đánh giá ngay lập tức
        }, 600);
    };

    // 3. RENDER COMPONENTS
    const renderMessage = ({ item }: any) => {
        const isBot = item.sender === 'bot';
        return (
            <View style={{ marginBottom: 20 }}>
                <View style={[styles.msgRow, isBot ? styles.botRow : styles.userRow]}>
                    {isBot && (
                        <View style={[styles.avatar, { backgroundColor: phase === 'DOCTOR_CHAT' ? COLORS.secondary : COLORS.primary }]}>
                            {phase === 'DOCTOR_CHAT' ? <User size={20} color="white" /> : <Bot size={20} color="white" />}
                        </View>
                    )}

                    <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                        <Text style={{ color: isBot ? COLORS.text : 'white', ...TYPOGRAPHY.body }}>{item.text}</Text>
                    </View>
                </View>

                {item.isRatingAction && (
                    <AppButton
                        title="Đánh giá chất lượng tư vấn"
                        variant="outline"
                        onPress={() => setIsRatingVisible(true)}
                        style={{ alignSelf: 'center', marginTop: 15, width: '85%' }}
                    />
                )}
                {item.isAction && (
                    <AppButton
                        title="Kết nối ngay (150.000đ)"
                        variant="primary"
                        onPress={() => setPaymentVisible(true)}
                        style={{ alignSelf: 'center', marginTop: 10, width: '80%' }}
                    />
                )}
                {isBot && item.quickReplies && (
                    <View style={styles.quickReplyBox}>
                        {item.quickReplies.map((r: string) => (
                            <AppButton key={r} title={r} variant="ghost" size="small" onPress={() => handleSend(r)} style={styles.chip} />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <MainLayout
            title={phase === 'DOCTOR_CHAT' ? "BS. Nguyễn Văn A" : "Tư vấn Serena AI"}
            subtitle={phase === 'DOCTOR_CHAT' ? "Đang trực tuyến" : "Trợ lý y tế thông minh"}
            isScrollable={false}
            showBack={true}
        >
            {/* Loading Spinner giả lập xác nhận giao dịch */}
            {isVerifying && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 10, ...TYPOGRAPHY.body }}>Hệ thống đang xác nhận giao dịch...</Text>
                </View>
            )}

            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 15 }}
            />

            {/* Gợi ý Chip kết thúc cuộc trò chuyện cố định ngay trên Input Bar khi đang chat với Bác sĩ */}
            {phase === 'DOCTOR_CHAT' && (
                <View style={styles.doctorActionContainer}>
                    <TouchableOpacity
                        style={styles.endChatChip}
                        onPress={() => setIsConfirmEndVisible(true)}
                    >
                        <LogOut size={16} color={COLORS.warning} style={{ marginRight: 6 }} />
                        <Text style={styles.endChatText}>Kết thúc tư vấn với Bác sĩ</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Input Bar */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={10}>
                <View style={styles.inputBar}>
                    <Plus size={24} color={COLORS.primary} />
                    <TextInput placeholder="Nhập tin nhắn..." style={styles.input} />
                    <TouchableOpacity style={styles.sendBtn}><Send size={20} color="white" /></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* 4. MODALS */}
            {/* Modal Thanh toán */}
            <Modal visible={isPaymentVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={TYPOGRAPHY.h1}>Thanh toán tư vấn</Text>
                            <TouchableOpacity onPress={() => setPaymentVisible(false)}><X size={24} /></TouchableOpacity>
                        </View>
                        <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SerenaHealthPayment' }} style={styles.qrImage} />
                        <Text style={styles.qrHint}>Sử dụng ứng dụng MoMo/VNPay để quét mã</Text>
                        <AppButton title="Xác nhận đã chuyển khoản" onPress={handlePaymentConfirm} style={{ width: '100%' }} />
                    </View>
                </View>
            </Modal>

            {/* Modal Xác nhận kết thúc tư vấn bác sĩ */}
            <ConfirmModal
                isVisible={isConfirmEndVisible}
                title="Kết thúc tư vấn?"
                description="Bạn có chắc chắn muốn hoàn thành cuộc tư vấn trực tiếp này với Bác sĩ Nguyễn Văn A không?"
                icon={<LogOut size={36} color={COLORS.warning} />}
                type="danger"
                confirmText="Kết thúc & Đánh giá"
                onCancel={() => setIsConfirmEndVisible(false)}
                onConfirm={handleConfirmEndDoctorChat}
            />

            {/* Modal Đánh giá chất lượng */}
            <RatingModal
                isVisible={isRatingVisible}
                onClose={() => setIsRatingVisible(false)}
                onSubmit={(rating, comment) => {
                    console.log(`User rated ${rating} stars: ${comment}`);
                    setIsRatingVisible(false);
                    setPhase('SCREENING'); // Đưa flow quay về mặc định hoặc trang chủ lịch sử

                    const finalMsg = {
                        id: Date.now().toString(),
                        text: 'Cảm ơn bạn đã gửi đánh giá chất lượng phục vụ của Bác sĩ!',
                        sender: 'bot'
                    };
                    setMessages(prev => [...prev, finalMsg]);
                }}
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    msgRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 20,
        width: '100%',
    },
    botRow: { alignSelf: 'flex-start' },
    userRow: { justifyContent: 'flex-end' },
    avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    bubble: { maxWidth: '80%', padding: 14, borderRadius: 20 },
    botBubble: { backgroundColor: '#E3F2FD', borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
    quickReplyBox: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 44, marginTop: 10, gap: 8 },
    chip: { borderRadius: 15, backgroundColor: COLORS.white, borderColor: COLORS.secondary, borderWidth: 1 },

    // Phần hiển thị Chip đóng phiên chat bác sĩ
    doctorActionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    endChatChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF1F1',
        borderWidth: 1,
        borderColor: COLORS.warning || '#FF4D4F',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    endChatText: {
        color: COLORS.warning || '#FF4D4F',
        fontWeight: '600',
        fontSize: 13,
    },

    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', marginBottom: 30, borderRadius: 30, marginHorizontal: 15, elevation: 5 },
    input: { flex: 1, marginHorizontal: 10, ...TYPOGRAPHY.body },
    sendBtn: { backgroundColor: COLORS.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    loadingOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 10, justifyContent: 'center', alignItems: 'center' },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 25, padding: 25, alignItems: 'center' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    qrImage: { width: 200, height: 200, marginBottom: 15 },
    qrHint: { ...TYPOGRAPHY.caption, marginBottom: 20, color: COLORS.subtext }
});