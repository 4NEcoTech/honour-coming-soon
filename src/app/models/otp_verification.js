import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
  OV_User_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  OV_Email: { type: String, required: true },
  OV_OTP: { type: Number, required: true },
  OV_OTP_Expiry: { type: Date, required: true },
  OV_Resend_Count: { type: Number, default: 0 },
  OV_Created_At: { type: Date, default: Date.now },
  OV_Updated_At: { type: Date, default: Date.now }
}, { collection: 'otp_verification' });

otpVerificationSchema.index({ OV_Email: 1 });
otpVerificationSchema.index({ OV_User_Id: 1 });

const OTPVerification = mongoose.models.OTPVerification || mongoose.model('OTPVerification', otpVerificationSchema);

export default OTPVerification;