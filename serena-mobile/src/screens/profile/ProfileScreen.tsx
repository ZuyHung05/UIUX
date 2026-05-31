import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MainLayout } from '../../components/layout/MainLayout';
import { TYPOGRAPHY } from '../../utils/theme';

export default function ProfileScreen() {
    return (
        <MainLayout
            title="Cá nhân"
            subtitle="Thông tin sức khỏe & EMR"
        >
            <View style={styles.center}>
                <Text style={styles.text}>Nội dung Trang Cá nhân ...</Text>
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    text: {
        ...TYPOGRAPHY.body,
        color: '#999',
    }
});