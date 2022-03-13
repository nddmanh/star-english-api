const mongoose = require('mongoose');

const connectDB = async () => { 
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected Successfully!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
 
module.exports = {connectDB};