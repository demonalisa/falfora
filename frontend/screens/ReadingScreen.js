import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Animated, useWindowDimensions, Image, Modal } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DatabaseService } from '../services/database';
import { getCardImage } from '../utils/cardImageMap';


export default function ReadingScreen({ user, userInfo, accessToken, selectedType, manualSelectedCards, existingReading, onBack, onNavigate }) {
    const [loading, setLoading] = useState(!existingReading);
    const [readingData, setReadingData] = useState(existingReading || null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Fullscreen Card Modal State
    const [selectedModalCard, setSelectedModalCard] = useState(null);

    const { width: screenWidth } = useWindowDimensions();
    const [slideWidth, setSlideWidth] = useState(screenWidth - 92);
    const scrollViewRef = useRef(null);
    const cardsScrollViewRef = useRef(null);
    
    // To prevent infinite loop in bi-directional scrolling
    const activeScroll = useRef(null); 

    const processReadingText = (readingDataRaw) => {
        if (!readingDataRaw) return [];

        // NEW: If backend already returns a perfected JSON array, just clean artifacts and use it!
        if (Array.isArray(readingDataRaw)) {
            return readingDataRaw
                .map(p => String(p || '').replace(/[*#]/g, '').replace(/[-_=]{2,}/g, '').trim())
                .filter(p => p.length > 0);
        }

        // SMART FALLBACK: If it's a string, it might be a stringified JSON (from those few broken turns)
        if (typeof readingDataRaw === 'string' && readingDataRaw.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(readingDataRaw);
                const values = parsed.paragraphs || parsed.slides || parsed.reading || Object.values(parsed);
                if (Array.isArray(values)) {
                    return values.map(p => String(p).replace(/[*#]/g, '').trim()).filter(p => p.length > 0);
                }
            } catch (e) {
                console.log('[ReadingScreen] JSON Parse fallthrough');
            }
        }

        // LEGACY OLD FALLBACK: Support for old history readings that were saved as plain continuous strings
        const text = String(readingDataRaw);
        const cleaned = text.replace(/[*#]/g, '').replace(/[-_=]{2,}/g, '');
        let slides = cleaned.split(/\[SLAYT\]/i).map(p => p.trim()).filter(p => p.length > 0);

        if (slides.length <= 2) {
            const rawLines = cleaned.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
            slides = [];
            for (let i = 0; i < rawLines.length; i++) {
                let line = rawLines[i];
                if (slides.length > 0 && slides[slides.length - 1].length < 120) {
                    slides[slides.length - 1] += "\n\n" + line; // Merge short sentences
                } else {
                    slides.push(line);
                }
            }
        }

        return slides;
    };

     // Use both result (new server) and reading (legacy) for compatibility
    const paragraphs = processReadingText(readingData?.result || readingData?.reading);

    const sanitizeCardName = (cardName) => {
        if (!cardName) return "";
        let name = cardName;

        const isReversed = name.includes('(Ters)');
        // Remove English names and anything else in parens
        // This removes (The Fool), (Ters) etc.
        name = name.replace(/\([^)]+\)/g, '').trim();

        // Final polish for 'Major Arcana' or double spaces
        name = name.replace(/\s{2,}/g, ' ');

        return isReversed ? `Ters ${name}` : name;
    };

    const getSlideTitle = (index) => {
        const cardsArray = readingData?.selectedCards || readingData?.cards;
        if (!cardsArray || index < 0 || index >= cardsArray.length) {
            return "Kozmik Bilgelik";
        }

        const themes = {
            'single_1': ['Günün Mesajı'],
            'love_7': [
                'Senin derin duyguların',
                'Onun sana karşı hisleri',
                'Mevcut enerji ve uyum',
                'İlişkiden beklentin',
                'Onun ilişkiden beklentisi',
                'Yolunuzdaki engel/zorluk',
                'Potansiyel sonuç'
            ],
            '3_cards': [
                'Geçmiş / Kökler',
                'Bugün / Mevcut Durum',
                'Gelecek / Potansiyel'
            ],
            '10_cards': [
                'Mevcut Durum',
                'Engel / Zorluk',
                'Amaç / İdeal',
                'Bilinçaltı / Temel',
                'Geçmiş',
                'Gelecek',
                'Kendi İç Dünyan',
                'Dış Etkiler',
                'Umutlar ve Korkular',
                'Kozmik Sonuç'
            ]
        };

        const currentThemes = themes[selectedType];
        let themePrefix = "";
        if (currentThemes && currentThemes[index]) {
            themePrefix = `${currentThemes[index]} - `;
        } else {
            themePrefix = `${index + 1}. Durum - `;
        }

        return `${themePrefix}${sanitizeCardName(cardsArray[index])}`;
    };

    const handleNext = () => {
        if (currentPage < paragraphs.length - 1) {
            const nextIndex = currentPage + 1;
            // 1. Durumu hemen güncelle (Başlık ve Highlight için)
            setCurrentPage(nextIndex);
            
            // 2. Alt slaytı kaydır
            scrollViewRef.current?.scrollTo({ x: nextIndex * slideWidth, animated: true });
            
            // 3. Üst kart listesini senkronize et (Aktif kartı merkeze al)
            if (cardsScrollViewRef.current) {
                const cardWidth = 74; // 64 width + 10 margin
                const halfScreen = screenWidth / 2;
                const halfCard = cardWidth / 2;
                const targetTopX = (nextIndex * cardWidth) - halfScreen + halfCard;
                cardsScrollViewRef.current.scrollTo({
                    x: Math.max(0, targetTopX),
                    animated: true
                });
            }
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            const prevIndex = currentPage - 1;
            // 1. Durumu hemen güncelle
            setCurrentPage(prevIndex);
            
            // 2. Alt slaytı kaydır
            scrollViewRef.current?.scrollTo({ x: prevIndex * slideWidth, animated: true });
            
            // 3. Üst kart listesini senkronize et
            if (cardsScrollViewRef.current) {
                const cardWidth = 74; 
                const halfScreen = screenWidth / 2;
                const halfCard = cardWidth / 2;
                const targetTopX = (prevIndex * cardWidth) - halfScreen + halfCard;
                cardsScrollViewRef.current.scrollTo({
                    x: Math.max(0, targetTopX),
                    animated: true
                });
            }
        }
    };

    const fortuneNames = {
        'single_1': 'Günün Tavsiyesi',
        '3_cards': 'Günlük Bakış',
        '10_cards': 'Galaktik Açılım',
        'love_7': 'Aşk Açılımı'
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

            const counts = { 'single_1': 1, '3_cards': 3, '10_cards': 10, 'love_7': 7 };
            const cardCount = counts[selectedType] || 3;

            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/readings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    cardCount,
                    selectedCards: manualSelectedCards,
                    spreadName: fortuneNames[selectedType] || 'Tarot Falı',
                    userInfo: {
                        name: userInfo?.name || user?.name,
                        birthDate: userInfo?.birthDate,
                        horoscope: userInfo?.zodiac,
                        gender: userInfo?.gender || 'Belirtilmedi',
                        relationship: userInfo?.relationship
                    },
                    type: selectedType // İşte o gizli kahraman!
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[ReadingScreen] API Response Error Status:', response.status, errorData);
                throw new Error(errorData.message || `Üzgünüz, yıldızlar şu an biraz bulanık. (Hata Kodu: ${response.status})`);
            }

            const data = await response.json();
            // Server format: { result: "...", selectedCards: [...] }
            setReadingData({
                ...data,
                reading: data.result || data.reading, // Server uses 'result'
                cards: data.selectedCards ? data.selectedCards.map(c => c.name || c) : data.cards
            });
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err.message || 'Üzgünüz, bir hata oluştu');
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
                    <Text style={styles.loadingText}>Evren kartlarınızı hazırlıyor...</Text>
                    <Text style={styles.loadingSubtext}>Kozmik enerjinizle uyumlanıyor...</Text>
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
                <Text style={styles.headerTitle}>{fortuneNames[selectedType] || 'Tarot Falı'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.mainContent}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#ff4d4d" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchTarotReading}>
                            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Cards Display */}
                        <View style={{ flexGrow: 0, marginBottom: 12, overflow: 'visible' }}>
                            <Text style={styles.sectionTitle}>Seçilen Kartlarınız</Text>
                        <ScrollView 
                            ref={cardsScrollViewRef}
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={{ flexGrow: 0 }} 
                            contentContainerStyle={styles.cardsScroll}
                            scrollEnabled={true}
                            onScroll={(event) => {
                                // Sadece bu liste aktif olarak kaydırılıyorsa alttaki slaytları yönet
                                if (activeScroll.current !== 'top') return;

                                const scrollX = event.nativeEvent.contentOffset.x;
                                const cardWidth = 88;
                                const halfScreen = screenWidth / 2;
                                const halfCard = cardWidth / 2;

                                // Kart listesindeki pozisyonu alt slayt indeksine çevir
                                const virtualIndex = (scrollX + halfScreen - halfCard) / cardWidth;
                                const roundIndex = Math.round(virtualIndex);

                                // Sayfayı (currentPage) ve dolayısıyla Highlight + Başlığı güncelle
                                if (currentPage !== roundIndex) {
                                    setCurrentPage(roundIndex);
                                }
                                
                                if (scrollViewRef.current) {
                                    scrollViewRef.current.scrollTo({
                                        x: virtualIndex * slideWidth,
                                        animated: false
                                    });
                                }
                            }}
                            // WEB İÇİN ÖZEL DOKUNUŞ TAKİBİ
                            onMouseDown={() => { activeScroll.current = 'top'; }}
                            onTouchStart={() => { activeScroll.current = 'top'; }}
                            onScrollEndDrag={() => { activeScroll.current = null; }}
                            onMomentumScrollEnd={() => { activeScroll.current = null; }}
                            scrollEventThrottle={16}
                        >
                                { (readingData?.selectedCards || readingData?.cards)?.map((card, index) => {
                                    const imageSource = getCardImage(card);
                                    const isReversed = card.includes('(Ters)');
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={[
                                                styles.cardItem, 
                                                currentPage === index && styles.cardItemHighlight
                                            ]}
                                            activeOpacity={0.7}
                                            // TEK DOKUNUŞ: O slayta git
                                            onPress={() => {
                                                if (scrollViewRef.current) {
                                                    // Önce sayfayı ve paralamayı (highlight) hemen güncelle
                                                    setCurrentPage(index);
                                                    
                                                    // Sonra pürüzsüzce o konuma kaydır
                                                    scrollViewRef.current.scrollTo({
                                                        x: index * slideWidth,
                                                        animated: true
                                                    });
                                                }
                                            }}
                                            // BASILI TUTMA: Büyük resmi aç
                                            onLongPress={() => {
                                                setSelectedModalCard({ 
                                                    name: card, 
                                                    image: imageSource, 
                                                    isReversed 
                                                });
                                            }}
                                            delayLongPress={500} // Yarım saniye basılı tutma süresi
                                        >
                                            <View style={[styles.cardArt, currentPage === index && styles.cardArtHighlight]}>
                                                {imageSource ? (
                                                    <Image 
                                                        source={imageSource} 
                                                        style={[styles.cardImage, isReversed && { transform: [{ rotate: '180deg' }] }]}
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <MaterialCommunityIcons name="cards-playing-outline" size={40} color="#d4af37" />
                                                )}
                                            </View>
                                            <Text style={[styles.cardName, currentPage === index && styles.cardNameHighlight]} numberOfLines={2}>
                                                {sanitizeCardName(card)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Reading Text */}
                        <View style={[styles.readingContainer, { flex: 1 }]}>
                            <View style={styles.readingHeader}>
                                <MaterialCommunityIcons name="auto-fix" size={24} color="#d4af37" />
                                <Text style={styles.readingHeaderText}>{getSlideTitle(currentPage)}</Text>
                            </View>
                            <View style={styles.divider} />
                            {paragraphs.length > 0 ? (
                                <>
                                    <View style={{ flex: 1 }} onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width)}>
                                        <ScrollView
                                            ref={scrollViewRef}
                                            horizontal
                                            pagingEnabled
                                            showsHorizontalScrollIndicator={false}
                                            onScroll={(event) => {
                                                if (activeScroll.current !== 'bottom') return;

                                                const scrollX = event.nativeEvent.contentOffset.x;
                                                const slideSize = event.nativeEvent.layoutMeasurement.width;
                                                const index = scrollX / slideSize;
                                                const roundIndex = Math.round(index);
                                                
                                                if (currentPage !== roundIndex) {
                                                    setCurrentPage(roundIndex);
                                                }

                                                // GÜVENLİ SENKRONİZASYON (Layout bozmadan)
                                                if (cardsScrollViewRef.current) {
                                                    const cardWidth = 88; 
                                                    const halfScreen = screenWidth / 2;
                                                    const halfCard = cardWidth / 2;
                                                    const targetTopX = (index * cardWidth) - halfScreen + halfCard;
                                                    
                                                    cardsScrollViewRef.current.scrollTo({
                                                        x: Math.max(0, targetTopX),
                                                        animated: false
                                                    });
                                                }
                                            }}
                                            // WEB İÇİN ÖZEL DOKUNUŞ TAKİBİ (ALTA DA EKLENİYOR)
                                            onMouseDown={() => { activeScroll.current = 'bottom'; }}
                                            onTouchStart={() => { activeScroll.current = 'bottom'; }}
                                            onScrollEndDrag={() => { activeScroll.current = null; }}
                                            onMomentumScrollEnd={() => { activeScroll.current = null; }}
                                            scrollEventThrottle={16}
                                        >
                                            {paragraphs.map((p, i) => (
                                                <View key={i} style={{ width: slideWidth, flex: 1 }}>
                                                    <ScrollView 
                                                        showsVerticalScrollIndicator={true} 
                                                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 10 }}
                                                        indicatorStyle="white"
                                                    >
                                                        <Text 
                                                            style={styles.readingText}
                                                            adjustsFontSizeToFit={true}
                                                            minimumFontScale={0.7}
                                                        >
                                                            {p}
                                                        </Text>
                                                    </ScrollView>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    {paragraphs.length > 1 && (
                                        <View style={styles.paginationRow}>
                                            <TouchableOpacity 
                                                onPress={handlePrev} 
                                                disabled={currentPage === 0} 
                                                style={[
                                                    styles.navArrow, 
                                                    currentPage === 0 && styles.navArrowDisabled,
                                                    (currentPage === 0) && { pointerEvents: 'none' }
                                                ]}
                                            >
                                                <MaterialCommunityIcons name="chevron-left" size={28} color={currentPage === 0 ? "rgba(255,255,255,0.2)" : "#d4af37"} />
                                            </TouchableOpacity>

                                            <View style={styles.pagination}>
                                                {paragraphs.map((_, i) => (
                                                    <View key={i} style={[styles.dot, currentPage === i && styles.activeDot]} />
                                                ))}
                                            </View>

                                            <TouchableOpacity 
                                                onPress={handleNext} 
                                                disabled={currentPage === paragraphs.length - 1} 
                                                style={[
                                                    styles.navArrow, 
                                                    currentPage === paragraphs.length - 1 && styles.navArrowDisabled,
                                                    (currentPage === paragraphs.length - 1) && { pointerEvents: 'none' }
                                                ]}
                                            >
                                                <MaterialCommunityIcons name="chevron-right" size={28} color={currentPage === paragraphs.length - 1 ? "rgba(255,255,255,0.2)" : "#d4af37"} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <View style={{ flex: 1 }}>
                                    <ScrollView 
                                        showsVerticalScrollIndicator={true} 
                                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 10 }}
                                        indicatorStyle="white"
                                    >
                                        <Text 
                                            style={styles.readingText}
                                            adjustsFontSizeToFit={true}
                                            minimumFontScale={0.7}
                                        >
                                            {Array.isArray(readingData?.reading) ? readingData.reading.join('\n\n') : readingData?.reading}
                                        </Text>
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={onBack}>
                            <LinearGradient colors={['#d4af37', '#b8860b']} style={styles.saveGradient}>
                                <Text style={styles.saveButtonText}>
                                    {existingReading ? 'Arşivlere Dön' : 'Şükranla Kabul Edildi'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Fullscreen Card Modal */}
            <Modal
                visible={selectedModalCard !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedModalCard(null)}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setSelectedModalCard(null)}
                >
                    <View style={styles.modalContent}>
                        {selectedModalCard?.image ? (
                            <Image
                                source={selectedModalCard.image}
                                style={[styles.modalImage, selectedModalCard?.isReversed && { transform: [{ rotate: '180deg' }] }]}
                                resizeMode="contain"
                            />
                        ) : (
                            <MaterialCommunityIcons name="cards-playing-outline" size={150} color="#d4af37" />
                        )}
                        <Text style={styles.modalCardName}>{sanitizeCardName(selectedModalCard?.name)}</Text>
                        <Text style={styles.modalCloseText}>Kapatmak için dokunun</Text>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('history')}>
                    <MaterialCommunityIcons name="history" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Geçmiş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItemActive} onPress={() => onNavigate('home')}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="home-variant" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Ana Sayfa</Text>
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
        backgroundColor: '#1c1022',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: {
        color: '#d4af37',
        fontSize: 20,
        fontFamily: 'Outfit_600SemiBold',
        marginTop: 24,
        textAlign: 'center',
    },
    loadingSubtext: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginTop: 8,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 0,
        height: 44,
    },
    backButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 18,
        paddingBottom: 65,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 9,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
        marginTop: 0,
    },
    cardsScroll: {
        paddingVertical: 6, 
        paddingHorizontal: 4,
        overflow: 'visible', 
    },
    cardItem: {
        width: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: 5,
        marginRight: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    cardArt: {
        width: 32,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardName: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardItemHighlight: {
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        transform: [{ scale: 1.1 }], // Slightly bigger for more impact
        elevation: 15,
        zIndex: 100, // Ensure it's above everything
    },
    cardArtHighlight: {
        borderColor: '#d4af37',
        boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
    },
    cardNameHighlight: {
        color: '#d4af37',
    },
    readingContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 2,
    },
    readingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    readingHeaderText: {
        color: '#d4af37',
        fontSize: 12,
        fontFamily: 'Outfit_600SemiBold',
        flexShrink: 1, 
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 8,
    },
    readingText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontFamily: 'Inter_400Regular',
        lineHeight: 22,
        textAlign: 'left',
        flex: 1, 
    },
    paginationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 10,
    },
    navArrow: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navArrowDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeDot: {
        backgroundColor: '#d4af37',
        width: 24,
    },
    saveButton: {
        marginTop: 8,
        height: 40,
        borderRadius: 12,
        overflow: 'hidden',
    },
    saveGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#1c1022',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
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
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
    },
    modalImage: {
        width: 250,
        height: 420,
        borderRadius: 16,
        marginBottom: 24,
    },
    modalCardName: {
        color: '#d4af37',
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalCloseText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
    }
});
