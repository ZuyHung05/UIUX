import { Mic, Search } from 'lucide-react-native';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/theme';

export const SearchBar = () => {
    return (
        <View style={styles.container}>
            <Search color={COLORS.secondary} size={20} style={styles.searchIcon} />
            <TextInput
                placeholder="Bạn đang cảm thấy thế nào? Nhập triệu chứng ..."
                style={styles.input}
                multiline={true}
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.micBtn}>
                <Mic color={COLORS.secondary} size={20} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 10,
        height: 65,
        alignItems: 'center',
        // Đổ bóng cho iOS & Android
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginVertical: 10,
    },
    searchIcon: { marginRight: 10 },
    input: { flex: 1, ...TYPOGRAPHY.body, color: '#333' },
    micBtn: {
        backgroundColor: '#F0F7FF',
        padding: 10,
        borderRadius: 20
    },
});