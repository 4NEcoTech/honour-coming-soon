const { z } = require("zod");

export const adminSchema = (t) =>
  z.object({
    photo: z.any().optional(),
    firstName: z.string().min(1, t("6024_1")),
    lastName: z.string().min(1, t("6024_2")),
    corporateEmail: z.string().email(t("6024_3")),
    alternateEmail: z.string().email(t("6024_4")).optional(),
    phone: z.string().min(10, t("6024_5")),
    alternatePhone: z.string().optional(),
    about: z.string().max(500, t("6024_6")).optional(),

    designation: z.string().optional(),
    profileHeadline: z.string().optional(),
    gender: z.enum(["01", "02", "03"], {
      required_error: t("6024_7"),
    }),
    dob: z.string().min(1, t("6024_8")),
    // part two of the schema down below

    addressLine1: z.string().min(1, t("6024_9")),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    country: z.string().min(1, t("6024_10")),
    pincode: z.string().min(1, t("6024_11")),
    state: z.string().min(1, t("6024_12")),
    city: z.string().min(1, t("6024_13")),

    // social media schema
    platform: z.string().min(1, t("6024_14")),
    url: z.string().url(t("6024_15")),
  });

// export const AdminSocialPlatformsSchema = adminSchema.pick({
//   platform: true,
//   url: true,
// });

// export const AdminAddressSchema = adminSchema.pick({
//   addressLine1: true,
//   addressLine2: true,
//   landmark: true,
//   country: true,
//   pincode: true,
//   state: true,
//   city: true,
// });

// export const AdminPersonalSchema = adminSchema.pick({
//   photo: true,
//   firstName: true,
//   lastName: true,
//   corporateEmail: true,
//   alternateEmail: true,
//   phone: true,
//   alternatePhone: true,
//   designation: true,
//   profileHeadline: true,
//   gender: true,
//   about: true,
//   dob: true,

// });
