import { getContactSubmissionModel } from "@/app/models/ContactSubmission";
import { dbConnect } from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/super-admin/v1/gblArET60112FetchContact:
 *   get:
 *     summary: Retrieve a paginated list of contact submissions
 *     description: Fetches a list of contact form submissions with optional search and pagination.
 *     tags: [Super Admin Contact Submissions]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number for pagination (default is 1)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: search
 *         in: query
 *         description: Search keyword to filter contact submissions
 *         required: false
 *         schema:
 *           type: string
 *           example: "John"
 *     responses:
 *       200:
 *         description: Successfully retrieved contact submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique ID of the contact submission
 *                         example: "65af3b6f3d1425a9f34a4f12"
 *                       firstName:
 *                         type: string
 *                         description: First name of the contact
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         description: Last name of the contact
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         description: Email of the contact
 *                         example: "johndoe@example.com"
 *                       country:
 *                         type: string
 *                         description: Country of the contact
 *                         example: "USA"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of submission
 *                         example: "2024-03-01T14:25:30Z"
 *                 total:
 *                   type: integer
 *                   description: Total number of submissions
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   description: Total pages available
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *                 batchStartPage:
 *                   type: integer
 *                   description: The starting page of the batch
 *                   example: 1
 *                 batchEndPage:
 *                   type: integer
 *                   description: The ending page of the batch
 *                   example: 10
 *       404:
 *         description: No submissions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No submissions found"
 *                 data:
 *                   type: array
 *                   example: []
 *                 total:
 *                   type: integer
 *                   example: 0
 *                 totalPages:
 *                   type: integer
 *                   example: 0
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error fetching contact submissions"
 */


export async function GET(request) {
  try {
    await dbConnect();
    const ContactSubmission = getContactSubmissionModel();

    // Get search params from the request URL
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10); // Current page
    const pageSize = 10; // Number of items per page
    const batchSize = 100; // Fetch 100 items at a time
    const startBatch = Math.ceil(page / (batchSize / pageSize)); // Calculate batch index
    const startPage = (startBatch - 1) * batchSize / pageSize; // Starting page for the batch

    const limit = batchSize;
    const skip = (startBatch - 1) * batchSize;

    const search = searchParams.get('search') || '';

    // Create search query
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Get total count
    const total = await ContactSubmission.countDocuments(searchQuery);

    // Get batch data
    const submissionsData = await ContactSubmission.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!submissionsData || submissionsData.length === 0) {
      return NextResponse.json(
        {
          message: 'No submissions found',
          data: [],
          total: 0,
          totalPages: Math.ceil(total / pageSize),
          currentPage: page,
        },
        { status: 404 }
      );
    }

    // Format response
    return NextResponse.json(
      {
        data: submissionsData,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        batchStartPage: startPage + 1,
        batchEndPage: startPage + batchSize / pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json({ success: false, message: "Error fetching contact submissions" }, { status: 500 });
  }
}
