import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";


/**
 * Schema for HCJ Achievers Central.
 *
 * @typedef {Object} hcjAchieversCentralSchema
 * @property {String} HCJ_AC_Id - Unique identifier for the achiever.
 * @property {String} HCJ_AC_News_Shrt_Description - Short description of the news related to the achiever.
 * @property {Date} HCJ_AC_Publish_Dt - Date when the news was published.
 * @property {Date} HCJ_AC_Achievers_Event_Dt - Date of the event where the achiever was recognized.
 * @property {String} HCJ_AC_Achievers_Name - Name of the achiever.
 * @property {String} HCJ_AC_Achievers_Photo - URL of the achiever's photo.
 * @property {String} HCJ_AC_Achievers_Event_Name - Name of the event where the achiever was recognized.
 * @property {String} HCJ_AC_Achievers_Event_Description - Description of the event.
 * @property {String} HCJ_AC_Achievers_Award_Description - Description of the award received.
 * @property {String} HCJ_AC_College_Num - Unique identifier number of the college.
 * @property {String} HCJ_AC_College_Name - Name of the college.
 * @property {String} HCJ_AC_Achievers_Award_Img - URL of the award image.
 * @property {String} HCJ_AC_Achievers_Award_Addnl_Img - URL of additional images related to the award.
 * @property {String} HCJ_AC_Achievers_Award_Detail_Description - Detailed description of the award received.
 * @property {Date} HCJ_AC_Creation_DtTym - Date and time when the record was created.
 * @property {String} HCJ_AC_Session_Id - Identifier for the session during which the record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_AC_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const Schema = mongoose.Schema;

const hcjAchieversCentralSchema = new Schema(
  {
    HCJ_AC_News_Shrt_Description: { type: String, required: true },
    HCJ_AC_Status: { type: String, required: true, enum:['01', '02', '03'], default:'02', },        // 01 Verified, 02 Means Unverified, 03 Rejected
    HCJ_AC_Publish_Dt: { type: Date, required: true },
    HCJ_AC_Achievers_Event_Dt: { type: Date, required: true },
    HCJ_AC_Achievers_Name: { type: String, required: true },
    HCJ_AC_Achievers_Photo: { type: String, required: true },
    HCJ_AC_Achievers_Event_Name: { type: String, required: true },
    HCJ_AC_Achievers_Event_Description: { type: String, required: true },
    HCJ_AC_Achievers_Award_Description: { type: String },
    HCJ_AC_College_Num: { type: String },
    HCJ_AC_College_Name: { type: String, required: true },
    HCJ_AC_Achievers_Award_Img: { type: String, required: true },
    HCJ_AC_Achievers_Award_Addnl_Img: { type: String },
    HCJ_AC_Achievers_Award_Detail_Description: { type: String },
    HCJ_AC_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_AC_Session_Id: { type: String },
    HCJ_AC_Audit_Trail: [AuditTrailSchema],
  },
  { timestamps: true }
);

//  **Fix OverwriteModelError: Check if model exists before defining**
const HcjAchieversCentral =
  mongoose.models.hcj_achievers_central ||
  mongoose.model("hcj_achievers_central", hcjAchieversCentralSchema);

export default HcjAchieversCentral;
