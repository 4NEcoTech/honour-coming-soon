import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Admin Details.
 *
 * @typedef {Object} HcjAdminDetailsSchema
 * @property {String} HCJ_AD_Admin_Id - The unique ID of the admin.
 * @property {String} HCJ_AD_First_Name - The first name of the admin.
 * @property {String} HCJ_AD_Last_Name - The last name of the admin.
 * @property {String} HCJ_AD_Email - The email address of the admin.
 * @property {Date} HCJ_AD_Registration_DtTym - The date and time of admin registration.
 * @property {String} HCJ_AD_Role - The role of the admin.
 * @property {String} HCJ_AD_Role_Id - The role ID of the admin.
 * @property {String[]} HCJ_AD_Permissions - The permissions assigned to the admin.
 * @property {Date} HCJ_AD_RoleCreation_DtTym - The date and time when the role was created.
 * @property {Date} HCJ_AD_Updation_DtTym - The last update date and time of the admin record.
 * @property {String} HCJ_AD_Session_Id - The session ID of the admin.
 * @property {Date} HCJ_AD_Creation_DtTym - The date and time when the admin record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_AD_Audit_Trail - The audit trail of the admin's actions.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const hcjAdminDetailsSchema = new Schema(
  {
  //  HCJ_AD_Admin_Id: { type: String, required: true, unique: true },
    HCJ_AD_First_Name: { type: String, required: true },
    HCJ_AD_Last_Name: { type: String, required: true },
    HCJ_AD_Email: { type: String, required: true, unique: true },
    HCJ_AD_Registration_DtTym: { type: Date, default: Date.now },
    HCJ_AD_Role: { type: String, required: true },
    HCJ_AD_Role_Id: { type: String, required: true },
    HCJ_AD_Permissions: { type: [String], default: [] },
    HCJ_AD_RoleCreation_DtTym: { type: Date, default: Date.now },
    HCJ_AD_Updation_DtTym: { type: Date, default: Date.now },
    HCJ_AD_Session_Id: { type: String },
    HCJ_AD_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_AD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjAdminDetails =
  mongoose.models.hcj_admin_details ||
  mongoose.model('hcj_admin_details', hcjAdminDetailsSchema);

export default HcjAdminDetails;
