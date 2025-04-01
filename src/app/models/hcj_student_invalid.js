import mongoose from "mongoose";

const HCJStudentInvalidSchema = new mongoose.Schema(
  {
    bulkImportId: { type: mongoose.Schema.Types.ObjectId, ref: "HCJBulkImport", required: true }, // Linking to bulk import

    HCJ_ST_InstituteNum: { type: String, required: false },
    HCJ_ST_Institution_Name: { type: String, required: false },
    HCJ_ST_Student_First_Name: { type: String, required: false },
    HCJ_ST_Student_Last_Name: { type: String, required: false },
    HCJ_ST_Educational_Email: { type: String, required: false },
    HCJ_ST_Phone_Number: { type: String, required: false },
    HCJ_ST_Gender: { type: String, required: false },
    HCJ_ST_DOB: { type: Date, required: false },
    HCJ_ST_Student_Country: { type: String, required: false },
    HCJ_ST_Student_Pincode: { type: String, required: false },
    HCJ_ST_Student_State: { type: String, required: false },
    HCJ_ST_Student_City: { type: String, required: false },
    HCJ_ST_Address: { type: String, required: false },
    HCJ_ST_Enrollment_Year: { type: Number, required: false },
    HCJ_ST_Student_Program_Name: { type: String, required: false },
    HCJ_ST_Score_Grade_Type: { type: String, required: false },
    HCJ_ST_Score_Grade: { type: String, required: false },
    HCJ_ST_Student_Document_Domicile: { type: String, required: false },
    HCJ_ST_Student_Document_Type: { type: String, required: false },
    HCJ_ST_Student_Document_Number: { type: String, required: false },
    HCJ_ST_Class_Of_Year: { type: Number, required: false },
    HCJ_ST_Student_Branch_Specialization: { type: String, required: false },

    errorMessages: { type: [String], required: true }, // Stores multiple error reasons
    uploadedAt: { type: Date, default: Date.now }, // Timestamp of when the record was added
  },
  { collection: "hcj_student_invalid" }
);

const HCJStudentInvalid =
  mongoose.models.HCJStudentInvalid ||
  mongoose.model("HCJStudentInvalid", HCJStudentInvalidSchema);

export default HCJStudentInvalid;
