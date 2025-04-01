import { NextResponse } from "next/server";
import CompanyDetails from "@/app/models/company_details";
import CompanyAddress from "@/app/models/company_address_details";
import CompanyKYC from "@/app/models/company_kyc_details";
import SocialProfile from "@/app/models/social_link";
import IndividualDetails from "@/app/models/individual_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { getPaginatedResults } from "@/app/utils/paginationUtils";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61041FetchInstitutionVerificationData:
 *   get:
 *     summary: Retrieve company details with pagination
 *     description: |
 *       - Fetches paginated company details including company KYC, address, and administrator details.
 *       - Supports searching by various fields such as company name, email, industry, and registration number.
 *       - Returns associated social profiles and verification details.
 *     tags: [Get Institution Details For Super Admin Verification]
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
 *         description: Search query that checks multiple fields (company name, email, phone, registration number, etc.).
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated company details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65f4b29e28b72a001c35a92b"
 *                   description: "Unique identifier for the company KYC record."
 *                 administrator:
 *                   type: object
 *                   nullable: true
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
 *                 companyDetails:
 *                   type: object
 *                   properties:
 *                     CD_Company_Name:
 *                       type: string
 *                       example: "TechCorp Pvt Ltd"
 *                     CD_Company_Industry:
 *                       type: string
 *                       example: "Information Technology"
 *                     CD_Company_Email:
 *                       type: string
 *                       example: "info@techcorp.com"
 *                     CD_Phone_Number:
 *                       type: string
 *                       example: "+9876543210"
 *                     CD_Company_Website:
 *                       type: string
 *                       example: "https://www.techcorp.com"
 *                 companyAddress:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     CAD_Address_Line1:
 *                       type: string
 *                       example: "123 Street Name"
 *                     CAD_City:
 *                       type: string
 *                       example: "New York"
 *                     CAD_State:
 *                       type: string
 *                       example: "NY"
 *                     CAD_Country:
 *                       type: string
 *                       example: "USA"
 *                     CAD_Pincode:
 *                       type: string
 *                       example: "10001"
 *                 socialProfiles:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     SL_LinkedIn:
 *                       type: string
 *                       example: "https://linkedin.com/in/techcorp"
 *                     SL_Twitter:
 *                       type: string
 *                       example: "https://twitter.com/techcorp"
 *                 companyKYC:
 *                   type: object
 *                   properties:
 *                     CKD_Company_Registration_Number:
 *                       type: string
 *                       example: "ABC123456"
 *                     CKD_Company_Tax_Id:
 *                       type: string
 *                       example: "TAX987654"
 *                     CKD_Verification_Status:
 *                       type: string
 *                       example: "verified"
 *                     CKD_Verification_DtTym:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-19T10:30:00Z"
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
 *                   example: "No company records found."
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
    "CD_Company_Name",
    "CD_Company_Email",
    "CD_Company_Location",
    "CD_Company_Industry",
    "CD_Company_Industry_SubCategory",
    "CD_Phone_Number",
    "CKD_Company_Registration_Number",
    "CKD_Company_Tax_Id",
    "ID_First_Name",
    "ID_Last_Name",
    "ID_Email"
  ];

  //  REMOVE projection (fetch everything first)
  return await getPaginatedResults(
    CompanyKYC,
    searchParams,
    searchFields,
    {}, //  No projection (Fetch all data first)
    async (companyKYC) => {
      // Fetch Company Details using KYC's foreign key (Company_Id)
      const companyDetails = await CompanyDetails.findOne({ _id: companyKYC.CKD_Company_Id });
      if (!companyDetails) return null; // Skip if no company details exist

      // Fetch Administrator Details using `CD_Individual_Id`
      const adminDetails = await IndividualDetails.findOne({ _id: companyDetails.CD_Individual_Id });

      // Fetch Company Address using CompanyDetails foreign key
      const companyAddress = await CompanyAddress.findOne({ CAD_Company_Id: companyDetails._id });

      // Fetch Social Links using CompanyDetails foreign key
      const socialProfiles = await SocialProfile.findOne({ SL_Id: companyDetails._id });

      //  Now we filter only the required fields instead of using `projection`
      return {
        _id: companyKYC._id,
        administrator: adminDetails
          ? {
              ID_First_Name: adminDetails.ID_First_Name,
              ID_Last_Name: adminDetails.ID_Last_Name,
              ID_Email: adminDetails.ID_Email,
              ID_Phone: adminDetails.ID_Phone,
            }
          : null,
        companyDetails: {
          CD_Company_Name: companyDetails.CD_Company_Name,
          CD_Company_Establishment_Year: companyDetails.CD_Company_Establishment_Year,
          CD_Company_Location: companyDetails.CD_Company_Location,
          CD_Company_Email: companyDetails.CD_Company_Email,
          CD_Company_Alternate_Email: companyDetails.CD_Company_Alternate_Email,
          CD_Phone_Number: companyDetails.CD_Phone_Number,
          CD_Alternate_Phone_Number: companyDetails.CD_Alternate_Phone_Number,
          CD_Company_Size: companyDetails.CD_Company_Size,
          CD_Company_Industry: companyDetails.CD_Company_Industry,
          CD_Company_Industry_SubCategory: companyDetails.CD_Company_Industry_SubCategory,
          CD_Company_Website: companyDetails.CD_Company_Website,
          CD_Company_Logo: companyDetails.CD_Company_Logo,
          CD_Company_Cover_Profile: companyDetails.CD_Company_Cover_Profile,
          CD_Company_About: companyDetails.CD_Company_About,
          CD_Company_Type: companyDetails.CD_Company_Type,
        },
        companyAddress: companyAddress
          ? {
              CAD_Address_Line1: companyAddress.CAD_Address_Line1,
              CAD_Address_Line2: companyAddress.CAD_Address_Line2,
              CAD_City: companyAddress.CAD_City,
              CAD_State: companyAddress.CAD_State,
              CAD_Country: companyAddress.CAD_Country,
              CAD_Pincode: companyAddress.CAD_Pincode,
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
        companyKYC: {
          CKD_KYCNum: companyKYC.CKD_KYCNum,
          CKD_Company_Registration_Number: companyKYC.CKD_Company_Registration_Number,
          CKD_Company_Registration_Documents: companyKYC.CKD_Company_Registration_Documents,
          CKD_Company_Tax_Id: companyKYC.CKD_Company_Tax_Id,
          CKD_Company_Tax_Documents: companyKYC.CKD_Company_Tax_Documents,
          CKD_Institution_Type: companyKYC.CKD_Institution_Type,
          CKD_AISHE_Code: companyKYC.CKD_AISHE_Code,
          CKD_College_Name: companyKYC.CKD_College_Name,
          CKD_Affiliated_University: companyKYC.CKD_Affiliated_University,
          CKD_Submitted_By: companyKYC.CKD_Submitted_By,
          CKD_Submission_DtTym: companyKYC.CKD_Submission_DtTym,
          CKD_Verification_Status: companyKYC.CKD_Verification_Status,
          CKD_Verification_DtTym: companyKYC.CKD_Verification_DtTym,
          CKD_Verified_By: companyKYC.CKD_Verified_By,
          CKD_Remarks: companyKYC.CKD_Remarks,
        },
        createdAt: companyKYC.createdAt
      };
    }
  );
}



