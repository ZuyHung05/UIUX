import { useNavigation } from '@react-navigation/native';
import { Bell, ChevronLeft, MoreVertical } from 'lucide-react-native';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SereneHeartLogo } from '../brand/SereneHeartLogo';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';


interface HeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    showRightIcon?: boolean;
    showBell?: boolean;
    rightElement?: React.ReactNode;
}
export const AppHeader = ({ title, subtitle, showBack = false, showRightIcon = false, rightElement, showBell = true }: HeaderProps) => {
    const navigation = useNavigation<any>();
    const showMenu = () => {
        Alert.alert(
            "Tùy chọn",
            "Bạn muốn thực hiện hành động nào?",
            [
                { text: "Đánh dấu tất cả đã đọc", onPress: () => console.log("Mark all read") },
                { text: "Xóa tất cả", style: "destructive" },
                { text: "Hủy", style: "cancel" }
            ]
        );
    };
    return (
        <View style={[styles.header]}>
            <View style={styles.headerLeft}>
                {showBack ? (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
                        <ChevronLeft size={28} color={COLORS.secondary} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.logo}>
                        <SereneHeartLogo size={50} />
                    </View>
                )}
                <View>
                    <Text style={styles.brandName}>{title}</Text>
                    <Text style={styles.brandSub}>{subtitle}</Text>
                </View>
            </View>
            {rightElement ? rightElement : null}
            {showRightIcon && (
                <TouchableOpacity onPress={showMenu} style={{ padding: 5 }}>
                    <MoreVertical color={COLORS.secondary} size={26} />
                </TouchableOpacity>
            )}
            {(showBell && !showRightIcon && !rightElement) && (
                <TouchableOpacity
                    style={styles.notificationBtn}
                    onPress={() => navigation.navigate('Notification')}
                >
                    <Bell color={COLORS.secondary} size={26} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1.27,
        borderBottomColor: COLORS.border,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 50, height: 50, marginRight: 12, transform: [{ translateY: 2 }] },
    brandName: { ...TYPOGRAPHY.h1, color: COLORS.accent },
    brandSub: { ...TYPOGRAPHY.caption, color: COLORS.subtext, marginTop: 2 },
    notificationBtn: { padding: 5, position: 'relative' },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 10,
        height: 10,
        backgroundColor: COLORS.notification,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    }
});
