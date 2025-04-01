import mongoose from 'mongoose';
import { dbConnect } from '../utils/dbConnect';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Unique ID for different counters
  seq: { type: Number, required: true }, // The decrementing sequence number
}, {
  versionKey: false,
});

const Counter =
  mongoose.models.Counter || mongoose.model('Counter', counterSchema);
export default Counter;

// async function initializeCounter() {
//   await dbConnect();
//   await Counter.findOneAndUpdate(
//     { _id: 'userCounter' },
//     { $setOnInsert: { seq: 9990000000 } },
//     { upsert: true, new: true }
//   );
//   console.log('Counter initialized!');
// }

// initializeCounter();
