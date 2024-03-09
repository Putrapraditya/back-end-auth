import mongoose, { Schema, Document } from 'mongoose';

export interface RoleDocument extends Document {
  rolename: string;
}

const roleSchema: Schema = new Schema({
  rolename: { type: String, required: true, unique: true },
});

const Role = mongoose.model<RoleDocument>('Role', roleSchema);

export default Role;
