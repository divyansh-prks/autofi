import mongoose, { Document, Schema } from 'mongoose';

// User model for YouTube content automation
export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    }
  },

  {
    timestamps: true
  }
);

// Create indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Export the model (handles existing model issue in development)
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
