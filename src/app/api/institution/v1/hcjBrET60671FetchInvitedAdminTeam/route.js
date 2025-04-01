import CompanyContactPerson from '@/app/models/company_contact_person';
import { dbConnect } from '@/app/utils/dbConnect';
import { getPaginatedResults } from '@/app/utils/paginationUtils';

/**
 * @swagger
 * /api/institution/v1/hcjBrET60772FetchInstitutionStaff:
 *   get:
 *     summary: Get Institution Staff (Invited or Registered)
 *     description: Fetches paginated staff members with optional filters like status and search.
 *     tags: [Institution Staff]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [invited, registered]
 *         required: false
 *         description: Filter by staff status ("invited" or "registered")
 *         example: "invited"
 *       - in: query
 *         name: CCP_Institute_Num
 *         schema:
 *           type: string
 *         required: false
 *         description: Institute Number (defaults to "1001" if not provided)
 *         example: "1001"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search text
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  console.log('searchParams', searchParams);
  // Clone for safe edits
  const cleanedSearchParams = new URLSearchParams(searchParams);

  // Apply status filter
  const status = searchParams.get('status');
  if (status === 'invited') {
    cleanedSearchParams.set('CCP_Individual_Id', 'null');
  } else if (status === 'registered') {
    cleanedSearchParams.set('CCP_Individual_Id', '__NOT_NULL__');
  }

  // Enforce default institution number
  const institutionNum = searchParams.get('CCP_Institute_Num') || '1001';
  cleanedSearchParams.set('CCP_Institute_Num', institutionNum);

  const searchFields = [
    'CCP_Contact_Person_First_Name',
    'CCP_Contact_Person_Last_Name',
    'CCP_Contact_Person_Email',
    'CCP_Contact_Person_Designation',
    'CCP_Contact_Person_Department',
  ];

  const projection = {
    _id: 1,
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
    createdAt: 1,
  };

  return await getPaginatedResults(
    CompanyContactPerson,
    cleanedSearchParams,
    searchFields,
    projection
  );
}
