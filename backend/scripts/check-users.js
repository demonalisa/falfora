const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- MONGODB KULLANICI LİSTESİ ---');
        
        const users = await User.find({}).select('username email sub createdAt');
        
        if (users.length === 0) {
            console.log('Henüz kayıtlı kullanıcı bulunamadı.');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Kullanıcı:`);
                console.log(`   - İsim: ${user.username}`);
                console.log(`   - E-posta: ${user.email}`);
                console.log(`   - Auth0 ID (sub): ${user.sub || 'Yok'}`);
                console.log(`   - Kayıt Tarihi: ${user.createdAt}`);
                console.log('------------------------------');
            });
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Bağlantı hatası:', err.message);
    }
};

checkUsers();
