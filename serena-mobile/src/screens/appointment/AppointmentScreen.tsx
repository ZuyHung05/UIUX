import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MainLayout } from '../../components/layout/MainLayout';
import { TYPOGRAPHY } from '../../utils/theme';

export default function AppointmentScreen() {
    return (
        <MainLayout
            title="Lịch hẹn"
            subtitle="Quản lý lịch khám của bạn"
        >
            <View style={styles.center}>
                <Text style={styles.text}>Nội dung Trang Lịch hẹn ...</Text>
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