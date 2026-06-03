import { AlertCircle, Bot, Mic, Plus, Send, User } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../../components/common/AppButton';
import { RatingModal } from '../../components/common/RatingModal';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

export default function ConsultationScreen({ navigation }: any) {
    // 1. STATES
    const [step, setStep] = useState(1);
    const [messages, setMessages] = useState<any[]>([
        {
            id: 'disclaimer',
            type: 'disclaimer',
            text: '🛡️ THÔNG BÁO QUAN TRỌNG: Serena AI chỉ hỗ trợ sàng lọc sức khỏe ban đầu, KHÔNG thay thế chẩn đoán bác sĩ và KHÔNG kê đơn thuốc. Trong trường hợp khẩn cấp, vui lòng gọi cấp cứu ngay lập tức.',
            sender: 'bot',
        },
        {
            id: '1',
            text: 'Chào bạn, tôi là Serena. Tôi có thể giúp bạn sàng lọc triệu chứng. Bạn đang cảm thấy thế nào?',
            sender: 'bot',
            quickReplies: ['Đau đầu', 'Đau dạ dày', 'Sốt / Ho', 'Khác (Tôi muốn tự nhập)']
        }
    ]);

    const [phase, setPhase] = useState<'SCREENING' | 'PAYMENT' | 'DOCTOR_CHAT'>('SCREENING');
    const [inputText, setInputText] = useState('');
    const [placeholder, setPlaceholder] = useState('Chọn gợi ý hoặc nhập triệu chứng (vd: Đau đầu)...');

    const [isPaymentVisible, setPaymentVisible] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRatingVisible, setIsRatingVisible] = useState(false);
    const [isConfirmEndVisible, setIsConfirmEndVisible] = useState(false);


    const handleSend = useCallback((text: string) => {
        if (!text.trim()) return;
        const userMsg = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        setTimeout(() => {
            if (step === 1) {
                // Bước 2: Hỏi về thời gian
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: `Bạn bị ${text.toLowerCase()} từ bao lâu rồi?`,
                    sender: 'bot',
                    quickReplies: ['Mới bị thôi', 'Đã 2-3 ngày', 'Hơn 1 tuần']
                }]);
                setStep(2);
            }
            else if (step === 2) {
                // Bước 3: Hỏi về mức độ (Affordance mớm lời thang điểm)
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'Mức độ khó chịu của bạn trên thang điểm 10 là bao nhiêu? (1 là nhẹ, 10 là rất đau)',
                    sender: 'bot',
                    quickReplies: ['1-3 (Nhẹ)', '4-7 (Vừa)', '8-10 (Rất nặng)']
                }]);
                setStep(3);
            }
            else if (step === 3) {
                // Bước 4: Kết luận hoặc Upsell
                if (text.includes('8-10')) {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: 'Mức độ này khá nghiêm trọng. Bạn cần được bác sĩ chuyên khoa tư vấn ngay để tránh biến chứng.',
                        sender: 'bot',
                        isComplexAction: true // Hiện nút Kết nối bác sĩ
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: 'Thông tin đã được ghi nhận. Triệu chứng của bạn có vẻ ổn, nhưng để an tâm bạn có muốn chat với bác sĩ không?',
                        sender: 'bot',
                        quickReplies: ['Cần bác sĩ ngay', 'Cảm ơn Serena']
                    }]);
                }
                setStep(4);
            }
        }, 1000);
    }, [step]);

    //         // KỊCH BẢN 1: TRIỆU CHỨNG NHẸ (Tư vấn xong kết thúc)
    //         if (text === 'Đau đầu' || text === 'Cảm ơn Serena') {
    //             const botReply = {
    //                 id: Date.now().toString(),
    //                 text: 'Dựa trên sàng lọc, bạn có dấu hiệu căng thẳng nhẹ. Hãy nghỉ ngơi, uống đủ nước và theo dõi thêm 24h nhé.',
    //                 sender: 'bot',
    //                 quickReplies: ['Cảm ơn Serena', 'Vẫn thấy lo lắng']
    //             };
    //             if (text === 'Cảm ơn Serena') {
    //                 setMessages(prev => [...prev, { id: 'r1', text: 'Rất vui được giúp bạn! Đừng quên đánh giá trải nghiệm nhé.', sender: 'bot', isRatingAction: true }]);
    //             } else {
    //                 setMessages(prev => [...prev, botReply]);
    //             }
    //         }

    //         // KỊCH BẢN 2: TRIỆU CHỨNG CẦN CHUYÊN MÔN (Dẫn dắt kết nối bác sĩ)
    //         else if (text === 'Sốt / Ho' || text === 'Vẫn thấy lo lắng' || text === 'Tư vấn bác sĩ ngay') {
    //             const upsellMsg = {
    //                 id: Date.now().toString(),
    //                 text: 'Triệu chứng của bạn cần được bác sĩ chuyên khoa kiểm tra để đảm bảo an toàn. Bạn muốn kết nối ngay hay đặt lịch khám tại viện?',
    //                 sender: 'bot',
    //                 isComplexAction: true // Hiện 2 option điều hướng
    //             };
    //             setMessages(prev => [...prev, upsellMsg]);
    //             setPlaceholder("Nhấn nút chọn hoặc nhập yêu cầu cụ thể...");
    //         }

    //         // KỊCH BẢN 3: NGƯỜI DÙNG TỰ NHẬP (Linh hoạt)
    //         else {
    //             setMessages(prev => [...prev, {
    //                 id: Date.now().toString(),
    //                 text: 'Serena đã ghi nhận thông tin: "' + text + '". Bạn có muốn kết nối với bác sĩ để trao đổi kỹ hơn không?',
    //                 sender: 'bot',
    //                 quickReplies: ['Tư vấn bác sĩ ngay', 'Để sau']
    //             }]);
    //         }
    //     }, 1000);
    // }, [phase]);

    // RENDER COMPONENTS
    const renderMessage = ({ item }: any) => {
        const isBot = item.sender === 'bot';

        if (item.type === 'disclaimer') {
            return (
                <View style={styles.disclaimerBox}>
                    <AlertCircle size={20} color={COLORS.warning} />
                    <Text style={styles.disclaimerText}>{item.text}</Text>
                </View>
            );
        }

        return (
            <View style={{ marginBottom: 20 }}>
                <View style={[styles.msgRow, isBot ? styles.botRow : styles.userRow]}>
                    {isBot && (
                        <View style={[styles.avatar, { backgroundColor: phase === 'DOCTOR_CHAT' ? COLORS.primary : COLORS.secondary }]}>
                            {phase === 'DOCTOR_CHAT' ? <User size={20} color="white" /> : <Bot size={20} color="white" />}
                        </View>
                    )}
                    <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                        <Text style={{ color: isBot ? COLORS.text : 'white', ...TYPOGRAPHY.body }}>{item.text}</Text>
                    </View>
                </View>

                {/* Option "Mớm lời" đa dạng kịch bản */}
                {item.isComplexAction && (
                    <View style={styles.actionColumn}>
                        <AppButton
                            title="Kết nối bác sĩ ngay (150k)"
                            variant="primary"
                            onPress={() => setPaymentVisible(true)}
                            style={styles.actionBtnWide}
                        />
                        <AppButton
                            title="Đặt lịch hẹn tại phòng khám"
                            variant="outline"
                            onPress={() => navigation.navigate('Appointment')}
                            style={styles.actionBtnWide}
                        />
                    </View>
                )}

                {item.isRatingAction && (
                    <AppButton title="Đánh giá tư vấn" variant="outline" onPress={() => setIsRatingVisible(true)} style={styles.centerBtn} />
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
            subtitle={phase === 'DOCTOR_CHAT' ? "Đang trực tuyến" : "Sàng lọc sức khỏe ban đầu"}
            isScrollable={false}
            showBack={true}
        >
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
                contentContainerStyle={{ padding: 0 }}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.plusBtn}><Plus size={24} color={COLORS.primary} /></TouchableOpacity>
                    <TextInput
                        placeholder={placeholder} // Placeholder mớm lời rõ ràng
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                    />

                    <TouchableOpacity style={styles.iconBtn}><Mic size={22} color={COLORS.secondary} /></TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sendBtn, { opacity: inputText.length > 0 ? 1 : 0.5 }]}
                        onPress={() => handleSend(inputText)}
                        disabled={inputText.length === 0}
                    >
                        <Send size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Các Modals xác nhận & Đánh giá giữ nguyên logic Delay 600ms như đã fix */}
            <RatingModal isVisible={isRatingVisible} onClose={() => setIsRatingVisible(false)} onSubmit={() => setIsRatingVisible(false)} />
            {/* Modal thanh toán QR và ConfirmEnd */}
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    // Miễn trừ trách nhiệm
    disclaimerBox: {
        backgroundColor: '#FFFBEB',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEF3C7',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20
    },
    disclaimerText: { ...TYPOGRAPHY.caption, color: '#92400E', flex: 1, lineHeight: 18 },

    msgRow: { flexDirection: 'row', alignItems: 'flex-end', width: '100%' },
    botRow: { alignSelf: 'flex-start' },
    userRow: { justifyContent: 'flex-end' },
    avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    bubble: { maxWidth: '80%', padding: 14, borderRadius: 20, alignSelf: 'flex-start' },
    botBubble: { backgroundColor: '#F0F4FF', borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4, alignSelf: 'flex-end' },

    // Kịch bản điều hướng
    actionColumn: { paddingLeft: 40, marginTop: 10, gap: 10 },
    actionBtnWide: { width: '100%', borderRadius: 12 },
    centerBtn: { alignSelf: 'center', marginTop: 15, width: '80%' },

    quickReplyBox: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 40, marginTop: 10, gap: 8 },
    chip: { borderRadius: 15, backgroundColor: COLORS.white, borderColor: COLORS.secondary, borderWidth: 1 },

    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: 'white', marginBottom: 40, borderRadius: 30, marginHorizontal: 10, elevation: 5 },
    input: { flex: 1, marginHorizontal: 8, ...TYPOGRAPHY.body, fontSize: 13 },
    plusBtn: { padding: 5 },
    iconBtn: { padding: 8 },
    sendBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }
});