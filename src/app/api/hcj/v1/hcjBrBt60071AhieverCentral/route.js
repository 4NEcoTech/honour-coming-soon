import HcjAchieversCentral from "@/app/models/hcj_achievers_central";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { generateAuditTrail } from "@/app/utils/audit-trail";

/**
 * @swagger
 * /api/hcj/v1/hcjBrBt60071aAhieverCentral:
 *   post:
 *     summary: Submit a new achievement
 *     description: Submits an achievement including the achiever's details, event information, and award images.
 *     tags: [Achiever Central Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_AC_News_Shrt_Description:
 *                 type: string
 *               HCJ_AC_Publish_Dt:
 *                 type: string
 *                 format: date
 *               HCJ_AC_Achievers_Event_Dt:
 *                 type: string
 *                 format: date
 *               HCJ_AC_Achievers_Name:
 *                 type: string
 *               HCJ_AC_Achievers_Photo:
 *                 type: string
 *                 format: binary
 *               HCJ_AC_Achievers_Event_Name:
 *                 type: string
 *               HCJ_AC_Achievers_Event_Description:
 *                 type: string
 *               HCJ_AC_Achievers_Award_Description:
 *                 type: string
 *               HCJ_AC_College_Num:
 *                 type: string
 *               HCJ_AC_College_Name:
 *                 type: string
 *               HCJ_AC_Achievers_Award_Img:
 *                 type: string
 *                 format: binary
 *               HCJ_AC_Achievers_Award_Addnl_Img:
 *                 type: string
 *                 format: binary
 *               HCJ_AC_Achievers_Award_Detail_Description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Achievement added successfully!
 *       400:
 *         description: Required fields are missing
 *       500:
 *         description: Error processing the request
 */

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // Extract required fields
    const HCJ_AC_News_Shrt_Description = formData.get("HCJ_AC_News_Shrt_Description");
    const HCJ_AC_Publish_Dt = formData.get("HCJ_AC_Publish_Dt");
    const HCJ_AC_Achievers_Event_Dt = formData.get("HCJ_AC_Achievers_Event_Dt");
    const HCJ_AC_Achievers_Name = formData.get("HCJ_AC_Achievers_Name");
    const HCJ_AC_Achievers_Photo = formData.get("HCJ_AC_Achievers_Photo");
    const HCJ_AC_Achievers_Event_Name = formData.get("HCJ_AC_Achievers_Event_Name");
    const HCJ_AC_Achievers_Event_Description = formData.get("HCJ_AC_Achievers_Event_Description");
    const HCJ_AC_Achievers_Award_Description = formData.get("HCJ_AC_Achievers_Award_Description");
    const HCJ_AC_College_Num = formData.get("HCJ_AC_College_Num");
    const HCJ_AC_College_Name = formData.get("HCJ_AC_College_Name");
    const HCJ_AC_Achievers_Award_Img = formData.get("HCJ_AC_Achievers_Award_Img");
    const HCJ_AC_Achievers_Award_Addnl_Img = formData.get("HCJ_AC_Achievers_Award_Addnl_Img");
    const HCJ_AC_Achievers_Award_Detail_Description = formData.get("HCJ_AC_Achievers_Award_Detail_Description");

    // Validate required fields
    if (
      !HCJ_AC_News_Shrt_Description ||
      !HCJ_AC_Publish_Dt ||
      !HCJ_AC_Achievers_Event_Dt ||
      !HCJ_AC_Achievers_Name ||
      !HCJ_AC_Achievers_Photo ||
      !HCJ_AC_Achievers_Event_Name ||
      !HCJ_AC_Achievers_Event_Description ||
      !HCJ_AC_College_Name ||
      !HCJ_AC_Achievers_Award_Img
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Required fields are missing" }),
        { status: 400 }
      );
    }

    // Upload images to Google Drive
    let achieverPhotoUrl = null;
    let awardImgUrl = null;
    let awardAddnlImgUrl = null;

    if (HCJ_AC_Achievers_Photo) {
      const buffer = Buffer.from(await HCJ_AC_Achievers_Photo.arrayBuffer());
      achieverPhotoUrl = await uploadToGoogleDrive(buffer, `achiever_${Date.now()}.png`, "image/png");
    }

    if (HCJ_AC_Achievers_Award_Img) {
      const buffer = Buffer.from(await HCJ_AC_Achievers_Award_Img.arrayBuffer());
      awardImgUrl = await uploadToGoogleDrive(buffer, `award_${Date.now()}.png`, "image/png");
    }

    if (HCJ_AC_Achievers_Award_Addnl_Img) {
      const buffer = Buffer.from(await HCJ_AC_Achievers_Award_Addnl_Img.arrayBuffer());
      awardAddnlImgUrl = await uploadToGoogleDrive(buffer, `award_additional_${Date.now()}.png`, "image/png");
    }

    // Generate audit trail
    const auditTrail = await generateAuditTrail(req);

    // Save to MongoDB using correct schema
    const achievementEntry = new HcjAchieversCentral({
      HCJ_AC_Id: "ACH_001",
      HCJ_AC_News_Shrt_Description,
      HCJ_AC_Publish_Dt: new Date(HCJ_AC_Publish_Dt),
      HCJ_AC_Achievers_Event_Dt: new Date(HCJ_AC_Achievers_Event_Dt),
      HCJ_AC_Achievers_Name,
      HCJ_AC_Achievers_Photo: achieverPhotoUrl,
      HCJ_AC_Achievers_Event_Name,
      HCJ_AC_Achievers_Event_Description,
      HCJ_AC_Achievers_Award_Description,
      HCJ_AC_College_Num,
      HCJ_AC_College_Name,
      HCJ_AC_Achievers_Award_Img: awardImgUrl,
      HCJ_AC_Achievers_Award_Addnl_Img: awardAddnlImgUrl,
      HCJ_AC_Achievers_Award_Detail_Description,
      HCJ_AC_Creation_DtTym: new Date(),
      HCJ_AC_Audit_Trail: [auditTrail],
    });

    await achievementEntry.save();

    return new Response(
      JSON.stringify({ message: "Achievement added successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during achievement submission:", error);
    return new Response(
      JSON.stringify({ message: "Error processing the request." }),
      { status: 500 }
    );
  }
}
