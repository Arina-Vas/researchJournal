import dotenv from 'dotenv';

dotenv.config();

import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';
import medicationRoutes from './routes/medicationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || '3001';

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/medications', medicationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Сервер запущен ${port}`);
  });
};

startServer();
