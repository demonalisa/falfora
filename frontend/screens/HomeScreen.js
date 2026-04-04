import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ user, onLogout, onReadFortune, onNavigate }) {
    const [selectedType, setSelectedType] = useState(null); // 'dailyReading3' or 'celticCrossReading10'

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Kaderini{"\n"}<Text style={styles.accentText}>Keşfet</Text></Text>
                    <Text style={styles.subtitle}>Yıldızların kaderine ne kadar derinden bakmasını istediğini seç.</Text>
                </View>

                {/* Fortune Options */}
                <View style={styles.cardContainer}>
                    {/* Single Card Advice Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedType === 'oneCardReading1' && styles.selectedCard]}
                        onPress={() => setSelectedType('oneCardReading1')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIconWrapper}>
                            <MaterialCommunityIcons
                                name="star-shooting-outline"
                                size={32}
                                color={selectedType === 'oneCardReading1' ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Günün Tavsiyesi</Text>
                            <Text style={styles.cardDesc}>Evrenin size bugün için verdiği özel mesaj ve rehberlik.</Text>
                        </View>
                        <View style={styles.cardBadge}>
                            <Text style={styles.badgeText}>1 KART</Text>
                        </View>
                        {selectedType === 'oneCardReading1' && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* 3 Cards Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedType === 'dailyReading3' && styles.selectedCard]}
                        onPress={() => setSelectedType('dailyReading3')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIconWrapper}>
                            <MaterialCommunityIcons
                                name="cards-playing-outline"
                                size={32}
                                color={selectedType === 'dailyReading3' ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Günlük Bakış</Text>
                            <Text style={styles.cardDesc}>Gününüz için hızlı bir genel bakış.</Text>
                        </View>
                        <View style={styles.cardBadge}>
                            <Text style={styles.badgeText}>3 KART</Text>
                        </View>
                        {selectedType === 'dailyReading3' && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* 10 Cards Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedType === 'celticCrossReading10' && styles.selectedCard]}
                        onPress={() => setSelectedType('celticCrossReading10')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIconWrapper}>
                            <MaterialCommunityIcons
                                name="cards-outline"
                                size={32}
                                color={selectedType === 'celticCrossReading10' ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Galaktik Açılım</Text>
                            <Text style={styles.cardDesc}>Kaderinize derin bir dalış.</Text>
                        </View>
                        <View style={styles.cardBadge}>
                            <Text style={styles.badgeText}>10 KART</Text>
                        </View>
                        {selectedType === 'celticCrossReading10' && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Love Spread Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedType === 'loveReading7' && styles.selectedCard]}
                        onPress={() => setSelectedType('loveReading7')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIconWrapper}>
                            <MaterialCommunityIcons
                                name="heart-multiple-outline"
                                size={32}
                                color={selectedType === 'loveReading7' ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Aşk Açılımı</Text>
                            <Text style={styles.cardDesc}>Duygularınız ve ilişkiniz üzerine derin bir bakış.</Text>
                        </View>
                        <View style={styles.cardBadge}>
                            <Text style={styles.badgeText}>7 KART</Text>
                        </View>
                        {selectedType === 'loveReading7' && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Fixed Action Button */}
            <View style={styles.fixedActionSection}>
                <TouchableOpacity
                    disabled={!selectedType}
                    style={[
                        styles.readButton, 
                        !selectedType && styles.readButtonDisabled,
                        !selectedType && { pointerEvents: 'none' }
                    ]}
                    onPress={() => onReadFortune(selectedType)}
                >
                    <LinearGradient
                        colors={selectedType ? ['#d4af37', '#b8860b'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                        style={styles.readGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={[styles.readButtonText, !selectedType && styles.readButtonTextDisabled]}>
                            Kart Seç
                        </Text>
                        <MaterialCommunityIcons 
                            name="cards-playing" 
                            size={20} 
                            color={selectedType ? '#1c1022' : 'rgba(255, 255, 255, 0.3)'} 
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('history')}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Geçmiş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="home-variant" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Ana Sayfa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('explore')}>
                    <MaterialCommunityIcons name="magnify" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Keşfet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('profile')}>
                    <MaterialCommunityIcons name="account-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Profil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'web' ? 20 : 10,
        paddingBottom: 130,
        justifyContent: 'center', // Centered distribution
    },
    titleSection: {
        marginTop: 0,
        marginBottom: 16,
    },
    mainTitle: {
        color: '#fff',
        fontSize: Platform.OS === 'web' ? 36 : 28,
        fontFamily: 'Outfit_700Bold',
        lineHeight: Platform.OS === 'web' ? 44 : 34,
        marginBottom: 8,
    },
    accentText: {
        color: '#d4af37',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    cardContainer: {
        gap: 10,
    },
    optionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    selectedCard: {
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        borderWidth: 2,
    },
    cardIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        marginBottom: 0,
    },
    cardDesc: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontFamily: 'Inter_400Regular',
        lineHeight: 14,
    },
    cardBadge: {
        position: 'absolute',
        top: 8,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        color: '#d4af37',
        fontSize: 9,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 0.5,
    },
    checkIcon: {
        marginLeft: 8,
    },
    fixedActionSection: {
        position: 'absolute',
        bottom: 76, // Above bottom nav
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    readButton: {
        height: 48,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
    },
    readButtonDisabled: {
        opacity: 0.5,
    },
    readGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    readButtonText: {
        color: '#1c1022',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    readButtonTextDisabled: {
        color: 'rgba(255, 255, 255, 0.5)',
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
        fontFamily: 'Inter_500Medium',
    },
    navTextActive: {
        color: '#d4af37',
        fontSize: 11,
        fontFamily: 'Inter_700Bold',
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
