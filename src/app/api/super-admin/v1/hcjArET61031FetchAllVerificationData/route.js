// import { NextResponse } from "next/server";
// import User from "@/app/models/user_table";
// import IndividualDetails from "@/app/models/individual_details";
// import IndividualAddress from "@/app/models/individual_address_detail";
// import SocialProfile from "@/app/models/social_link";
// import IndividualEducation from "@/app/models/individual_education";
// import IndividualDocuments from "@/app/models/individual_document_details";
// import { dbConnect } from "@/app/utils/dbConnect";
// import { getPaginatedResults } from "@/app/utils/paginationUtils";


// export async function GET(request) {
//   await dbConnect();
//   const searchParams = new URL(request.url).searchParams;

//   // Define searchable fields
//   const searchFields = [
//     "user.UT_User_Name",
//     "user.UT_User_Email",
//     "user.UT_User_Phone",
//     "individualDetails.ID_First_Name",
//     "individualDetails.ID_Last_Name",
//     "individualDetails.ID_Email",
//     "individualDetails.ID_Phone",
//     "individualAddress.IAD_City",
//     "individualAddress.IAD_State",
//     "individualAddress.IAD_Country",
//   ];

//   // Fetch paginated user verification data
//   return await getPaginatedResults(
//     User,
//     searchParams,
//     searchFields,
//     {}, // No projection (Fetch all data first)
//     async (user) => {
//       // Fetch Individual Details
//       const individualDetails = await IndividualDetails.findOne({ ID_User_Id: user._id });
//       if (!individualDetails) return null;

//       // Fetch Individual Address
//       const individualAddress = await IndividualAddress.findOne({ IAD_Individual_Id: individualDetails._id });

//       // Fetch Social Profiles
//       const socialProfiles = await SocialProfile.findOne({ SL_Id: individualDetails._id });

//       // Fetch Education (only for students, return **first record only** instead of an array)
//       const education =
//         user.UT_User_Role === "05"
//           ? await IndividualEducation.findOne({ IE_Individual_Id: individualDetails._id })
//           : null;

//       // Fetch Documents (return **first document only** instead of an array)
//       const document = await IndividualDocuments.findOne({ IDD_Individual_Id: individualDetails._id });

//       // If no documents exist, skip user (documents are required for verification)
//       if (!document) return null;

//       // Format and return user data
//       return {
//         user: {
//           UT_User_Id: user._id,
//           UT_User_Name: user.UT_User_Name,
//           UT_User_Email: user.UT_User_Email,
//           UT_User_Phone: user.UT_User_Phone,
//           UT_User_Role: user.UT_User_Role,
//           UT_User_Verification_Status: user.UT_User_Verification_Status,
//           createdAt: user.createdAt,
//         },
//         individualDetails: {
//           ID_First_Name: individualDetails.ID_First_Name,
//           ID_Last_Name: individualDetails.ID_Last_Name,
//           ID_Email: individualDetails.ID_Email,
//           ID_Phone: individualDetails.ID_Phone,
//           ID_Gender: individualDetails.ID_Gender,
//           ID_DOB: individualDetails.ID_DOB,
//           ID_City: individualDetails.ID_City,
//           ID_Individual_Role: individualDetails.ID_Individual_Role,
//         },
//         individualAddress: individualAddress
//           ? {
//               IAD_Address_Line1: individualAddress.IAD_Address_Line1,
//               IAD_Address_Line2: individualAddress.IAD_Address_Line2,
//               IAD_City: individualAddress.IAD_City,
//               IAD_State: individualAddress.IAD_State,
//               IAD_Country: individualAddress.IAD_Country,
//               IAD_Pincode: individualAddress.IAD_Pincode,
//             }
//           : null,
//         socialProfiles: socialProfiles
//           ? {
//               SL_Website: socialProfiles.SL_Website,
//               SL_LinkedIn: socialProfiles.SL_LinkedIn,
//               SL_Facebook: socialProfiles.SL_Facebook,
//               SL_Twitter: socialProfiles.SL_Twitter,
//               SL_Instagram: socialProfiles.SL_Instagram,
//             }
//           : null,
//         education: education
//           ? {
//               IE_Institute_Name: education.IE_Institute_Name,
//               IE_Program_Name: education.IE_Program_Name,
//               IE_Specialization: education.IE_Specialization,
//               IE_Start_Date: education.IE_Start_Date,
//               IE_End_Date: education.IE_End_Date,
//               IE_Program_Status: education.IE_Program_Status,
//               IE_Score_Grades: education.IE_Score_Grades,
//               IE_Score_Grades_Value: education.IE_Score_Grades_Value,
//             }
//           : null,
//         documents: document
//           ? {
//               IDD_Document1_Type: document.IDD_Document1_Type,
//               IDD_Document1_Unq_Identifier: document.IDD_Document1_Unq_Identifier,
//               IDD_Uploaded1_DtTym: document.IDD_Uploaded1_DtTym,
//               IDD_Verified1_Status: document.IDD_Verified1_Status,
//               IDD_Individual1_Document: document.IDD_Individual1_Document,
//             }
//           : null,
//       };
//     }
//   );
// }


import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualAddress from "@/app/models/individual_address_detail";
import SocialProfile from "@/app/models/social_link";
import IndividualEducation from "@/app/models/individual_education";
import IndividualDocuments from "@/app/models/individual_document_details";
import { dbConnect } from "@/app/utils/dbConnect";

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


