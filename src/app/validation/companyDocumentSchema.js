import { z } from 'zod';
import { gstInSchema } from './gstValidationSchema';

// ✅ Company Document Schema
export const companyDocumentSchema = z
  .object({
    institutionType: z.enum(['College', 'University']),
    aisheCode: z.string().min(1, 'AISHE Code is required'),
    collegeName: z.string().optional(),
    affiliatedUniversity: z.string().optional(),
    universityName: z.string().optional(),
    universityType: z.string().optional(),
    taxId: gstInSchema,
    companyRegistrationNumber: z
      .string()
      .min(1, 'Company Registration Number is required'),
    registrationDoc: z
      .custom((file) => file instanceof File, { message: 'File is required' })
      .refine((file) => file.size <= 2 * 1024 * 1024, 'Max file size is 2MB')
      .refine(
        (file) =>
          ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
        'Only PDF, JPG, and PNG are allowed'
      ),
    taxDoc: z
      .custom((file) => file instanceof File, { message: 'File is required' })
      .refine((file) => file.size <= 2 * 1024 * 1024, 'Max file size is 2MB')
      .refine(
        (file) =>
          ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
        'Only PDF, JPG, and PNG are allowed'
      ),
  })
  .superRefine((data, ctx) => {
    if (data.institutionType === 'College') {
      if (!data.collegeName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'College name is required',
          path: ['collegeName'],
        });
      }

      if (!data.affiliatedUniversity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Affiliated university is required',
          path: ['affiliatedUniversity'],
        });
      }
    }

    if (data.institutionType === 'University') {
      if (!data.universityName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'University name is required',
          path: ['universityName'],
        });
      }

      if (!data.universityType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'University type is required',
          path: ['universityType'],
        });
      }
    }
  });
