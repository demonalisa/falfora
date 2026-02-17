import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DatabaseService } from '../services/database';

export default function ProfileScreen({ user, onLogout, onNavigate }) {
    const fullUser = DatabaseService.getUser(user.id) || {};

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const d = new Date(dateString);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const infoItems = [
        { label: 'Birth Date', value: formatDate(fullUser.birthDate), icon: 'calendar-heart' },
        { label: 'Zodiac Sign', value: fullUser.zodiac || 'Not set', icon: 'zodiac-leo' },
        { label: 'Relationship', value: fullUser.relationship || 'Not set', icon: 'heart-outline' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header/Banner Area */}
                <View style={styles.banner}>
                    <LinearGradient
                        colors={['rgba(212, 175, 55, 0.2)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.profileImageContainer}>
                        <View style={styles.avatarCircle}>
                            <MaterialCommunityIcons name="account" size={60} color="#d4af37" />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <MaterialIcons name="edit" size={16} color="#1c1022" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userId}>ID: {user.id.substring(0, 12)}...</Text>
                </View>

                {/* User Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cosmic Identity</Text>
                    <View style={styles.infoCard}>
                        {infoItems.map((item, index) => (
                            <View key={item.label} style={[styles.infoItem, index === infoItems.length - 1 && styles.noBorder]}>
                                <View style={styles.iconBackground}>
                                    <MaterialCommunityIcons name={item.icon} size={22} color="#d4af37" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                    <Text style={styles.infoValue}>{item.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
                        <View style={[styles.iconBackground, { backgroundColor: 'rgba(255, 69, 58, 0.1)' }]}>
                            <MaterialCommunityIcons name="logout" size={22} color="#FF453A" />
                        </View>
                        <Text style={[styles.actionText, { color: '#FF453A' }]}>Logout</Text>
                        <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.3)" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('history')}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('home')}>
                    <MaterialCommunityIcons name="home-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="account" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    banner: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#d4af37',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#1c1022',
    },
    userName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userId: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 32,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(28, 16, 34, 0.98)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    navItemActive: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    navText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
        fontWeight: '500',
    },
    navTextActive: {
        color: '#d4af37',
        fontSize: 11,
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        top: -12,
        width: 40,
        height: 3,
        backgroundColor: '#d4af37',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    }
});
