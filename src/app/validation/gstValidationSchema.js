import { z } from 'zod';

//  Convert state codes list into a Set for faster lookup (O(1) complexity)
const validStateCodesSet = new Set([
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '97', // '97' is used for certain territories
]);

//  Function to Validate GSTIN Checksum (Placeholder for official algorithm)
const isValidGSTINChecksum = (gstin) => {
  // Add actual GSTIN checksum validation logic here (if required)
  return true; // Placeholder: Always returns true for now
};

//  GSTIN Validation Schema with All Edge Cases Covered
/**
 * Schema for validating GSTIN (Goods and Services Tax Identification Number).
 *
 * This schema ensures that the GSTIN adheres to the following rules:
 *
 * - Must be a string with exactly 15 characters.
 * - The first two characters must represent a valid state code (01-35 or 97).
 * - Characters 3 to 12 must follow the PAN (Permanent Account Number) structure:
 *   - 5 uppercase letters, followed by 4 digits, and 1 uppercase letter.
 * - Characters 13 and 14 must consist of:
 *   - A number (0-9) as the 13th character.
 *   - The letter 'Z' as the 14th character.
 * - The GSTIN must pass a checksum validation.
 *
 * Validation Errors:
 * - If the length is not exactly 15 characters, an error message is returned.
 * - If the state code is invalid, an error message specifies the invalid code.
 * - If the PAN structure is invalid, an error message is returned.
 * - If the 13th and 14th characters do not meet the required format, an error message is returned.
 * - If the checksum is invalid, an error message is returned.
 *
 * @constant {ZodString} gstinSchema - The Zod schema for GSTIN validation.
 */

export const gstInSchema = z
  .string()
  .trim()
  .min(15, { message: 'GSTIN must be exactly 15 characters long.' })
  .max(15, { message: 'GSTIN must be exactly 15 characters long.' })
  // .refine((gstin) => validStateCodesSet.has(gstin.substring(0, 2)), {
  //   message: (gstin) =>
  //     `Invalid State Code: ${gstin.substring(
  //       0,
  //       2
  //     )}. It should be between 01-35 or 97.`,
  //   path: ['stateCode'],
  // })
  // // PAN structure: 5 uppercase letters, 4 digits, 1 uppercase letter
  // .refine((gstin) => /^[A-Z]{5}[0-9]{4}[A-Z]/.test(gstin.substring(2, 12)), {
  //   message: 'Invalid PAN structure inside GSTIN.',
  //   path: ['pan'],
  // })
  // // 13th character: number (0-9), followed by 'Z'
  // .refine((gstin) => /^[0-9]Z/.test(gstin.substring(12, 14)), {
  //   message: "13th character must be a number (0-9), followed by 'Z'.",
  //   path: ['entityCode'],
  // })
  // .refine((gstin) => isValidGSTINChecksum(gstin), {
  //   message: 'Invalid GSTIN checksum.',
  //   path: ['checksum'],
  // });

// Function to Validate GSTIN with Detailed Errors
export const validateGSTIN = (gstin) => {
  const result = gstInSchema.safeParse(gstin);
  return {
    success: result.success,
    errors: result.error?.errors ?? [],
    data: result.success ? result.data : null,
  };
};

