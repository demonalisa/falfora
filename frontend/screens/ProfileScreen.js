import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DatabaseService } from '../services/database';

const ZODIAC_SIGNS = [
    { name: 'Koç', icon: 'zodiac-aries' },
    { name: 'Boğa', icon: 'zodiac-taurus' },
    { name: 'İkizler', icon: 'zodiac-gemini' },
    { name: 'Yengeç', icon: 'zodiac-cancer' },
    { name: 'Aslan', icon: 'zodiac-leo' },
    { name: 'Başak', icon: 'zodiac-virgo' },
    { name: 'Terazi', icon: 'zodiac-libra' },
    { name: 'Akrep', icon: 'zodiac-scorpio' },
    { name: 'Yay', icon: 'zodiac-sagittarius' },
    { name: 'Oğlak', icon: 'zodiac-capricorn' },
    { name: 'Kova', icon: 'zodiac-aquarius' },
    { name: 'Balık', icon: 'zodiac-pisces' },
];

export default function ProfileScreen({ user, userInfo, setUserInfo, onLogout, onNavigate }) {
    const fullUser = userInfo || {};
    const webDateInputRef = useRef(null);

    const [relationshipStatus, setRelationshipStatus] = useState(fullUser.relationship || 'İlişkisi Var');
    const [isSaving, setIsSaving] = useState(false);

    const hasChanged = relationshipStatus !== (fullUser.relationship || 'İlişkisi Var');

    const handleSave = async () => {
        if (isSaving || !hasChanged) return;
        
        setIsSaving(true);
        try {
            const editData = {
                relationship: relationshipStatus
            };
            const updatedUser = await DatabaseService.saveUser(user.id, editData);
            if (updatedUser) {
                setUserInfo(updatedUser);
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        } finally {
            // We keep isSaving true until it changes again or some other logic?
            // User said: "tıklayınca gri ve dokunulamaz hale gelsin"
            // If we set isSaving(true) it becomes gray/disabled.
            // If the request finishes, it should probably stay disabled if it's saved.
            // Actually, once saved, hasChanged will become false (because fullUser updates).
            // So the button will disappear anyway. 
            // BUT the user specifically wants it to become gray and disabled when clicked.
            // So I'll keep isSaving true during the process, and after it updates, the button will hide.
            setIsSaving(false);
        }
    };

    const formatDateForView = (dateString) => {
        if (!dateString) return 'Belirtilmedi';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const infoItems = [
        { key: 'birthDate', label: 'Doğum Tarihi', value: formatDateForView(fullUser.birthDate), icon: 'calendar-heart' },
        { key: 'zodiac', label: 'Burç', value: fullUser.zodiac || 'Belirtilmedi', icon: 'zodiac-leo' },
        { key: 'gender', label: 'Cinsiyet', value: fullUser.gender || 'Belirtilmedi', icon: fullUser.gender === 'Erkek' ? 'gender-male' : 'gender-female' },
    ];

    const RELATIONS = ['Bekar', 'İlişkisi Var', 'Evli', 'Karışık'];

    return (
        <View style={styles.container}>
            <View style={styles.profileMainContent}>
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
                    </View>
                    <Text style={styles.userName}>{fullUser.name || user.name}</Text>
                    <Text style={styles.userId}>ID: {user.id.substring(0, 12)}...</Text>
                </View>

                {/* User Details Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitleNoMargin}>Kozmik Kimlik</Text>
                    </View>

                    <View style={styles.infoCard}>
                        {infoItems.map((item, index) => (
                            <View key={item.key} style={styles.infoItem}>
                                <View style={styles.iconBackground}>
                                    <MaterialCommunityIcons name={item.icon} size={22} color="#d4af37" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                    <Text style={styles.infoValue}>{item.value}</Text>
                                </View>
                            </View>
                        ))}
                        
                        {/* Relationship Status Dropdown Selection */}
                        <View style={[styles.infoItem, styles.noBorder]}>
                            <View style={styles.iconBackground}>
                                <MaterialCommunityIcons name="heart-outline" size={22} color="#d4af37" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>İlişki Durumu</Text>
                                <View style={styles.relationshipSelectContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillGroupCompact}>
                                        {RELATIONS.map((status) => (
                                            <TouchableOpacity
                                                key={status}
                                                onPress={() => setRelationshipStatus(status)}
                                                style={[
                                                    styles.pillButtonSmall,
                                                    relationshipStatus === status && styles.pillButtonSmallActive,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.pillTextSmall,
                                                        relationshipStatus === status && styles.pillTextSmallActive,
                                                    ]}
                                                >
                                                    {status}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Save Button - Only visible when changed */}
                    {hasChanged && (
                        <TouchableOpacity 
                            style={[
                                styles.saveBtn,
                                isSaving && styles.saveBtnDisabled
                            ]} 
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            <Text style={[
                                styles.saveBtnText,
                                isSaving && styles.saveBtnTextDisabled
                            ]}>
                                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hesap</Text>
                    <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
                        <View style={[styles.iconBackground, { backgroundColor: 'rgba(255, 69, 58, 0.1)' }]}>
                            <MaterialCommunityIcons name="logout" size={22} color="#FF453A" />
                        </View>
                        <Text style={[styles.actionText, { color: '#FF453A' }]}>Çıkış Yap</Text>
                        <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.3)" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('history')}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Geçmiş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('home')}>
                    <MaterialCommunityIcons name="home-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Ana Sayfa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="account" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Profil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1022',
        width: '100%',
        height: '100%',
    },
    profileMainContent: {
        flex: 1,
        justifyContent: 'space-evenly', 
        paddingBottom: 70, 
    },
    banner: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
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
    userName: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
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
        marginTop: 10,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionTitleNoMargin: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
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
        fontFamily: 'Inter_400Regular',
        marginBottom: 2,
    },
    infoValue: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
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
    },
    /* Forms & Edit mode styles */
    relationshipSelectContainer: {
        marginTop: 4,
    },
    pillGroupCompact: {
        flexDirection: 'row',
        gap: 4,
        paddingRight: 16,
    },
    pillButtonSmall: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: 6,
    },
    pillButtonSmallActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
        borderWidth: 1,
    },
    pillTextSmall: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
    },
    pillTextSmallActive: {
        color: '#d4af37',
        fontFamily: 'Inter_700Bold',
    },
    saveBtn: {
        backgroundColor: '#d4af37',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#d4af37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveBtnDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        shadowOpacity: 0,
        elevation: 0,
    },
    saveBtnText: {
        color: '#1c1022',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    saveBtnTextDisabled: {
        color: 'rgba(255, 255, 255, 0.2)',
    }
});
