const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '/Users/demonalisa/musty/demonalisa/falfora/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
    console.log('--- Database Migration (Stats: Monthly Grouping) Started ---');
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const readingsCol = db.collection('readings');
        const statsCol = db.collection('stats');

        // 1. Reconstruct Stats Collection by Month
        console.log('Reconstructing Stats collection from Readings data (grouped by month)...');
        
        // Clear existing Stats
        await statsCol.deleteMany({});
        console.log('> Cleared old stats.');

        // Aggregate counts by month and type
        const statsAggregation = await readingsCol.aggregate([
            {
                $project: {
                    type: 1,
                    monthStart: {
                        $dateToString: { format: "%Y-%m-01", date: "$createdAt" }
                    }
                }
            },
            {
                $group: {
                    _id: { monthStart: "$monthStart", type: "$type" },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        console.log(`Generated ${statsAggregation.length} monthly type-specific stats records.`);

        for (const stat of statsAggregation) {
            await statsCol.insertOne({
                date: new Date(stat._id.monthStart),
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
