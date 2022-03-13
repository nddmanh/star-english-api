require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './routes/auth.route';
import postRouter from './routes/post.route';

const app = express();
import { connectDB } from './configs/db';

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);

let port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
})

