const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
const secretPath = '/etc/secrets/.env';
if (fs.existsSync(secretPath)) {
    dotenv.config({ path: secretPath });
} else {
    dotenv.config();
}

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/readings', require('./routes/readingRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Falfora API is running...',
        version: '1.0.0',
        status: 'online'
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
