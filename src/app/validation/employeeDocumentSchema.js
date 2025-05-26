import { z } from "zod";

// Optional: GST number validation regex
const gstRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

//  Company Document Schema for Employer/Company
export const companyDocumentSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Company Registration Number is required"),

  taxGstNumber: z
    .string()
    .min(1, "GST Number is required")
    .regex(gstRegex, "Invalid GST Number"),
});
