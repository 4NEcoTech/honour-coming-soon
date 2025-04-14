import IndividualDetails from "@/app/models/individual_details";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60851AddAbout/[id]:
 *   get:
 *     summary: Get a single user's about information
 *     parameters:
 *       - name: ID_Individual_Id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user
 *
 *   patch:
 *     summary: Update a user's about information
 *     parameters:
 *       - name: ID_Individual_Id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_About:
 *                 type: string
 *                 description: About text (less than 1000 characters)
 *     responses:
 *       200:
 *         description: About updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 *
 *   delete:
 *     summary: Delete a user's about information
 *     parameters:
 *       - name: ID_Individual_Id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */

//  Zod Schema for Validation
const aboutSchema = z.object({
  ID_About: z.string().max(1000, "About must be less than 1000 characters"),
});

//  GET: Fetch single user’s about information
export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    await dbConnect();
    const user = await IndividualDetails.findById(id).select("ID_About");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ID_About: user.ID_About }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//  PATCH: Update user's about information
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const formData = await req.json();
    const validatedData = aboutSchema.safeParse(formData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const auditTrail = await generateAuditTrail(req);

    const updatedUser = await IndividualDetails.findByIdAndUpdate(
      params.id,
      {
        $set: { ID_About: validatedData.data.ID_About },
        $push: { ID_Audit_Trail: auditTrail },
      },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "About updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//  DELETE: Remove user's about information
export async function DELETE(_, { params }) {
  try {
    await dbConnect();
    const deletedUser = await IndividualDetails.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
