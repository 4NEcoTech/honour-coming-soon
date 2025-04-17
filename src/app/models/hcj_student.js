import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";
import Counter from "./counter";

/**
 * Schema definition for HCJ Student.
 *
 * @typedef {Object} hcjStudentSchema
 * @property {String} HCJ_ST_Student_Id - Unique identifier for the student.
 * @property {String} HCJ_ST_Individual_Id - Unique identifier for the individual associated with the student.
 * @property {String} HCJ_ST_Student_Num - Unique student number assigned to the student.
 * @property {String} HCJ_ST_InstituteNum - Identifier of the institution the student belongs to.
 * @property {String} HCJ_ST_Institution_Name - Name of the educational institution.
 * @property {String} HCJ_ST_Student_Country - Country where the student resides.
 * @property {String} HCJ_ST_Student_Pincode - Postal code of the student’s address.
 * @property {String} HCJ_ST_Student_State - State or province where the student resides.
 * @property {String} HCJ_ST_Student_City - City where the student resides.
 * @property {String} HCJ_ST_Address - Full address of the student.
 * @property {String} HCJ_ST_Student_Document_Domicile - Type of domicile document provided by the student.
 * @property {String} HCJ_ST_Student_Document_Type - Type of identification document submitted.
 * @property {String} HCJ_ST_Student_Document_Number - Number of the identification document.
 * @property {String} HCJ_Student_Documents_Image - Image of the student’s documents.
 * @property {String} HCJ_ST_Student_First_Name - First name of the student.
 * @property {String} HCJ_ST_Student_Last_Name - Last name of the student.
 * @property {String} HCJ_ST_Educational_Email - Official email address provided by the educational institution.
 * @property {String} HCJ_ST_Educational_Alternate_Email - Alternate email address provided by the student.
 * @property {String} HCJ_ST_Phone_Number - Primary contact number of the student.
 * @property {String} HCJ_ST_Alternate_Phone_Number - Alternate contact number of the student.
 * @property {String} HCJ_ST_Student_Branch_Specialization - Student's area of specialization or branch of study.
 * @property {String} HCJ_ST_Student_Program_Name - Name of the educational program enrolled in.
 * @property {String} HCJ_ST_Enrollment_Year - Year the student enrolled in the program.
 * @property {String} HCJ_ST_Current_Year - Current year of study.
 * @property {String} HCJ_ST_Student_Graduation_Year - Expected year of graduation.
 * @property {String} HCJ_ST_Score_Grade_Type - Type of grading system used (e.g., GPA, Percentage).
 * @property {String} HCJ_ST_Score_Grade - Grade or score obtained by the student.
 * @property {String} HCJ_ST_Resume_Upload - Uploaded resume or CV of the student.
 * @property {String} HCJ_ST_Preferred_Work_location - Preferred location where the student wishes to work.
 * @property {Date} HCJ_ST_DOB - Date of birth of the student.
 * @property {String} HCJ_ST_Gender - Gender of the student.
 * @property {String} HCJ_ST_Class_Of_Year - Year of graduation or class year of the student.
 * @property {Boolean} HCJ_ST_Seeking_Internship - Indicates whether the student is seeking an internship.
 * @property {String} HCJ_ST_Session_Id - Identifier of the session in which the student is currently enrolled.
 * @property {Date} HCJ_ST_Creation_DtTym - The timestamp when the record was created.
 * @property {AuditTrailSchema[]} HCJ_ST_Audit_Trail - The audit trail information.
 * @property {Date} createdAt - The timestamp when the record was created.
 * @property {Date} updatedAt - The timestamp when the record was last updated.
 */

const HCJStudentSchema = new mongoose.Schema(
  {
  //  HCJ_ST_Student_Id: { type: String, unique: true },
    bulkImportId: { type: mongoose.Schema.Types.ObjectId, ref: "HCJBulkImport", required: false },
    HCJ_ST_Individual_Id: { type: mongoose.Schema.Types.ObjectId, ref: "IndividualDetails", required: false, default: null},
    HCJ_ST_Student_Num: { type: String,  required: false },
    HCJ_ST_InstituteNum: { type: String, required: true },
    HCJ_ST_Institution_Name: { type: String, required: true },
    HCJ_ST_Student_Country: { type: String, required: true },
    HCJ_ST_Student_Pincode: { type: String, required: true },
    HCJ_ST_Student_State: { type: String, required: true },
    HCJ_ST_Student_City: { type: String, required: true },
    HCJ_ST_Address: { type: String, required: true }, //  Added this attribute
    HCJ_ST_Student_Document_Domicile: { type: String, required: true },
    HCJ_ST_Student_Document_Type: { type: String, required: true },
    HCJ_ST_Student_Document_Number: { type: String, required: true },
    HCJ_Student_Documents_Image: { type: String },
    HCJ_ST_Student_First_Name: { type: String, required: true },
    HCJ_ST_Student_Last_Name: { type: String, required: true },
    HCJ_ST_Educational_Email: { type: String, required: true, unique: true },
    HCJ_ST_Educational_Alternate_Email: { type: String },
    HCJ_ST_Phone_Number: { type: String, required: true },
    HCJ_ST_Alternate_Phone_Number: { type: String },
    HCJ_ST_Student_Branch_Specialization: { type: String, required: true },
    HCJ_ST_Student_Program_Name: { type: String, required: true },
    HCJ_ST_Enrollment_Year: { type: String, required: true },
    HCJ_ST_Current_Year: { type: String },
    HCJ_ST_Student_Graduation_Year: { type: String },
    HCJ_ST_Score_Grade_Type: { type: String, required: true },
    HCJ_ST_Score_Grade: { type: String, required: true },
    HCJ_ST_Resume_Upload: { type: String },
    HCJ_ST_Preferred_Work_location: { type: String },
    HCJ_ST_DOB: { type: Date, required: true },
    HCJ_ST_Gender: { type: String,  enum: ["01", "02", "03"], required: true },
    HCJ_ST_Class_Of_Year: { type: String, required: true },
    HCJ_ST_Seeking_Internship: { type: Boolean, default: false },
    HCJ_ST_Session_Id: { type: String },
    HCJ_ST_Audit_Trail: [AuditTrailSchema],
    signupToken: { type: String },
  },
  {
    timestamps: true,
  }
);

HCJStudentSchema.pre("save", async function (next) {
  if (!this.HCJ_ST_Student_Id) {
    const count = await mongoose.models.hcj_student.countDocuments();
    this.HCJ_ST_Student_Id = `ST${String(count + 1).padStart(6, "0")}`;
  }
  next();
});



HCJStudentSchema.pre('save', async function (next) {
  if (!this.isNew) return next(); // Only assign ID on new documents

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Decrement the counter atomically
    /**
     * Updates the counter document with the specified ID by incrementing its sequence value.
     * If the document does not exist, it will be created (upsert).
     *
     * @constant {Object} counterDoc - The updated counter document.
     * @async
     * @function
     * @param {string} id - The ID of the counter document to update ('userCounter').
     * @param {Object} update - The update operation to perform ({ $inc: { seq: 1 } }).
     * @param {Object} options - Additional options for the operation.
     * @param {boolean} options.new - Returns the updated document if true.
     * @param {boolean} options.upsert - Creates the document if it does not exist.
     * @param {Object} options.session - The session to use for the operation.
     * @returns {Promise<Object>} The updated or newly created counter document.
     */
    const counterDoc = await Counter.findByIdAndUpdate(
      'userCounter',
      { $inc: { seq: 1 } }, // Decrement by 1
      { new: true, upsert: true, session }
    );
    if (!counterDoc || counterDoc.seq <= 0) {
      throw new Error('Counter has reached its limit! Cannot assign new IDs.');
    }

    // Step 2: Format userNumber to be exactly 10 digits
    this.userNumber = counterDoc.seq;

    this.HCJ_ST_Student_Num = `${2}${String(this.userNumber).padStart(
      10,
      '0'
    )}`;

    // console.log('UT_User_Num:', String(this.userNumber).padStart(10, '0'));
    // console.log('UT_User_Num:', this.UT_User_Num);

    // Step 4: Commit the transaction
    await session.commitTransaction();
    session.endSession();
    next();
  } catch (err) {
    await session.abortTransaction(); //  Rollback on error
    session.endSession();
    next(err);
  }
});

export default mongoose.models.hcj_student || mongoose.model('hcj_student', HCJStudentSchema);
