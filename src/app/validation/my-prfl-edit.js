import { z } from "zod"

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  profileHeadline: z.string().optional(),
  designation: z.string().optional(),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  about: z.string().optional(),
  language: z
    .array(
      z.object({
        name: z.string(),
        proficiency: z.string(),
      }),
    )
    .optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
      facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
      instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
    })
    .optional(),
})

