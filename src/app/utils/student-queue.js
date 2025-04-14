import { generateQRCodeWithLogo } from './generate-eco-link';
import { uploadToGoogleDrive } from './googleDrive';
import EcoLink from '@/app/models/ecl_ecolink';
import IndividualDesignation from '@/app/models/ecl_individual_details'; 
import { dbConnect } from './dbConnect';

const studentEcoLinkQueue = [];
let isProcessing = false;

export async function queueStudentEcoLinkCreation(task) {
  studentEcoLinkQueue.push(task);
  if (!isProcessing) {
    processQueue();
  }
}

async function processQueue() {
  isProcessing = true;
  
  while (studentEcoLinkQueue.length > 0) {
    const task = studentEcoLinkQueue.shift();
    try {
      await createStudentEcoLink(task);
    } catch (error) {
      console.error('Failed to process Student EcoLink task:', error);
      // Implement retry logic here if needed
    }
  }
  
  isProcessing = false;
}

async function createStudentEcoLink({
  individualId,
  profileName,
  profilePicture,
  phone,
  email,
  address,
  city,
  state,
  website,
  institute,
  program,
  specialization,
  lang = 'en',
  route = 'student-ecolink',
  designation = ''
}) {
  await dbConnect();
  
  // Construct full URL dynamically
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}/${lang}/${route}/${individualId}`;
  
  // Generate QR code (with profile picture as logo if available)
  const qrBuffer = await generateQRCodeWithLogo(profileUrl, profilePicture || null);
  
  // Upload QR code to Google Drive
  const qrDriveUrl = await uploadToGoogleDrive(
    qrBuffer,
    `student_ecolink_qr_${individualId}.png`,
    'image/png'
  );

  // Additional education info for students
  const educationInfo = [];
  if (institute) educationInfo.push(institute);
  if (program) educationInfo.push(program);
  if (specialization) educationInfo.push(specialization);
  const educationText = educationInfo.join(' | ');

  // Execute all updates in parallel
  await Promise.all([
    // Update EcoLink record
    EcoLink.findOneAndUpdate(
      { ECL_EL_Id: individualId },
      {
        ECL_EL_Id: individualId,
        ECL_EL_Id_Source: 'StudentProfile',
        ECL_EL_Photo_ViewPermission: !!profilePicture,
        ECL_EL_Product: 3, // Different product code for students
        ECL_EL_Profile_Url: profilePicture || '', 
        ECL_EL_EcoLink_Name: profileName,
        ECL_EL_EcoLink_QR_Code: qrDriveUrl,
        ECL_EL_Address: address,
        ECL_EL_Address_ViewPermission: true,
        ECL_EL_Current_City: city,
        ECL_EL_City_ViewPermission: true,
        ECL_EL_Current_State: state,
        ECL_EL_State_ViewPermission: true,
        ECL_EL_Phone_Number: phone || '',
        ECL_EL_Phone_ViewPermission: true,
        ECL_EL_Email_Address: email || '',
        ECL_EL_Email_ViewPermission: true,
        ECL_EL_Website_Url: website || '',
        ECL_EL_Education_Info: educationText,
        ECL_EL_Session_Id: Date.now(),
        ECL_EL_Audit_Trail: 'Student profile created via API',
      },
      { upsert: true, new: true }
    ),

    // Update designation record if needed
    IndividualDesignation.findOneAndUpdate(
      { ECL_EID_Individual_Id: individualId },
      {
        ECL_EID_Current_Designation: designation,
        ECL_EID_Session_Id: Date.now(),
        ECL_EID_Audit_Trail: 'Student profile updated via API'
      },
      { upsert: true, new: true }
    )
  ]);

  console.log(`Student EcoLink created for ${individualId}`);
}