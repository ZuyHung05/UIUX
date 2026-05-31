import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ClinicVisitCard from '../../components/history/ClinicVisitCard';
import ConsultationItem from '../../components/history/ConsultationtItem';
import { MainLayout } from '../../components/layout/MainLayout';
import { CLINIC_HISTORY, CONSULTATION_HISTORY } from '../../services/mockData';
import { COLORS } from '../../utils/theme';

export const HistoryScreen = () => {
    const [tab, setTab] = useState('tu-van');
    return (
        <MainLayout title="Lịch sử hoạt động" subtitle="Lịch tư vấn và thăm khám">
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'tu-van' && styles.activeTab]}
                    onPress={() => setTab('tu-van')}
                >
                    <Text style={[styles.tabText, tab === 'tu-van' && styles.activeTabText]}>Tư vấn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, tab === 'kham' && styles.activeTab]}
                    onPress={() => setTab('kham')}
                >
                    <Text style={[styles.tabText, tab === 'kham' && styles.activeTabText]}>Khám trực tiếp</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
                {tab === 'tu-van' ? (
                    CONSULTATION_HISTORY.map(item => <ConsultationItem key={item.id} item={item} />)
                ) : (
                    CLINIC_HISTORY.map(item => <ClinicVisitCard key={item.id} item={item} />)
                )}
            </View>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 21,
    },
    activeTab: {
        backgroundColor: COLORS.secondary,
    },
    tabText: { color: '#666', fontWeight: '600' },
    activeTabText: { color: 'white' },
    // Consultation Styles
    consultItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        padding: 16, borderRadius: 16, marginBottom: 12,
        borderWidth: 1, borderColor: '#F0F0F0'
    },
    iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    itemDoctor: { fontSize: 13, color: COLORS.secondary, marginTop: 2 },
    itemSub: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
    itemDate: { fontSize: 12, color: COLORS.gray },
    newBadge: { backgroundColor: COLORS.secondary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
    newBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },

    // Clinic Card Styles
    clinicCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    doctorAvatar: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#E0E0E0' },
    cardDoctor: { fontSize: 16, fontWeight: 'bold' },
    cardSpecialty: { fontSize: 13, color: COLORS.gray },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    cardInfoBox: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 12, marginVertical: 12 },
    infoText: { fontSize: 14, color: COLORS.text, marginBottom: 4 },
    actionBtn: { alignSelf: 'flex-end', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.secondary },
    actionBtnText: { color: COLORS.secondary, fontWeight: 'bold' }
});