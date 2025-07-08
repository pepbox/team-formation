import mongoose from "mongoose";
import { Admin } from "../models/admin";

export default class AdminServices {
  private session?: mongoose.ClientSession;

  constructor(session?: mongoose.ClientSession) {
    this.session = session;
  }

  // Static methods for backward compatibility
  static async createAdmin({
    sessionId,
    password,
    name,
  }: {
    sessionId: string;
    password: string;
    name: string;
  }) {
    const service = new AdminServices();
    return service.createAdmin({ sessionId, password, name });
  }

  static async loginAdmin({
    sessionId,
    password,
  }: {
    sessionId: string;
    password: string;
  }) {
    const service = new AdminServices();
    return service.loginAdmin({ sessionId, password });
  }

  // Instance methods that use this.session
  async createAdmin({
    name,
    sessionId,
    password,
  }: {
    name: string;
    sessionId: string;
    password: string;
  }) {
    const query = Admin.findOne({ sessionId });
    if (this.session) {
      query.session(this.session);
    }
    const existingAdmin = await query;
    if (existingAdmin) {
      throw new Error("Admin with this session ID already exists");
    }
    const admin = new Admin({
      sessionId,
      password,
      name,
    });
    const options: any = {};
    if (this.session) {
      options.session = this.session;
    }
    await admin.save(options);
    return { ...admin.toObject(), password: undefined };
  }

  async loginAdmin({
    sessionId,
    password,
  }: {
    sessionId: string;
    password: string;
  }) {
    const query = Admin.findOne({ sessionId }).select("+password");
    if (this.session) {
      query.session(this.session);
    }
    const admin = await query;
    if (!admin) {
      throw new Error("Admin not found");
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    return { ...admin.toObject(), password: undefined };
  }

  async fetchAdminById(adminId: mongoose.Types.ObjectId | string) {
    const query = Admin.findById(adminId);
    if (this.session) {
      query.session(this.session);
    }
    const admin = await query;
    if (!admin) {
      throw new Error("Admin not found");
    }
    return { ...admin.toObject(), password: undefined };
  }
}
