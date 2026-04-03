import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
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

export default function ProfileScreen({ user, userInfo, setUserInfo, accessToken, onLogout, onNavigate }) {
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
            // accessToken'ı göndererek MongoDB'yi güncelliyoruz
            const updatedUser = await DatabaseService.saveUser(user.id, editData, accessToken);
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

    const RELATIONS = ['Bekar', 'İlişkisi Var', 'Evli', 'Boşanmış', 'Karışık'];

    return (
        <View style={styles.container}>
            <View style={styles.profileMainContent}>
                {/* Header/Banner Area */}
                <View style={styles.banner}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.avatarCircle}>
                            {user.picture ? (
                                <Image source={{ uri: user.picture }} style={styles.avatarImage} />
                            ) : (
                                <MaterialCommunityIcons name="account" size={50} color="#d4af37" />
                            )}
                        </View>
                    </View>
                    <Text style={styles.userName}>{fullUser.name || user.name}</Text>
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
                                    <MaterialCommunityIcons name={item.icon} size={18} color="#d4af37" />
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
                                <MaterialCommunityIcons name="heart-outline" size={18} color="#d4af37" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>İlişki Durumu</Text>
                                <View style={styles.pillGroupCompact}>
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
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                                style={[
                                                    styles.pillTextSmall,
                                                    relationshipStatus === status && styles.pillTextSmallActive,
                                                ]}
                                            >
                                                {status}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Save Button - Only visible when changed */}
                    {hasChanged && (
                        <TouchableOpacity 
                            style={[
                                styles.saveBtn,
                                isSaving && styles.saveBtnDisabled,
                                isSaving && { pointerEvents: 'none' }
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
                    <Text style={styles.sectionTitleCompact}>Hesap</Text>
                    <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
                        <View style={[styles.iconBackground, { backgroundColor: 'rgba(255, 69, 58, 0.1)', width: 34, height: 34, borderRadius: 10 }]}>
                            <MaterialCommunityIcons name="logout" size={18} color="#FF453A" />
                        </View>
                        <Text style={[styles.actionText, { color: '#FF453A' }]}>Çıkış Yap</Text>
                        <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.3)" />
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

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('explore')}>
                    <MaterialCommunityIcons name="magnify" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Keşfet</Text>
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
        paddingBottom: 70, // Buffer for nav bar
    },
    banner: {
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatarCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    userName: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 2,
    },
    userId: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 4,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitleCompact: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 6,
        marginLeft: 4,
    },
    sectionTitleNoMargin: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    iconBackground: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
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
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    pillButtonSmall: {
        flexGrow: 1,
        minWidth: '30%',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillButtonSmallActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
        borderWidth: 1,
    },
    pillTextSmall: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    pillTextSmallActive: {
        color: '#d4af37',
        fontFamily: 'Inter_700Bold',
    },
    saveBtn: {
        backgroundColor: '#d4af37',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 8,
        boxShadow: '0 2px 4px rgba(212, 175, 55, 0.2)',
    },
    saveBtnDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: 'none',
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
