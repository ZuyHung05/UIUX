import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../utils/theme';
import { AppHeader } from './header';

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    isScrollable?: boolean;
    backgroundColor?: string;
    padding?: number;         // Padding mặc định cho nội dung
    showBack?: boolean;
    showRightIcon?: boolean;
}

export const MainLayout = ({
    children,
    title,
    subtitle,
    isScrollable = true,
    backgroundColor = COLORS.background,
    padding = 20,
    showBack = false,
    showRightIcon = false
}: MainLayoutProps) => {

    const ContentWrapper = isScrollable ? ScrollView : View;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
            <StatusBar style="dark" />
            <AppHeader title={title} subtitle={subtitle} showBack={showBack} showRightIcon={showRightIcon} />
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