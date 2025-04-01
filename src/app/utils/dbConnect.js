import mongoose from 'mongoose';

const getMongoURI = () => {
  const environment = process.env.NODE_ENV;
  if (process.env.NODE_ENV !== 'production') {
    console.log(environment, 'environments');
  }
  switch (environment) {
    case 'development':
      return process.env.DEV_DATABASE_URL;
    case 'production':
      return process.env.PROD_DATABASE_URL;
    default:
      throw new Error(`Unknown environment: ${environment}`);
  }
};

const mongoURI = getMongoURI();
// console.log('MongoDB URI:', mongoURI); // Add this line to debug

let isConnected = false;

export const dbConnect = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return mongoose.connection.db;
  }
console.log(mongoURI)
  try {
    const connection = await mongoose.connect(mongoURI);
    isConnected = true;
    console.log(`Connected to MongoDB in ${process.env.NODE_ENV} environment`);
    return connection.connection.db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.DATABASE_URL;

// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   );
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }
