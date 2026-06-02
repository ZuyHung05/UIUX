import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import Svg, { Polygon } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMode = 'login' | 'register';

interface AuthScreenProps {
    onAuthenticated: () => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [rememberMe, setRememberMe] = useState(false);

    const isRegister = mode === 'register';

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.content, isRegister ? styles.registerContent : styles.loginContent]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.hero}>
                        <SerenaMark />
                        <Text style={styles.title}>CHÀO MỪNG ĐẾN VỚI{'\n'}SERENA HEALTH</Text>
                        <Text style={styles.subtitle}>
                            {isRegister
                                ? 'Đăng ký tài khoản để sử dụng dịch vụ của hệ thống'
                                : 'Đăng nhập để sử dụng dịch vụ của hệ thống'}
                        </Text>
                    </View>

                    <View style={[styles.formPanel, isRegister ? styles.registerPanel : styles.loginPanel]}>
                        {isRegister && (
                            <AuthField
                                icon="user"
                                label="Họ và Tên"
                                placeholder="Nhập họ và tên"
                                textContentType="name"
                            />
                        )}

                        <AuthField
                            icon="mail"
                            label="Email / Số điện thoại"
                            placeholder="Nhập email hoặc số điện thoại"
                            keyboardType="email-address"
                            textContentType="username"
                        />

                        <AuthField
                            icon="shield"
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            secureTextEntry
                            textContentType="password"
                        />

                        {isRegister ? (
                            <AuthField
                                icon="shield"
                                label="Nhập lại mật khẩu"
                                placeholder="Nhập lại mật khẩu"
                                secureTextEntry
                                textContentType="password"
                            />
                        ) : (
                            <View style={styles.loginOptions}>
                                <Pressable
                                    onPress={() => setRememberMe(!rememberMe)}
                                    style={styles.rememberRow}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && <View style={styles.checkboxDot} />}
                                    </View>
                                    <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
                                </Pressable>

                                <TouchableOpacity activeOpacity={0.75}>
                                    <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={onAuthenticated}
                            style={styles.primaryButton}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {isRegister ? (
                            <View style={styles.switchRow}>
                                <Text style={styles.switchMuted}>Đã có tài khoản?</Text>
                                <TouchableOpacity onPress={() => setMode('login')} activeOpacity={0.75}>
                                    <Text style={styles.switchLink}>Đăng nhập</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.switchRow}>
                                <Text style={styles.switchMuted}>Chưa có tài khoản?</Text>
                                <TouchableOpacity onPress={() => setMode('register')} activeOpacity={0.75}>
                                    <Text style={styles.switchLink}>Đăng kí ngay</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

interface AuthFieldProps {
    icon: 'user' | 'mail' | 'shield';
    label: string;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    textContentType?: 'name' | 'username' | 'password';
}

function AuthField({
    icon,
    label,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    textContentType,
}: AuthFieldProps) {
    const Icon = icon === 'user' ? UserRound : icon === 'mail' ? Mail : ShieldCheck;

    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputShell}>
                <Icon size={20} color="#1E4671" strokeWidth={2.2} style={styles.inputIcon} />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#D2D5DB"
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    textContentType={textContentType}
                    style={styles.input}
                />
            </View>
        </View>
    );
}

function SerenaMark() {
    return (
        <Svg width={100} height={100} viewBox="0 0 100 100" style={styles.logo}>
            <Polygon points="29.2,0 58.4,50 29.2,100 0,50" fill="#4E9FFF" opacity={0.6} />
            <Polygon points="50,0 79.2,50 50,100 20.8,50" fill="#8DC1FF" opacity={0.6} />
            <Polygon points="70.8,0 100,50 70.8,100 41.6,50" fill="#4E9FFF" opacity={0.6} />
        </Svg>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 11,
        paddingBottom: 20,
    },
    registerContent: {
        paddingTop: 96,
    },
    loginContent: {
        paddingTop: 100,
    },
    hero: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 417,
    },
    logo: {
        marginBottom: 27,
    },
    title: {
        color: '#244A6B',
        fontSize: 24,
        lineHeight: 28,
        fontWeight: '700',
        letterSpacing: 0.8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 8,
    },
    formPanel: {
        width: '100%',
        maxWidth: 417,
        backgroundColor: '#F5F9F9',
        borderRadius: 28,
        paddingHorizontal: 32,
        marginTop: 32,
    },
    registerPanel: {
        minHeight: 674,
        paddingTop: 24,
        paddingBottom: 32,
    },
    loginPanel: {
        minHeight: 491,
        paddingTop: 32,
        paddingBottom: 32,
    },
    fieldGroup: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#244A6B',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        marginBottom: 12,
    },
    inputShell: {
        width: '100%',
        height: 69,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1F3F7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        shadowColor: '#19213D',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
        opacity: 0.5,
    },
    input: {
        flex: 1,
        color: '#244A6B',
        fontSize: 16,
        lineHeight: 19,
        paddingVertical: 0,
    },
    loginOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 28,
        marginTop: 4,
        marginBottom: 20,
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        marginRight: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 2.5,
        borderWidth: 1,
        borderColor: '#767676',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        borderColor: '#5B9BFA',
    },
    checkboxDot: {
        width: 12,
        height: 12,
        borderRadius: 2,
        backgroundColor: '#5B9BFA',
    },
    rememberText: {
        color: '#244A6B',
        fontSize: 16,
        lineHeight: 24,
    },
    forgotText: {
        color: '#718096',
        fontSize: 16,
        lineHeight: 24,
    },
    primaryButton: {
        alignSelf: 'center',
        width: 200,
        height: 48,
        borderRadius: 28,
        backgroundColor: '#5B9DFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '700',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#D9E0E8',
        marginTop: 28,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 6,
        rowGap: 4,
        marginTop: 28,
    },
    switchMuted: {
        color: '#BAB7CF',
        fontSize: 16,
        lineHeight: 16,
    },
    switchLink: {
        color: '#579AFF',
        fontSize: 16,
        lineHeight: 16,
    },
});
