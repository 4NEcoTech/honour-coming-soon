import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Admin Logs.
 *
 * @typedef {Object} hcjAdminLogsSchema
 * @property {String} HCJ_AL_Log_Id - The unique ID of the admin log.
 * @property {String} HCJ_AL_Admin_Id - The ID of the admin.
 * @property {String} HCJ_AL_Action - The action performed by the admin.
 * @property {String} HCJ_AL_IP_Address - The IP address from which the action was performed.
 * @property {String} HCJ_AL_Comments - Additional comments regarding the action.
 * @property {String} HCJ_AL_Session_Id - The session ID during which the action was performed.
 * @property {Date} HCJ_AL_Creation_DtTym - The date and time when the log entry was created.
 * @property {Array.<AuditTrailSchema>} HCJ_AL_Audit_Trail - The audit trail for the admin log.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const hcjAdminLogsSchema = new Schema(
  {
  //  HCJ_AL_Log_Id: { type: String, required: true,  unique: true,},
    HCJ_AL_Admin_Id: {
      type: String,
      required: true,
    },
    HCJ_AL_Action: {
      type: String,
      required: true,
    },
    HCJ_AL_IP_Address: {
      type: String,
      required: true,
    },
    HCJ_AL_Comments: {
      type: String,
    },
    HCJ_AL_Session_Id: {
      type: String,
      required: true,
    },
    HCJ_AL_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_AL_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjAdminLogs =
  mongoose.models.hcj_admin_logs ||
  mongoose.model('hcj_admin_logs', hcjAdminLogsSchema);

export default HcjAdminLogs;
