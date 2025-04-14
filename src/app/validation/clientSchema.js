import { z } from 'zod';

// Client-side only schema
export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  country: z.string().optional(),
  pincode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});
