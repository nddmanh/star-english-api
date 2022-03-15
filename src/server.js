require('dotenv').config();
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route';
import postRouter from './routes/post.route';
import questionRouter from './routes/question.route';

const app = express();
import { connectDB } from './configs/db';

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/questions', questionRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
