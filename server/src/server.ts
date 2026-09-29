import dotenv from 'dotenv';

dotenv.config();

import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';
import medicationRoutes from './routes/medicationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { WebSocketServer } from 'ws';
import http from 'http';
import { initWebSocketServer } from './webSocket/ws.js';

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
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);
const startServer = async () => {
  try {
    await connectDB();

    initWebSocketServer(server);

    server.listen(port, () => {
      console.log(`WS & HTTP server is running on ws://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
  // app.listen(port, () => {
  //   console.log(`Сервер запущен ${port}`);
  // });
};

startServer();
