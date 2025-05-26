import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Follower Details.
 *
 * @typedef {Object} followersSchema
 * @property {String} F_SourceDtl - Source tag (CD_ or ID_ prefix to identify origin).
 * @property {mongoose.Schema.Types.ObjectId} F_Id - Entity being followed (could be from Company or Individual).
 * @property {mongoose.Schema.Types.ObjectId} F_Follower_Individual_Id - The individual who is following others.
 * @property {String} F_Followed_Individual_Type - Type of entity being followed: 01 = Company, 02 = Job Seeker, 03 = Institute, 04 = Group.
 * @property {Number} F_Session_Id - Session ID to track the action context.
 * @property {Date} F_Creation_DtTym - Timestamp of follow action.
 * @property {Array.<AuditTrailSchema>} F_Audit_Trail - Logs of actions performed.
 * @property {Date} createdAt - Auto timestamp (Mongoose).
 * @property {Date} updatedAt - Auto timestamp (Mongoose).
 */

const followersSchema = new mongoose.Schema(
  {
    F_SourceDtl: {
      type: String,
      required: true,
      // Example: "CD_60281" (Company Detail) or "ID_60661" (Individual Detail)
    },
    F_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Dynamic ref depending on type (optional: use refPath if needed)
    },
    F_Follower_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    F_Followed_Individual_Type: {
      type: String,
      enum: ["01", "02", "03", "04"], // 01 - Company, 02 - Job Seeker, 03 - Institute, 04 - Group
      required: true,
    },
    F_Session_Id: {
      type: Number,
      required: true,
    },
    F_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    F_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.followers ||
  mongoose.model("followers", followersSchema);
