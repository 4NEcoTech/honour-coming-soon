import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for mapping job contact persons in the HCJ application.
 *
 * @typedef {Object} hcjJobContactPersonMappingSchema
 * @property {String} HCJ_JCPM_Job_Contact_Person_Mapping_Id - Unique identifier for the job contact person mapping.
 * @property {Schema.Types.ObjectId} HCJ_JCPM_Company_Id - Reference to the company details.
 * @property {Schema.Types.ObjectId} HCJ_JCPM_Employee_Id - Reference to the employee.
 * @property {Schema.Types.ObjectId} HCJ_JCPM_Job_Id - Reference to the job.
 * @property {Schema.Types.ObjectId} HCJ_JCPM_Session_Id - Reference to the session.
 * @property {Date} HCJ_JCPM_Creation_DtTym - The timestamp when the record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_JCPM_Audit_Trail - Array of audit trail entries.
 * @property {Date} createdAt - Timestamp indicating when the document was created.
 * @property {Date} updatedAt - Timestamp indicating when the document was last updated.
 */

const hcjJobContactPersonMappingSchema = new Schema(
  {
  //  HCJ_JCPM_Job_Contact_Person_Mapping_Id: { type: String,},
    HCJ_JCPM_Company_Id: {
      type: Schema.Types.ObjectId,
      ref: 'company_details',
      required: true,
    },
    HCJ_JCPM_Employee_Id: {
      type: Schema.Types.ObjectId,
      ref: 'IndividualDetails', // Reference to the Employee schema (to be added later)
      required: true,
    },
    HCJ_JCPM_Job_Id: {
      type: Schema.Types.ObjectId,
      ref: 'hcj_job_applications',
      required: true,
    },
    HCJ_JCPM_Session_Id: {
     type: String, 
     required: false,
     default: Date.now,
    },
    HCJ_JCPM_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_JCPM_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HCJJobContactPersonMapping =
  mongoose.models.hcj_job_contact_person_mapping ||
  mongoose.model('hcj_job_contact_person_mapping', hcjJobContactPersonMappingSchema);

export default HCJJobContactPersonMapping;
