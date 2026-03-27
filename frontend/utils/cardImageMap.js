export const getCardImage = (name) => {
    // Major Arcana
    if (name.includes('Deli')) return require('../assets/cards/m00.jpg');
    if (name.includes('Büyücü')) return require('../assets/cards/m01.jpg');
    if (name.includes('Azize')) return require('../assets/cards/m02.jpg');
    if (name.includes('İmparatoriçe')) return require('../assets/cards/m03.jpg');
    if (name.includes('İmparator')) return require('../assets/cards/m04.jpg');
    if (name.includes('Aziz')) return require('../assets/cards/m05.jpg');
    if (name.includes('Aşıklar')) return require('../assets/cards/m06.jpg');
    if (name.includes('Araba')) return require('../assets/cards/m07.jpg');
    if (name.includes('Güç')) return require('../assets/cards/m08.jpg');
    if (name.includes('Ermiş')) return require('../assets/cards/m09.jpg');
    if (name.includes('Çark')) return require('../assets/cards/m10.jpg'); // Kader Çarkı
    if (name.includes('Adalet')) return require('../assets/cards/m11.jpg');
    if (name.includes('Asılan adam') || name.includes('Asılan Adam')) return require('../assets/cards/m12.jpg');
    if (name.includes('Ölüm')) return require('../assets/cards/m13.jpg');
    if (name.includes('Denge')) return require('../assets/cards/m14.jpg');
    if (name.includes('Şeytan')) return require('../assets/cards/m15.jpg');
    if (name.includes('Kule')) return require('../assets/cards/m16.jpg'); // Yıkılan Kule
    if (name.includes('Yıldız')) return require('../assets/cards/m17.jpg');
    if (name.includes('Ay')) return require('../assets/cards/m18.jpg');
    if (name.includes('Güneş')) return require('../assets/cards/m19.jpg');
    if (name.includes('Mahkeme')) return require('../assets/cards/m20.jpg');
    if (name.includes('Dünya')) return require('../assets/cards/m21.jpg');

    // Wands (Değnekler)
    if (name.includes('Değnek Ası')) return require('../assets/cards/w01.jpg');
    if (name.includes('Değnek İkilisi')) return require('../assets/cards/w02.jpg');
    if (name.includes('Değnek Üçlüsü')) return require('../assets/cards/w03.jpg');
    if (name.includes('Değnek Dörtlüsü')) return require('../assets/cards/w04.jpg');
    if (name.includes('Değnek Beşlisi')) return require('../assets/cards/w05.jpg');
    if (name.includes('Değnek Altılısı')) return require('../assets/cards/w06.jpg');
    if (name.includes('Değnek Yedilisi')) return require('../assets/cards/w07.jpg');
    if (name.includes('Değnek Sekizlisi')) return require('../assets/cards/w08.jpg');
    if (name.includes('Değnek Dokuzlusu')) return require('../assets/cards/w09.jpg');
    if (name.includes('Değnek Onlusu')) return require('../assets/cards/w10.jpg');
    if (name.includes('Değnek Prensi')) return require('../assets/cards/w11.jpg');
    if (name.includes('Değnek Şövalyesi')) return require('../assets/cards/w12.jpg');
    if (name.includes('Değnek Kraliçesi')) return require('../assets/cards/w13.jpg');
    if (name.includes('Değnek Kralı')) return require('../assets/cards/w14.jpg');

    // Cups (Kupalar)
    if (name.includes('Kupa Ası')) return require('../assets/cards/c01.jpg');
    if (name.includes('Kupa İkilisi')) return require('../assets/cards/c02.jpg');
    if (name.includes('Kupa Üçlüsü')) return require('../assets/cards/c03.jpg');
    if (name.includes('Kupa Dörtlüsü')) return require('../assets/cards/c04.jpg');
    if (name.includes('Kupa Beşlisi')) return require('../assets/cards/c05.jpg');
    if (name.includes('Kupa Altılısı')) return require('../assets/cards/c06.jpg');
    if (name.includes('Kupa Yedilisi')) return require('../assets/cards/c07.jpg');
    if (name.includes('Kupa Sekizlisi')) return require('../assets/cards/c08.jpg');
    if (name.includes('Kupa Dokuzlusu')) return require('../assets/cards/c09.jpg');
    if (name.includes('Kupa Onlusu')) return require('../assets/cards/c10.jpg');
    if (name.includes('Kupa Prensi')) return require('../assets/cards/c11.jpg');
    if (name.includes('Kupa Şövalyesi')) return require('../assets/cards/c12.jpg');
    if (name.includes('Kupa Kraliçesi')) return require('../assets/cards/c13.jpg');
    if (name.includes('Kupa Kralı')) return require('../assets/cards/c14.jpg');

    // Swords (Kılıçlar)
    if (name.includes('Kılıç Ası')) return require('../assets/cards/s01.jpg');
    if (name.includes('Kılıç İkilisi')) return require('../assets/cards/s02.jpg');
    if (name.includes('Kılıç Üçlüsü')) return require('../assets/cards/s03.jpg');
    if (name.includes('Kılıç Dörtlüsü')) return require('../assets/cards/s04.jpg');
    if (name.includes('Kılıç Beşlisi')) return require('../assets/cards/s05.jpg');
    if (name.includes('Kılıç Altılısı')) return require('../assets/cards/s06.jpg');
    if (name.includes('Kılıç Yedilisi')) return require('../assets/cards/s07.jpg');
    if (name.includes('Kılıç Sekizlisi')) return require('../assets/cards/s08.jpg');
    if (name.includes('Kılıç Dokuzlusu')) return require('../assets/cards/s09.jpg');
    if (name.includes('Kılıç Onlusu')) return require('../assets/cards/s10.jpg');
    if (name.includes('Kılıç Prensi')) return require('../assets/cards/s11.jpg');
    if (name.includes('Kılıç Şövalyesi')) return require('../assets/cards/s12.jpg');
    if (name.includes('Kılıç Kraliçesi')) return require('../assets/cards/s13.jpg');
    if (name.includes('Kılıç Kralı')) return require('../assets/cards/s14.jpg');

    // Pentacles (Tılsımlar)
    if (name.includes('Tılsım Ası')) return require('../assets/cards/p01.jpg');
    if (name.includes('Tılsım İkilisi')) return require('../assets/cards/p02.jpg');
    if (name.includes('Tılsım Üçlüsü')) return require('../assets/cards/p03.jpg');
    if (name.includes('Tılsım Dörtlüsü')) return require('../assets/cards/p04.jpg');
    if (name.includes('Tılsım Beşlisi')) return require('../assets/cards/p05.jpg');
    if (name.includes('Tılsım Altılısı')) return require('../assets/cards/p06.jpg');
    if (name.includes('Tılsım Yedilisi')) return require('../assets/cards/p07.jpg');
    if (name.includes('Tılsım Sekizlisi')) return require('../assets/cards/p08.jpg');
    if (name.includes('Tılsım Dokuzlusu')) return require('../assets/cards/p09.jpg');
    if (name.includes('Tılsım Onlusu')) return require('../assets/cards/p10.jpg');
    if (name.includes('Tılsım Prensi')) return require('../assets/cards/p11.jpg');
    if (name.includes('Tılsım Şövalyesi')) return require('../assets/cards/p12.jpg');
    if (name.includes('Tılsım Kraliçesi')) return require('../assets/cards/p13.jpg');
    if (name.includes('Tılsım Kralı')) return require('../assets/cards/p14.jpg');

    return null;
};
