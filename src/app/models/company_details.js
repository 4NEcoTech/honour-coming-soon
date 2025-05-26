import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';
import Counter from './counter';

const { Schema } = mongoose;

/**
 * Schema for Company Details.
 *
 * @typedef {Object} company_detailsSchema
 * @property {mongoose.Schema.Types.ObjectId} CD_Company_Id - Unique identifier for the company.
 * @property {Number} CD_Company_Num - Unique number assigned to the company.
 * @property {mongoose.Schema.Types.ObjectId} CD_Individual_Id - Reference to the individual who owns or manages the company.
 * @property {Number} CD_Individual_Num - Unique number assigned to the individual.
 * @property {Number} CD_Company_Establishment_Year - Year the company was established.
 * @property {String} CD_Company_Name - Official name of the company.
 * @property {String} CD_Company_Location - Address or location of the company.
 * @property {String} CD_Company_Email - Official email address of the company.
 * @property {String} CD_Company_Alternate_Email - Alternate email address for company communication.
 * @property {String} CD_Phone_Number - Primary phone number of the company.
 * @property {String} CD_Alternate_Phone_Number - Secondary/alternate phone number.
 * @property {Number} CD_Company_Size - Number of employees or company size category.
 * @property {String} CD_Company_Industry - Industry to which the company belongs.
 * @property {String} CD_Company_Industry_SubCategory - Specific subcategory within the industry.
 * @property {String} CD_Company_Website - URL of the company's official website.
 * @property {Buffer} CD_Company_Logo - Binary data for storing the company logo.
 * @property {Buffer} CD_Company_Cover_Profile - Binary data for storing the company cover profile image.
 * @property {String} CD_Company_About - A brief description of the company.
 * @property {String} CD_Company_Type - Type of company (e.g., Private, Public, Non-Profit).
 * @property {Number} CD_Session_Id - Identifier for the session in which the data was recorded.
 * @property {Date} CD_Created_DtTym - Date and time when the company record was created.
 * @property {Array.<AuditTrailSchema>} CD_Audit_Trail - Audit trail information for tracking changes.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const company_detailsSchema = new Schema(
  {
    //  CD_Company_Id: { type: mongoose.Schema.Types.ObjectId,  auto: true, },
    CD_Company_Num: { type: String, unique: true, required: false },
    CD_Individual_Id: {
      type: Schema.Types.ObjectId,
      ref: 'IndividualDetails',
      required: true,
    },
    CD_Company_Status : { type: String,  default: '02', enum: ['01', '02', '03'] },
    // CD_Individual_Num: { type: Number, required: true },
    CD_Company_Establishment_Year: { type: Number }, // Mandatory
    CD_Company_Name: { type: String, required: true },
    CD_Company_Location: { type: String, required: false }, // Mandatory
    CD_Company_Email: { type: String, required: true },
    CD_Company_Alternate_Email: { type: String },
    CD_Phone_Number: { type: String, required: true },
    CD_Alternate_Phone_Number: { type: String },
    CD_Company_Size: { type: Number }, // Mandatory
    CD_Company_Industry: { type: String }, // Mandatory
    CD_Company_Industry_SubCategory: { type: String }, // Mandatory
    CD_Company_Website: { type: String },
    CD_Company_Logo: { type: String },
    CD_Company_Cover_Profile: { type: String },
    CD_Company_Mission: { type: String, required: false },
    CD_Company_About: { type: String, required: false }, // Mandatory
    CD_Company_Type: { type: String },
    CD_Session_Id: { type: Number },
    CD_Created_DtTym: { type: Date, default: Date.now },
    CD_Audit_Trail: [AuditTrailSchema],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

company_detailsSchema.pre('save', async function (next) {
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

    this.CD_Company_Num = `${2}${String(this.userNumber).padStart(10, '0')}`;

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

export default mongoose.models.company_details ||
  mongoose.model('company_details', company_detailsSchema);
