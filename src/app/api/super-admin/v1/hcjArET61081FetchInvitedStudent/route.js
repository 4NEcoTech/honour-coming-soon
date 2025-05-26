import HCJStudent from '@/app/models/hcj_student';
import { dbConnect } from '@/app/utils/dbConnect';
import { getPaginatedResults } from '@/app/utils/paginationUtils';

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61081FetchInvitedStudent:
 *   get:
 *     summary: Get paginated list of students
 *     description: Fetches a paginated list of students under an institution. Supports filters such as registration status, search by name, branch, program, and more.
 *     tags: [Super Admin Fetch Invited And Registered Student Data]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of results per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: status
 *         in: query
 *         description: Filter by student status. Can be "invited" or "registered".
 *         required: false
 *         schema:
 *           type: string
 *           enum: [invited, registered]
 *       - name: search
 *         in: query
 *         description: Search term applied across student first name, last name, email, branch, program, and institution name.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of students retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 250
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 25
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       HCJ_ST_Student_Id:
 *                         type: string
 *                       HCJ_ST_InstituteNum:
 *                         type: string
 *                       HCJ_ST_Institution_Name:
 *                         type: string
 *                       HCJ_ST_Student_First_Name:
 *                         type: string
 *                       HCJ_ST_Student_Last_Name:
 *                         type: string
 *                       HCJ_ST_Educational_Email:
 *                         type: string
 *                       HCJ_ST_Phone_Number:
 *                         type: string
 *                       HCJ_ST_Gender:
 *                         type: string
 *                       HCJ_ST_DOB:
 *                         type: string
 *                       HCJ_ST_Student_Country:
 *                         type: string
 *                       HCJ_ST_Student_Pincode:
 *                         type: string
 *                       HCJ_ST_Student_State:
 *                         type: string
 *                       HCJ_ST_Student_City:
 *                         type: string
 *                       HCJ_ST_Student_Document_Domicile:
 *                         type: string
 *                       HCJ_ST_Student_Document_Type:
 *                         type: string
 *                       HCJ_ST_Student_Document_Number:
 *                         type: string
 *                       HCJ_Student_Documents_Image:
 *                         type: string
 *                       HCJ_ST_Student_Branch_Specialization:
 *                         type: string
 *                       HCJ_ST_Student_Program_Name:
 *                         type: string
 *                       HCJ_ST_Enrollment_Year:
 *                         type: integer
 *                       HCJ_ST_Current_Year:
 *                         type: integer
 *                       HCJ_ST_Student_Graduation_Year:
 *                         type: integer
 *                       HCJ_ST_Score_Grade_Type:
 *                         type: string
 *                       HCJ_ST_Score_Grade:
 *                         type: number
 *                       HCJ_ST_Seeking_Internship:
 *                         type: boolean
 *                       isVerified:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       HCJ_ST_Individual_Id:
 *                         type: string
 *       500:
 *         description: Internal server error while fetching student data.
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
 *                   example: "Internal server error"
 */


export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const cleanedSearchParams = new URLSearchParams(searchParams);

  // Handle custom "status" filtering
  const status = searchParams.get('status');
  if (status === 'invited') {
    cleanedSearchParams.set('HCJ_ST_Individual_Id', 'null');
  } else if (status === 'registered') {
    cleanedSearchParams.set('HCJ_ST_Individual_Id', '__NOT_NULL__');
  }

  // Define searchable fields
  const searchFields = [
    'HCJ_ST_Student_First_Name',
    'HCJ_ST_Student_Last_Name',
    'HCJ_ST_Student_Branch_Specialization',
    'HCJ_ST_Student_Program_Name',
    'HCJ_ST_Educational_Email',
    'HCJ_ST_Institution_Name',
  ];

  // Define projection fields (return only needed data)
  const projection = {
    HCJ_ST_Student_Id: 1,
    HCJ_ST_InstituteNum: 1,
    HCJ_ST_Institution_Name: 1,
    HCJ_ST_Student_First_Name: 1,
    HCJ_ST_Student_Last_Name: 1,
    HCJ_ST_Educational_Email: 1,
    HCJ_ST_Phone_Number: 1,
    HCJ_ST_Gender: 1,
    HCJ_ST_DOB: 1,
    HCJ_ST_Student_Country: 1,
    HCJ_ST_Student_Pincode: 1,
    HCJ_ST_Student_State: 1,
    HCJ_ST_Student_City: 1,
    HCJ_ST_Student_Document_Domicile: 1,
    HCJ_ST_Student_Document_Type: 1,
    HCJ_ST_Student_Document_Number: 1,
    HCJ_Student_Documents_Image: 1,
    HCJ_ST_Student_Branch_Specialization: 1,
    HCJ_ST_Student_Program_Name: 1,
    HCJ_ST_Enrollment_Year: 1,
    HCJ_ST_Current_Year: 1,
    HCJ_ST_Student_Graduation_Year: 1,
    HCJ_ST_Score_Grade_Type: 1,
    HCJ_ST_Score_Grade: 1,
    HCJ_ST_Seeking_Internship: 1,
    isVerified: 1,
    createdAt: 1,
    HCJ_ST_Individual_Id: 1,
  };

  return await getPaginatedResults(
    HCJStudent,
    cleanedSearchParams,
    searchFields,
    projection
  );
}