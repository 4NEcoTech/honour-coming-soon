import { getServerSession } from "next-auth";
import IndividualDetails from "@/app/models/individual_details";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";

/**
 * @swagger
 * /api/individual/v1/hcjBrTo60614UpdateProfileImages/{individual_id}:
 *   patch:
 *     summary: Update Individual Profile & Cover Photo
 *     description: Updates the profile picture and cover photo of an individual.
 *     tags: [Administrator Image Update]
 *     parameters:
 *       - in: path
 *         name: individual_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the individual.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image file for profile picture.
 *               coverPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Image file for cover photo.
 *     responses:
 *       200:
 *         description: Profile images updated successfully
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

    // Validate session
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    let updateData = {};

    // Upload Profile Picture to Google Drive
    const profilePictureFile = formData.get("profilePicture");
    if (profilePictureFile && profilePictureFile instanceof Blob) {
      const profileBuffer = Buffer.from(await profilePictureFile.arrayBuffer());
      const profileUrl = await uploadToGoogleDrive(profileBuffer, `profile_picture_${Date.now()}.png`, "image/png");
      updateData.ID_Profile_Picture = profileUrl;
    }

    // Upload Cover Photo to Google Drive
    const coverPhotoFile = formData.get("coverPhoto");
    if (coverPhotoFile && coverPhotoFile instanceof Blob) {
      const coverBuffer = Buffer.from(await coverPhotoFile.arrayBuffer());
      const coverPhotoUrl = await uploadToGoogleDrive(coverBuffer, `cover_photo_${Date.now()}.png`, "image/png");
      updateData.ID_Cover_Photo = coverPhotoUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    // Update Individual Details with new Image URLs
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
      { success: true, message: "Profile images updated successfully", data: updatedIndividual },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile images:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
