// import mongoose from "mongoose";
// import { z } from "zod";

// // Define the client-side Zod schema for validation
// export const contactSchema = z.object({
//   firstName: z.string().min(1, "6011_1 First name is required."),
//   lastName: z.string().optional(),
//   phoneNumber: z.string().min(10, "6011_2 Phone number must be at least 10 digits."),
//   email: z.string().email("6011_3 Invalid email address."),
//   country: z.string().optional(),
//   state: z.string().optional(),
//   city: z.string().optional(),
//   message: z.string().min(10, "6011_4 Message must be at least 10 characters long."),
//   logo: z.any().optional(), // Change this to accept any type for client-side
// });

// // Server-side schema remains the same as it's already correct
// export const serverContactSchema = contactSchema.extend({
//   logo: z.any().optional(), 
// });

// // Rest of your mongoose schemas remain the same
// const AuditTrailSchema = new mongoose.Schema({
//   ipAddress: { type: String, default: "Unknown" },
//   os: { type: String, default: "Unknown" },
//   browser: { type: String, default: "Unknown" },
//   device: { type: String, default: "Unknown" },
//   location: {
//     timezone: { type: String, default: "Unknown" },
//     isp: { type: String, default: "Unknown" },
//     lon: { type: Number, default: 0 },
//     lat: { type: Number, default: 0 },
//     zip: { type: String, default: "Unknown" },
//     city: { type: String, default: "Unknown" },
//     region: { type: String, default: "Unknown" },
//     country: { type: String, default: "Unknown" },
//   },
// });

// const ContactSubmissionSchema = new mongoose.Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String },
//     email: {
//       type: String,
//       required: true,
//       match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     },
//     phoneNumber: { type: String },
//     country: { type: String },
//     state: { type: String },
//     city: { type: String },
//     message: { type: String, required: true },
//     logo: { type: Buffer }, // This is correct for storing binary data
//     audit_trail: [AuditTrailSchema],
//   },
//   {
//     timestamps: true,
//   }
// );

// export function getContactSubmissionModel() {
//   return (
//     mongoose.models.ContactSubmission ||
//     mongoose.model("ContactSubmission", ContactSubmissionSchema)
//   );
// }

// export { ContactSubmissionSchema };




import mongoose from "mongoose";
import { z } from "zod";
import { AuditTrailSchema } from "./common/AuditTrail";

// Define the client-side Zod schema for validation
export const contactSchema = z.object({
  firstName: z.string().min(1, "6011_1 First name is required."),
  lastName: z.string().optional(),
  phoneNumber: z.string().min(10, "6011_2 Phone number must be at least 10 digits."),
  email: z.string().email("6011_3 Invalid email address."),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(10, "6011_4 Message must be at least 10 characters long."),
  logo: z.any().optional(), // Change this to accept any type for client-side
});

// Server-side schema remains the same as it's already correct
export const serverContactSchema = contactSchema.extend({
  logo: z.any().optional(), 
});


const ContactSubmissionSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phoneNumber: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    message: { type: String, required: true },
    logo: { type: String }, // Change from Buffer to String (Google Drive URL)
    audit_trail: [AuditTrailSchema],
  },
  { timestamps: true }
);


export function getContactSubmissionModel() {
  return (
    mongoose.models.ContactSubmission ||
    mongoose.model("ContactSubmission", ContactSubmissionSchema)
  );
}

export { ContactSubmissionSchema };
