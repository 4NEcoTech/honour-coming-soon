import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: [
      "superAdmin",
      "institutionAdmin",
      "institutionTeam",
      "studentVerified",
      "studentUnverified",
      "employerAdmin",
      "employerTeam",
      "jobSeeker",
      "guestUser"
    ],
    required: true,
    unique: true
  },
  permissions: {
    type: Map,
    of: Boolean, // True if the role has access, False otherwise
    default: {}
  }
});

export default mongoose.models.Permission || mongoose.model("Permission", PermissionSchema);
