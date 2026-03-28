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

export default function OnboardingScreen({ onComplete, onBack }) {
    const [birthDate, setBirthDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedZodiac, setSelectedZodiac] = useState('Aslan');
    const [relationshipStatus, setRelationshipStatus] = useState('İlişkisi Var');
    const [dateError, setDateError] = useState(false);
    const webDateInputRef = useRef(null);

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
            relationship: relationshipStatus
        });
    };

    return (
        <View style={styles.onboardingContainer}>
            {/* Header */}
            <View style={styles.onboardingHeader}>
                <Text style={styles.onboardingHeaderTitle}>Kullanıcı Bilgileri</Text>
            </View>

            <View style={styles.mainContentFit}>
                {/* Headline */}
                <View style={styles.onboardingHeadline}>
                    <Text style={styles.onboardingTitle}>Göksel Uyum</Text>
                    <Text style={styles.onboardingSubtitle}>Yıldızların yolunuzu aydınlatması için kendinizi tanıtın.</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Birth Date Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Doğum Tarihi * {dateError && <Text style={{color: '#ff4d4d', textTransform: 'none'}}> (Gerekli)</Text>}</Text>
                        <TouchableOpacity
                            style={styles.textInputWrapper}
                            onPress={() => Platform.OS !== 'web' && setShowDatePicker(true)}
                            activeOpacity={Platform.OS === 'web' ? 1 : 0.7}
                        >
                            <View style={[styles.textInput, dateError && styles.textInputError]}>
                                <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
                                    {formatDate(birthDate)}
                                </Text>
                            </View>
                            <MaterialIcons name="calendar-today" size={20} color="#d4af37" style={styles.inputIcon} />
                            
                            {Platform.OS === 'web' && (
                                <input
                                    ref={webDateInputRef}
                                    type="date"
                                    style={styles.webInputOverlay}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const dateValue = e.target.value;
                                        if (dateValue) {
                                            const date = new Date(dateValue);
                                            if (!isNaN(date.getTime())) {
                                                setBirthDate(date);
                                                setDateError(false);
                                            }
                                        }
                                    }}
                                />
                            )}
                        </TouchableOpacity>

                        {/* iOS Modal */}
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
                        {/* Android Picker */}
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

                    {/* Zodiac Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Burç</Text>
                        <View style={styles.zodiacScrollWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.zodiacScrollContent}
                            >
                                {ZODIAC_SIGNS.map((item) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => setSelectedZodiac(item.name)}
                                        style={[styles.zodiacCard, selectedZodiac === item.name && styles.zodiacCardSelected]}
                                    >
                                        <MaterialCommunityIcons
                                            name={item.icon}
                                            size={32}
                                            color={selectedZodiac === item.name ? '#d4af37' : 'rgba(255, 255, 255, 0.5)'}
                                        />
                                        <Text style={[styles.zodiacName, selectedZodiac === item.name ? styles.zodiacNameActive : styles.zodiacNameInactive]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Relationship Status Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>İlişki Durumu</Text>
                        <View style={styles.pillGroup}>
                            {['Bekar', 'İlişkisi Var', 'Evli', 'Karışık'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => setRelationshipStatus(status)}
                                    style={[styles.pillButton, relationshipStatus === status && styles.pillButtonActive]}
                                >
                                    <Text style={[styles.pillText, relationshipStatus === status && styles.pillTextActive]}>
                                        {status}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer Button */}
            <View style={styles.onboardingFooter}>
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueButtonText}>Kozmos'a Devam Et</Text>
                    <MaterialCommunityIcons name="auto-fix" size={22} color="#1c1022" />
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    onboardingHeaderTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
    },
    mainContentFit: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-evenly', // İçeriği ekrana dengeli dağıtır
        paddingBottom: 20,
    },
    onboardingHeadline: {
        alignItems: 'center',
    },
    onboardingTitle: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    onboardingSubtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 15,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 20,
    },
    formContainer: {
        gap: 24,
    },
    inputGroup: {
        gap: 10,
    },
    inputLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    textInputWrapper: {
        position: 'relative',
        height: 52,
    },
    textInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    textInputError: {
        borderColor: '#ff4d4d',
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 15,
    },
    dateText: {
        color: 'white',
        fontSize: 16,
    },
    placeholderText: {
        color: 'rgba(255, 255, 255, 0.2)',
    },
    webInputOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
        zIndex: 10,
    },
    zodiacScrollWrapper: {
        height: 90,
    },
    zodiacScrollContent: {
        gap: 12,
        paddingRight: 20,
    },
    zodiacCard: {
        width: 90,
        height: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    zodiacCardSelected: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
        borderWidth: 2,
    },
    zodiacName: {
        fontSize: 11,
    },
    zodiacNameInactive: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    zodiacNameActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pillButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    pillButtonActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
    },
    pillText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
    },
    pillTextActive: {
        color: '#d4af37',
        fontWeight: 'bold',
    },
    onboardingFooter: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    continueButton: {
        backgroundColor: '#d4af37',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    continueButtonText: {
        color: '#1c1022',
        fontSize: 18,
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
