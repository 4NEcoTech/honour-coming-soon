import { getContactSubmissionModel } from "@/app/models/ContactSubmission";
import { dbConnect } from "@/app/utils/dbConnect";
import { getPaginatedResults } from "@/app/utils/paginationUtils";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET60112FetchContact:
 *   get:
 *     summary: Get paginated list of contact form submissions
 *     description: >
 *       Retrieves contact submissions with support for pagination, search, and field projection.  
 *       Useful for Super Admin to view user-submitted inquiries or leads.
 *     tags:
 *       - Super Admin Fetch Contact Us Data
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query to match first name, last name, email, phone, or location fields
 *       - in: query
 *         name: [dynamic]
 *         schema:
 *           type: string
 *         description: Additional filters (e.g., country=India or state=Maharashtra)
 *     responses:
 *       200:
 *         description: List of contact form submissions with selected fields
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
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                       pincode:
 *                         type: string
 *                       message:
 *                         type: string
 *                       logo:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Bad Request - Invalid query or parameters
 *       500:
 *         description: Internal Server Error
 */


export async function GET(request) { 
  await dbConnect();
  const ContactSubmission = getContactSubmissionModel();

  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const cleanedSearchParams = new URLSearchParams(searchParams);

  // Define searchable fields
  const searchFields = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'country',
    'state',
    'city'
  ];

  // Define projection fields
  const projection = {
    firstName: 1,
    lastName: 1,
    email: 1,
    phoneNumber: 1,
    country: 1,
    pincode: 1,
    state: 1,
    city: 1,
    message: 1,
    logo: 1,
    createdAt: 1,
    updatedAt: 1
  };

  return await getPaginatedResults(
    ContactSubmission,
    cleanedSearchParams,
    searchFields,
    projection
  );
}