// models/otp.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface OTPModel extends Document {
  email: string;
  otp: string;
  expiration: Date;
}

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiration: { type: Date, required: true }
});

export default mongoose.model<OTPModel>('OTP', otpSchema);
