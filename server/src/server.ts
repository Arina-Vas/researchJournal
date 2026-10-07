import 'dotenv/config';

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';
import medicationRoutes from './routes/medicationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import http from 'http';
import { initWebSocketServer } from './webSocket/ws.js';

const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || '3001';

app.use('/api/medications', medicationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON' });
    return;
  }
  next(err);
});

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
};

startServer();
