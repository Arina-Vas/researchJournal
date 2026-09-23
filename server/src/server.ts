import express, {type Express, type Request, type Response} from 'express';
import {connectDB} from "./db";
import medicationRoutes from "./routes/medicationRoutes";
import locationRoutes from "./routes/locationRoutes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/medications', medicationRoutes);
app.use('/api/locations', locationRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Сервер запущен ${port}`);
    })
}

startServer();