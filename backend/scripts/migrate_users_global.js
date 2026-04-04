const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '/Users/demonalisa/musty/demonalisa/falfora/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const zodiacMigrationMap = {
    'Koç': 'aries',
    'Boğa': 'taurus',
    'İkizler': 'gemini',
    'Yengeç': 'cancer',
    'Aslan': 'leo',
    'Başak': 'virgo',
    'Terazi': 'libra',
    'Akrep': 'scorpio',
    'Yay': 'sagittarius',
    'Oğlak': 'capricorn',
    'Kova': 'aquarius',
    'Balık': 'pisces'
};

const genderMigrationMap = {
    'Kadın': 'female',
    'Erkek': 'male'
};

const relationshipMigrationMap = {
    'iliski_yok': 'single',
    'iliski_var': 'in_relationship',
    'iliski_evli': 'married',
    'iliski_bosanmis': 'divorced',
    'iliski_karisik': 'complicated'
};

async function migrate() {
    console.log('--- Global ID Migration (Users) Started ---');
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const usersCol = db.collection('users');

        // 1. Migrate Gender
        for (const [oldVal, newVal] of Object.entries(genderMigrationMap)) {
            const res = await usersCol.updateMany({ gender: oldVal }, { $set: { gender: newVal } });
            console.log(`> Gender: ${res.modifiedCount} users updated from "${oldVal}" to "${newVal}"`);
        }

        // 2. Migrate Zodiac
        for (const [oldVal, newVal] of Object.entries(zodiacMigrationMap)) {
            const res = await usersCol.updateMany({ zodiac: oldVal }, { $set: { zodiac: newVal } });
            console.log(`> Zodiac: ${res.modifiedCount} users updated from "${oldVal}" to "${newVal}"`);
        }

        // 3. Migrate Relationship
        for (const [oldVal, newVal] of Object.entries(relationshipMigrationMap)) {
            const res = await usersCol.updateMany({ relationship: oldVal }, { $set: { relationship: newVal } });
            console.log(`> Relationship: ${res.modifiedCount} users updated from "${oldVal}" to "${newVal}"`);
        }

        console.log('--- Global ID Migration Finished Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
