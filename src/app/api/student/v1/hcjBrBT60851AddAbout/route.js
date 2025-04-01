import { dbConnect } from "@/app/utils/dbConnect";
import IndividualDetails from "@/app/models/individual_details";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60851AddAbout:
 *   get:
 *     summary: Get all users with their about information
 *     responses:
 *       200:
 *         description: A list of users with their about information
 *       500:
 *         description: Error retrieving users
 */
//  GET: Fetch all users with their about information
export async function GET() {
  try {
    await dbConnect();
    const users = await IndividualDetails.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}
