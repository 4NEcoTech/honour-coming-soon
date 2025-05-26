// import { NextResponse } from "next/server";
// import { dbConnect } from "@/app/utils/dbConnect";
// import IndividualDetails from "@/app/models/individual_details";
// import CompanyDetails from "@/app/models/company_details";
// import CompanyAddress from "@/app/models/company_address_details";
// import SocialLinks from "@/app/models/social_link";
// import CompanyDocuments from "@/app/models/company_kyc_details";

// /**
//  * @swagger
//  * /api/hcj/v1/institutionPublicProfile/[institutionId]
//  *   get:
//  *     summary: Get Institution Public Profile
//  *     description: Fetches public details of an institution including company details, address, and social links.
//  *     tags: [Institution Public Profile]
//  *     parameters:
//  *       - in: path
//  *         name: institutionId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Unique ID of the institution
//  *     responses:
//  *       200:
//  *         description: Institution public profile retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     individualDetails:
//  *                       type: object
//  *                     companyDetails:
//  *                       type: object
//  *                     companyAddress:
//  *                       type: object
//  *                     socialLinks:
//  *                       type: object
//  *       400:
//  *         description: Institution ID is required
//  *       404:
//  *         description: Institution details not found
//  *       500:
//  *         description: Internal Server Error
//  */

// export async function GET(req, { params }) {
//   try {
//     await dbConnect();

//     // Extract institution ID from request parameters
//     const institutionId = await params?.institutionId;
//     if (!institutionId) {
//       return NextResponse.json(
//         { success: false, message: "Institution ID is required" },
//         { status: 400 }
//       );
//     }

//     console.log("Fetching public details for institution ID:", institutionId);

//     // Fetch Individual Details
//     const individualDetails = await IndividualDetails.findById(institutionId).lean();
//     if (!individualDetails) {
//       return NextResponse.json(
//         { success: false, message: "Individual details not found" },
//         { status: 404 }
//       );
//     }

//     // Fetch Company Details using Individual ID
//     const companyDetails = await CompanyDetails.findOne({
//       CD_Individual_Id: individualDetails._id,
//     }).lean();

//     if (!companyDetails) {
//       return NextResponse.json(
//         { success: false, message: "Institution details not found" },
//         { status: 404 }
//       );
//     }

//     // Fetch related data concurrently using company ID
//     const [companyAddress, socialLinks, companyDocuments] = await Promise.all([
//       CompanyAddress.findOne({ CAD_Company_Id: companyDetails._id }).lean(),
//       SocialLinks.findOne({ SL_Id: companyDetails._id }).lean(),
//       CompanyDocuments.findOne({ CKD_Company_Id: companyDetails._id }).lean(),
//     ]);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Institution public profile retrieved successfully",
//         data: {
//           individualDetails,
//           companyDetails,
//           companyAddress: companyAddress || null,
//           socialLinks: socialLinks || null,
//           companyDocuments: companyDocuments || null,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching institution public profile:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";
import IndividualDetails from "@/app/models/individual_details";
import CompanyDetails from "@/app/models/company_details";
import CompanyAddress from "@/app/models/company_address_details";
import SocialLinks from "@/app/models/social_link";
import CompanyDocuments from "@/app/models/company_kyc_details";
import CompanyVisibility from "@/app/models/company_info_visibility";

/**
 * @swagger
 * /api/hcj/v1/institutionPublicProfile/[institutionId]
 *   get:
 *     summary: Get Institution Public Profile
 *     description: Fetches public details of an institution including company details, address, and social links.
 *     tags: [Institution Public Profile]
 *     parameters:
 *       - in: path
 *         name: institutionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the institution
 *     responses:
 *       200:
 *         description: Institution public profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     individualDetails:
 *                       type: object
 *                     companyDetails:
 *                       type: object
 *                     companyAddress:
 *                       type: object
 *                     socialLinks:
 *                       type: object
 *       400:
 *         description: Institution ID is required
 *       404:
 *         description: Institution details not found
 *       500:
 *         description: Internal Server Error
 */

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Extract institution ID from request parameters
    const institutionId = await params?.institutionId;
    if (!institutionId) {
      return NextResponse.json(
        { success: false, message: "Institution ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching public details for institution ID:", institutionId);

    // Fetch Individual Details
    // const individualDetails = await IndividualDetails.findById(institutionId).lean();
    // if (!individualDetails) {
    //   return NextResponse.json(
    //     { success: false, message: "Individual details not found" },
    //     { status: 404 }
    //   );
    // }

    // // Fetch Company Details using Individual ID
    // const companyDetails = await CompanyDetails.findOne({
    //   CD_Individual_Id: individualDetails._id,
    // }).lean();

    const companyDetails = await CompanyDetails.findById(institutionId).lean();
if (!companyDetails) {
  return NextResponse.json(
    { success: false, message: "Institution details not found" },
    { status: 404 }
  );
}


    if (!companyDetails) {
      return NextResponse.json(
        { success: false, message: "Institution details not found" },
        { status: 404 }
      );
    }

    // Fetch related data concurrently using company ID
    const [companyAddress, socialLinks, companyDocuments, companyVisibility] = await Promise.all([
      CompanyAddress.findOne({ CAD_Company_Id: companyDetails._id }).lean(),
      SocialLinks.findOne({ SL_Id: companyDetails._id }).lean(),
      CompanyDocuments.findOne({ CKD_Company_Id: companyDetails._id }).lean(),
      CompanyVisibility.findOne({ CIV_Company_Id: companyDetails._id }).lean(),
    ]);
    

    return NextResponse.json(
      {
        success: true,
        message: "Institution public profile retrieved successfully",
        data: {
          // individualDetails,
          companyDetails,
          companyAddress: companyAddress || null,
          socialLinks: socialLinks || null,
          companyDocuments: companyDocuments || null,
          companyVisibility: companyVisibility || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching institution public profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
