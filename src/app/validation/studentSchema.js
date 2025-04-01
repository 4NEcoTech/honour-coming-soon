import { z } from 'zod';

const studentSchema = z.object({
  // Institute number, required and should be a non-empty string
  HCJ_ST_InstituteNum: z.string().min(1),

  // Institution name, required and should be a non-empty string
  HCJ_ST_Institution_Name: z.string().min(1),

  // Student's first name, required and should be a non-empty string
  HCJ_ST_Student_First_Name: z.string().min(1),
  ID_About: z.string().max(100, 'Maximum 100 characters').optional(),
  // Student's last name, required and should be a non-empty string
  HCJ_ST_Student_Last_Name: z.string().min(1),

  // Educational email, required and must be a valid email format
  HCJ_ST_Educational_Email: z.string().email(),
  HCJ_ST_Educational_Alternate_Email: z
    .string()
    .email('Invalid email format')
    .optional(),

  // Phone number, required and should have a length between 10 to 15 characters
  HCJ_ST_Phone_Number: z.string().min(10).max(15), // Adjust min/max as needed
  HCJ_ST_Alternate_Phone_Number: z.string().min(10).max(15).optional(), // Adjust min/max as needed
  // Gender selection from predefined values
  HCJ_ST_Gender: z.enum(['01', '02', '03']),

  // Date of Birth, required and should follow YYYY-MM-DD format
  HCJ_ST_DOB: z.date({ required_error: 'Date of birth is required' }),

  // Country of the student, required
  HCJ_ST_Student_Country: z.string().min(1),

  // Pincode, required and should be exactly 6 characters (adjust as needed per country)
  HCJ_ST_Student_Pincode: z.string().length(6),

  // State of residence, required
  HCJ_ST_Student_State: z.string().min(1),

  // City of residence, required
  HCJ_ST_Student_City: z.string().min(1),

  // Address, required and should be a non-empty string
  HCJ_ST_Address: z.string().min(1),

  // Enrollment year, required, should be an integer between 1900 and the current year
  HCJ_ST_Enrollment_Year: z.union([z.string(), z.number()]),

  // Program name the student is enrolled in, required
  HCJ_ST_Student_Program_Name: z.string().min(1),

  // Score grade type selection from predefined values
  HCJ_ST_Score_Grade_Type: z.union([z.string(), z.number()]),
  // HCJ_ST_Score_Grade_Type: z.enum(['Percentage', 'CGPA', 'GPA', 'Other']),

  // Score or grade, can be either a string or a number
  HCJ_ST_Score_Grade: z.union([z.string(), z.number()]),

  // Student's domicile document, required
  HCJ_ST_Student_Document_Domicile: z.string().min(1),

  // Type of student document, required
  HCJ_ST_Student_Document_Type: z.string().min(1),

  // Student's document number, required
  HCJ_ST_Student_Document_Number: z.string().min(1),

  // Class year, required, should be an integer between 1900 and the current year
  HCJ_ST_Class_Of_Year: z.union([z.string(), z.number()]),

  // Branch or specialization of the student, required
  HCJ_ST_Student_Branch_Specialization: z.string().min(1),
});

export default studentSchema;

export const StudentProfileSchema = studentSchema.pick({
  HCJ_ST_Student_First_Name: true,
  HCJ_ST_Student_Last_Name: true,
  HCJ_ST_Educational_Email: true,
  HCJ_ST_Educational_Alternate_Email: true,
  HCJ_ST_Phone_Number: true,
  HCJ_ST_Alternate_Phone_Number: true,
  HCJ_ST_Gender: true,
  HCJ_ST_DOB: true,
  ID_About: true,
});

export const StudentAddressSchema = studentSchema.pick({
  HCJ_ST_Student_Country: true,
  HCJ_ST_Student_City: true,
  HCJ_ST_Student_Pincode: true,
  HCJ_ST_Student_State: true,
  HCJ_ST_Address: true,
});

export const StudentEducationSchema = studentSchema.pick({
  HCJ_ST_Institution_Name: true,
  HCJ_ST_Enrollment_Year: true,
  HCJ_ST_Student_Program_Name: true,
  HCJ_ST_Class_Of_Year: true,
  HCJ_ST_Student_Branch_Specialization: true,
  HCJ_ST_Score_Grade_Type: true,
  HCJ_ST_Score_Grade: true,
});
