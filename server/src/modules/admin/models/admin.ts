import mongoose, { Schema, Model } from "mongoose";
import { IAdmin } from "../types/admin";
import bcrypt from "bcryptjs";

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    bcrypt.hash(admin.password as string, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      admin.password = hash as string;
      next();
    });
  } else {
    next();
  }
});

adminSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch || false);
    });
  });
};

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>(
  "Admin",
  adminSchema,
  "admins"
);
