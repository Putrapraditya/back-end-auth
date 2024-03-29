import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  googleId?: string;
  roles: string[];
  verified: boolean; // New field for verification status
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  googleId: String,
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  verified: { type: Boolean, default: false }, // Default to unverified
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  description: String,
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
