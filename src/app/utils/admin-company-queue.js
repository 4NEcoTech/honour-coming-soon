import { generateQRCodeWithLogo } from "./generate-eco-link";
import { uploadToGoogleDrive } from "./googleDrive";
import EcoLink from "@/app/models/ecl_ecolink";
import CompanyProfile from "@/app/models/ecl_company_profile";
import { dbConnect } from "./dbConnect";

const companyQueue = [];
let isProcessing = false;

export async function queueCompanyEcoLinkCreation(task) {
  companyQueue.push(task);
  if (!isProcessing) {
    processCompanyQueue();
  }
}

export async function queueCompanyEcoLinkUpdate(task) {
  companyQueue.unshift(task);
  if (!isProcessing) {
    processCompanyQueue();
  }
}

async function processCompanyQueue() {
  isProcessing = true;

  while (companyQueue.length > 0) {
    const task = companyQueue.shift();
    try {
      if (task.type === "update") {
        await updateCompanyEcoLink(task);
      } else {
        await createCompanyEcoLink(task);
      }
    } catch (error) {
      console.error("Failed to process company EcoLink task:", error);
      if (task.retryCount === undefined) {
        task.retryCount = 1;
        companyQueue.push(task);
      } else if (task.retryCount < 3) {
        task.retryCount++;
        companyQueue.push(task);
      }
    }
  }

  isProcessing = false;
}

async function createCompanyEcoLink({
  companyId,
  profileName,
  profilePicture,
  phone,
  email,
  address,
  city,
  state,
  website,
  industry,
  size,
  lang = "en",
  route = "company-ecolink",
}) {
  await dbConnect();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}/${lang}/${route}/${companyId}`;

  const qrBuffer = await generateQRCodeWithLogo(profileUrl, profilePicture || null);
  const qrDriveUrl = await uploadToGoogleDrive(
    qrBuffer,
    `company_ecolink_qr_${companyId}.png`,
    "image/png"
  );

  await Promise.all([
    EcoLink.findOneAndUpdate(
      { ECL_EL_Id: companyId, ECL_EL_Id_Source: "CompanyDetails" },
      {
        ECL_EL_Id: companyId,
        ECL_EL_Id_Source: "CompanyDetails",
        ECL_EL_Photo_ViewPermission: !!profilePicture,
        ECL_EL_Product: 3, // Assuming 3 for employer/company
        ECL_EL_Profile_Url: profilePicture || "",
        ECL_EL_EcoLink_Name: profileName || "Unnamed Company",
        ECL_EL_EcoLink_QR_Code: qrDriveUrl,
        ECL_EL_Address: address || "Address not provided",
        ECL_EL_Address_ViewPermission: true,
        ECL_EL_Current_City: city || "City not provided",
        ECL_EL_City_ViewPermission: true,
        ECL_EL_Current_State: state || "State not provided",
        ECL_EL_State_ViewPermission: true,
        ECL_EL_Phone_Number: phone || "",
        ECL_EL_Phone_ViewPermission: !!phone,
        ECL_EL_Email_Address: email || "",
        ECL_EL_Email_ViewPermission: !!email,
        ECL_EL_Website_Url: website || "",
        ECL_EL_Session_Id: Date.now(),
        ECL_EL_Audit_Trail: "Company profile created via API",
      },
      { upsert: true, new: true }
    ),

    CompanyProfile.findOneAndUpdate(
      { ECL_ECP_Company_Id: companyId },
      {
        ECL_ECP_Industry: industry,
        ECL_ECP_Company_Size: size,
        ECL_ECP_Session_Id: Date.now(),
        ECL_ECP_Audit_Trail: "Company profile created via API",
      },
      { upsert: true, new: true }
    ),
  ]);

  console.log(`Company EcoLink created for ${companyId}`);
}

async function updateCompanyEcoLink({ companyId, profilePicture, profileName }) {
  await dbConnect();

  await EcoLink.findOneAndUpdate(
    { ECL_EL_Id: companyId, ECL_EL_Id_Source: "CompanyDetails" },
    {
      ECL_EL_Profile_Url: profilePicture || "",
      ECL_EL_EcoLink_Name: profileName,
      ECL_EL_Session_Id: Date.now(),
      ECL_EL_Audit_Trail: "Company logo updated via API",
    }
  );

  console.log(`Company EcoLink updated for ${companyId}`);
}