const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend folder
dotenv.config({ path: '/Users/demonalisa/musty/demonalisa/falfora/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const migrationMap = {
    'Bekar': 'iliski_yok',
    'İlişkisi Var': 'iliski_var',
    'Evli': 'iliski_evli',
    'Boşanmış': 'iliski_bosanmis',
    'Karışık': 'iliski_karisik',
    'Bekâr': 'iliski_yok' // Alternative spellings
};

async function migrate() {
    console.log('--- Migration Script Started ---');
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`Connected to host: ${conn.connection.host}`);
        console.log(`Using database: ${conn.connection.name}`);

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        console.log('Starting user data migration...');

        for (const [oldValue, newValue] of Object.entries(migrationMap)) {
            console.log(`Updating "${oldValue}" to "${newValue}"...`);
            const result = await usersCollection.updateMany(
                { relationship: oldValue },
                { $set: { relationship: newValue } }
            );
            console.log(`> Done. Updated ${result.modifiedCount} users.`);
        }

        console.log('--- Migration Successfully Finished ---');
        process.exit(0);
    } catch (error) {
        console.error('--- Migration Failed! ---');
        console.error(error);
        process.exit(1);
    }
}

migrate();
