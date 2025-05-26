import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";

/**
 * @swagger
 * /api/global/v1/gblArET90003FtchPinCdDtls:
 *   get:
 *     summary: Fetch city and state details by pincode
 *     description: |
 *       - Retrieves city and state details based on the provided pincode.
 *       - Allows specifying fields to return using the `fields` query parameter.
 *     tags: [Fetch city and state details by pincode]
 *     parameters:
 *       - in: query
 *         name: pincode
 *         required: true
 *         schema:
 *           type: string
 *         description: The pincode to fetch details for.
 *         example: "10001"
 *       - in: query
 *         name: fields
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to return (e.g., "state_name,division_name").
 *         example: "state_name,division_name"
 *     responses:
 *       200:
 *         description: City and state details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 fetched_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-03T12:00:00Z"
 *                 execution_time_ms:
 *                   type: integer
 *                   example: 45
 *                 requested_pincode:
 *                   type: string
 *                   example: "10001"
 *                 requested_fields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["state_name", "division_name"]
 *                 data:
 *                   type: object
 *                   properties:
 *                     state:
 *                       type: string
 *                       example: "New York"
 *                     city:
 *                       type: string
 *                       example: "Manhattan"
 *       400:
 *         description: Pincode parameter is required
 *       404:
 *         description: Pincode not found
 *       500:
 *         description: Server error
 */

export async function GET(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    const startTime = Date.now(); // Start time for execution tracking

    // Connect to the database
    const db = await dbConnect();
    const collection = db.collection("pincode_list");

    // Parse query parameters
    const url = new URL(req.url);
    const pincode = url.searchParams.get("pincode")?.trim();
    const fields = url.searchParams
      .get("fields")
      ?.split(",")
      .map((field) => field.trim());

    // Validate pincode input
    if (!pincode) {
      return Response.json(
        {
          success: false,
          code: "9003_1",
          title: t("errorCode.9003_1.title"),
          message: t("errorCode.9003_1.description"),
        },
        { status: 400 }
      );
    }

    // Default fields if no specific ones are requested
    const defaultFields = { state_name: 1, district: 1 };
    let projection = { _id: 0 };

    // Apply requested fields dynamically
    if (fields && fields.length > 0) {
      fields.forEach((field) => (projection[field] = 1));
    } else {
      projection = { ...defaultFields, _id: 0 };
    }

    // Fetch city details based on pincode
    const result = await collection.findOne({ pincode }, { projection });

    if (!result) {
      return Response.json(
        {
          success: false,
          code: "9003_2",
          title: t("errorCode.9003_2.title"),
          message: t("errorCode.9003_2.description"),
          fetched_at: new Date().toISOString(),
          execution_time_ms: Date.now() - startTime,
        },
        { status: 404 }
      );
    }

    // Provide default values for missing fields
    if (!fields || fields.length === 0) {
      result.state = result.state_name || "Unknown State";
      result.city = result.district || "Unknown Division";
      delete result.state_name;
      delete result.district;
    }

    // Final response with metadata
    return Response.json(
      {
        success: true,
        code: "9003_3",
        title: t("errorCode.9003_3.title"),
        message: t("errorCode.9003_3.description"),
        fetched_at: new Date().toISOString(), // Current timestamp
        execution_time_ms: Date.now() - startTime, // API execution time
        requested_pincode: pincode, // Pincode queried
        requested_fields: fields || ["state_name", "district"], // Requested fields
        data: result, // Actual data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      {
        success: false,
        code: "9003_4",
        title: t("errorCode.9003_4.title"),
        message: t("errorCode.9003_4.description"),
        status: 500,
        fetched_at: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
