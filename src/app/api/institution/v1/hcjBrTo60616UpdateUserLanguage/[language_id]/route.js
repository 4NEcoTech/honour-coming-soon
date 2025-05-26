import JobSeekerLanguages from "@/app/models/hcj_job_seeker_languages";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60616UpdateUserLanguage/{language_id}:
 *   patch:
 *     summary: Update User Language
 *     description: Updates an existing language entry for a job seeker.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the language entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSL_Language:
 *                 type: string
 *                 description: Updated language name
 *               HCJ_JSL_Language_Proficiency_Level:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: Updated proficiency level (1: Beginner - 5: Expert)
 *               HCJ_JSL_Language_Proficiency:
 *                 type: string
 *                 enum: ["Basic", "Intermediate", "Advanced"]
 *                 description: Updated proficiency category
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User language updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Language entry not found
 *       500:
 *         description: Internal Server Error
 *   get:
 *     summary: Get a Single User Language
 *     description: Fetches a specific language entry for a job seeker.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the language entry
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Language entry retrieved successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Language entry not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete User Language
 *     description: Removes a language entry from the job seeker's profile.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the language entry
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Language entry deleted successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Language entry not found
 *       500:
 *         description: Internal Server Error
 */

export async function PATCH(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const { language_id } = await params;

    if (!language_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_54",
          title: t("errorCodes.6061_54.title"),
          message: t("errorCodes.6061_54.description"),
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
          title: t("errorCodes.6061_36.title"),
          message: t("errorCodes.6061_36.description"),
        },
        { status: 401 }
      );
    }

    const updateData = await req.json();
    const updatedLanguage = await JobSeekerLanguages.findByIdAndUpdate(
      language_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedLanguage) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_55",
          title: t("errorCodes.6061_55.title"),
          message: t("errorCodes.6061_55.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6061_56",
        title: t("errorCodes.6061_56.title"),
        message: t("errorCodes.6061_56.description"),
        data: updatedLanguage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user language:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_46",
        title: t("errorCodes.6061_46.title"),
        message: t("errorCodes.6061_46.description", {
          message: error.message,
        }),
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
    const { language_id } = await params;

    if (!language_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_54",
          title: t("errorCodes.6061_54.title"),
          message: t("errorCodes.6061_54.description"),
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
          title: t("errorCodes.6061_36.title"),
          message: t("errorCodes.6061_36.description"),
        },
        { status: 401 }
      );
    }

    const languageEntry = await JobSeekerLanguages.findById(language_id).lean();

    if (!languageEntry) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_55",
          title: t("errorCodes.6061_55.title"),
          message: t("errorCodes.6061_55.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6061_57",
        title: t("errorCodes.6061_57.title"),
        message: t("errorCodes.6061_57.description"),
        data: languageEntry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user language:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_46",
        title: t("errorCodes.6061_46.title"),
        message: t("errorCodes.6061_46.description", {
          message: error.message,
        }),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);

  try {
    await dbConnect();
    const { language_id } = await params;

    if (!language_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_54",
          title: t("errorCodes.6061_54.title"),
          message: t("errorCodes.6061_54.description"),
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
          title: t("errorCodes.6061_36.title"),
          message: t("errorCodes.6061_36.description"),
        },
        { status: 401 }
      );
    }

    const deletedLanguage = await JobSeekerLanguages.findByIdAndDelete(
      language_id
    ).lean();

    if (!deletedLanguage) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_55",
          title: t("errorCodes.6061_55.title"),
          message: t("errorCodes.6061_55.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6061_58",
        title: t("errorCodes.6061_58.title"),
        message: t("errorCodes.6061_58.description"),
        data: deletedLanguage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user language:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_46",
        title: t("errorCodes.6061_46.title"),
        message: t("errorCodes.6061_46.description", {
          message: error.message,
        }),
      },
      { status: 500 }
    );
  }
}
