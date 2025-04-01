import { getServerSession } from "next-auth";
import IndividualDetails from "@/app/models/individual_details";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60611UpdateIndividual/{individual_id}:
 *   patch:
 *     summary: Update Individual Details
 *     description: Updates specific fields of an individual's profile.
 *     tags: [Administrator Individual Details]
 *     parameters:
 *       - in: path
 *         name: individual_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the individual details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_First_Name:
 *                 type: string
 *               ID_Last_Name:
 *                 type: string
 *               ID_Email:
 *                 type: string
 *               ID_Phone:
 *                 type: string
 *               ID_Profile_Headline:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Individual details updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Individual details not found
 *       500:
 *         description: Internal Server Error
 */

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { individual_id } = await params;
    if (!individual_id) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const updateData = await req.json();
    const updatedIndividual = await IndividualDetails.findByIdAndUpdate(
      individual_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedIndividual) {
      return NextResponse.json(
        { success: false, message: "Individual details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Individual details updated", data: updatedIndividual },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating individual details:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
