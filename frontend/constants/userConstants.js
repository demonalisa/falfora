export const RELATIONSHIP_STATUSES = [
    { key: 'single', label: 'Bekar' },
    { key: 'in_relationship', label: 'İlişkisi Var' },
    { key: 'married', label: 'Evli' },
    { key: 'divorced', label: 'Boşanmış' },
    { key: 'complicated', label: 'Karışık' }
];

export const GENDERS = [
    { key: 'female', label: 'Kadın', icon: 'gender-female' },
    { key: 'male', label: 'Erkek', icon: 'gender-male' }
];

export const ZODIAC_SIGNS = [
    { key: 'aries', label: 'Koç', icon: 'zodiac-aries' },
    { key: 'taurus', label: 'Boğa', icon: 'zodiac-taurus' },
    { key: 'gemini', label: 'İkizler', icon: 'zodiac-gemini' },
    { key: 'cancer', label: 'Yengeç', icon: 'zodiac-cancer' },
    { key: 'leo', label: 'Aslan', icon: 'zodiac-leo' },
    { key: 'virgo', label: 'Başak', icon: 'zodiac-virgo' },
    { key: 'libra', label: 'Terazi', icon: 'zodiac-libra' },
    { key: 'scorpio', label: 'Akrep', icon: 'zodiac-scorpio' },
    { key: 'sagittarius', label: 'Yay', icon: 'zodiac-sagittarius' },
    { key: 'capricorn', label: 'Oğlak', icon: 'zodiac-capricorn' },
    { key: 'aquarius', label: 'Kova', icon: 'zodiac-aquarius' },
    { key: 'pisces', label: 'Balık', icon: 'zodiac-pisces' }
];

export const getRelationshipLabel = (key) => {
    const status = RELATIONSHIP_STATUSES.find(s => s.key === key);
    return status ? status.label : key;
};

export const getGenderLabel = (key) => {
    const gender = GENDERS.find(g => g.key === key);
    return gender ? gender.label : key;
};

export const getZodiacLabel = (key) => {
    const zodiac = ZODIAC_SIGNS.find(z => z.key === key);
    return zodiac ? zodiac.label : key;
};
