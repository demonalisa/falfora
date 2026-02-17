import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReadingScreen({ selectedType, onBack, onNavigate }) {
    const fortuneNames = {
        '3_cards': 'Daily Insight',
        '10_cards': 'Galactic Spread'
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Fortune Reading</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.fortuneTitle}>
                    {fortuneNames[selectedType] || 'Selected Fortune'}
                </Text>
                <Text style={styles.placeholderText}>
                    The universe is preparing your cards...
                </Text>
            </View>

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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        marginBottom: 40,
    },

    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    fortuneTitle: {
        color: '#d4af37',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    placeholderText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        textAlign: 'center',
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
