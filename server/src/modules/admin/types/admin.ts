import mongoose from "mongoose";

export interface IAdmin {
  name: string;
  sessionId: mongoose.Types.ObjectId | string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}
