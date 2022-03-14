import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('DB Connected Successfully!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
