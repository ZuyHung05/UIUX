import React from 'react';
import { Modal, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';
import { AppButton } from './AppButton';

interface ConfirmModalProps {
    isVisible: boolean;
    title: string;
    description: string | React.ReactNode;
    icon: React.ReactNode;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'primary' | 'danger';
}

export const ConfirmModal = ({
    isVisible, title, description, icon,
    confirmText, onConfirm, onCancel, type = 'primary'
}: ConfirmModalProps) => {
    const { width } = useWindowDimensions();
    const isDesktopWeb = Platform.OS === 'web' && width > 480;

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={[styles.overlay, isDesktopWeb && styles.webOverlay]}>
                <View style={[styles.content, isDesktopWeb && styles.webContent]}>
                    <View style={[styles.iconCircle, { backgroundColor: type === 'danger' ? '#FFE5E5' : COLORS.lightBlue }]}>
                        {icon}
                    </View>

                    <Text style={[styles.title, { color: type === 'danger' ? COLORS.warning : COLORS.primary }]}>{title}</Text>

                    <View style={styles.descContainer}>
                        {typeof description === 'string' ? (
                            <Text style={styles.description}>{description}</Text>
                        ) : (
                            description
                        )}
                    </View>

                    <View style={[styles.buttonRow, isDesktopWeb && styles.webButtonRow]}>
                        <AppButton
                            title="Hủy"
                            variant="outline"
                            onPress={onCancel}
                            style={styles.btn}
                        />
                        <AppButton
                            title={confirmText}
                            variant={type === 'danger' ? 'danger' : 'primary'}
                            onPress={onConfirm}
                            style={styles.btn}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    webOverlay: {
        width: 390,
        maxWidth: '100%',
        height: 844,
        maxHeight: '100%',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    content: { width: '90%', backgroundColor: 'white', borderRadius: 30, padding: 20, alignItems: 'center' },
    webContent: {
        width: 342,
        maxWidth: '88%',
        borderRadius: 24,
        padding: 18,
    },
    iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { ...TYPOGRAPHY.h1, marginBottom: 15 },
    descContainer: { marginBottom: 30 },
    description: { ...TYPOGRAPHY.body, textAlign: 'center', color: '#4A5565', lineHeight: 22 },
    buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
    webButtonRow: { gap: 8 },
    btn: { flex: 1 }
});
