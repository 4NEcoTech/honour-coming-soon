import JobSeekerLanguages from "@/app/models/hcj_job_seeker_languages";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60615UserLanguage/{individual_id}:
 *   post:
 *     summary: Add User Language
 *     description: Adds a new language for a job seeker.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: individual_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the job seeker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSL_Source:
 *                 type: string
 *                 description: Source of language data (e.g., user input)
 *               HCJ_JSL_Id:
 *                 type: string
 *                 description: Unique language entry ID
 *               HCJ_JSL_Language:
 *                 type: string
 *                 description: Name of the language
 *               HCJ_JSL_Language_Proficiency_Level:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: Proficiency level (1: Beginner - 5: Expert)
 *               HCJ_JSL_Language_Proficiency:
 *                 type: string
 *                 enum: ["Basic", "Intermediate", "Advanced"]
 *                 description: Text-based proficiency category
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: User language added successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal Server Error
 *   get:
 *     summary: Get All Languages of an Individual
 *     description: Fetches all language records associated with a specific job seeker.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: individual_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the job seeker
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user languages retrieved successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No languages found for the user
 *       500:
 *         description: Internal Server Error
 */

export async function POST(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const { individual_id } = await params;

    if (!individual_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_30",
          title: t("errorCode.6061_30.title"),
          message: t("errorCode.6061_30.description"),
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_31",
          title: t("errorCode.6061_31.title"),
          message: t("errorCode.6061_31.description"),
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    const {
      HCJ_JSL_Source,
      HCJ_JSL_Id,
      HCJ_JSL_Language,
      HCJ_JSL_Language_Proficiency_Level,
      HCJ_JSL_Language_Proficiency,
    } = await req.json();

    if (
      !HCJ_JSL_Source ||
      !HCJ_JSL_Id ||
      !HCJ_JSL_Language ||
      !HCJ_JSL_Language_Proficiency_Level ||
      !HCJ_JSL_Language_Proficiency
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_32",
          title: t("errorCode.6061_32.title"),
          message: t("errorCode.6061_32.description"),
        },
        { status: 400 }
      );
    }

    const newLanguage = new JobSeekerLanguages({
      HCJ_JSL_Source,
      HCJ_JSL_Id,
      HCJ_JSL_Language,
      HCJ_JSL_Language_Proficiency_Level,
      HCJ_JSL_Language_Proficiency,
    });

    await newLanguage.save();

    return NextResponse.json(
      {
        success: true,
        code: "6061_33",
        title: t("errorCode.6061_33.title"),
        message: t("errorCode.6061_33.description"),
        data: newLanguage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user language:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_34",
        title: t("errorCode.6061_34.title"),
        message: t(`errorCode.6061_34.description`, { message: error.message }),
      },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const { individual_id } = await params;

    if (!individual_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_35",
          title: t("errorCode.6061_35.title"),
          message: t("errorCode.6061_35.description"),
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_36",
          title: t("errorCode.6061_36.title"),
          message: t("errorCode.6061_36.description"),
        },
        { status: 401 }
      );
    }

    const userLanguages = await JobSeekerLanguages.find({
      HCJ_JSL_Id: individual_id,
    }).lean();

    if (!userLanguages || userLanguages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_37",
          title: t("errorCode.6061_37.title"),
          message: t("errorCode.6061_37.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6061_38",
        title: t("errorCode.6061_38.title"),
        message: t("errorCode.6061_38.description"),
        data: userLanguages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user languages:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_39",
        title: t("errorCode.6061_39.title"),
        message: t(`errorCode.6061_39.description`, { message: error.message }),
      },
      { status: 500 }
    );
  }
}
