import mongoose from "mongoose";

const HCJStaffInvalidSchema = new mongoose.Schema(
  {
    bulkImportId: { type: mongoose.Schema.Types.ObjectId, ref: "HCJBulkImport", required: true },
    
    CCP_Institute_Num: { type: String, required: false },
    CCP_Institute_Name: { type: String, required: false },
    CCP_Contact_Person_First_Name: { type: String, required: false },
    CCP_Contact_Person_Last_Name: { type: String, required: false },
    CCP_Contact_Person_Email: { type: String, required: false },
    CCP_Contact_Person_Phone: { type: String, required: false },
    CCP_Contact_Person_Gender: { type: String, required: false },
    CCP_Contact_Person_DOB: { type: Date, required: false },
    CCP_Contact_Person_Country: { type: String, required: false },
    CCP_Contact_Person_Pincode: { type: String, required: false },
    CCP_Contact_Person_State: { type: String, required: false },
    CCP_Contact_Person_City: { type: String, required: false },
    CCP_Contact_Person_Address_Line1: { type: String, required: false },
    CCP_Contact_Person_Joining_Year: { type: Number, required: false },
    CCP_Contact_Person_Department: { type: String, required: false },
    CCP_Contact_Person_Designation: { type: String, required: false },
    CCP_Contact_Person_Role: { type: String, required: false },
    CCP_Contact_Person_Document_Domicile: { type: String, required: false },
    CCP_Contact_Person_Document_Type: { type: String, required: false },
    CCP_Contact_Person_Document_Number: { type: String, required: false },
    CCP_Contact_Person_Document_Picture: { type: String, required: false },
    
    errorMessages: { type: [String], required: true }, // Stores multiple error reasons
    uploadedAt: { type: Date, default: Date.now }, // Timestamp of when the record was added
  },
  { collection: "company_contact_person_invalid" }
);

const HCJStaffInvalid =
  mongoose.models.HCJStaffInvalid ||
  mongoose.model("HCJStaffInvalid", HCJStaffInvalidSchema);

export default HCJStaffInvalid;
