const asyncHandler = require('express-async-handler');
const Reading = require('../models/Reading');
const Stats = require('../models/Stats');

// @desc Get user stats
// @route GET /api/stats/user
// @access Private
const getUserStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const totalReadings = await Reading.countDocuments({ userId, deletedByUser: false });
    
    // Group by type
    const typeDistribution = await Reading.aggregate([
        { $match: { userId, deletedByUser: false } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
        totalReadings,
        typeDistribution
    });
});

// @desc Get global stats
// @route GET /api/stats/global
// @access Private
const getGlobalStats = asyncHandler(async (req, res) => {
    // Current date calculations
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Global counts (overall)
    const totalGlobal = await Reading.countDocuments();

    // Today's count (using Stats collection if possible or Reading collection direct)
    const statsToday = await Stats.aggregate([
        { $match: { date: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$count' } } }
    ]);

    // Monthly/Yearly using Reading aggregation for real-time (or you can use stats collection)
    const monthlyReadings = await Reading.countDocuments({ createdAt: { $gte: monthStart } });
    const yearlyReadings = await Reading.countDocuments({ createdAt: { $gte: yearStart } });

    res.json({
        totalGlobal,
        today: statsToday[0] ? statsToday[0].total : 0,
        monthly: monthlyReadings,
        yearly: yearlyReadings
    });
});

module.exports = {
    getUserStats,
    getGlobalStats
};
