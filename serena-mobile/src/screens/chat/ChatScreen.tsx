import { Bot, ChevronLeft, Send } from 'lucide-react-native';
import { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../utils/theme';

// Dữ liệu mẫu (Mock Data)
const INITIAL_MESSAGES = [
    { id: '1', text: 'Xin chào! Tôi là Serena, trợ lý sức khỏe AI của bạn.', sender: 'bot' },
    { id: '2', text: 'Bạn đang cảm thấy thế nào? Hãy chọn hoặc nhập triệu chứng nhé.', sender: 'bot' },
];

const QUICK_REPLIES = ['Đau đầu', 'Sốt nhẹ', 'Đau dạ dày', 'Tư vấn bác sĩ'];

export default function ChatScreen() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim().length === 0) return;

        // Thêm tin nhắn của User
        const newMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInputText('');

        // Giả lập Bot trả lời sau 1 giây
        setTimeout(() => {
            const botReply = {
                id: (Date.now() + 1).toString(),
                text: 'Cảm ơn bạn đã chia sẻ. Tôi đang ghi nhận triệu chứng này...',
                sender: 'bot'
            };
            setMessages(prev => [...prev, botReply]);
        }, 1000);
    };

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.messageWrapper,
            item.sender === 'user' ? styles.userWrapper : styles.botWrapper
        ]}>
            {item.sender === 'bot' && (
                <View style={styles.botIcon}>
                    <Bot size={16} color={COLORS.white} />
                </View>
            )}
            <View style={[
                styles.bubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    item.sender === 'user' ? styles.userText : styles.botText
                ]}>
                    {item.text}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <ChevronLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hỏi đáp sức khỏe AI</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Chat List */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            {/* Quick Replies & Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Quick Reply Chips */}
                <View style={styles.quickReplyContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={QUICK_REPLIES}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.chip}
                                onPress={() => setInputText(item)}
                            >
                                <Text style={styles.chipText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingHorizontal: SPACING.m }}
                    />
                </View>

                {/* Input Bar */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập triệu chứng tại đây..."
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Send size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
    listContent: { padding: SPACING.m, paddingBottom: 20 },
    messageWrapper: { flexDirection: 'row', marginBottom: SPACING.m, alignItems: 'flex-end' },
    botWrapper: { alignSelf: 'flex-start' },
    userWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    botIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
    },
    botBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    messageText: { fontSize: 15, lineHeight: 20 },
    botText: { color: COLORS.text },
    userText: { color: COLORS.white },
    quickReplyContainer: { paddingVertical: SPACING.s },
    chip: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.secondary,
    },
    chipText: { color: COLORS.primary, fontWeight: '500', fontSize: 13 },
    inputBar: {
        flexDirection: 'row',
        padding: SPACING.m,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 45,
        marginRight: 10,
        fontSize: 15,
    },
    sendBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});