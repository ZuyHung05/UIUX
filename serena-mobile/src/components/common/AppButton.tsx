import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const AppButton = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
}: AppButtonProps) => {
    const getBtnStyle = () => {
        switch (variant) {
            case 'outline': return styles.outlineBtn;
            case 'ghost': return styles.ghostBtn;
            case 'danger': return styles.dangerBtn;
            default: return styles.primaryBtn;
        }
    };

    // Xác định style cho text
    const getTextStyle = () => {
        switch (variant) {
            case 'outline': return styles.outlineText;
            case 'danger': return styles.dangerText;
            case 'ghost': return styles.ghostText;
            default: return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[styles.baseBtn, styles[size], getBtnStyle(), style, disabled && styles.disabled]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : COLORS.secondary} />
            ) : (
                <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseBtn: {
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    // Kích thước
    small: { paddingVertical: 6, paddingHorizontal: 16 },
    medium: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 16, width: '100%' },

    // Variants
    primaryBtn: { backgroundColor: COLORS.primary },
    outlineBtn: { backgroundColor: 'white', borderWidth: 1.5, borderColor: COLORS.secondary },
    ghostBtn: { backgroundColor: '#F0F7FF' },
    dangerBtn: { backgroundColor: 'white', borderWidth: 1.5, borderColor: COLORS.warning },

    // Text Styles
    baseText: { ...TYPOGRAPHY.button, textAlign: 'center' },
    primaryText: { color: 'white' },
    outlineText: { color: COLORS.secondary },
    ghostText: { color: COLORS.accent, ...TYPOGRAPHY.body },
    dangerText: { color: COLORS.warning },
    disabled: { opacity: 0.5 }
});