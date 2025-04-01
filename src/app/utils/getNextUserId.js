import Counter from '../models/counter';

export async function getNextUserId(session = null) {
  const options = { new: true, upsert: true };
  if (session) options.session = session;

  const counterDoc = await Counter.findByIdAndUpdate(
    'userCounter',
    { $inc: { seq: -1 } }, // Decrement by 1
    options
  );

  return counterDoc.seq; // Return the updated sequence number
}
