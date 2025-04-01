import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * @typedef {Object} IndividualEducationSchema
 * @property {mongoose.Schema.Types.ObjectId} IE_Education_Id - Auto-generated unique identifier for the education entry.
 * @property {mongoose.Schema.Types.ObjectId} IE_Individual_Id - Foreign key reference to the IndividualDetails schema.
 * @property {String} IE_Institute_Name - Name of the educational institute. Required.
 * @property {String} IE_Program_Name - Name of the academic program. Required.
 * @property {String} IE_Specialization - Specialization field of the program. Required.
 * @property {Date} IE_Start_Date - Start date of the academic program.
 * @property {Date} IE_End_Date - End date of the academic program.
 * @property {String} IE_Program_Status - Program completion status (Ongoing/Completed).
 * @property {String} IE_Year - Year of graduation or completion.
 * @property {String} IE_Score_Grades - Score or grade achieved.
 * @property {Number} IE_Score_Grades_Value - Numeric value of the score/grade.
 * @property {String} IE_Session_Id - Session ID to track user session.
 * @property {Date} IE_Creation_DtTym - Timestamp when the education entry was created.
 * @property {Array.<AuditTrailSchema>} IE_Audit_Trail - Array of audit trail records for tracking modifications.
 * @property {Date} createdAt - Auto-generated timestamp for document creation.
 * @property {Date} updatedAt - Auto-generated timestamp for last update.
 */

const IndividualEducationSchema = new mongoose.Schema(
  {
   // IE_Education_Id: { type: mongoose.Schema.Types.ObjectId, auto: true, },
    IE_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'IndividualDetails', // Reference to IndividualDetails schema
    },
    IE_Institute_Name: {
      type: String,
      required: true, // Mandatory field
    },
    IE_Program_Name: {
      type: String,
      required: true, // Mandatory field
    },
    IE_Specialization: {
      type: String,
      required: true, // Mandatory field
    },
    IE_Start_Date: {
      type: Date,
      required: false,
    },
    IE_End_Date: {
      type: Date,
      required: false,
    },
    IE_Program_Status: {
      type: String,
      //  enum: ["Ongoing", "Completed"],
      enum: ['01', '02', '03'],
      required: false,
    },
    IE_Year: {
      type: String,
      required: false,
    },
    IE_Score_Grades: {
      type: String,
      required: false,
    },
    IE_Score_Grades_Value: {
      type: Number,
      required: false,
    },
    IE_Session_Id: {
      type: String,
      required: false,
    },
    IE_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const IndividualEducation =
  mongoose.models.Individual_Education ||
  mongoose.model("Individual_Education", IndividualEducationSchema);

export default IndividualEducation;
