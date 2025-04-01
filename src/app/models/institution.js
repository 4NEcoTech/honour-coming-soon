import mongoose from "mongoose";

const InstitutionSchema = new mongoose.Schema(
  {
    Category: String,
    AISHE_Code: String,
    Institute_Name: String,
    Name_of_Affiliated_University: String,
    Type_of_Institute: String,
    State: String,
    District: String,
    Status: String,
  },
  { collection: "institution_dtls" } // Specify existing collection
);

// Ensure model is not recompiled every request
export default mongoose.models.Institution || mongoose.model("Institution", InstitutionSchema);
