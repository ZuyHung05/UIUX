import { FileText } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MainLayout } from '../../components/layout/MainLayout';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

export default function ConsultationDetailScreen({ route }: any) {
    const { consultation } = route.params;

    const renderHeader = () => (
        <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
                <FileText size={20} color={COLORS.primary} />
                <Text style={styles.summaryTitle}>Kết luận y tế</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Triệu chứng:</Text>
                <Text style={styles.value}>{consultation.symptoms}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Chẩn đoán:</Text>
                <Text style={styles.value}>{consultation.diagnosis}</Text>
            </View>

            <View style={styles.adviceBox}>
                <Text style={[styles.label, { color: COLORS.primary }]}>Lời khuyên bác sĩ:</Text>
                <Text style={styles.adviceText}>{consultation.advice}</Text>
            </View>
        </View>
    );

    const renderMessage = ({ item }: any) => {
        const isBot = item.sender === 'bot';
        return (
            <View style={[styles.msgRow, isBot ? styles.botRow : styles.userRow]}>
                <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                    <Text style={{ color: isBot ? COLORS.text : 'white', ...TYPOGRAPHY.body }}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <MainLayout
            title="Chi tiết tư vấn"
            subtitle={consultation.doctorName}
            showBack={true}
            isScrollable={false}
        >
            <FlatList
                data={consultation.chatHistory}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 15 }}
                ListFooterComponent={
                    <Text style={styles.endText}>—— Cuộc trò chuyện đã kết thúc ——</Text>
                }
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: COLORS.lightBlue,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    summaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
    summaryTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary },
    infoRow: { marginBottom: 10 },
    label: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.subtext, marginBottom: 2 },
    value: { ...TYPOGRAPHY.body, color: COLORS.text },
    adviceBox: {
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 12,
        marginTop: 5,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary
    },
    adviceText: { ...TYPOGRAPHY.body, fontStyle: 'italic', color: COLORS.text },

    // Chat Styles (Giống màn ChatScreen)
    msgRow: { flexDirection: 'row', marginBottom: 15 },
    botRow: { alignSelf: 'flex-start' },
    userRow: { alignSelf: 'flex-end' },
    bubble: { maxWidth: '85%', padding: 12, borderRadius: 18 },
    botBubble: { backgroundColor: COLORS.lightBlue, borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
    endText: {
        textAlign: 'center',
        ...TYPOGRAPHY.caption,
        color: COLORS.placeholder,
        marginVertical: 20
    }
});