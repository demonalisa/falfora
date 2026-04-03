import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Modal, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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

function getZodiacFromDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Koç';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Boğa';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'İkizler';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Yengeç';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Aslan';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Başak';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Terazi';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Akrep';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Yay';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Oğlak';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Kova';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Balık';
    return 'Koç';
}

const MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const YEARS = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

export default function OnboardingScreen({ onComplete, onBack }) {
    const [birthDate, setBirthDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedZodiac, setSelectedZodiac] = useState('Aslan');
    const [relationshipStatus, setRelationshipStatus] = useState('İlişkisi Var');
    const [selectedGender, setSelectedGender] = useState('Kadın');
    const [dateError, setDateError] = useState(false);
    const [isZodiacAuto, setIsZodiacAuto] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const webDateInputRef = useRef(null);

    // Auto-detect zodiac from birth date
    useEffect(() => {
        if (birthDate) {
            const zodiac = getZodiacFromDate(birthDate);
            setSelectedZodiac(zodiac);
            setIsZodiacAuto(true);
        }
    }, [birthDate]);

    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        // Detect if we are at the beginning
        const isAtStart = contentOffset.x <= 10; 
        // Detect if we are at the end (with a small buffer)
        const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;

        setShowLeftArrow(!isAtStart);
        setShowRightArrow(!isAtEnd);
    };

    const handleZodiacSelect = (zodiacName) => {
        setSelectedZodiac(zodiacName);
        setIsZodiacAuto(false); // User manually changed it
    };

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (selectedDate) {
                setBirthDate(selectedDate);
                setDateError(false);
            }
        } else {
            if (selectedDate) setTempDate(selectedDate);
        }
    };

    const handleConfirmDate = () => {
        setBirthDate(tempDate);
        setDateError(false);
        setShowDatePicker(false);
    };

    const formatDate = (date) => {
        if (!date) return 'Gün / Ay / Yıl';
        const d = new Date(date);
        return `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
    };

    const handleContinue = () => {
        if (!birthDate) {
            setDateError(true);
            return;
        }
        onComplete({
            birthDate: birthDate.toISOString(),
            zodiac: selectedZodiac,
            relationship: relationshipStatus,
            gender: selectedGender
        });
    };

    return (
        <View style={styles.onboardingContainer}>
            {/* Header - Compact height with Back Button */}
            <View style={styles.onboardingHeader}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <MaterialIcons name="chevron-left" size={24} color="#d4af37" />
                </TouchableOpacity>
                <Text style={styles.onboardingHeaderTitle}>Kullanıcı Bilgileri</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.mainContentFit}>
                {/* Headline - Significantly smaller */}
                <View style={styles.onboardingHeadline}>
                    <Text style={styles.onboardingTitle}>Göksel Uyum</Text>
                    <Text style={styles.onboardingSubtitle}>Yıldızların yolunu keşfetmek için bilgilerinizi girin.</Text>
                </View>

                {/* Form - Tight gaps */}
                <View style={styles.formContainer}>
                    {/* Birth Date Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Doğum Tarihi *</Text>
                        <View style={Platform.OS === 'web' ? styles.webDateContainer : styles.textInputWrapper}>
                            {Platform.OS === 'web' ? (
                                <View style={styles.webSelectGroup}>
                                    <select 
                                        style={styles.webSelect}
                                        value={birthDate ? birthDate.getDate().toString() : ''}
                                        onChange={(e) => {
                                            const day = parseInt(e.target.value);
                                            const newDate = new Date(birthDate || new Date());
                                            newDate.setDate(day);
                                            setBirthDate(new Date(newDate));
                                            setDateError(false);
                                        }}
                                    >
                                        <option value="" disabled>Gün</option>
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>

                                    <select 
                                        style={styles.webSelect}
                                        value={birthDate ? birthDate.getMonth().toString() : ''}
                                        onChange={(e) => {
                                            const month = parseInt(e.target.value);
                                            const newDate = new Date(birthDate || new Date());
                                            newDate.setMonth(month);
                                            setBirthDate(newDate);
                                            setDateError(false);
                                        }}
                                    >
                                        <option value="" disabled>Ay</option>
                                        {MONTHS.map((m, i) => <option key={m} value={i.toString()}>{m}</option>)}
                                    </select>

                                    <select 
                                        style={styles.webSelect}
                                        value={birthDate ? birthDate.getFullYear().toString() : ''}
                                        onChange={(e) => {
                                            const year = parseInt(e.target.value);
                                            const newDate = new Date(birthDate || new Date());
                                            newDate.setFullYear(year);
                                            setBirthDate(newDate);
                                            setDateError(false);
                                        }}
                                    >
                                        <option value="" disabled>Yıl</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.textInputWrapper}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <View style={[styles.textInput, dateError && styles.textInputError]}>
                                        <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
                                            {formatDate(birthDate)}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="calendar-today" size={18} color="#d4af37" style={styles.inputIcon} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* iOS Modal - Geri Getirildi */}
                        {Platform.OS === 'ios' && (
                            <Modal transparent={true} animationType="slide" visible={showDatePicker}>
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalHeader}>
                                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                <Text style={styles.modalCancelText}>İptal</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleConfirmDate}>
                                                <Text style={styles.modalDoneText}>Onayla</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <DateTimePicker
                                            value={tempDate}
                                            mode="date"
                                            display="spinner"
                                            onChange={onDateChange}
                                            maximumDate={new Date()}
                                            textColor="white"
                                        />
                                    </View>
                                </View>
                            </Modal>
                        )}
                        {/* Android Picker - Geri Getirildi */}
                        {Platform.OS === 'android' && showDatePicker && (
                            <DateTimePicker
                                value={birthDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Zodiac Selection - Smaller cards with Arrow Indicators */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Burç {isZodiacAuto ? '✨' : ''}</Text>
                        <View style={styles.zodiacScrollWrapper}>
                            {/* Left Arrow */}
                            {showLeftArrow && (
                                <View style={styles.leftArrowContainer} pointerEvents="none">
                                    <MaterialIcons name="chevron-left" size={24} color="#d4af37" />
                                </View>
                            )}

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.zodiacScrollContent}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                            >
                                {ZODIAC_SIGNS.map((item) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => handleZodiacSelect(item.name)}
                                        style={[styles.zodiacCard, selectedZodiac === item.name && styles.zodiacCardSelected]}
                                    >
                                        <MaterialCommunityIcons
                                            name={item.icon}
                                            size={26}
                                            color={selectedZodiac === item.name ? '#d4af37' : 'rgba(255, 255, 255, 0.4)'}
                                        />
                                        <Text style={[styles.zodiacName, selectedZodiac === item.name ? styles.zodiacNameActive : styles.zodiacNameInactive]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Right Arrow */}
                            {showRightArrow && (
                                <View style={styles.rightArrowContainer} pointerEvents="none">
                                    <MaterialIcons name="chevron-right" size={24} color="#d4af37" />
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Gender Selection - Ultra compact */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Cinsiyet</Text>
                        <View style={styles.pillGroup}>
                            {['Kadın', 'Erkek'].map((gender) => (
                                <TouchableOpacity
                                    key={gender}
                                    onPress={() => setSelectedGender(gender)}
                                    style={[styles.pillButton, selectedGender === gender && styles.pillButtonActive]}
                                >
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                        <MaterialCommunityIcons 
                                            name={gender === 'Kadın' ? 'gender-female' : 'gender-male'} 
                                            size={16} 
                                            color={selectedGender === gender ? '#d4af37' : 'rgba(255, 255, 255, 0.4)'} 
                                        />
                                        <Text style={[styles.pillText, selectedGender === gender && styles.pillTextActive]}>
                                            {gender}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Relationship Status Selection - Slim design */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>İlişki Durumu</Text>
                        <View style={styles.pillGroup}>
                            {['Bekar', 'İlişkisi Var', 'Evli', 'Boşanmış', 'Karışık'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => setRelationshipStatus(status)}
                                    style={[styles.pillButton, relationshipStatus === status && styles.pillButtonActive]}
                                >
                                    <Text 
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                        style={[styles.pillText, relationshipStatus === status && styles.pillTextActive]}
                                    >
                                        {status}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Continue Action */}
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueButtonText}>Devam Et</Text>
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#1c1022" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    onboardingContainer: {
        flex: 1,
        backgroundColor: '#1c1022',
        width: '100%',
        height: '100%',
    },
    onboardingHeader: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onboardingHeaderTitle: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
    },
    mainContentFit: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'space-evenly',
    },
    onboardingHeadline: {
        alignItems: 'center',
        marginBottom: 10,
    },
    onboardingTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    onboardingSubtitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 13,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 18,
    },
    formContainer: {
        gap: 15,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    textInputWrapper: {
        position: 'relative',
        height: 44,
    },
    textInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        paddingHorizontal: 14,
        justifyContent: 'center',
    },
    textInputError: {
        borderColor: '#ff4d4d',
    },
    inputIcon: {
        position: 'absolute',
        right: 14,
        top: 13,
    },
    dateText: {
        color: 'white',
        fontSize: 14,
    },
    placeholderText: {
        color: 'rgba(255, 255, 255, 0.2)',
    },
    webDateContainer: {
        width: '100%',
    },
    webSelectGroup: {
        flexDirection: 'row',
        gap: 6,
    },
    webSelect: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 10,
        height: 44,
        color: 'white',
        fontSize: 13,
        paddingHorizontal: 2,
        appearance: 'none',
        cursor: 'pointer',
        textAlign: 'center',
    },
    zodiacScrollWrapper: {
        height: 70,
        position: 'relative',
    },
    zodiacScrollContent: {
        gap: 10,
        paddingHorizontal: 10, // Add some padding for arrows
    },
    leftArrowContainer: {
        position: 'absolute',
        left: -10,
        top: 0,
        bottom: 0,
        width: 30,
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightArrowContainer: {
        position: 'absolute',
        right: -10,
        top: 0,
        bottom: 0,
        width: 30,
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zodiacCard: {
        width: 70,
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    zodiacCardSelected: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
        borderWidth: 1.5,
    },
    zodiacName: {
        fontSize: 10,
    },
    zodiacNameInactive: {
        color: 'rgba(255, 255, 255, 0.6)',
    },
    zodiacNameActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    pillButton: {
        flexGrow: 1,
        minWidth: '28%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillButtonActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
    },
    pillText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    pillTextActive: {
        color: '#d4af37',
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#d4af37',
        height: 52,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
    continueButtonText: {
        color: '#1c1022',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#1c1022',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    modalDoneText: {
        color: '#d4af37',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCancelText: {
        color: 'white',
        fontSize: 16,
    },
});
