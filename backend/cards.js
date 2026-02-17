const TAROT_CARDS = [
    // Major Arcana
    "Deli (The Fool)", "Büyücü (The Magician)", "Azize (The High Priestess)", "İmparatoriçe (The Empress)",
    "İmparator (The Emperor)", "Aziz (The Hierophant)", "Aşıklar (The Lovers)", "Araba (The Chariot)",
    "Güç (Strength)", "Ermiş (The Hermit)", "Kader Çarkı (Wheel of Fortune)", "Adalet (Justice)",
    "Asılan Adam (The Hanged Man)", "Ölüm (Death)", "Denge (Temperance)", "Şeytan (The Devil)",
    "Yıkılan Kule (The Tower)", "Yıldız (The Star)", "Ay (The Moon)", "Güneş (The Sun)",
    "Mahkeme (Judgement)", "Dünya (The World)",

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

/**
 * Rastgele tarot kartı seçer.
 * @param {number} count Seçilecek kart sayısı.
 * @returns {Array<string>} Seçilen kartlar.
 */
function pickRandomCards(count) {
    const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map(card => {
        const isReversed = Math.random() < 0.5;
        return `${card} (${isReversed ? 'Ters' : 'Düz'})`;
    });
}

module.exports = {
    TAROT_CARDS,
    pickRandomCards
};
