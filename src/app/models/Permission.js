import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    resource: { type: String, required: true },
    action: { type: String, required: true },
    roles: { type: [String], required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "permissions" } // optional but recommended
);

// Fix: Check if model already exists before defining
export default mongoose.models?.Permission ||
  mongoose.model("Permission", PermissionSchema);
