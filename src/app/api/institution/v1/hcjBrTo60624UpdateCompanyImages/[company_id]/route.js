import { getServerSession } from "next-auth";
import CompanyDetails from "@/app/models/company_details";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60624UpdateCompanyImages/{company_id}:
 *   patch:
 *     summary: Update Company Profile & Cover Photo
 *     description: Updates the company logo and cover profile photo in Google Drive.
 *     tags: [Company Image Update]
 *     parameters:
 *       - in: path
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the company.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               companyLogo:
 *                 type: string
 *                 format: binary
 *                 description: Image file for company logo.
 *               coverPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Image file for company cover photo.
 *     responses:
 *       200:
 *         description: Company images updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Company details not found
 *       500:
 *         description: Internal Server Error
 */

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { company_id } = await params;

    if (!company_id) {
      return NextResponse.json(
        { success: false, message: "Company ID is required" },
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

    // Upload to Google Drive and get URLs
    const companyLogoFile = formData.get("companyLogo");
    if (companyLogoFile && companyLogoFile instanceof Blob) {
      const logoBuffer = Buffer.from(await companyLogoFile.arrayBuffer());
      const logoUrl = await uploadToGoogleDrive(logoBuffer, `company_logo_${Date.now()}.png`, "image/png");
      updateData.CD_Company_Logo = logoUrl;
    }

    const coverPhotoFile = formData.get("coverPhoto");
    if (coverPhotoFile && coverPhotoFile instanceof Blob) {
      const coverBuffer = Buffer.from(await coverPhotoFile.arrayBuffer());
      const coverPhotoUrl = await uploadToGoogleDrive(coverBuffer, `company_cover_${Date.now()}.png`, "image/png");
      updateData.CD_Company_Cover_Profile = coverPhotoUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    // Update Company Details with new Image URLs
    const updatedCompany = await CompanyDetails.findByIdAndUpdate(
      company_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedCompany) {
      return NextResponse.json(
        { success: false, message: "Company details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Company images updated successfully", data: updatedCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company images:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
