import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ user, onLogout }) {
    const [selectedType, setSelectedType] = useState(null); // '3_cards' or '10_cards'

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Choose Your{"\n"}<Text style={styles.accentText}>Divination</Text></Text>
                    <Text style={styles.subtitle}>Select how deep you want the stars to look into your destiny.</Text>
                </View>

                {/* Fortune Options */}
                <View style={styles.cardContainer}>
                    {/* 3 Cards Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedType === '3_cards' && styles.selectedCard]}
                        onPress={() => setSelectedType('3_cards')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIconWrapper}>
                            <MaterialCommunityIcons
                                name="cards-playing-outline"
                                size={32}
                                color={selectedType === '3_cards' ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Daily Insight</Text>
                            <Text style={styles.cardDesc}>A quick overview for your day.</Text>
                        </View>
                        <View style={styles.cardBadge}>
                            <Text style={styles.badgeText}>3 CARDS</Text>
                        </View>
                        {selectedType === '3_cards' && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* 10 Cards Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedType === '10_cards' && styles.selectedCard]}
                        onPress={() => setSelectedType('10_cards')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIconWrapper}>
                            <MaterialCommunityIcons
                                name="cards-outline"
                                size={32}
                                color={selectedType === '10_cards' ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Galactic Spread</Text>
                            <Text style={styles.cardDesc}>A deep dive into your destiny.</Text>
                        </View>
                        <View style={styles.cardBadge}>
                            <Text style={styles.badgeText}>10 CARDS</Text>
                        </View>
                        {selectedType === '10_cards' && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Fixed Action Button */}
            <View style={styles.fixedActionSection}>
                <TouchableOpacity
                    disabled={!selectedType}
                    style={[styles.readButton, !selectedType && styles.readButtonDisabled]}
                    onPress={() => console.log('Reading fortune for:', selectedType)}
                >
                    <LinearGradient
                        colors={selectedType ? ['#d4af37', '#b8860b'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                        style={styles.readGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={[styles.readButtonText, !selectedType && styles.readButtonTextDisabled]}>
                            Read My Fortune
                        </Text>
                        <MaterialCommunityIcons
                            name="auto-fix"
                            size={22}
                            color={selectedType ? '#1c1022' : 'rgba(255, 255, 255, 0.3)'}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="home-variant" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
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
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 0,
        paddingBottom: 160, // Increased to accommodate fixed button
    },
    titleSection: {
        marginTop: 10,
        marginBottom: 32,
    },
    mainTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 40,
        marginBottom: 12,
    },
    accentText: {
        color: '#d4af37',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        lineHeight: 24,
    },
    cardContainer: {
        gap: 16, // Slightly reduced gap
    },
    optionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20, // Smaller radius
        padding: 16, // Reduced padding
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row', // Horizontal layout for smaller height
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
        width: 48, // Smaller icon wrapper
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16, // Gap between icon and text
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18, // Smaller title
        fontWeight: 'bold',
        marginBottom: 2,
    },
    cardDesc: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12, // Smaller description
        lineHeight: 16,
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
        fontWeight: 'bold',
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
        height: 56, // Slightly smaller
        borderRadius: 16,
        overflow: 'hidden',
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
        fontWeight: 'bold',
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
