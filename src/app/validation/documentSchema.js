import * as z from "zod";

// Validation Rules for Each Document Type

export const validationSchemas = (t) => ({
  aadhaar: z.string().regex(/^\d{12}$/, {
    message: t("6024_25"), // Instead of hardcoded message
  }),
  voter_id: z.string().regex(/^[A-Z]{3}\d{7}$/, {
    message: t("6024_29"),
  }),
  passport: z.string().regex(/^[A-Z]\d{7}$/, {
    message: t("6024_27"),
  }),
  pan_card: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, {
    message: t("6024_26"),
  }),
  driving_license: z.string().regex(/^[A-Z]{2}\d{2}\s\d{11}$/, {
    message: t("6024_28"),
  }),
});

// Main Schema
export const DocumentSchema = (t) =>
  z
    .object({
      domicile: z.string().min(1, "Please select a country."),
      documentType: z.string().min(1, "Please select a document type."),
      documentNumber: z.string().min(1, "Document number is required."),
      uploadPhoto: z
        .any()
        .refine((file) => file instanceof File, "File is required")
        .refine(
          (file) => file?.size <= 2 * 1024 * 1024,
          "Max file size is 2MB."
        )
        .refine(
          (file) =>
            [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "application/pdf",
            ].includes(file?.type),
          "Only JPG, PNG, and PDF are allowed."
        ),
    })
    .superRefine((data, ctx) => {
      const { documentType, documentNumber } = data;
      const Schemas = validationSchemas(t); // pass translator
      // Ensure a validation schema exists for the selected document type
      if (Schemas[documentType]) {
        const result = Schemas[documentType].safeParse(documentNumber);
        if (!result.success) {
          ctx.addIssue({
            path: ["documentNumber"],
            message: result.error.errors[0].message,
          });
        }
      }
    });
