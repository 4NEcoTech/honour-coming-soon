import * as z from 'zod';

// Validation Rules for Each Document Type
const validationSchemas = {
  Aadhaar: z.string().regex(/^\d{12}$/, {
    message: 'Invalid Aadhaar Number. Must be exactly 12 digits.',
  }),
  voterID: z.string().regex(/^[A-Z]{3}\d{7}$/, {
    message:
      'Invalid Voter ID Number. Must be 10 alphanumeric characters (3 letters followed by 7 digits).',
  }),
  passport: z.string().regex(/^[A-Z]\d{7}$/, {
    message:
      'Invalid Passport Number. Must be 8 characters (1 uppercase letter followed by 7 digits).',
  }),
  PANcard: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, {
    message:
      'Invalid PAN Number. Format: 5 uppercase letters, 4 digits, and 1 uppercase letter (e.g., ABCDE1234F).',
  }),
  drivinglicense: z.string().regex(/^[A-Z]{2}\d{2}\s\d{11}$/, {
    message:
      'Invalid Driving License. Format: 2 uppercase letters, 2 digits, a space, and 11 digits (e.g., AB12 12345678901).',
  }),
};

// Main Schema
export const DocumentSchema = z
  .object({
    domicile: z.string().min(1, 'Please select a country.'),
    documentType: z.string().min(1, 'Please select a document type.'),
    documentNumber: z.string().min(1, 'Document number is required.'),
    uploadPhoto: z
      .any()
      .refine((file) => file instanceof File, 'File is required')
      .refine((file) => file.size <= 2 * 1024 * 1024, 'Max file size is 2MB.')
      .refine(
        (file) =>
          ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(
            file.type
          ),
        'Only JPG, PNG, and PDF are allowed.'
      ),
  })
  .superRefine((data, ctx) => {
    const { documentType, documentNumber } = data;
    console.log('documentType', documentType);

    // Ensure a validation schema exists for the selected document type
    if (validationSchemas[documentType]) {
      const result = validationSchemas[documentType].safeParse(documentNumber);
      if (!result.success) {
        ctx.addIssue({
          path: ['documentNumber'],
          message: result.error.errors[0].message,
        });
      }
    }
  });
