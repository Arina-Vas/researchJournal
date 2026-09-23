import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/my_test_db';

        const conn = await mongoose.connect(connStr);

        console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error);
        process.exit(1);
    }
};