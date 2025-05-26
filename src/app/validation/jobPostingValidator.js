import * as z from 'zod';


const assessmentQuestionSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  isMandatory: z.boolean().default(false)
});

// Common validation schema for all opportunity types
const commonSchema = z.object({
  opportunityType: z.enum(['job', 'internship', 'project']),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  skillsRequired: z.array(z.string()).optional(),
  workMode: z.enum(['in-office', 'hybrid', 'remote']),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  additionalPreferences: z.string().optional(),
  assessmentQuestions: z.array(assessmentQuestionSchema).optional(),
  location: z.string().optional(),
  closingDate: z.string().optional(),
  salaryCurrency: z.string().optional(),
  salaryAmount: z.string().optional(),
  perks: z.array(z.string()).optional(),
  isEqualOpportunity: z.boolean().optional(),
  whoCanApply: z.array(z.string()).optional(),
  additionalRequirements: z.array(z.string()).optional(),
});

// Job specific validation
const jobSchema = z.object({
  duration: z.enum(['permanent', 'contract']),
  startDate: z.enum(['immediately', 'within-month', 'later']),
  numberOfOpenings: z.string().optional(),
});

// Internship specific validation
const internshipSchema = z.object({
  startDate: z.enum(['immediately', 'within-month', 'later']),
  durationValue: z.string().optional(),
  durationType: z.string().optional(),
  numberOfInterns: z.string().optional(),
  longTermPossibility: z.boolean().optional(),
});

// Project specific validation
const projectSchema = z.object({
  durationValue: z.string().optional(),
  durationType: z.string().optional(),
  numberOfInterns: z.string().optional(),
  longTermPossibility: z.boolean().optional(),
});

// Combined validation function
export function validateJobPosting(data) {
  const baseValidation = commonSchema.safeParse(data);
  if (!baseValidation.success) {
    return {
      valid: false,
      errors: baseValidation.error.errors,
    };
  }

  let specificValidation;
  switch (data.opportunityType) {
    case 'job':
      specificValidation = jobSchema.safeParse(data);
      break;
    case 'internship':
      specificValidation = internshipSchema.safeParse(data);
      break;
    case 'project':
      specificValidation = projectSchema.safeParse(data);
      break;
    default:
      return {
        valid: false,
        errors: [{ message: 'Invalid opportunity type' }],
      };
  }

  if (!specificValidation.success) {
    return {
      valid: false,
      errors: specificValidation.error.errors,
    };
  }

  // Additional custom validations
  const errors = [];

  // Validate duration for internships and projects
  if ((data.opportunityType === 'internship' || data.opportunityType === 'project') && 
      (!data.durationValue || !data.durationType)) {
    errors.push({ message: 'Duration is required for internships and projects' });
  }

  // Validate salary if amount is provided
  if (data.salaryAmount && !data.salaryCurrency) {
    errors.push({ message: 'Currency is required when specifying salary amount' });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
  };
}