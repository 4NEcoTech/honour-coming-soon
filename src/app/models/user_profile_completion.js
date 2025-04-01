import mongoose from "mongoose";

const UserProfileCompletionSchema = new mongoose.Schema(
  {
    UPC_User_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_table",
      required: true,
      unique: true,
    },
    UPC_Profile_Completed: { type: Boolean, default: false }, // Overall completion
    UPC_StudentProfile: { type: Boolean, default: false }, // Student completion
    UPC_InstitutionAdminProfile: { type: Boolean, default: false }, // Institution Admin completion
    UPC_EducationDetails: { type: Boolean, default: false }, // Education details
    UPC_EmployerProfile: { type: Boolean, default: false }, // Employer completion
    UPC_JobSeekerProfile: { type: Boolean, default: false }, // Job Seeker completion
  },
  { timestamps: true }
);

export default mongoose.models.user_profile_completion ||
  mongoose.model("user_profile_completion", UserProfileCompletionSchema);
