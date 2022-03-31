require('dotenv').config();
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import postRouter from './routes/post.route';
import questionRouter from './routes/question.route';
import dictionaryRouter from './routes/dictionary.route';
import { connectDB } from './configs/db';

const app = express();

app.use(cors({ origin: true }));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/dictionary', dictionaryRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
