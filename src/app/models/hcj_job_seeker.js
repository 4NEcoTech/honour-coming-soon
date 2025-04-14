import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * Schema definition for HCJ_JOB_SEEKER.
 *
 * @typedef {Object} hcjJobSeekerSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JS_Job_Seeker_Id - The ID of the job seeker.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JS_Individual_Id - The ID of the individual.
 * @property {String} HCJ_JS_Location_City - City of residence.
 * @property {String} HCJ_JS_Location_State - State of residence.
 * @property {String} HCJ_JS_Location_Country - Country of residence.
 * @property {String} HCJ_JS_Preferred_Work_Location - Preferred work location.
 * @property {String} HCJ_JS_Profile_Picture - Profile picture URL.
 * @property {String} HCJ_JS_Current_Company - Name of the current company.
 * @property {String} HCJ_JS_Last_Company - Name of the last company.
 * @property {String} HCJ_JS_Designation - Current job title.
 * @property {String} HCJ_JS_Profile_HeadIine - Profile headline.
 * @property {String} HCJ_JS_Profile_Summary - Profile summary.
 * @property {Boolean} HCJ_JS_Flexible_Work_Hours - Whether flexible work hours are preferred.
 * @property {String} HCJ_JS_Industry - Industry of expertise.
 * @property {String} HCJ_JS_Institution_Name - Name of the educational institution.
 * @property {String} HCJ_JS_Student_Branch_Specialization - Branch or specialization in education.
 * @property {String} HCJ_JS_Student_Program_Name - Name of the program enrolled.
 * @property {Number} HCJ_JS_Enrollment_Year - Enrollment year.
 * @property {Number} HCJ_JS_Current_Year - Current academic year.
 * @property {Number} HCJ_JS_Student_Graduation_Year - Expected graduation year.
 * @property {String} HCJ_JS_Score_Grade_Type - Type of score grading (e.g., CGPA, Percentage).
 * @property {Number} HCJ_JS_Score_Grade - Score or grade obtained.
 * @property {String} HCJ_JS_Resume_Upload - Resume upload URL.
 * @property {Number} HCJ_JS_Class_Of_Year - Class of graduation year.
 * @property {Boolean} HCJ_JS_Seeking_Internship - Whether the job seeker is looking for an internship.
 * @property {String} HCJ_JS_Session_Id - Session ID.
 * @property {Date} HCJ_JS_Creation_DtTym - Creation timestamp.
 * @property {AuditTrailSchema[]} HCJ_JS_Audit_Trail - Array of audit trail records.
 * @property {Date} createdAt - Timestamp when the document was created.
 * @property {Date} updatedAt - Timestamp when the document was last updated.
 */
const hcjJobSeekerSchema = new mongoose.Schema(
  {
    //   HCJ_JS_Job_Seeker_Id: {  type: mongoose.Schema.Types.ObjectId,  required: true, ref: "JobSeeker",},
    HCJ_JS_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'IndividualDetails',
    },
    HCJ_JS_Location_City: { type: String, required: true, trim: true },
    HCJ_JS_Location_State: { type: String, required: true, trim: true },
    HCJ_JS_Location_Country: { type: String, required: true, trim: true },
    HCJ_JS_Preferred_Work_Location: {
      type: String,
      required: false,
      trim: true,
    },
    HCJ_JS_Profile_Picture: { type: String, required: false },
    HCJ_JS_Current_Company: { type: String, required: false, trim: true }, //
    HCJ_JS_Last_Company: { type: String, required: false, trim: true }, //
    HCJ_JS_Designation: { type: String, required: false, trim: true }, //
    HCJ_JS_Profile_HeadIine: { type: String, required: false, trim: true },
    HCJ_JS_Profile_Summary: { type: String, required: false, trim: true }, //
    HCJ_JS_Flexible_Work_Hours: { type: Boolean, required: false }, //
    HCJ_JS_Industry: { type: String, required: false, trim: true }, //
    HCJ_JS_Institution_Name: { type: String, required: true, trim: true },
    HCJ_JS_Student_Branch_Specialization: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JS_Student_Program_Name: { type: String, required: true, trim: true },
    HCJ_JS_Enrollment_Year: { type: Number, required: false },
    HCJ_JS_Current_Year: { type: Number, required: false },
    HCJ_JS_Student_Graduation_Year: { type: Number, required: false},
    HCJ_JS_Score_Grade_Type: { type: String, required: false, trim: true },
    HCJ_JS_Score_Grade: { type: Number, required: false },
    HCJ_JS_Resume_Upload: { type: String, required: false },
    HCJ_JS_Class_Of_Year: { type: Number, required: false }, //
    HCJ_JS_Seeking_Internship: { type: Boolean, required: false }, //
    HCJ_JS_Session_Id: { type: String, required: false }, //
    HCJ_JS_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JS_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Hcj_Job_Seeker =
  mongoose.models.Hcj_Job_Seeker ||
  mongoose.model('Hcj_Job_Seeker', hcjJobSeekerSchema);

export default Hcj_Job_Seeker;
