import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualAddress from "@/app/models/individual_address_detail";
import SocialProfile from "@/app/models/social_link";
import IndividualEducation from "@/app/models/individual_education";
import IndividualDocuments from "@/app/models/individual_document_details";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61031FetchAllVerificationData:
 *   get:
 *     summary: Get paginated and filtered list of users for verification
 *     description: >
 *       Fetches users (students, admins, etc.) with their individual details, address, documents, education, and social profiles.  
 *       Only returns complete and valid user records (e.g. all required linked documents and details must be present).
 *     tags:
 *       - Super Admin Verify A user - Admin, Staff, Support, Student
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword to match name, email, phone, location, etc.
 *       - in: query
 *         name: [dynamic]
 *         schema:
 *           type: string
 *         description: Additional dynamic filters (e.g., UT_User_Role, UT_User_Verification_Status, etc.). Use `__NOT_NULL__` to filter for non-null values.
 *     responses:
 *       200:
 *         description: List of valid users with full profile information
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
 *                       user:
 *                         type: object
 *                         properties:
 *                           UT_User_Id:
 *                             type: string
 *                           UT_User_Name:
 *                             type: string
 *                           UT_User_Email:
 *                             type: string
 *                           UT_User_Phone:
 *                             type: string
 *                           UT_User_Role:
 *                             type: string
 *                           UT_User_Verification_Status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                       individualDetails:
 *                         type: object
 *                         properties:
 *                           ID_First_Name:
 *                             type: string
 *                           ID_Last_Name:
 *                             type: string
 *                           ID_Email:
 *                             type: string
 *                           ID_Phone:
 *                             type: string
 *                           ID_Gender:
 *                             type: string
 *                           ID_DOB:
 *                             type: string
 *                             format: date
 *                           ID_City:
 *                             type: string
 *                           ID_Individual_Role:
 *                             type: string
 *                       individualAddress:
 *                         type: object
 *                         properties:
 *                           IAD_Address_Line1:
 *                             type: string
 *                           IAD_City:
 *                             type: string
 *                           IAD_State:
 *                             type: string
 *                           IAD_Country:
 *                             type: string
 *                           IAD_Pincode:
 *                             type: string
 *                       socialProfiles:
 *                         type: object
 *                         properties:
 *                           SL_Website:
 *                             type: string
 *                           SL_LinkedIn:
 *                             type: string
 *                           SL_Facebook:
 *                             type: string
 *                           SL_Twitter:
 *                             type: string
 *                           SL_Instagram:
 *                             type: string
 *                       education:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           IE_Institute_Name:
 *                             type: string
 *                           IE_Program_Name:
 *                             type: string
 *                           IE_Specialization:
 *                             type: string
 *                           IE_Start_Date:
 *                             type: string
 *                             format: date
 *                           IE_End_Date:
 *                             type: string
 *                             format: date
 *                           IE_Program_Status:
 *                             type: string
 *                           IE_Score_Grades:
 *                             type: string
 *                           IE_Score_Grades_Value:
 *                             type: number
 *                       documents:
 *                         type: object
 *                         properties:
 *                           IDD_Document1_Type:
 *                             type: string
 *                           IDD_Document1_Unq_Identifier:
 *                             type: string
 *                           IDD_Uploaded1_DtTym:
 *                             type: string
 *                             format: date-time
 *                           IDD_Verified1_Status:
 *                             type: string
 *                           IDD_Individual1_Document:
 *                             type: string
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 batchNumber:
 *                   type: integer
 *       400:
 *         description: Invalid query or pagination parameters
 *       500:
 *         description: Internal Server Error
 */


// Custom pagination logic integrated into the API
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

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const batchSize = 100; // Fetch 100 records at a time
  const skip = (page - 1) * pageSize;

  // Extract search query
  const searchQuery = searchParams.get("search") || "";
  const filterParams = {};

  // Add dynamic filters for pagination (if any)
  searchParams.forEach((value, key) => {
    if (!["page", "pageSize", "search"].includes(key)) {
      filterParams[key] = value === "__NOT_NULL__" ? { $ne: null } : value;
    }
  });

  // Create query to search for the users
  let query = { ...filterParams };
  if (searchQuery && searchFields.length > 0) {
    query.$or = searchFields.map((field) => ({
      [field]: { $regex: searchQuery, $options: "i" }
    }));
  }

  // Fetch records based on query
  const results = await User.find(query)
    .skip(skip)
    .limit(batchSize)
    .sort({ createdAt: -1 });

  // Format and filter out invalid results (skip null values)
  const validResults = await Promise.all(
    results.map(async (user) => {
      // Fetch Individual Details
      const individualDetails = await IndividualDetails.findOne({
        ID_User_Id: user._id,
      });

      if (!individualDetails) return null; // Skip if individual details are not found

      // Check for Individual Documents
      const documents = await IndividualDocuments.findOne({
        IDD_Individual_Id: individualDetails._id,
      });

      if (!documents) return null; // Skip if documents are missing

      // Fetch Individual Address
      const individualAddress = await IndividualAddress.findOne({
        IAD_Individual_Id: individualDetails._id,
      });

      const socialProfiles = await SocialProfile.findOne({
        SL_Id: individualDetails._id,
      });

      // Fetch Education only if the user is a student
      const education =
        user.UT_User_Role === "05" // Role 05 = Student
          ? await IndividualEducation.findOne({
              IE_Individual_Id: individualDetails._id,
            })
          : null;

      // Skip user if any required data is missing
      if (!individualAddress || !socialProfiles || (user.UT_User_Role === "05" && !education)) {
        return null;
      }

      // Format the response for valid records
      const response = {
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
          : undefined,
        socialProfiles: socialProfiles
          ? {
              SL_Website: socialProfiles.SL_Website,
              SL_LinkedIn: socialProfiles.SL_LinkedIn,
              SL_Facebook: socialProfiles.SL_Facebook,
              SL_Twitter: socialProfiles.SL_Twitter,
              SL_Instagram: socialProfiles.SL_Instagram,
            }
          : undefined,
      };

      if (user.UT_User_Role === "05" && education) {
        response.education = {
          IE_Institute_Name: education.IE_Institute_Name,
          IE_Program_Name: education.IE_Program_Name,
          IE_Specialization: education.IE_Specialization,
          IE_Start_Date: education.IE_Start_Date,
          IE_End_Date: education.IE_End_Date,
          IE_Program_Status: education.IE_Program_Status,
          IE_Score_Grades: education.IE_Score_Grades,
          IE_Score_Grades_Value: education.IE_Score_Grades_Value,
        };
      }

      response.documents = documents
        ? {
            IDD_Document1_Type: documents.IDD_Document1_Type,
            IDD_Document1_Unq_Identifier: documents.IDD_Document1_Unq_Identifier,
            IDD_Uploaded1_DtTym: documents.IDD_Uploaded1_DtTym,
            IDD_Verified1_Status: documents.IDD_Verified1_Status,
            IDD_Individual1_Document: documents.IDD_Individual1_Document,
          }
        : undefined;

      return response;
    })
  );

  // Remove null values (invalid users)
  const validResultsFiltered = validResults.filter((result) => result !== null);

  // Calculate the total count excluding invalid users
  const totalValidUsers = validResultsFiltered.length;

  // Return the paginated response with valid users only
  return NextResponse.json({
    data: validResultsFiltered,
    total: totalValidUsers, // Update total to reflect only valid users
    totalPages: Math.ceil(totalValidUsers / pageSize),
    currentPage: page,
    batchNumber: Math.ceil(page / (batchSize / pageSize)),
  });
}


