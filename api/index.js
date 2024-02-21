import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('connected to Mongo DB');
 })
.catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());
app.listen(3000, () =>{
    console.log('server is listening to 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);