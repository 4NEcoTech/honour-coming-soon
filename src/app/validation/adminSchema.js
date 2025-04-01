const { z } = require('zod');

export const adminSchema = z.object({
  photo: z.any().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  corporateEmail: z.string().email("Invalid email format"),
  alternateEmail: z.string().email("Invalid email format").optional(),
  phone: z.string().min(10, "Phone number is required"),
  alternatePhone: z.string().optional(),
  designation: z.string().optional(),
  profileHeadline: z.string().optional(),
  gender: z.enum(["01", "02", "03"], { required_error: "Gender is required" }),
  dob: z.string().min(1, "Date of birth is required"),



  // part two of the schema down below

    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    pincode: z.string().min(1, "Pincode is required"),
    state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),


// social media schema
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().url('Please enter a valid URL'),
});




export const AdminSocialPlatformsSchema = adminSchema.pick({
  platform: true,
  url: true,
});

export const AdminAddressSchema = adminSchema.pick({
  addressLine1: true,
  addressLine2: true,
  landmark: true,
  country: true,
  pincode: true,
  state: true,
  city: true,
});

export const AdminPersonalSchema = adminSchema.pick({
  photo: true,
  firstName: true,
  lastName: true,
  corporateEmail: true,
  alternateEmail: true,
  phone: true,
  alternatePhone: true,
  designation: true,
  profileHeadline: true,
  gender: true,
  dob: true,

});
