import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Search Activity Logs.
 *
 * @typedef {Object} searchSchema
 * @property {mongoose.Schema.Types.ObjectId} S_Individual_Id - FK to the individual performing the search (or default guest user).
 * @property {String} S_Search_Query - The text string entered by the user in the search bar.
 * @property {Number} S_Results_Count - Number of results returned for this search.
 * @property {String} S_User_Location - (Optional) Approx. location of the user during search.
 * @property {String} S_Device_Info - (Optional) User device used (e.g., "Mobile", "Desktop").
 * @property {Boolean} S_Frequently_Searched - Indicates if the query is a frequently repeated one.
 * @property {Number} S_Session_Id - Session identifier for audit or tracking.
 * @property {Date} S_Search_DateTime - Date and time of the search.
 * @property {Array.<AuditTrailSchema>} S_Audit_Trail - Array of logs for tracking technical changes or triggers.
 * @property {Date} createdAt - Mongoose auto timestamp.
 * @property {Date} updatedAt - Mongoose auto timestamp.
 */

const searchSchema = new mongoose.Schema(
  {
    S_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    S_Search_Query: {
      type: String,
      required: true,
    },
    S_Results_Count: {
      type: Number,
      required: true,
    },
    S_User_Location: {
      type: String,
      default: null,
    },
    S_Device_Info: {
      type: String,
      default: null,
    },
    S_Frequently_Searched: {
      type: Boolean,
      default: false,
    },
    S_Session_Id: {
      type: Number,
      required: true,
    },
    S_Search_DateTime: {
      type: Date,
      default: Date.now,
    },
    S_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.search || mongoose.model("search", searchSchema);
