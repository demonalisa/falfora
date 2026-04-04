const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '/Users/demonalisa/musty/demonalisa/falfora/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const typeMap = {
    'single_1': 'oneCardReading1',
    '3_cards': 'dailyReading3',
    'love_7': 'loveReading7',
    '10_cards': 'celticCrossReading10'
};

async function migrate() {
    console.log('--- Database Migration (Readings & Stats) Started ---');
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const readingsCol = db.collection('readings');
        const statsCol = db.collection('stats');

        // 1. Migrate Readings Collection
        console.log('Updating Readings types...');
        
        // Update explicit types
        for (const [oldType, newType] of Object.entries(typeMap)) {
            const res = await readingsCol.updateMany({ type: oldType }, { $set: { type: newType } });
            console.log(`> Converted ${res.modifiedCount} readings from "${oldType}" to "${newType}"`);
        }

        // Handle generic "tarot" or missing type in Readings
        const tarotReadings = await readingsCol.find({ type: { $in: ['tarot', null, undefined] } }).toArray();
        console.log(`Found ${tarotReadings.length} generic "tarot" readings. Categorizing by card count...`);

        for (const reading of tarotReadings) {
            let newType = 'dailyReading3'; // Default
            const cardCount = reading.cards ? reading.cards.length : 0;
            
            if (cardCount === 1) newType = 'oneCardReading1';
            else if (cardCount === 3) newType = 'dailyReading3';
            else if (cardCount === 7) newType = 'loveReading7';
            else if (cardCount === 10) newType = 'celticCrossReading10';

            await readingsCol.updateOne({ _id: reading._id }, { $set: { type: newType } });
        }
        console.log('> Finished categorizing generic readings.');

        // 2. Reconstruct Stats Collection
        console.log('Reconstructing Stats collection from Readings data...');
        
        // Clear existing Stats
        await statsCol.deleteMany({});
        console.log('> Cleared old stats.');

        // Aggregate counts by date and type
        const statsAggregation = await readingsCol.aggregate([
            {
                $project: {
                    type: 1,
                    dateOnly: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    }
                }
            },
            {
                $group: {
                    _id: { date: "$dateOnly", type: "$type" },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        console.log(`Generated ${statsAggregation.length} daily type-specific stats records.`);

        for (const stat of statsAggregation) {
            await statsCol.insertOne({
                date: new Date(stat._id.date),
                type: stat._id.type,
                count: stat.count,
                __v: 0
            });
        }

        console.log('--- Migration Successfully Finished ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
