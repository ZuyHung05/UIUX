import { CheckCircle2 } from 'lucide-react-native';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';
import { AppButton } from './AppButton';

interface StatusModalProps {
    isVisible: boolean;
    title: string;
    description: string;
    onClose: () => void;
}


export const StatusModal = ({ isVisible, title, description, onClose }: StatusModalProps) => (
    <Modal visible={isVisible} transparent animationType="fade">
        <View style={styles.overlay}>
            <View style={styles.content}>
                <CheckCircle2 size={80} color={COLORS.green} style={{ marginBottom: 20 }} />
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.description, { marginBottom: 25 }]}>{description}</Text>
                <AppButton title="Hoàn thành" onPress={onClose} style={{ width: '100%' }} />
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    content: { width: '85%', backgroundColor: 'white', borderRadius: 30, padding: 25, alignItems: 'center' },
    iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { ...TYPOGRAPHY.h1, color: COLORS.secondary, marginBottom: 15 },
    descContainer: { marginBottom: 30 },
    description: { ...TYPOGRAPHY.body, textAlign: 'center', color: '#4A5565', lineHeight: 22 },
    buttonRow: { flexDirection: 'row', gap: 15 },
    btn: { flex: 1 }
});