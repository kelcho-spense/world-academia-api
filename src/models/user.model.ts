import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string; // 'user', 'admin', or 'shared'
  isApproved: boolean;
  approvedBy?: mongoose.Schema.Types.ObjectId; // Reference to the admin who approved the user
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "shared"], default: "user" },
  isApproved: { type: Boolean, default: false }, // Not approved by default
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to an admin
});

// Hash password before saving the user
UserSchema.pre<IUser>("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error:any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
