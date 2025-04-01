import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { dbConnect } from "../../../utils/dbConnect";
import User from "@/models/User";
import Permission from "@/models/Permission";

export async function authMiddleware(req) {
  const token = req.cookies.get("token");
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.redirect(new URL("/login", req.url));

  await dbConnect();
  const user = await User.findById(decoded.id);
  if (!user) return NextResponse.redirect(new URL("/403", req.url));

  return user.UT_Role; // Return user role
}

export async function checkPermissions(req, action) {
    const role = await authMiddleware(req);
    await dbConnect();
    const rolePermissions = await Permission.findOne({ role });
  
    if (!rolePermissions || !rolePermissions.permissions.get(action)) {
      return false; // No access
    }
  
    return true; // Has access
  }
  
