import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../utils/theme';
import { AppHeader } from './header';

interface MainLayoutProps {
    children: React.ReactNode; // Nội dung của màn hình
    title?: string;            // Tiêu đề header
    subtitle?: string;         // Phụ đề header
    isScrollable?: boolean;    // Có cho phép cuộn toàn màn hình không? (Mặc định là có)
    backgroundColor?: string;
    padding?: number;         // Padding mặc định cho nội dung
}

export const MainLayout = ({
    children,
    title,
    subtitle,
    isScrollable = true,
    backgroundColor = '#F9FAFB',
    padding = 20,
}: MainLayoutProps) => {

    const ContentWrapper = isScrollable ? ScrollView : View;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.white }]} edges={['top']}>
            <StatusBar style="dark" />
            <AppHeader title={title} subtitle={subtitle} />
            <ContentWrapper
                style={[styles.content, { backgroundColor }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[isScrollable ? { paddingBottom: 100 } : undefined,
                { paddingHorizontal: padding },
                { paddingTop: 22 }]}
            >
                {children}
            </ContentWrapper>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});