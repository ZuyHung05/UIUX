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
    View
} from 'react-native';
import { COLORS } from '../../utils/theme';
import { AppButton } from './AppButton';

interface RatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal = ({ isVisible, onClose, onSubmit }: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isVisible) {
            setRating(0);
            setComment('');
        }
    }, [isVisible]);

    const isReady = rating > 0;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* Background mờ phía sau */}
            <Pressable style={styles.overlay} onPress={onClose}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.sheetContainer}
                >
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
    },
    sheetContainer: {
        width: '100%',
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.secondary,
    },
    starSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F0F7FF',
        borderRadius: 15,
        paddingVertical: 20,
        marginBottom: 20,
    },
    starTouch: {
        paddingHorizontal: 5,
    },
    textInput: {
        backgroundColor: '#F5F9FF',
        borderRadius: 15,
        padding: 15,
        height: 150,
        fontSize: 15,
        color: '#333',
        marginBottom: 20,
    },
    submitBtn: {
        width: '100%',
        borderRadius: 30,
    }
});