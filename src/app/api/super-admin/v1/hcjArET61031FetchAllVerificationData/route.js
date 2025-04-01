import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualAddress from "@/app/models/individual_address_detail";
import SocialProfile from "@/app/models/social_link";
import IndividualEducation from "@/app/models/individual_education";
import IndividualDocuments from "@/app/models/individual_document_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { getPaginatedResults } from "@/app/utils/paginationUtils";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61031FetchAllVerificationData
 *   get:
 *     summary: Retrieve user verification details with pagination
 *     description: |
 *       - Fetches paginated user verification details including individual, address, education, and document information.
 *       - Supports searching by various fields such as name, email, phone, city, and state.
 *       - Returns social profiles and associated documents required for verification.
 *     tags: [Super Admin All User Verification]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of results per page (default is 10).
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query that checks multiple fields (user name, email, phone, city, etc.).
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated user verification details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     UT_User_Id:
 *                       type: string
 *                       example: "65f4b29e28b72a001c35a92b"
 *                     UT_User_Name:
 *                       type: string
 *                       example: "John Doe"
 *                     UT_User_Email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     UT_User_Phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     UT_User_Role:
 *                       type: string
 *                       example: "05"
 *                     UT_User_Verification_Status:
 *                       type: string
 *                       example: "Pending"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-19T10:30:00Z"
 *                 individualDetails:
 *                   type: object
 *                   properties:
 *                     ID_First_Name:
 *                       type: string
 *                       example: "John"
 *                     ID_Last_Name:
 *                       type: string
 *                       example: "Doe"
 *                     ID_Email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     ID_Phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     ID_Gender:
 *                       type: string
 *                       example: "Male"
 *                     ID_DOB:
 *                       type: string
 *                       format: date
 *                       example: "1995-06-15"
 *                     ID_City:
 *                       type: string
 *                       example: "Los Angeles"
 *                     ID_Individual_Role:
 *                       type: string
 *                       example: "Student"
 *                 individualAddress:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     IAD_Address_Line1:
 *                       type: string
 *                       example: "123 Street Name"
 *                     IAD_City:
 *                       type: string
 *                       example: "Los Angeles"
 *                     IAD_State:
 *                       type: string
 *                       example: "California"
 *                     IAD_Country:
 *                       type: string
 *                       example: "USA"
 *                     IAD_Pincode:
 *                       type: string
 *                       example: "90001"
 *                 socialProfiles:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     SL_Website:
 *                       type: string
 *                       example: "https://johndoe.com"
 *                     SL_LinkedIn:
 *                       type: string
 *                       example: "https://linkedin.com/in/johndoe"
 *                     SL_Facebook:
 *                       type: string
 *                       example: "https://facebook.com/johndoe"
 *                     SL_Twitter:
 *                       type: string
 *                       example: "https://twitter.com/johndoe"
 *                     SL_Instagram:
 *                       type: string
 *                       example: "https://instagram.com/johndoe"
 *                 education:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     IE_Institute_Name:
 *                       type: string
 *                       example: "Harvard University"
 *                     IE_Program_Name:
 *                       type: string
 *                       example: "Computer Science"
 *                     IE_Specialization:
 *                       type: string
 *                       example: "Artificial Intelligence"
 *                     IE_Start_Date:
 *                       type: string
 *                       format: date
 *                       example: "2018-09-01"
 *                     IE_End_Date:
 *                       type: string
 *                       format: date
 *                       example: "2022-06-01"
 *                     IE_Program_Status:
 *                       type: string
 *                       example: "Completed"
 *                     IE_Score_Grades:
 *                       type: string
 *                       example: "GPA"
 *                     IE_Score_Grades_Value:
 *                       type: string
 *                       example: "3.9"
 *                 documents:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     IDD_Document1_Type:
 *                       type: string
 *                       example: "National ID"
 *                     IDD_Document1_Unq_Identifier:
 *                       type: string
 *                       example: "A123456789"
 *                     IDD_Uploaded1_DtTym:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-10T15:30:00Z"
 *                     IDD_Verified1_Status:
 *                       type: string
 *                       example: "Verified"
 *                     IDD_Individual1_Document:
 *                       type: string
 *                       format: binary
 *                       description: "URL or Base64 encoded document file"
 *       400:
 *         description: Bad request (e.g., invalid parameters).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       404:
 *         description: No records found for the given search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No user verification records found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error."
 */


export async function GET(request) {
  await dbConnect();
  const searchParams = new URL(request.url).searchParams;

  // Define searchable fields
  const searchFields = [
    "user.UT_User_Name",
    "user.UT_User_Email",
    "user.UT_User_Phone",
    "individualDetails.ID_First_Name",
    "individualDetails.ID_Last_Name",
    "individualDetails.ID_Email",
    "individualDetails.ID_Phone",
    "individualAddress.IAD_City",
    "individualAddress.IAD_State",
    "individualAddress.IAD_Country",
  ];

  // Fetch paginated user verification data
  return await getPaginatedResults(
    User,
    searchParams,
    searchFields,
    {}, // No projection (Fetch all data first)
    async (user) => {
      // Fetch Individual Details
      const individualDetails = await IndividualDetails.findOne({ ID_User_Id: user._id });
      if (!individualDetails) return null;

      // Fetch Individual Address
      const individualAddress = await IndividualAddress.findOne({ IAD_Individual_Id: individualDetails._id });

      // Fetch Social Profiles
      const socialProfiles = await SocialProfile.findOne({ SL_Id: individualDetails._id });

      // Fetch Education (only for students, return **first record only** instead of an array)
      const education =
        user.UT_User_Role === "05"
          ? await IndividualEducation.findOne({ IE_Individual_Id: individualDetails._id })
          : null;

      // Fetch Documents (return **first document only** instead of an array)
      const document = await IndividualDocuments.findOne({ IDD_Individual_Id: individualDetails._id });

      // If no documents exist, skip user (documents are required for verification)
      if (!document) return null;

      // Format and return user data
      return {
        user: {
          UT_User_Id: user._id,
          UT_User_Name: user.UT_User_Name,
          UT_User_Email: user.UT_User_Email,
          UT_User_Phone: user.UT_User_Phone,
          UT_User_Role: user.UT_User_Role,
          UT_User_Verification_Status: user.UT_User_Verification_Status,
          createdAt: user.createdAt,
        },
        individualDetails: {
          ID_First_Name: individualDetails.ID_First_Name,
          ID_Last_Name: individualDetails.ID_Last_Name,
          ID_Email: individualDetails.ID_Email,
          ID_Phone: individualDetails.ID_Phone,
          ID_Gender: individualDetails.ID_Gender,
          ID_DOB: individualDetails.ID_DOB,
          ID_City: individualDetails.ID_City,
          ID_Individual_Role: individualDetails.ID_Individual_Role,
        },
        individualAddress: individualAddress
          ? {
              IAD_Address_Line1: individualAddress.IAD_Address_Line1,
              IAD_Address_Line2: individualAddress.IAD_Address_Line2,
              IAD_City: individualAddress.IAD_City,
              IAD_State: individualAddress.IAD_State,
              IAD_Country: individualAddress.IAD_Country,
              IAD_Pincode: individualAddress.IAD_Pincode,
            }
          : null,
        socialProfiles: socialProfiles
          ? {
              SL_Website: socialProfiles.SL_Website,
              SL_LinkedIn: socialProfiles.SL_LinkedIn,
              SL_Facebook: socialProfiles.SL_Facebook,
              SL_Twitter: socialProfiles.SL_Twitter,
              SL_Instagram: socialProfiles.SL_Instagram,
            }
          : null,
        education: education
          ? {
              IE_Institute_Name: education.IE_Institute_Name,
              IE_Program_Name: education.IE_Program_Name,
              IE_Specialization: education.IE_Specialization,
              IE_Start_Date: education.IE_Start_Date,
              IE_End_Date: education.IE_End_Date,
              IE_Program_Status: education.IE_Program_Status,
              IE_Score_Grades: education.IE_Score_Grades,
              IE_Score_Grades_Value: education.IE_Score_Grades_Value,
            }
          : null,
        documents: document
          ? {
              IDD_Document1_Type: document.IDD_Document1_Type,
              IDD_Document1_Unq_Identifier: document.IDD_Document1_Unq_Identifier,
              IDD_Uploaded1_DtTym: document.IDD_Uploaded1_DtTym,
              IDD_Verified1_Status: document.IDD_Verified1_Status,
              IDD_Individual1_Document: document.IDD_Individual1_Document,
            }
          : null,
      };
    }
  );
}
