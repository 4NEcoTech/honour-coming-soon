import { generateQRCodeWithLogo } from "./generate-eco-link";
import { uploadToGoogleDrive } from "./googleDrive";
import EcoLink from "@/app/models/ecl_ecolink";
import CompanyProfile from "@/app/models/ecl_company_profile";
import { dbConnect } from "./dbConnect";

const institutionQueue = [];
let isProcessing = false;

export async function queueEcoLinkCreation(task) {
  institutionQueue.push(task);
  if (!isProcessing) {
    processInstitutionQueue();
  }
}

export async function queueEcoLinkUpdate(task) {
  // Add to front of queue for higher priority
  institutionQueue.unshift(task);
  if (!isProcessing) {
    processInstitutionQueue();
  }
}

async function processInstitutionQueue() {
  isProcessing = true;

  while (institutionQueue.length > 0) {
    const task = institutionQueue.shift();
    try {
      if (task.type === "update") {
        await updateCompanyEcoLink(task);
      } else {
        await createCompanyEcoLink(task);
      }
    } catch (error) {
      console.error("Failed to process institution EcoLink task:", error);
      // Implement retry logic (max 3 retries)
      if (task.retryCount === undefined) {
        task.retryCount = 1;
        institutionQueue.push(task);
      } else if (task.retryCount < 3) {
        task.retryCount++;
        institutionQueue.push(task);
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
  establishmentYear,
  lang = "en",
  route = "institution-ecolink",
}) {
  await dbConnect();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}/${lang}/${route}/${companyId}`;

  // Generate QR code with company logo as center image
  const qrBuffer = await generateQRCodeWithLogo(
    profileUrl,
    profilePicture || null
  );
  const qrDriveUrl = await uploadToGoogleDrive(
    qrBuffer,
    `company_ecolink_qr_${companyId}.png`,
    "image/png"
  );

  // Execute all updates in parallel
  await Promise.all([
    // Update EcoLink record
    EcoLink.findOneAndUpdate(
      { ECL_EL_Id: companyId, ECL_EL_Id_Source: "CompanyDetails" },
      {
        ECL_EL_Id: companyId,
        ECL_EL_Id_Source: "CompanyDetails",
        ECL_EL_Photo_ViewPermission: !!profilePicture,
        ECL_EL_Product: 2, // Assuming 2 is the product code for institutions
        ECL_EL_Profile_Url: profilePicture || "",
        ECL_EL_EcoLink_Name: profileName || "Unnamed Institution",
        ECL_EL_EcoLink_QR_Code: qrDriveUrl,
        ECL_EL_Address: address || "Address not provided",
        ECL_EL_Address_ViewPermission: true,
        ECL_EL_Current_City: city || "City not provided",
        ECL_EL_City_ViewPermission: true,
        ECL_EL_Current_State: state || "State not provided",
        ECL_EL_State_ViewPermission: true,
        ECL_EL_Phone_Number: phone || "",
        ECL_EL_Phone_ViewPermission: phone ? true : false,
        ECL_EL_Email_Address: email || "",
        ECL_EL_Email_ViewPermission: email ? true : false,
        ECL_EL_Website_Url: website || "",
        ECL_EL_Session_Id: Date.now(),
        ECL_EL_Audit_Trail: "Company profile created via API",
      },
      { upsert: true, new: true }
    ),

    // Update company profile
    CompanyProfile.findOneAndUpdate(
      { ECL_ECP_Company_Id: companyId },
      {
        ECL_ECP_Establishment_Year: establishmentYear,
        ECL_ECP_Session_Id: Date.now(),
        ECL_ECP_Audit_Trail: "Company profile created via API",
      },
      { upsert: true, new: true }
    ),
  ]);

  console.log(`Company EcoLink created for ${companyId}`);
}

async function updateCompanyEcoLink({
  companyId,
  profilePicture,
  profileName,
}) {
  await dbConnect();

  // Only update the necessary fields (logo and name)
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
