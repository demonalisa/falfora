import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DatabaseService } from '../services/database';

// API Configuration - Replace with your machine's IP if testing on a real device
const API_URL = 'http://192.168.1.167:3000'; // For Android Emulator
// const API_URL = 'http://localhost:3000'; // For iOS Simulator

export default function ReadingScreen({ user, userInfo, accessToken, selectedType, existingReading, onBack, onNavigate }) {
    const [loading, setLoading] = useState(!existingReading);
    const [readingData, setReadingData] = useState(existingReading || null);
    const [error, setError] = useState(null);

    const fortuneNames = {
        '3_cards': 'Daily Insight',
        '10_cards': 'Galactic Spread'
    };

    useEffect(() => {
        if (!existingReading) {
            fetchTarotReading();
        }
    }, [existingReading]);

    const fetchTarotReading = async () => {
        try {
            setLoading(true);
            setError(null);

            const cardCount = selectedType === '10_cards' ? 10 : 3;

            const response = await fetch(`${API_URL}/api/tarot/reading`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    cardCount,
                    userInfo: {
                        name: user?.name,
                        birthDate: userInfo?.birthDate,
                        horoscope: userInfo?.zodiac,
                        gender: userInfo?.gender || 'Belirtilmedi',
                        relationship: userInfo?.relationship
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Üzgünüz, yıldızlar şu an biraz bulanık. Lütfen tekrar deneyin.');
            }

            const data = await response.json();
            setReadingData(data);

            // Save reading to history
            if (user?.id) {
                await DatabaseService.saveReading(user.id, {
                    type: selectedType,
                    typeName: fortuneNames[selectedType] || 'Tarot Reading',
                    cards: data.cards,
                    reading: data.reading
                });
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#1c1022', '#2d1b36']} style={StyleSheet.absoluteFill} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d4af37" />
                    <Text style={styles.loadingText}>The universe is preparing your cards...</Text>
                    <Text style={styles.loadingSubtext}>Aligning with your celestial energy</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#1c1022', '#2d1b36']} style={StyleSheet.absoluteFill} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#d4af37" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{fortuneNames[selectedType] || 'Tarot Reading'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#ff4d4d" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchTarotReading}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Cards Display */}
                        <Text style={styles.sectionTitle}>Your Selected Cards</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
                            {readingData?.cards.map((card, index) => (
                                <View key={index} style={styles.cardItem}>
                                    <View style={styles.cardArt}>
                                        <MaterialCommunityIcons name="cards-playing-outline" size={40} color="#d4af37" />
                                    </View>
                                    <Text style={styles.cardName}>{card}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Reading Text */}
                        <View style={styles.readingContainer}>
                            <View style={styles.readingHeader}>
                                <MaterialCommunityIcons name="auto-fix" size={24} color="#d4af37" />
                                <Text style={styles.readingHeaderText}>Celestial Interpretation</Text>
                            </View>
                            <View style={styles.divider} />
                            <Text style={styles.readingText}>{readingData?.reading}</Text>
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={onBack}>
                            <LinearGradient colors={['#d4af37', '#b8860b']} style={styles.saveGradient}>
                                <Text style={styles.saveButtonText}>
                                    {existingReading ? 'Return to Archives' : 'Gratefully Received'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('history')}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive} onPress={() => onNavigate('home')}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="home-variant" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('profile')}>
                    <MaterialCommunityIcons name="account-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1022',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 24,
        textAlign: 'center',
    },
    loadingSubtext: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
        height: 80,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 16,
        marginTop: 10,
    },
    cardsScroll: {
        paddingBottom: 24,
    },
    cardItem: {
        width: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 12,
        marginRight: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    cardArt: {
        width: 80,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    readingContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 8,
    },
    readingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    readingHeaderText: {
        color: '#d4af37',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    readingText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'left',
    },
    saveButton: {
        marginTop: 32,
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    saveGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#1c1022',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
        lineHeight: 22,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderWidth: 1,
        borderColor: '#d4af37',
    },
    retryButtonText: {
        color: '#d4af37',
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
