import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
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

export default function ProfileScreen({ user, userInfo, setUserInfo, onLogout, onNavigate }) {
    const fullUser = userInfo || {};

    const [isEditing, setIsEditing] = useState(false);
    
    // Manage editing state separately
    const [editName, setEditName] = useState(fullUser.name || user.name);
    const [birthDate, setBirthDate] = useState(fullUser.birthDate ? new Date(fullUser.birthDate) : null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedZodiac, setSelectedZodiac] = useState(fullUser.zodiac || 'Aslan');
    const [relationshipStatus, setRelationshipStatus] = useState(fullUser.relationship || 'İlişkisi Var');

    const handleSave = async () => {
        try {
            const editData = {
                name: editName,
                birthDate: birthDate ? birthDate.toISOString() : fullUser.birthDate,
                zodiac: selectedZodiac,
                relationship: relationshipStatus
            };
            const updatedUser = await DatabaseService.saveUser(user.id, editData);
            if (updatedUser) {
                setUserInfo(updatedUser);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleCancel = () => {
        setEditName(fullUser.name || user.name);
        setBirthDate(fullUser.birthDate ? new Date(fullUser.birthDate) : null);
        setSelectedZodiac(fullUser.zodiac || 'Aslan');
        setRelationshipStatus(fullUser.relationship || 'İlişkisi Var');
        setIsEditing(false);
    };

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (selectedDate) setBirthDate(selectedDate);
        } else {
            if (selectedDate) setTempDate(selectedDate);
        }
    };

    const handleConfirmDate = () => {
        setBirthDate(tempDate);
        setShowDatePicker(false);
    };

    const formatDateForView = (dateString) => {
        if (!dateString) return 'Belirtilmedi';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatDateForEdit = (date) => {
        if (!date) return 'Gün / Ay / Yıl';
        const d = new Date(date);
        return `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`;
    };

    const infoItems = [
        { key: 'birthDate', label: 'Doğum Tarihi', value: formatDateForView(fullUser.birthDate), icon: 'calendar-heart' },
        { key: 'zodiac', label: 'Burç', value: fullUser.zodiac || 'Belirtilmedi', icon: 'zodiac-leo' },
        { key: 'relationship', label: 'İlişki Durumu', value: fullUser.relationship || 'Belirtilmedi', icon: 'heart-outline' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header/Banner Area */}
                <View style={styles.banner}>
                    <LinearGradient
                        colors={['rgba(212, 175, 55, 0.2)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.profileImageContainer}>
                        <View style={styles.avatarCircle}>
                            <MaterialCommunityIcons name="account" size={60} color="#d4af37" />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <MaterialIcons name="edit" size={16} color="#1c1022" />
                        </TouchableOpacity>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={[styles.userName, styles.userNameInput]}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Adınız"
                            placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        />
                    ) : (
                        <Text style={styles.userName}>{fullUser.name || user.name}</Text>
                    )}
                    <Text style={styles.userId}>ID: {user.id.substring(0, 12)}...</Text>
                </View>

                {/* User Details Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitleNoMargin}>Kozmik Kimlik</Text>
                        {!isEditing ? (
                            <TouchableOpacity onPress={() => setIsEditing(true)}>
                                <Text style={styles.editActionText}>Düzenle</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{flexDirection: 'row', gap: 16}}>
                                <TouchableOpacity onPress={handleCancel}>
                                    <Text style={styles.cancelActionText}>İptal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave}>
                                    <Text style={styles.saveActionText}>Kaydet</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {isEditing ? (
                        <View style={styles.formContainer}>
                            {/* Birth Date */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Doğum Tarihi</Text>
                                <TouchableOpacity
                                    style={styles.textInputWrapper}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <View style={styles.textInputBox}>
                                        <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
                                            {formatDateForEdit(birthDate)}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="calendar-today" size={20} color="#d4af37" style={styles.inputIcon} />
                                </TouchableOpacity>

                                {/* iOS Date Picker Modal */}
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

                                {/* Android Date Picker */}
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

                            {/* Zodiac Sign */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Burç</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zodiacScrollContent}>
                                    {ZODIAC_SIGNS.map((item) => (
                                        <TouchableOpacity
                                            key={item.name}
                                            onPress={() => setSelectedZodiac(item.name)}
                                            style={[
                                                styles.zodiacCard,
                                                selectedZodiac === item.name && styles.zodiacCardSelected,
                                            ]}
                                        >
                                            <MaterialCommunityIcons
                                                name={item.icon}
                                                size={32}
                                                color={selectedZodiac === item.name ? '#d4af37' : 'rgba(255, 255, 255, 0.5)'}
                                            />
                                            <Text
                                                style={[
                                                    styles.zodiacName,
                                                    selectedZodiac === item.name ? styles.zodiacNameActive : styles.zodiacNameInactive,
                                                ]}
                                            >
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Relationship Status */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>İlişki Durumu</Text>
                                <View style={styles.pillGroup}>
                                    {['Bekar', 'İlişkisi Var', 'Evli', 'Karışık'].map((status) => (
                                        <TouchableOpacity
                                            key={status}
                                            onPress={() => setRelationshipStatus(status)}
                                            style={[
                                                styles.pillButton,
                                                relationshipStatus === status && styles.pillButtonActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.pillText,
                                                    relationshipStatus === status && styles.pillTextActive,
                                                ]}
                                            >
                                                {status}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.infoCard}>
                            {infoItems.map((item, index) => (
                                <View key={item.key} style={[styles.infoItem, index === infoItems.length - 1 && styles.noBorder]}>
                                    <View style={styles.iconBackground}>
                                        <MaterialCommunityIcons name={item.icon} size={22} color="#d4af37" />
                                    </View>
                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.infoLabel}>{item.label}</Text>
                                        <Text style={styles.infoValue}>{item.value}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hesap</Text>
                    <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
                        <View style={[styles.iconBackground, { backgroundColor: 'rgba(255, 69, 58, 0.1)' }]}>
                            <MaterialCommunityIcons name="logout" size={22} color="#FF453A" />
                        </View>
                        <Text style={[styles.actionText, { color: '#FF453A' }]}>Çıkış Yap</Text>
                        <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.3)" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
    },
    scrollContent: {
        paddingBottom: 100,
    },
    banner: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#d4af37',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#1c1022',
    },
    userName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userNameInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#d4af37',
        minWidth: 150,
        textAlign: 'center',
        paddingBottom: 4,
    },
    userId: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 32,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionTitleNoMargin: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    editActionText: {
        color: '#d4af37',
        fontSize: 14,
        fontWeight: 'bold',
    },
    saveActionText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cancelActionText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
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
    formContainer: {
        gap: 20,
        paddingBottom: 20,
    },
    inputGroup: {
        gap: 12,
    },
    inputLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginLeft: 4,
    },
    textInputWrapper: {
        position: 'relative',
        height: 56,
    },
    textInputBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 18,
    },
    dateText: {
        color: 'white',
        fontSize: 16,
    },
    placeholderText: {
        color: 'rgba(255, 255, 255, 0.2)',
    },
    zodiacScrollContent: {
        flexDirection: 'row',
        gap: 12,
        paddingRight: 16,
    },
    zodiacCard: {
        width: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: 0.6,
        height: 90,
    },
    zodiacCardSelected: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
        borderWidth: 2,
        opacity: 1,
    },
    zodiacName: {
        fontSize: 11,
        fontWeight: '500',
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
        gap: 10,
    },
    pillButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    pillButtonActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderColor: '#d4af37',
    },
    pillText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    pillTextActive: {
        color: '#d4af37',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1c1022',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
