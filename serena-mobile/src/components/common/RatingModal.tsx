import { Star, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';
import { AppButton } from './AppButton';

interface RatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal = ({ isVisible, onClose, onSubmit }: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { width } = useWindowDimensions();
    const isDesktopWeb = Platform.OS === 'web' && width > 480;

    useEffect(() => {
        if (isVisible) {
            setRating(0);
            setComment('');
        }
    }, [isVisible]);

    const isReady = rating > 0;
    if (!isVisible) return null;
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* Background mờ phía sau */}
            <Pressable style={[styles.overlay, isDesktopWeb && styles.webOverlay]} onPress={onClose}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={[styles.keyboardWrapper, isDesktopWeb && styles.webKeyboardWrapper]}
                >
                    <View style={[styles.sheetContainer, isDesktopWeb && styles.webSheetContainer]}>
                        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.handle} />
                            <View style={styles.header}>
                                <Text style={styles.title}>Đánh giá chất lượng tư vấn</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <X color="#333" size={24} />
                                </TouchableOpacity>
                            </View>

                            {/* chọn Sao */}
                            <View style={styles.starSection}>
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setRating(index)}
                                        style={styles.starTouch}
                                    >
                                        <Star
                                            size={40}
                                            color={index <= rating ? '#FFD700' : '#E0E0E0'}
                                            fill={index <= rating ? '#FFD700' : 'transparent'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Ô nhập ý kiến */}
                            <TextInput
                                style={styles.textInput}
                                placeholder="Chia sẻ thêm cảm nhận của bạn về cuộc tư vấn này..."
                                placeholderTextColor="#999"
                                multiline
                                textAlignVertical="top"
                                value={comment}
                                onChangeText={setComment}
                            />

                            {/* Nút gửi đánh giá */}
                            <AppButton
                                title="Gửi đánh giá"
                                onPress={() => onSubmit(rating, comment)}
                                variant={isReady ? 'primary' : 'ghost'} // Đổi variant dựa trên trạng thái
                                disabled={!isReady} // Không cho nhấn nếu chưa chọn sao
                                style={styles.submitBtn}
                            />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    webOverlay: {
        width: 390,
        maxWidth: '100%',
        height: 844,
        maxHeight: '100%',
        alignSelf: 'center',
        borderRadius: 26,
        overflow: 'hidden',
    },
    keyboardWrapper: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    webKeyboardWrapper: {
        maxWidth: 390,
        alignSelf: 'center',
    },
    sheetContainer: {
        width: '100%',
        maxHeight: '72%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 12,
    },
    webSheetContainer: {
        height: 390,
        maxHeight: 390,
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#CCC',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        ...TYPOGRAPHY.title,
        color: COLORS.secondary,
    },
    starSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F0F7FF',
        borderRadius: 15,
        paddingVertical: 14,
        marginBottom: 14,
    },
    starTouch: {
        paddingHorizontal: 5,
    },
    textInput: {
        backgroundColor: '#F5F9FF',
        borderRadius: 15,
        padding: 15,
        height: 132,
        ...TYPOGRAPHY.body,
        color: '#333',
        marginBottom: 14,
    },
    submitBtn: {
        width: '100%',
        borderRadius: 30,
        paddingVertical: 15,
    }
});
