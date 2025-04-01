import mongoose from "mongoose";

export const AuditTrailSchema = new mongoose.Schema({
  ipAddress: { type: String, default: "Unknown" },
  os: { type: String, default: "Unknown" },
  browser: { type: String, default: "Unknown" },
  device: { type: String, default: "Unknown" },
  location: {
    timezone: { type: String, default: "Unknown" },
    isp: { type: String, default: "Unknown" },
    lon: { type: Number, default: 0 },
    lat: { type: Number, default: 0 },
    zip: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
    country: { type: String, default: "Unknown" },
  },
});