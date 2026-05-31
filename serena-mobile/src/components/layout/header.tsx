import { Bell } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';


interface HeaderProps {
    title?: string;
    subtitle?: string;
}
export const AppHeader = ({ title, subtitle }: HeaderProps) => {
    return (
        <View style={[styles.header]}>
            <View style={styles.headerLeft}>
                <Image
                    source={require('../../assets/SerenaIcon.png')}
                    style={styles.logo}
                />
                <View>
                    <Text style={styles.brandName}>{title}</Text>
                    <Text style={styles.brandSub}>{subtitle}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
                <Bell color={COLORS.secondary} size={26} />
                <View style={styles.badge} />
            </TouchableOpacity>
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
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 45, height: 45, marginRight: 12 },
    brandName: { ...TYPOGRAPHY.h1, color: COLORS.secondary },
    brandSub: { ...TYPOGRAPHY.caption, color: '#666', marginTop: 2 },
    notificationBtn: { padding: 5, position: 'relative' },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'white'
    }
});