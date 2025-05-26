import { z } from "zod";

export const getCompanyDocumentSchema = (t) =>
  z.discriminatedUnion("institutionType", [
    z.object({
      institutionType: z.literal("College"),
      aisheCode: z.string().min(1, t("6031_1")),
      collegeName: z.string().min(1, t("6031_2")),
      affiliatedUniversity: z.string().min(1, t("6031_3")),
      universityName: z.string().optional(),
      universityType: z.string().optional(),
      taxId: z.string().trim().length(15, t("6031_4")),
      companyRegistrationNumber: z.string().min(1, t("6031_5")),
    }),
    z.object({
      institutionType: z.literal("University"),
      aisheCode: z.string().min(1, t("6031_1")),
      collegeName: z.string().optional(),
      affiliatedUniversity: z.string().optional(),
      universityName: z.string().min(1, t("6031_6")),
      universityType: z.string().min(1, t("6031_7")),
      taxId: z.string().trim().length(15, t("6031_4")),
      companyRegistrationNumber: z.string().min(1, t("6031_5")),
    }),
  ]);
