import mongoose from 'mongoose';

async function connectDB(databaseUrl) {
  mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Database connected'))
    .catch(err => console.log(err));
}

export default connectDB;
