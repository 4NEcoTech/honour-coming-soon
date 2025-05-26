import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import company_details from "@/app/models/company_details";
import CompanyKYCDetails from "@/app/models/company_kyc_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60311InstitutionDocument:
 *   post:
 *     summary: Submit Institution KYC Documents
 *     description: |
 *       Submits KYC details for an institution including registration number, tax ID, AISHE code, affiliation, and document links.
 *       Automatically generates a unique KYC number and stores the data in `company_kyc_details`.
 *     tags: [Institution Dcoument Save]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CKD_Institution_Type
 *               - CKD_Company_Registration_Number
 *               - CKD_Company_Tax_Id
 *               - CKD_Company_Registration_Documents
 *               - CKD_Company_Tax_Documents
 *               - CKD_Submitted_By
 *             properties:
 *               CKD_Company_Id:
 *                 type: string
 *                 description: Optional. Institution's company ID (fetched from session if not provided).
 *               CKD_Institution_Type:
 *                 type: string
 *               CKD_AISHE_Code:
 *                 type: string
 *               CKD_College_Name:
 *                 type: string
 *               CKD_College_Name_Other:
 *                 type: string
 *               CKD_Affiliated_University:
 *                 type: string
 *               CKD_Affiliated_University_Other:
 *                 type: string
 *               CKD_University_Name:
 *                 type: string
 *               CKD_University_Name_Other:
 *                 type: string
 *               CKD_University_Type:
 *                 type: string
 *               CKD_Company_Registration_Number:
 *                 type: string
 *               CKD_Company_Tax_Id:
 *                 type: string
 *               CKD_Company_Registration_Documents:
 *                 type: string
 *                 format: uri
 *               CKD_Company_Tax_Documents:
 *                 type: string
 *                 format: uri
 *               CKD_Submitted_By:
 *                 type: string
 *               CKD_Audit_Trail:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                     action:
 *                       type: string
 *     responses:
 *       201:
 *         description: KYC details submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 kycNumber:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error or Database Transaction Failed
 */

export async function POST(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const body = await req.json();

    const sessionData = await getServerSession(authOptions);
    const sessionId = body.CKD_Company_Id || sessionData?.user?.companyId;

    if (!sessionId) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "6031_16",
          title: t(`errorCode.6031_16.title`),
          message: t(`errorCode.6031_16.description`),
        }),
        {
          status: 401,
        }
      );
    }

    // Validate company
    const companyDetails = await company_details.findOne({ _id: sessionId });
    if (!companyDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "6031_17",
          title: t(`errorCode.6031_17.title`),
          message: t(`errorCode.6031_17.description`),
        }),
        {
          status: 404,
        }
      );
    }

    const {
      CKD_Institution_Type,
      CKD_AISHE_Code,
      CKD_College_Name,
      CKD_College_Name_Other,
      CKD_Affiliated_University,
      CKD_Affiliated_University_Other,
      CKD_University_Name,
      CKD_University_Name_Other,
      CKD_University_Type,
      CKD_Company_Registration_Number,
      CKD_Company_Tax_Id,
      CKD_Company_Registration_Documents,
      CKD_Company_Tax_Documents,
      CKD_Submitted_By,
      CKD_Audit_Trail,
    } = body;

    // Generate unique KYC number
    const kycNumber = uuidv4();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const kycRecord = new CompanyKYCDetails({
        CKD_KYCNum: kycNumber,
        CKD_Company_Id: companyDetails._id,
        CKD_Institution_Type,
        CKD_AISHE_Code,
        CKD_College_Name,
        CKD_College_Name_Other,
        CKD_Affiliated_University,
        CKD_Affiliated_University_Other,
        CKD_University_Name,
        CKD_University_Name_Other,
        CKD_University_Type,
        CKD_Company_Registration_Number,
        CKD_Company_Tax_Id,
        CKD_Company_Registration_Documents,
        CKD_Company_Tax_Documents,
        CKD_Submitted_By,
        CKD_Verification_Status: "submitted",
        CKD_Audit_Trail: CKD_Audit_Trail || [],
      });

      await kycRecord.save({ session });
      await session.commitTransaction();
      session.endSession();

      return new Response(
        JSON.stringify({
          success: true,
          code: "6031_18",
          title: t(`errorCode.6031_18.title`),
          message: t(`errorCode.6031_18.description`),
          kycNumber,
        }),
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("DB Transaction Error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          code: "6031_19",
          title: t(`errorCode.6031_19.title`),
          message: t(`errorCode.6031_19.description`),
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("KYC Submission Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        code: "6031_20",
        title: t(`errorCode.6031_20.title`),
        message: t(`errorCode.6031_20.description`, {
          message: error.message,
        }),
      }),
      {
        status: 500,
      }
    );
  }
}
