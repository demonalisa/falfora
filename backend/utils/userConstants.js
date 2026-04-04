const RELATIONSHIP_MAP = {
    'single': 'Bekar',
    'in_relationship': 'İlişkisi Var',
    'married': 'Evli',
    'divorced': 'Boşanmış',
    'complicated': 'Karışık'
};

const GENDER_MAP = {
    'female': 'Kadın',
    'male': 'Erkek'
};

const ZODIAC_MAP = {
    'aries': 'Koç',
    'taurus': 'Boğa',
    'gemini': 'İkizler',
    'cancer': 'Yengeç',
    'leo': 'Aslan',
    'virgo': 'Başak',
    'libra': 'Terazi',
    'scorpio': 'Akrep',
    'sagittarius': 'Yay',
    'capricorn': 'Oğlak',
    'aquarius': 'Kova',
    'pisces': 'Balık'
};

const getRelationshipLabel = (key) => RELATIONSHIP_MAP[key] || key;
const getGenderLabel = (key) => GENDER_MAP[key] || key;
const getZodiacLabel = (key) => ZODIAC_MAP[key] || key;

module.exports = {
    RELATIONSHIP_MAP,
    GENDER_MAP,
    ZODIAC_MAP,
    getRelationshipLabel,
    getGenderLabel,
    getZodiacLabel
};
