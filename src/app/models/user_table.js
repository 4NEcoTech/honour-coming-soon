import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";
import Counter from "./counter";

const UserSchema = new mongoose.Schema(
  {
    UT_User_Id: { type: String, required: true, unique: true },

    UT_User_Num: { type: String, unique: true },

    //01 Active,
    // 02 Inactive,
    // 03 Dormant,
    // 04 Deactivated
    // 05 Deleted
    UT_User_Status: {
      type: String,
      default: "02",
      enum: ["01", "02", "03", "04", "05"],
    },
    // 01 Pending Authorization
    // 02 Verified
    // 03 Unverified"
    UT_User_Verification_Status: {
      type: String,
      enum: ["01", "02", "03", "04", "05"],
      default: "02",
    },

    UT_Product_Enabled: { type: String, default: "000001000" },

    // 01 Guest User
    // 02 SA - Admin
    // 03 SA - Team
    // 04 SA - Support
    // 05 Student
    // 06 In Admin
    // 07 In Team
    // 08 In Support
    // 09 Em Admin
    // 10 Em Team
    // 11 Em Support
    // 12 Job Seeker

    UT_User_Role: {
      type: String,
      enum: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ],
      default: "01",
    },

    // 01 Phone
    // 02 Email
    // 03 LinkedIn
    // 04 Voice
    // 05 Apple
    // 06 Meta
    // 07 Google
    UT_Login_Type: {
      type: String,
      enum: ["01", "02", "03", "04", "05", "06", "07"],
    },

    UT_Email: { type: String, unique: true, trim: true, lowercase: true },
    // 01 Pending Authorization
    // 02 Verified
    // 03 Unverified"
    UT_Email_Verified: {
      type: String,
      enum: ["01", "02", "03"],
      default: "03",
    },

    UT_Phone: { type: String, sparse: true },

    UT_LinkedIn_Id: { type: String },

    UT_Voice: { type: mongoose.Schema.Types.Mixed },

    UT_Apple: { type: String },

    UT_Meta: { type: String },

    UT_Google: { type: String },

    UT_Biometric_Id: { type: mongoose.Schema.Types.Mixed },

    UT_Password: { type: String, default: "" },

    UT_Terms_Conditions_Agreement: { type: Boolean, default: false },

    UT_Audit_Trail: [AuditTrailSchema],
  },
  {
    strict: false,
    timestamps: true,
  }
);
UserSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

UserSchema.pre("save", async function (next) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(this.UT_User_Id)) {
    this.UT_User_Id = this.UT_User_Id.toLowerCase().trim();
    this.UT_Email = this.UT_User_Id.toLowerCase().trim();
    this.UT_Phone = null;
  } else {
    this.UT_Phone = this.UT_User_Id;
    this.UT_Email = null;
  }
  // ✅ Conditional Check for Login Type
  const loginType = this.UT_Login_Type;
  if (loginType == 3 && !this.UT_LinkedIn_Id) {
    return next(new Error("UT_LinkedIn_Id is required for UT_Login_Type 03"));
  }
  if (loginType == 4 && !this.UT_Voice) {
    return next(new Error("UT_Voice is required for UT_Login_Type 04"));
  }
  if (loginType == 5 && !this.UT_Apple) {
    return next(new Error("UT_Apple is required for UT_Login_Type 05"));
  }
  if (loginType == 6 && !this.UT_Meta) {
    return next(new Error("UT_Meta is required for UT_Login_Type 06"));
  }
  if (loginType == 7 && !this.UT_Google) {
    return next(new Error("UT_Google is required for UT_Login_Type 07"));
  }
  if (loginType == 8 && !this.UT_Biometric_Id) {
    return next(new Error("UT_Biometric_Id is required for UT_Login_Type 08"));
  }

  next();
});

UserSchema.pre("save", async function (next) {
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
      "userCounter",
      { $inc: { seq: 1 } }, // Decrement by 1
      { new: true, upsert: true, session }
    );
    if (!counterDoc || counterDoc.seq <= 0) {
      throw new Error("Counter has reached its limit! Cannot assign new IDs.");
    }

    // Step 2: Format userNumber to be exactly 10 digits
    this.userNumber = counterDoc.seq;

    this.UT_User_Num = `${1}${String(this.userNumber).padStart(10, "0")}`;

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

// // ✅ Middleware: Auto-update UT_User_Num after deletion
// UserSchema.post('remove', async function (doc) {
//   const deletedUserNum = doc.UT_User_Num;

//   await mongoose
//     .model('user_table')
//     .updateMany(
//       { UT_User_Num: { $gt: deletedUserNum } },
//       { $inc: { UT_User_Num: -1 } }
//     );
// });

const User =
  mongoose.models.user_table || mongoose.model("user_table", UserSchema);

export default User;
