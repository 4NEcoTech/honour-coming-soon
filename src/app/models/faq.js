import mongoose from "mongoose";

//  This is the correct structure based on your actual DB
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

//  Force collection to be exactly 'faq' to match your MongoDB
const Faq = mongoose.models.Faq || mongoose.model("Faq", faqSchema, "faq");

export default Faq;
