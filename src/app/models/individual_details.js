import mongoose from 'mongoose';
import Counter from './counter';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;

/**
 * Schema definition for Individual Details.
 *
 * @typedef {Object} IndividualDetailsSchema
 * @property {String} ID_Individual_Id - Unique identifier for the individual.
 * @property {String} ID_User_Id - Foreign key reference to the user.
 * @property {Number} ID_Individual_Num - Auto-incremented unique number.
 * @property {String} ID_Profile_Picture - URL of the profile picture.
 * @property {String} ID_Cover_Photo - URL of the cover photo.
 * @property {String} ID_First_Name - First name of the individual (required).
 * @property {String} ID_Last_Name - Last name of the individual (required).
 * @property {String} ID_Phone - Primary phone number (required).
 * @property {String} ID_Alternate_Phone - Alternate phone number.
 * @property {String} ID_Email - Primary email (required, unique).
 * @property {String} ID_Alternate_Email - Alternate email.
 * @property {Date} ID_DOB - Date of birth.
 * @property {String} ID_Gender - Gender of the individual.
 * @property {String} ID_City - City of residence (required).
 * @property {String} ID_Individual_Role - Role of the individual (required).
 * @property {String} ID_Individual_Designation - Designation/title (required).
 * @property {String} ID_Profile_Headline - Profile headline (required).
 * @property {String} ID_About - About section (required).
 * @property {String} ID_Language - Preferred language (required).
 * @property {String} ID_Session_Id - Session ID associated with the user (required).
 * @property {Date} ID_Creation_DtTym - Timestamp when the record was created.
 * @property {Array.<AuditTrailSchema>} ID_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - Timestamp when the document was created.
 * @property {Date} updatedAt - Timestamp when the document was last updated.
 */

const individualDetailsSchema = new Schema(
  {
  //  ID_Individual_Id: { type: String }, // Auto-generated _id by MongoDB
  //  ID_User_Id: { type: String, required: true },
    ID_User_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  ID_Individual_Num: { type: String, required: false, unique: true },
    ID_Profile_Picture: { type: String },
    ID_Cover_Photo: { type: String },
    ID_First_Name: { type: String, required: true },
    ID_Last_Name: { type: String, required: false },
    ID_Phone: { type: String, required: true, unique: true },
    ID_Alternate_Phone: { type: String },
    ID_Email: { type: String, required: true, unique: true },
    ID_Alternate_Email: { type: String },
    ID_DOB: { type: Date, required: true  },
    ID_Gender: { type: String, enum: ['01', '02', '03'] },
    ID_City: { type: String, required: true },
    ID_Individual_Role: { type: String, required: true, enum:['01', '02', '03', '04', '05', '06', '07', '08', '09'] },
    ID_Individual_Designation: { type: String, required: false },
    ID_Profile_Headline: { type: String, required: false },
    ID_About: { type: String, required: false },
    ID_Language: { type: String, required: false },
    ID_Session_Id: { type: String, required: false},
    ID_Creation_DtTym: { type: Date, default: Date.now },
    ID_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);



individualDetailsSchema.pre('save', async function (next) {
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

    this.ID_Individual_Num = `${2}${String(this.userNumber).padStart(10, '0')}`;

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


export default mongoose.models.Individual_Details ||
  mongoose.model('Individual_Details', individualDetailsSchema);
