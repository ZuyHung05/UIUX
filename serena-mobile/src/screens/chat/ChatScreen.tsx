import { AlertCircle, Bot, Calendar, LogOut, Mic, MoreVertical, Send, User, Volume2, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../../components/common/AppButton';
import { ConfirmModal } from '../../components/common/ConfirmModal';
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
            text: 'Chào bạn, tôi là Serena. Bạn muốn thực hiện sàng lọc triệu chứng với AI (Miễn phí) hay kết nối tư vấn trực tiếp với Bác sĩ chuyên khoa (Có phí)?',
            sender: 'bot',
            quickReplies: ['🔍 Sàng lọc với AI', '👨‍⚕️ Tư vấn với Bác sĩ']
        }
    ]);

    const [phase, setPhase] = useState<'SCREENING' | 'PAYMENT' | 'DOCTOR_CHAT'>('SCREENING');
    const [inputText, setInputText] = useState('');
    const [placeholder, setPlaceholder] = useState('Chọn gợi ý hoặc nhập triệu chứng (vd: Đau đầu)...');

    const [isPaymentVisible, setPaymentVisible] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRatingVisible, setIsRatingVisible] = useState(false);
    const [isConfirmEndVisible, setIsConfirmEndVisible] = useState(false);

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const flatListRef = React.useRef<FlatList>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const toggleSpeech = (id: string) => {
        setPlayingId(playingId === id ? null : id);
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const renderHeaderRight = () => (
        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={{ padding: 5 }}>
                <MoreVertical size={24} color={COLORS.text} />
            </TouchableOpacity>

            <Modal visible={isMenuVisible} transparent animationType="fade" onRequestClose={() => setIsMenuVisible(false)}>
                <Pressable style={styles.menuOverlay} onPress={() => setIsMenuVisible(false)}>
                    <View style={styles.menuContent}>
                        {/* Mục 1: Đặt lịch */}
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setIsMenuVisible(false);
                                navigation.navigate('MainTabs', { screen: 'Appointment' });
                            }}
                        >
                            <Calendar size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.menuItemText}>Đặt lịch khám</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Mục 2: Kết thúc */}
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setIsMenuVisible(false);
                                setTimeout(() => setIsConfirmEndVisible(true), 300);
                            }}
                        >
                            <LogOut size={18} color={COLORS.warning} style={{ marginRight: 10 }} />
                            <Text style={[styles.menuItemText, { color: COLORS.warning }]}>Kết thúc tư vấn</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );

    const handleSend = useCallback((text: string) => {
        if (!text.trim()) return;
        const userMsg = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        setTimeout(() => {
            if (text.includes('Bác sĩ') || text.includes('Tư vấn') || text.includes('Kết nối')) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'Hệ thống đang chuẩn bị kết nối bạn với bác sĩ trực tuyến. Phí dịch vụ là 150.000đ/lượt. Bạn vui lòng xác nhận thanh toán để bắt đầu.',
                    sender: 'bot',
                    isComplexAction: true
                }]);
                return;
            }

            if (text.includes('Sàng lọc')) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'Vâng, mời bạn chọn vùng đang cảm thấy khó chịu nhất trên cơ thể:',
                    sender: 'bot',
                    quickReplies: ['Đầu / Cổ', 'Ngực / Bụng', 'Tay / Chân', 'Khác']
                }]);
                setStep(1); // Bắt đầu luồng step-by-step
                return;
            }
            if (text.includes('Khác')) {
                setPlaceholder("Mô tả triệu chứng tại đây...");
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'Mời bạn nhập chi tiết vấn đề sức khỏe đang gặp phải. Bạn có thể gõ vào ô chat hoặc nhấn biểu tượng Micro 🎙️ để sử dụng giọng nói nhé.',
                    sender: 'bot',
                }]);
                setStep(1.5); // Đưa vào nhánh nhập tự do trước khi nhảy về luồng thời gian
                return;
            }
            if (step === 1 || step === 1.5) {
                // Bước 2: Hỏi về thời gian
                let symptomSnippet = text.toLowerCase();
                // Xử lý sượng chữ: Nếu là vùng chung thì đổi từ ngữ cho mượt
                if (symptomSnippet.includes('đầu')) symptomSnippet = 'khó chịu vùng đầu cổ';
                if (symptomSnippet.includes('ngực')) symptomSnippet = 'khó chịu vùng ngực bụng';
                if (symptomSnippet.includes('tay')) symptomSnippet = 'đau nhức tay chân';

                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: `Serena đã ghi nhận tình trạng ${symptomSnippet} của bạn. Bạn đã xuất hiện dấu hiệu này từ bao lâu rồi?`,
                    sender: 'bot',
                    quickReplies: ['Mới bị trong ngày', 'Đã 2-3 ngày nay', 'Kéo dài hơn 1 tuần']
                }]);
                setStep(2);
            }
            else if (step === 2) {
                // Bước 3: Hỏi về mức độ (Affordance mớm lời thang điểm)
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'Mức độ khó chịu của bạn trên thang điểm 10 là bao nhiêu? (1 là nhẹ, 10 là rất đau)',
                    sender: 'bot',
                    quickReplies: ['😀 1-3: Nhẹ', '😐 4-6: Trung bình', '😫 7-10: Rất đau']
                }]);
                setStep(3);
            }
            else if (step === 3) {
                // Bước 4: Hỏi về triệu chứng đi kèm (Để kịch bản phong phú hơn)
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'Ngoài ra, bạn có kèm theo các biểu hiện như sốt, buồn nôn hay chóng mặt không?',
                    sender: 'bot',
                    quickReplies: ['Có, tôi thấy sốt', 'Có, tôi chóng mặt', 'Không, chỉ triệu chứng trên']
                }]);
                setStep(4);
            }
            else if (step === 4) {
                // Bước 5: Kết luận & Điều hướng (Upsell)
                if (text.includes('7-10') || text.includes('sốt')) {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: '⚠️ CẢNH BÁO: Triệu chứng của bạn có dấu hiệu chuyển biến phức tạp. Serena khuyên bạn nên kết nối với bác sĩ chuyên khoa ngay để được chẩn đoán xác thực.',
                        sender: 'bot',
                        isComplexAction: true // Hiện nút Kết nối bác sĩ / Đặt lịch
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: 'Dựa trên sàng lọc, tình trạng của bạn có vẻ chưa quá nguy hiểm. Bạn nên nghỉ ngơi và theo dõi thêm. Bạn có muốn nhận lời khuyên chăm sóc tại nhà không?',
                        sender: 'bot',
                        quickReplies: ['Có, hãy tư vấn', 'Kết nối bác sĩ cho chắc', 'Cảm ơn Serena']
                    }]);
                }
                setStep(5);
            }
            else if (step === 5) {
                if (text === 'Có, hướng dẫn tôi') {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: '💡 LỜI KHUYÊN Y TẾ TỪ SERENA AI:\n\n1. Nghỉ ngơi hoàn toàn tại không gian thoáng mát.\n2. Bổ sung nhiều nước ấm hoặc nước điện giải (Oresol).\n3. Theo dõi thân nhiệt mỗi 4 tiếng.\n\nNếu có dấu hiệu tăng nặng đột ngột, hãy quay lại đây gõ "Bác sĩ" để được kết nối ngay lập tức.',
                        sender: 'bot',
                        quickReplies: ['Cảm ơn Serena']
                    }]);
                } else if (text === 'Cảm ơn Serena') {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: 'Rất vui được đồng hành cùng sức khỏe của bạn! Để giúp Serena cải thiện năng lực tư vấn, bạn vui lòng dành chút thời gian đánh giá phiên hỗ trợ này nhé.',
                        sender: 'bot',
                        isRatingAction: true
                    }]);
                    setStep(0); // Đưa trạng thái step về mặc định kết thúc luồng
                }
            }
        }, 1000);
    }, [step]);
    const handlePaymentConfirm = () => {
        setPaymentVisible(false);
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setPhase('DOCTOR_CHAT');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: '✅ Thanh toán thành công! BS. Nguyễn Văn A đang tham gia cuộc hội thoại. Bạn có thể bắt đầu trao đổi.',
                sender: 'bot',
                isSuccess: true
            }]);
        }, 2500);
    };

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
                        {isBot && item.id !== 'disclaimer' && (
                            <TouchableOpacity
                                onPress={() => toggleSpeech(item.id)}
                                style={styles.audioBtn}
                            >
                                <Volume2 size={16} color={playingId === item.id ? COLORS.primary : COLORS.placeholder}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                </View>

                {/* Option đa dạng kịch bản */}
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
                            onPress={() => navigation.navigate('MainTabs', { screen: 'Appointment' })}
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
            title={phase === 'DOCTOR_CHAT' ? "BS. Nguyễn Văn A" : "Tư vấn AI"}
            subtitle={phase === 'DOCTOR_CHAT' ? "Đang trực tuyến" : "Sàng lọc triệu chứng"}
            isScrollable={false}
            showBack={true}
            rightElement={renderHeaderRight()}
        >
            {isVerifying && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 10, ...TYPOGRAPHY.body }}>Hệ thống đang xác nhận giao dịch...</Text>
                </View>
            )}

            <FlatList
                data={messages}
                ref={flatListRef}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 5 }}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.iconBtn}><Mic size={22} color={COLORS.secondary} /></TouchableOpacity>
                    <TextInput
                        placeholder={inputText.length > 0 ? "" : placeholder}
                        placeholderTextColor={COLORS.placeholder}
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                    />

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
            <Modal visible={isPaymentVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={TYPOGRAPHY.h1}>Thanh toán tư vấn</Text>
                            <TouchableOpacity onPress={() => setPaymentVisible(false)}><X size={24} /></TouchableOpacity>
                        </View>
                        <Image
                            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SerenaPayment150k' }}
                            style={{ width: 220, height: 220, marginBottom: 20 }}
                        />
                        <Text style={{ textAlign: 'center', marginBottom: 20, ...TYPOGRAPHY.body }}>
                            Vui lòng quét mã QR để thanh toán phí tư vấn trực tiếp với bác sĩ (150.000đ)
                        </Text>
                        <AppButton title="Xác nhận đã chuyển khoản" onPress={handlePaymentConfirm} style={{ width: '100%' }} />
                    </View>
                </View>
            </Modal>

            <ConfirmModal
                isVisible={isConfirmEndVisible}
                title="Kết thúc tư vấn?"
                description="Bạn có muốn kết thúc và dành chút thời gian đánh giá Serena không?"
                icon={<AlertCircle size={40} color={COLORS.warning} />}
                confirmText="Đánh giá"
                onConfirm={() => { setIsConfirmEndVisible(false); setTimeout(() => setIsRatingVisible(true), 600); }}
                onCancel={() => { setIsConfirmEndVisible(false); navigation.goBack(); }}
            />

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
    botBubble: { backgroundColor: '#F0F4FF', borderBottomLeftRadius: 4, paddingBottom: 8 },

    userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4, alignSelf: 'flex-end' },

    // Kịch bản điều hướng
    actionColumn: { paddingLeft: 40, marginTop: 10, gap: 10 },
    actionBtnWide: { width: '100%', borderRadius: 12 },
    centerBtn: { alignSelf: 'center', marginTop: 15, width: '80%' },

    quickReplyBox: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 40, marginTop: 10, gap: 8 },
    chip: { borderRadius: 15, backgroundColor: COLORS.white, borderColor: COLORS.secondary, borderWidth: 1 },

    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: 'white', marginBottom: 40, borderRadius: 30, marginHorizontal: 10, elevation: 5 },
    input: { flex: 1, marginHorizontal: 8, ...TYPOGRAPHY.body, color: COLORS.text },
    plusBtn: { padding: 5 },
    iconBtn: { padding: 8 },
    sendBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },

    audioBtn: {
        alignSelf: 'flex-end',
        marginTop: 5,
        padding: 4,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 10,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 },
    menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    menuContent: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 60,
        right: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 8,
        width: 180,
        // Đổ bóng cho menu nổi lên
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
    },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10 },
    menuItemText: { ...TYPOGRAPHY.body, fontSize: 14, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 5 },
});