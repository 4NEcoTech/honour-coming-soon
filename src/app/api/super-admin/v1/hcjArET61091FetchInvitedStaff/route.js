import CompanyContactPerson from '@/app/models/company_contact_person';
import { dbConnect } from '@/app/utils/dbConnect';
import { getPaginatedResults } from '@/app/utils/paginationUtils';

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61091FetchInvitedStaff:
 *   get:
 *     summary: Get paginated list of institution staff (contact persons)
 *     description: Fetches a paginated list of staff or team members (contact persons) of an institution. Supports filtering by registration status, search across multiple fields, and pagination.
 *     tags: [Super Admin Fetch Invited And Registered Institution Staff, Support Data]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to fetch.
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
 *         description: Filter by staff status. Can be "invited" or "registered".
 *         required: false
 *         schema:
 *           type: string
 *           enum: [invited, registered]
 *       - name: search
 *         in: query
 *         description: Search term applied across first name, last name, email, designation, department, and institute name.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of staff fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 125
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 13
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       CCP_Institute_Num:
 *                         type: string
 *                       CCP_Institute_Name:
 *                         type: string
 *                       CCP_Contact_Person_First_Name:
 *                         type: string
 *                       CCP_Contact_Person_Last_Name:
 *                         type: string
 *                       CCP_Contact_Person_Email:
 *                         type: string
 *                       CCP_Contact_Person_Phone:
 *                         type: string
 *                       CCP_Contact_Person_Alternate_Phone:
 *                         type: string
 *                       CCP_Contact_Person_Designation:
 *                         type: string
 *                       CCP_Contact_Person_Role:
 *                         type: string
 *                       CCP_Contact_Person_Department:
 *                         type: string
 *                       CCP_Contact_Person_Joining_Year:
 *                         type: string
 *                       CCP_Contact_Person_Gender:
 *                         type: string
 *                       CCP_Contact_Person_DOB:
 *                         type: string
 *                       CCP_Contact_Person_Country:
 *                         type: string
 *                       CCP_Contact_Person_State:
 *                         type: string
 *                       CCP_Contact_Person_City:
 *                         type: string
 *                       CCP_Contact_Person_Address_Line1:
 *                         type: string
 *                       CCP_Contact_Person_Pincode:
 *                         type: string
 *                       CCP_Individual_Id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error while fetching staff data.
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
    cleanedSearchParams.set('CCP_Individual_Id', 'null');
  } else if (status === 'registered') {
    cleanedSearchParams.set('CCP_Individual_Id', '__NOT_NULL__');
  }

  // Define searchable fields
  const searchFields = [
    'CCP_Contact_Person_First_Name',
    'CCP_Contact_Person_Last_Name',
    'CCP_Contact_Person_Email',
    'CCP_Contact_Person_Designation',
    'CCP_Contact_Person_Department',
    'CCP_Institute_Name',
  ];

  // Define projection fields
  const projection = {
    _id: 1,
    CCP_Institute_Num: 1,
    CCP_Institute_Name: 1,
    CCP_Contact_Person_First_Name: 1,
    CCP_Contact_Person_Last_Name: 1,
    CCP_Contact_Person_Email: 1,
    CCP_Contact_Person_Phone: 1,
    CCP_Contact_Person_Alternate_Phone: 1,
    CCP_Contact_Person_Designation: 1,
    CCP_Contact_Person_Role: 1,
    CCP_Contact_Person_Department: 1,
    CCP_Contact_Person_Joining_Year: 1,
    CCP_Contact_Person_Gender: 1,
    CCP_Contact_Person_DOB: 1,
    CCP_Contact_Person_Country: 1,
    CCP_Contact_Person_State: 1,
    CCP_Contact_Person_City: 1,
    CCP_Contact_Person_Address_Line1: 1,
    CCP_Contact_Person_Pincode: 1,
    CCP_Individual_Id: 1,
    createdAt: 1,
  };

  return await getPaginatedResults(
    CompanyContactPerson,
    cleanedSearchParams,
    searchFields,
    projection
  );
}