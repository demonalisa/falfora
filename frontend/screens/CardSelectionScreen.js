import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { prepareTarotDeck } from '../utils/tarotCards';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CardSelectionScreen({ selectedType, onReadFortune, onBack }) {
    const cardCount = useMemo(() => {
        const counts = { 'single_1': 1, '3_cards': 3, 'love_7': 7, '10_cards': 10 };
        return counts[selectedType] || 3;
    }, [selectedType]);

    const fortuneNames = {
        'single_1': 'Günün Tavsiyesi',
        '3_cards': 'Günlük Bakış',
        'love_7': 'Aşk Açılımı',
        '10_cards': 'Galaktik Açılım'
    };

    // 78 slots assigned to random cards on mount
    const [deck, setDeck] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);

    useEffect(() => {
        setDeck(prepareTarotDeck());
    }, []);

    const toggleCard = (index) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
        } else {
            if (selectedIndices.length < cardCount) {
                setSelectedIndices([...selectedIndices, index]);
            }
        }
    };

    const handleConfirm = () => {
        if (selectedIndices.length === cardCount) {
            const selectedCards = selectedIndices.map(idx => deck[idx]);
            onReadFortune(selectedType, selectedCards);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#1c1022', '#2d1b36']} style={StyleSheet.absoluteFill} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#d4af37" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{fortuneNames[selectedType]}</Text>
                    <Text style={styles.headerSubtitle}>{cardCount} Kart Seçmelisiniz</Text>
                </View>
                <View style={styles.counterBadge}>
                    <Text style={styles.counterText}>{selectedIndices.length} / {cardCount}</Text>
                </View>
            </View>

            <Text style={styles.instruction}>
                Kartların üzerine odaklanın ve iç sesinizi dinleyin. 
                Sizin için hazırlanan {cardCount} kartı seçin.
            </Text>

            {/* Matrix of Cards */}
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    {Array(78).fill(0).map((_, index) => {
                        const isSelected = selectedIndices.includes(index);
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                accessibilityLabel={`Kart ${index + 1}`}
                                style={[
                                    styles.cardSlot,
                                    isSelected && styles.cardSelected
                                ]}
                                onPress={() => toggleCard(index)}
                            >
                                {isSelected ? (
                                    <View style={styles.selectedContent}>
                                        <MaterialCommunityIcons name="star" size={20} color="#1c1022" />
                                        <Text style={styles.selectedIndexText}>{selectedIndices.indexOf(index) + 1}</Text>
                                    </View>
                                ) : (
                                    <View style={styles.cardBack}>
                                        <MaterialCommunityIcons name="auto-fix" size={14} color="rgba(212, 175, 55, 0.4)" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Action Section */}
            <View style={styles.actionArea}>
                <TouchableOpacity
                    disabled={selectedIndices.length !== cardCount}
                    style={[
                        styles.confirmBtn,
                        selectedIndices.length !== cardCount && styles.confirmBtnDisabled,
                        (selectedIndices.length !== cardCount) && { pointerEvents: 'none' }
                    ]}
                    onPress={handleConfirm}
                >
                    <LinearGradient
                        colors={selectedIndices.length === cardCount ? ['#d4af37', '#b8860b'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={styles.confirmGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={[
                            styles.confirmText,
                            selectedIndices.length !== cardCount && styles.confirmTextDisabled
                        ]}>
                            Falımı Yorumla
                        </Text>
                        <MaterialCommunityIcons 
                            name="auto-fix" 
                            size={20} 
                            color={selectedIndices.length === cardCount ? '#1c1022' : 'rgba(255,255,255,0.3)'} 
                        />
                    </LinearGradient>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'web' ? 20 : 40,
        paddingBottom: 20,
        gap: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    headerSubtitle: {
        color: '#d4af37',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    counterBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d4af37',
    },
    counterText: {
        color: '#d4af37',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
    },
    instruction: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
        marginBottom: 20,
        fontFamily: 'Inter_400Regular',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    cardSlot: {
        width: (SCREEN_WIDTH - 32 - 40) / 6, // 6 columns
        aspectRatio: 2/3,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
        overflow: 'hidden',
    },
    cardSelected: {
        borderColor: '#d4af37',
        backgroundColor: '#d4af37',
        transform: [{ scale: 1.05 }],
        zIndex: 10,
        boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
    },
    cardBack: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIndexText: {
        color: '#1c1022',
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
        marginTop: -2,
    },
    actionArea: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'web' ? 20 : 30,
        backgroundColor: 'rgba(28, 16, 34, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    confirmBtn: {
        height: 52,
        borderRadius: 16,
        overflow: 'hidden',
    },
    confirmBtnDisabled: {
        opacity: 0.5,
    },
    confirmGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    confirmText: {
        color: '#1c1022',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    confirmTextDisabled: {
        color: 'rgba(255, 255, 255, 0.5)',
    }
});
