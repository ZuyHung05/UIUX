import { Bot, Mic, Plus, Send } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Import nội bộ
import { AppButton } from '../../components/common/AppButton';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

export default function ChatScreen() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Tôi bị đau đầu',
            sender: 'user'
        },
        {
            id: '2',
            text: 'Nghe bạn nói bị đau đầu, tôi rất tiếc. Tình trạng này chắc chắn rất khó chịu. Bạn đã bị như vậy bao lâu rồi?',
            sender: 'bot',
            quickReplies: ['Mới bị lúc nãy', 'Khoảng 2-3 tiếng', 'Đã bị từ sáng']
        },
    ]);

    // Hàm xử lý gửi tin nhắn
    const handleSend = useCallback((text: string) => {
        if (!text.trim()) return;

        const newUserMsg = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
        };

        setMessages((prev) => [...prev, newUserMsg]);
        setInputText('');

        // Giả lập Bot phản hồi sau 1 giây
        setTimeout(() => {
            const botReply = {
                id: (Date.now() + 1).toString(),
                text: 'Cảm ơn bạn đã cung cấp thông tin. Hệ thống đang phân tích các triệu chứng...',
                sender: 'bot',
                quickReplies: ['Tư vấn trực tiếp', 'Tìm hiểu thêm']
            };
            setMessages((prev) => [...prev, botReply]);
        }, 1000);
    }, []);

    const renderMessage = ({ item }: { item: any }) => {
        const isBot = item.sender === 'bot';

        return (
            <View style={styles.messageGroup}>
                {/* Hàng tin nhắn chính */}
                <View style={[styles.messageRow, isBot ? styles.botRow : styles.userRow]}>
                    {isBot && (
                        <View style={styles.botAvatar}>
                            <Bot size={24} color={COLORS.white} />
                        </View>
                    )}
                    <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                        <Text style={[styles.messageText, { color: isBot ? COLORS.text : COLORS.white }]}>
                            {item.text}
                        </Text>
                    </View>
                </View>

                {/* Quick Replies hiển thị ngay dưới bong bóng Chat của Bot */}
                {isBot && item.quickReplies && (
                    <View style={styles.quickReplyWrapper}>
                        {item.quickReplies.map((reply: string, index: number) => (
                            <AppButton
                                key={index}
                                title={reply}
                                variant="ghost"
                                size="small"
                                onPress={() => handleSend(reply)}
                                style={styles.chip}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <MainLayout
            title="Tư vấn"
            subtitle="Tôi có thể giúp gì cho bạn ?"
            showBack={true}
            isScrollable={false}
            backgroundColor={COLORS.white}
        >
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <View style={styles.inputWrapper}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Plus size={24} color={COLORS.secondary} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Hỏi AI Y tế..."
                        placeholderTextColor={COLORS.gray}
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={() => handleSend(inputText)}
                    />

                    <TouchableOpacity style={styles.iconBtn}>
                        <Mic size={24} color={COLORS.secondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sendBtn, { opacity: inputText ? 1 : 0.6 }]}
                        onPress={() => handleSend(inputText)}
                    >
                        <Send size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    chatList: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    messageGroup: {
        marginBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    botRow: { alignSelf: 'flex-start' },
    userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },

    botAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    bubble: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 20,
    },
    botBubble: {
        backgroundColor: COLORS.lightBlue,
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    messageText: {
        ...TYPOGRAPHY.body,
        lineHeight: 22,
    },

    // Quick Replies
    quickReplyWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 48,
        marginTop: 10,
        gap: 8,
    },
    chip: {
        color: COLORS.accent,
        borderRadius: 15,
        backgroundColor: COLORS.lightBlue,
        borderColor: COLORS.secondary,
        borderWidth: 0.5,
    },

    // Input Bar (Floating above Bottom Tab)
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: 15,
        // Khoảng cách này giúp thanh input nằm ngay trên Tab Bar
        marginBottom: Platform.OS === 'ios' ? 110 : 85,
        padding: 6,
        paddingLeft: 10,
        borderRadius: 30,
        // Shadow & Border
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    textInput: {
        flex: 1,
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        height: 45,
    },
    iconBtn: {
        padding: 8,
    },
    sendBtn: {
        backgroundColor: COLORS.primaryDark,
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    }
});