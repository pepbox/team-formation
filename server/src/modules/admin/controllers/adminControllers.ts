import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import AdminServices from "../services/adminServices";
import { generateAccessToken } from "../../../utils/jwtUtils";
import SessionService from "../../session/services/sessionService";

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId, password, name } = req.body;
    if (!sessionId || !password) {
      return next(new AppError("Session ID and password are required.", 400));
    }

    const sessionService = new SessionService();
    const adminService = new AdminServices();

    const session = await sessionService.fetchSessionById(sessionId);
    if (!session) {
      return next(new AppError("Session not found.", 404));
    }

    const admin = await adminService.createAdmin({
      sessionId,
      password,
      name,
    });

    if (!admin) {
      return next(new AppError("Failed to create admin.", 500));
    }

    const accessToken = generateAccessToken({
      id: admin._id.toString(),
      role: "ADMIN",
      sessionId: admin.sessionId.toString(),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Admin created successfully.",
      data: {
        admin,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    next(new AppError("Failed to create admin.", 500));
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId, password } = req.body;
    if (!sessionId || !password) {
      return next(new AppError("Session ID and password are required.", 400));
    }

    const adminService = new AdminServices();
    const admin = await adminService.loginAdmin({
      sessionId,
      password,
    });

    if (!admin) {
      return next(new AppError("Invalid session ID or password.", 401));
    }

    const accessToken = generateAccessToken({
      id: admin._id.toString(),
      role: "ADMIN",
      sessionId: admin.sessionId.toString(),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin logged in successfully.",
      data: {
        admin,
      },
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    next(new AppError("Failed to log in admin.", 500));
  }
};

export const fetchAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminService = new AdminServices();
  const { sessionId } = req.query;

  if (!sessionId || req.user.sessionId != sessionId) {
    return next(new AppError("Session ID is required or does not match.", 400));
  }

  try {
    const adminId = req.user.id;
    if (!adminId) {
      return next(new AppError("Admin ID is required.", 400));
    }

    const admin = await adminService.fetchAdminById(adminId);
    if (!admin) {
      return next(new AppError("Admin not found.", 404));
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error: any) {}
};

export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Admin logged out successfully.",
    });
  } catch (error) {
    console.error("Error logging out admin:", error);
    next(new AppError("Failed to log out admin.", 500));
  }
};
