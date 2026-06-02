import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Image, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';
import { AppButton } from '../common/AppButton';

const ConsultationItem = ({ item, onOpenRating }: { item: any; onOpenRating: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };
    return (

        <TouchableOpacity style={styles.consultItem}
            onPress={toggleExpand}
            activeOpacity={0.9}>
            <View style={styles.mainRow}>
                <View style={styles.iconCircle}>
                    <Image source={require('../../assets/SerenaIcon.png')} style={{ width: 24, height: 24 }} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {item.doctor && <Text style={styles.itemDoctor}>{item.doctor}</Text>}
                    <Text style={styles.itemSub} numberOfLines={1}>{item.sub}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Text style={styles.itemDate}>{item.date}</Text>
                        {item.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>Mới</Text></View>}
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <Text style={styles.itemTime}>{item.time}</Text>
                    {isExpanded ? (
                        <ChevronDown size={20} color={COLORS.secondary} />
                    ) : (
                        <ChevronRight size={20} color={COLORS.gray} />
                    )}
                </View>
            </View>
            {isExpanded && (
                <View style={styles.expandedContent}>
                    <AppButton
                        title="Xem chi tiết cuộc tư vấn"
                        variant="primary"
                        size="medium"
                        onPress={() => console.log('Go to detail')}
                        style={styles.actionBtn}
                    />

                    <AppButton
                        title="Đánh giá"
                        variant="outline"
                        size="medium"
                        onPress={onOpenRating}
                        style={styles.actionBtn}
                    />
                </View>
            )}

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    consultItem: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderColor: COLORS.lightGray
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.lightBlue,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemTitle: { ...TYPOGRAPHY.title, color: COLORS.accent },
    itemDoctor: { ...TYPOGRAPHY.caption, color: COLORS.primaryDark, marginTop: 2, fontWeight: '600' },
    itemSub: { ...TYPOGRAPHY.body, color: COLORS.subtext, marginTop: 4 },
    itemDate: { ...TYPOGRAPHY.caption, color: COLORS.gray },
    itemTime: { ...TYPOGRAPHY.caption, color: COLORS.gray, marginRight: 4 },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    newBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
    newBadgeText: { color: 'white', ...TYPOGRAPHY.caption },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Styles cho phần mở rộng
    expandedContent: {
        marginTop: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 15,
    },
    actionBtn: {
        marginBottom: 10,
        width: '100%',
    }
});

export default ConsultationItem;