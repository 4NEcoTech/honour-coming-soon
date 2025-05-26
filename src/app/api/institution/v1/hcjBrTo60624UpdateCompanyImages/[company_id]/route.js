import CompanyDetails from "@/app/models/company_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const { company_id } = await params;

    if (!company_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_18",
          title: t("errorCode.6062_18.title"),
          message: t("errorCode.6062_18.description"),
        },
        { status: 400 }
      );
    }

    // Validate session
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_19",
          title: t("errorCode.6062_19.title"),
          message: t("errorCode.6062_19.description"),
        },
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
      const logoUrl = await uploadToGoogleDrive(
        logoBuffer,
        `company_logo_${Date.now()}.png`,
        "image/png"
      );
      updateData.CD_Company_Logo = logoUrl;
    }

    const coverPhotoFile = formData.get("coverPhoto");
    if (coverPhotoFile && coverPhotoFile instanceof Blob) {
      const coverBuffer = Buffer.from(await coverPhotoFile.arrayBuffer());
      const coverPhotoUrl = await uploadToGoogleDrive(
        coverBuffer,
        `company_cover_${Date.now()}.png`,
        "image/png"
      );
      updateData.CD_Company_Cover_Profile = coverPhotoUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_20",
          title: t("errorCode.6062_20.title"),
          message: t("errorCode.6062_20.description"),
        },
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
        {
          success: false,
          code: "6062_21",
          title: t("errorCode.6062_21.title"),
          message: t("errorCode.6062_21.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6062_22",
        title: t("errorCode.6062_22.title"),
        message: t("errorCode.6062_22.description"),
        data: updatedCompany,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company images:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6062_17",
        title: t("errorCode.6062_17.title"),
        message: t("errorCode.6062_17.description", {
          message: error.message,
        }),
      },
      { status: 500 }
    );
  }
}
