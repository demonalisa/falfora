import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TAROT_CARD_DETAILS } from '../utils/tarotCardDetails';
import { getCardImage } from '../utils/cardImageMap';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExploreScreen({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState('major'); // 'major', 'wands', 'cups', 'swords', 'pentacles'
    const [currentIndex, setCurrentIndex] = useState(0);

    const categories = [
        { id: 'major', name: 'Büyük Arkana', icon: 'auto-fix' },
        { id: 'wands', name: 'Değnekler', icon: 'fire' },
        { id: 'cups', name: 'Kupalar', icon: 'water' },
        { id: 'swords', name: 'Kılıçlar', icon: 'air-filter' },
        { id: 'pentacles', name: 'Tılsımlar', icon: 'clover' }
    ];

    const currentCardList = useMemo(() => TAROT_CARD_DETAILS[activeCategory], [activeCategory]);
    const currentCard = currentCardList[currentIndex];

    const handleCategoryChange = (catId) => {
        setActiveCategory(catId);
        setCurrentIndex(0);
    };

    const handleNext = () => {
        if (currentIndex < currentCardList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <View style={styles.container}>
            {/* Category Navigation */}
            <View style={styles.categoryNav}>
                <View style={styles.navGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => handleCategoryChange(cat.id)}
                            style={[styles.navButton, activeCategory === cat.id && styles.navButtonActive]}
                        >
                            <MaterialCommunityIcons 
                                name={cat.icon} 
                                size={16} 
                                color={activeCategory === cat.id ? '#1c1022' : '#d4af37'} 
                            />
                            <Text style={[styles.navText, activeCategory === cat.id && styles.navTextActive]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentArea}>
                <View style={styles.cardContainer}>
                    {/* Left Side: Card Image */}
                    <View style={styles.imageColumn}>
                        <View style={styles.cardFrame}>
                            <Image 
                                source={getCardImage(currentCard.name)} 
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.cardTitle}>{currentCard.name}</Text>
                    </View>

                    {/* Right Side: Card Info */}
                    <View style={styles.infoColumn}>
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Element</Text>
                                <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit>{currentCard.element}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Astroloji</Text>
                                <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit>{currentCard.astrology}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Numeroloji</Text>
                                <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit>{currentCard.numerology}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Evet / Hayır</Text>
                                <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit>{currentCard.yesNo}</Text>
                            </View>
                        </View>

                        <View style={styles.timingBox}>
                            <Text style={styles.infoLabel}>Zamanlama</Text>
                            <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit>{currentCard.timing}</Text>
                        </View>
                        
                        <ScrollView style={styles.meaningScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.meaningLabel}>Kartın Mesajı:</Text>
                            <Text style={styles.meaningText}>{currentCard.meaning}</Text>
                        </ScrollView>
                    </View>
                </View>

                {/* Navigation Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity 
                        onPress={handlePrev} 
                        disabled={currentIndex === 0}
                        style={[styles.controlButton, currentIndex === 0 && styles.controlButtonDisabled]}
                    >
                        <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? 'rgba(255,255,255,0.2)' : '#d4af37'} />
                        <Text style={[styles.controlText, currentIndex === 0 && styles.controlTextDisabled]}>Önceki</Text>
                    </TouchableOpacity>

                    <View style={styles.pageIndicator}>
                        <Text style={styles.pageText}>{currentIndex + 1} / {currentCardList.length}</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={handleNext} 
                        disabled={currentIndex === currentCardList.length - 1}
                        style={[styles.controlButton, currentIndex === currentCardList.length - 1 && styles.controlButtonDisabled]}
                    >
                        <Text style={[styles.controlText, currentIndex === currentCardList.length - 1 && styles.controlTextDisabled]}>Sonraki</Text>
                        <Ionicons name="chevron-forward" size={24} color={currentIndex === currentCardList.length - 1 ? 'rgba(255,255,255,0.2)' : '#d4af37'} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Nav Spacer (UI consistent with other screens) */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('history')}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navTextBottom}>Geçmiş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('home')}>
                    <MaterialCommunityIcons name="home-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navTextBottom}>Ana Sayfa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="magnify" size={26} color="#d4af37" />
                    <Text style={styles.navTextActiveBottom}>Keşfet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('profile')}>
                    <MaterialCommunityIcons name="account-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navTextBottom}>Profil</Text>
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
    categoryNav: {
        paddingTop: Platform.OS === 'web' ? 10 : 40,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingBottom: 10,
    },
    navGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 10,
        gap: 6,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        gap: 4,
    },
    navButtonActive: {
        backgroundColor: '#d4af37',
        borderColor: '#d4af37',
    },
    navText: {
        color: '#d4af37',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
    navTextActive: {
        color: '#1c1022',
    },
    contentArea: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start', // Fix upward stability
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 10,
    },
    imageColumn: {
        flex: 1.3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cardFrame: {
        width: '100%',
        aspectRatio: 0.6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        padding: 4,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        marginTop: 12, // Space below frame
        textAlign: 'center',
    },
    infoColumn: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: 'flex-start',
    },
    infoGrid: {
        marginBottom: 12,
        gap: 6,
    },
    infoItem: {
        width: '100%',
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
        justifyContent: 'center', // Vertical stack alignment
    },
    timingBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#d4af37',
    },
    infoLabel: {
        color: '#d4af37',
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        marginBottom: 2, // Space between label and value
    },
    infoValue: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Inter_600SemiBold',
    },
    meaningScroll: {
        flex: 1,
    },
    meaningLabel: {
        color: 'rgba(212, 175, 55, 0.6)',
        fontSize: 11,
        fontFamily: 'Outfit_600SemiBold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    meaningText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingBottom: 10,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    controlButtonDisabled: {
        opacity: 0.3,
    },
    controlText: {
        color: '#d4af37',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
    },
    controlTextDisabled: {
        color: 'rgba(255,255,255,0.4)',
    },
    pageIndicator: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pageText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
    },
    bottomNav: {
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
    navTextBottom: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
    },
    navTextActiveBottom: {
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
