
import { useNavigation } from '@react-navigation/native';
import { Clock, MapPin } from 'lucide-react-native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';
import { AppButton } from '../common/AppButton';

const ClinicVisitCard = ({ item }: { item: any }) => {
    const getStatusColor = (status: string) => {
        if (status === 'Sắp diễn ra') return COLORS.secondary;
        if (status === 'Hoàn thành') return COLORS.green;
        return COLORS.warning; // Đã hủy
    };
    const navigation = useNavigation<any>();

    return (
        <View style={[styles.clinicCard, { borderLeftColor: getStatusColor(item.status), borderLeftWidth: 4 }]}>
            <View style={styles.cardHeader}>
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.doctorAvatar} />
            ) : (
                <View style={styles.doctorAvatar} />
            )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cardDoctor}>{item.doctor}</Text>
                    <Text style={styles.cardSpecialty}>{item.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' },]}>
                    <Text style={{ color: getStatusColor(item.status), ...TYPOGRAPHY.tabLabel }}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.cardInfoBox}>
                <View style={styles.infoRow}>
                    <Clock size={15} color="#555" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MapPin size={15} color="#555" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.location}</Text>
                </View>
            </View>

            <AppButton
                title={item.status === 'Sắp diễn ra' ? 'Hủy lịch' : 'Đặt lại'}
                variant={item.status === 'Sắp diễn ra' ? 'danger' : 'outline'}
                size="small"
                onPress={() => navigation.navigate('Appointment')}
                style={{ alignSelf: 'flex-end', marginTop: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    clinicCard: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    doctorAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.lightBlue },
    cardDoctor: { ...TYPOGRAPHY.title, color: COLORS.secondary },
    cardSpecialty: { ...TYPOGRAPHY.caption, color: COLORS.placeholder, marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },

    cardInfoBox: {
        justifyContent: 'space-between',
        marginTop: 8,
        padding: 8,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        width: '100%',
    },
    infoText: { ...TYPOGRAPHY.body, color: COLORS.text },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    infoIcon: {
        marginRight: 6,
    },
    actionBtn: {
        marginTop: 15,
        marginLeft: 'auto',
        width: 100,
        height: 36,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center'
    },
    actionBtnText: { color: COLORS.secondary, ...TYPOGRAPHY.button, fontWeight: 'bold' },
});

export default ClinicVisitCard;