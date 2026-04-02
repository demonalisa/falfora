export const TAROT_CARDS = [
    // Major Arcana
    "Deli", "Büyücü", "Azize", "İmparatoriçe",
    "İmparator", "Aziz", "Aşıklar", "Araba",
    "Güç", "Ermiş", "Kader Çarkı", "Adalet",
    "Asılan Adam", "Ölüm", "Denge", "Şeytan",
    "Yıkılan Kule", "Yıldız", "Ay", "Güneş",
    "Mahkeme", "Dünya",

    // Wands (Değnekler)
    "Değnek Ası", "Değnek İkilisi", "Değnek Üçlüsü", "Değnek Dörtlüsü", "Değnek Beşlisi",
    "Değnek Altılısı", "Değnek Yedilisi", "Değnek Sekizlisi", "Değnek Dokuzlusu", "Değnek Onlusu",
    "Değnek Prensi", "Değnek Şövalyesi", "Değnek Kraliçesi", "Değnek Kralı",

    // Cups (Kupalar)
    "Kupa Ası", "Kupa İkilisi", "Kupa Üçlüsü", "Kupa Dörtlüsü", "Kupa Beşlisi",
    "Kupa Altılısı", "Kupa Yedilisi", "Kupa Sekizlisi", "Kupa Dokuzlusu", "Kupa Onlusu",
    "Kupa Prensi", "Kupa Şövalyesi", "Kupa Kraliçesi", "Kupa Kralı",

    // Swords (Kılıçlar)
    "Kılıç Ası", "Kılıç İkilisi", "Kılıç Üçlüsü", "Kılıç Dörtlüsü", "Kılıç Beşlisi",
    "Kılıç Altılısı", "Kılıç Yedilisi", "Kılıç Sekizlisi", "Kılıç Dokuzlusu", "Kılıç Onlusu",
    "Kılıç Prensi", "Kılıç Şövalyesi", "Kılıç Kraliçesi", "Kılıç Kralı",

    // Pentacles (Tılsımlar)
    "Tılsım Ası", "Tılsım İkilisi", "Tılsım Üçlüsü", "Tılsım Dörtlüsü", "Tılsım Beşlisi",
    "Tılsım Altılısı", "Tılsım Yedilisi", "Tılsım Sekizlisi", "Tılsım Dokuzlusu", "Tılsım Onlusu",
    "Tılsım Prensi", "Tılsım Şövalyesi", "Tılsım Kraliçesi", "Tılsım Kralı"
];

export const prepareTarotDeck = () => {
    // 78 kartın her birine rastgele bir Ters/Düz durumu atayarak desteyi karıştırıyoruz
    const deck = TAROT_CARDS.map(card => {
        const isReversed = Math.random() < 0.5;
        return `${card} (${isReversed ? 'Ters' : 'Düz'})`;
    });
    
    // Shuffle the deck (Kullanıcı aynı yeri seçse bile farklı kart gelecek)
    return deck.sort(() => Math.random() - 0.5);
};
