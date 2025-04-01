import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * @typedef {Object} SocialProfileSchema
 * @property {mongoose.Schema.Types.ObjectId} SL_Social_Link_Id - Auto-generated unique identifier for the social profile.
 *@property {String} SL_Id - Unique identifier for the social link entry.
 *  @property {string} SL_Id_Source - Source identifier for the social link, must be one of ["01", "02", "03", "04"].
 * @property {String} SL_Product_Identifier - Identifies the product/service associated with the social link.
 * @property {String} SL_Individual_Role - Role of the individual associated with the social profile (e.g., Admin, User).
 * @property {String} SL_Social_Profile_Name - Custom name assigned to the social profile.
 * @property {String} SL_LinkedIn_Profile - LinkedIn profile URL.
 * @property {String} SL_Eco_Link - Eco-friendly or sustainability-related link.
 * @property {String} SL_Website_Url - Official website URL.
 * @property {String} SL_Instagram_Url - Instagram profile URL.
 * @property {String} SL_Facebook_Url - Facebook profile URL.
 * @property {String} SL_Twitter_Url - Twitter profile URL.
 * @property {String} SL_Pinterest_Url - Pinterest profile URL.
 * @property {String} SL_Custom_Url - Custom profile link.
 * @property {String} SL_Portfolio_Url - Portfolio or personal website URL.
 * @property {String} SL_Session_Id - Session ID to track changes in social profile data.
 * @property {Date} SL_Creation_DtTym - Timestamp when the social profile entry was created.
 * @property {Array.<AuditTrailSchema>} SL_Audit_Trail - Array of audit trail records for tracking modifications.
 * @property {Date} createdAt - Auto-generated timestamp for document creation.
 * @property {Date} updatedAt - Auto-generated timestamp for last update.
 */

const SocialProfileSchema = new mongoose.Schema(
  {
    SL_Id: {
     type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'IndividualDetails',
    },
    // 01 Individual 02 Company 03 T-shirt 04 Others
    SL_Id_Source: {
      type: String,
      required: true,
      default: '04',
      enum: ['01', '02', '03', '04'],
    },
    SL_Product_Identifier: {
      type: String,
      required: false,
    },
    SL_Individual_Role: {
      type: String,
      required: false,
    },
    SL_Social_Profile_Name: {
      type: String,
      required: false,
    },
    SL_LinkedIn_Profile: {
      type: String,
      required: false,
    },
    SL_Eco_Link: {
      type: String,
      required: false,
    },
    SL_Website_Url: {
      type: String,
      required: false,
    },
    SL_Instagram_Url: {
      type: String,
      required: false,
    },
    SL_Facebook_Url: {
      type: String,
      required: false,
    },
    SL_Twitter_Url: {
      type: String,
      required: false,
    },
    SL_Pinterest_Url: {
      type: String,
      required: false,
    },
    SL_Custom_Url: {
      type: String,
      required: false,
    },
    SL_Portfolio_Url: {
      type: String,
      required: false,
    },
    SL_Session_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: false,
    },
    SL_Audit_Trail: [AuditTrailSchema],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default mongoose.models.social_link ||
  mongoose.model('social_link', SocialProfileSchema);
