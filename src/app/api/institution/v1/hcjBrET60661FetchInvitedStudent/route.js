import HCJStudent from '@/app/models/hcj_student';
import { dbConnect } from '@/app/utils/dbConnect';
import { getPaginatedResults } from '@/app/utils/paginationUtils';

/**
 * @swagger
 * /api/institution/v1/hcjBrET60661FetchInvitedStudent:
 *   get:
 *     summary: Get paginated invited or registered students
 *     description: Returns a list of students filtered by status (invited or registered), institution number, and optional search query. Supports pagination and search by name, specialization, email, and more.
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [invited, registered]
 *         required: true
 *         description: Filter students by status
 *         example: invited
 *       - in: query
 *         name: HCJ_ST_InstituteNum
 *         schema:
 *           type: string
 *         required: true
 *         description: Institute Number of the student
 *         example: "1001"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search keyword across name, specialization, program, and email
 *         example: "john"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of records per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved student records
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
 *                       HCJ_ST_Student_Id:
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
 *                         format: date
 *                       HCJ_ST_Student_Branch_Specialization:
 *                         type: string
 *                       HCJ_ST_Student_Program_Name:
 *                         type: string
 *                       HCJ_ST_Enrollment_Year:
 *                         type: string
 *                       HCJ_ST_Student_Document_Type:
 *                         type: string
 *                       HCJ_ST_Student_Document_Number:
 *                         type: string
 *                       HCJ_ST_Student_Country:
 *                         type: string
 *                       HCJ_ST_Student_State:
 *                         type: string
 *                       HCJ_ST_Student_City:
 *                         type: string
 *                       HCJ_ST_Student_Pincode:
 *                         type: string
 *                       isVerified:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   example: 24
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 batchNumber:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error or failed to fetch students
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

  // Always enforce institution filter
  const institutionNumber = searchParams.get('HCJ_ST_InstituteNum'); // or pull from session/token
  cleanedSearchParams.set('HCJ_ST_InstituteNum', institutionNumber);

  // Define searchable fields
  const searchFields = [
    'HCJ_ST_Student_First_Name',
    'HCJ_ST_Student_Last_Name',
    'HCJ_ST_Student_Branch_Specialization',
    'HCJ_ST_Student_Program_Name',
    'HCJ_ST_Educational_Email',
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
  };

  return await getPaginatedResults(
    HCJStudent,
    cleanedSearchParams,
    searchFields,
    projection
  );
}
