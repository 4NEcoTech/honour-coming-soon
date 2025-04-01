// import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // spell-checker: disable-line
// import AddressDetails from '@/app/models/individual_address_detail';
// import IndividualDetails from '@/app/models/individual_details';
// import SocialProfile from '@/app/models/social_link';
// import User from '@/app/models/user_table';
// import { dbConnect } from '@/app/utils/dbConnect';
// import { uploadToGoogleDrive } from '@/app/utils/googleDrive';
// import mongoose from 'mongoose';
// import { getServerSession } from 'next-auth';
// import { cookies } from 'next/headers';

// /**
//  * @swagger
//  * /api/institution/v1/hcjBrBT60241CreateAdminProfile:
//  *   post:
//  *     summary: Create Institution Administrator Profile
//  *     description: Creates an Institution Administrator profile, stores profile pictures, address, and social links.
//  *     tags: [Institution Administrator Profile]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               UT_User_Id:
//  *                 type: string
//  *                 example: "admin@institution.com"
//  *               ID_First_Name:
//  *                 type: string
//  *                 example: "John"
//  *               ID_Last_Name:
//  *                 type: string
//  *                 example: "Doe"
//  *               ID_Phone:
//  *                 type: string
//  *                 example: "+919876543210"
//  *               ID_Profile_Picture:
//  *                 type: string
//  *                 format: binary
//  *               IAD_Address_Line1:
//  *                 type: string
//  *                 example: "123 Street Name"
//  *               IAD_City:
//  *                 type: string
//  *                 example: "Bangalore"
//  *               IAD_State:
//  *                 type: string
//  *                 example: "Karnataka"// spell-checker: disable-line
//  *               IAD_Country:
//  *                 type: string
//  *                 example: "India"
//  *               IAD_Pincode:// spell-checker: disable-line
//  *                 type: string
//  *                 example: "560001"
//  *               SL_Social_Profile_Name:
//  *                 type: string
//  *                 example: "LinkedIn"
//  *               SL_LinkedIn_Profile:
//  *                 type: string
//  *                 example: "https://linkedin.com/in/johndoe"
//  *     responses:
//  *       201:
//  *         description: Profile created successfully
//  *       400:
//  *         description: Invalid or missing fields
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Internal Server Error
//  */

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const formData = await req.formData();

//     const data1 = {};

//     for (const [key, value] of formData.entries()) {
//       data1[key] = value;
//     }
//     // console.log(data1, 'data1');

//     const sessions = await getServerSession(authOptions);
//     const sessionId = formData.get('ID_User_Id') || sessions?.user?.id;

//     // Check if sessionId is available
//     if (!sessionId) {
//       return new Response(
//         JSON.stringify({ success: false, message: 'Unauthorized' }),
//         { status: 401 }
//       );
//     }
//     // Find user
//     const user = await User.findOne({ _id: sessionId });

//     if (!user) {
//       return new Response(
//         JSON.stringify({ success: false, message: 'User not found' }),
//         { status: 404 }
//       );
//     }

//     let profilePictureUrl = null;
//     if (formData.has('ID_Profile_Picture')) {
//       const profileBuffer = Buffer.from(
//         await formData.get('ID_Profile_Picture').arrayBuffer()
//       );
//       profilePictureUrl = await uploadToGoogleDrive(
//         profileBuffer,
//         `profile_${Date.now()}.png`,
//         'image/png'
//       );
//     }

//     // Start MongoDB transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Create individual details
//       const individualDetails = new IndividualDetails({
//         ID_User_Id: formData.get('ID_User_Id'),
//         ID_Profile_Picture: profilePictureUrl,
//         ID_First_Name: formData.get('ID_First_Name'),
//         ID_Last_Name: formData.get('ID_Last_Name'),
//         ID_Phone: formData.get('ID_Phone'),
//         ID_Email: formData.get('ID_Email'),
//         ID_DOB: formData.get('ID_DOB'),
//         ID_Gender: formData.get('ID_Gender'),
//         ID_Individual_Role: user.UT_User_Role,
//         ID_About: formData.get('ID_About'),
//         ID_Individual_Designation: formData.get('ID_Individual_Designation'),
//         ID_Profile_Headline: formData.get('ID_Profile_Headline'),
//         ID_City: formData.get('IAD_City'),
//         ID_Audit_Trail: formData.get('ID_Audit_Trail') || [],
//       });

//       const savedIndividualDetails = await individualDetails.save({ session });

//       // Create address details
//       const addressDetails = new AddressDetails({
//         IAD_Individual_Id: savedIndividualDetails._id,
//         IAD_Address_Type: '02',
//         IAD_Address_Line1: formData.get('IAD_Address_Line1'),
//         IAD_City: formData.get('IAD_City'),
//         IAD_State: formData.get('IAD_State'),
//         IAD_Country: formData.get('IAD_Country'),
//         IAD_Pincode: formData.get('IAD_Pincode'), // spell-checker: disable-line
//         IAD_Address_Line2: formData.get('IAD_Address_Line2'),
//         IAD_Landmark: formData.get('IAD_Landmark'),
//         IAD_Audit_Trail: formData.get('IAD_Audit_Trail') || [],
//       });

//       await addressDetails.save({ session });

//       // Create social profile
//       await new SocialProfile({
//         SL_Id: savedIndividualDetails._id,
//         SL_Individual_Role: savedIndividualDetails.ID_Individual_Role,
//         SL_Product_Identifier: '10000',
//         SL_Social_Profile_Name: formData.get('SL_Social_Profile_Name') || '',
//         SL_LinkedIn_Profile: formData.get('SL_LinkedIn_Profile') || '',
//         SL_Website_Url: formData.get('SL_Website_Url') || '',
//         SL_Instagram_Url: formData.get('SL_Instagram_Url') || '',
//         SL_Facebook_Url: formData.get('SL_Facebook_Url') || '',
//         SL_Twitter_Url: formData.get('SL_Twitter_Url') || '',
//         SL_Pinterest_Url: formData.get('SL_Pinterest_Url') || '', // spell-checker: disable-line
//         SL_Custom_Url: formData.get('SL_Custom_Url') || '',
//         SL_Portfolio_Url: formData.get('SL_Portfolio_Url') || '',
//       }).save({ session });

//       await session.commitTransaction();
//       session.endSession();

//       // Set `individual_id` in Cookie
//       const cookieStore = await cookies();
//       await cookieStore.set(
//         'individual_id',
//         savedIndividualDetails._id.toString(),
//         {
//           httpOnly: true,
//           path: '/',
//           maxAge: 60 * 60 * 24 * 7,
//         }
//       );

//       return new Response(
//         JSON.stringify({
//           success: true,
//           message: 'Profile created successfully!',
//           individualId: savedIndividualDetails._id.toString(),
//         }),
//         { status: 201 }
//       );
//     } catch (error) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error('Transaction Error:', error);
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: 'Database transaction failed',
//         }),
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('Error during profile creation:', error);
//     return new Response(
//       JSON.stringify({ success: false, message: 'Internal Server Error' }),
//       { status: 500 }
//     );
//   }
// }




import { generateQRCodeWithLogo } from '@/app/utils/generate-eco-link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import mongoose from 'mongoose';
import User from '@/app/models/user_table';
import IndividualDetails from '@/app/models/individual_details';
import AddressDetails from '@/app/models/individual_address_detail';
import SocialProfile from '@/app/models/social_link';
import EcoLink from '@/app/models/ecl_ecolink';
import { cookies } from 'next/headers';
import { uploadToGoogleDrive } from '@/app/utils/googleDrive';
import { dbConnect } from '@/app/utils/dbConnect';

export async function POST(req) {
  try {
    // Connect to database
    await dbConnect();

    // Get form data
    const formData = await req.formData();

    // Get session and user ID
    const sessions = await getServerSession(authOptions);
    const sessionId = formData.get('ID_User_Id') || sessions?.user?.id;

    // Check authorization
    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findOne({ _id: sessionId });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Handle optional profile picture upload
    let profilePictureUrl = null;
    let profilePictureBuffer = null;
    
    if (formData.has('ID_Profile_Picture') && formData.get('ID_Profile_Picture').size > 0) {
      try {
        profilePictureBuffer = Buffer.from(
          await formData.get('ID_Profile_Picture').arrayBuffer()
        );
        profilePictureUrl = await uploadToGoogleDrive(
          profilePictureBuffer,
          `profile_${Date.now()}.png`,
          'image/png'
        );
      } catch (uploadError) {
        console.error('Profile picture upload failed:', uploadError);
        // Continue without profile picture
      }
    }

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create individual details (profile picture is optional)
      const individualDetails = new IndividualDetails({
        ID_User_Id: formData.get('ID_User_Id'),
        ID_Profile_Picture: profilePictureUrl, // null if no picture
        ID_First_Name: formData.get('ID_First_Name'),
        ID_Last_Name: formData.get('ID_Last_Name'),
        ID_Phone: formData.get('ID_Phone'),
        ID_Email: formData.get('ID_Email'),
        ID_DOB: formData.get('ID_DOB'),
        ID_Gender: formData.get('ID_Gender'),
        ID_Individual_Role: user.UT_User_Role,
        ID_About: formData.get('ID_About'),
        ID_Individual_Designation: formData.get('ID_Individual_Designation'),
        ID_Profile_Headline: formData.get('ID_Profile_Headline'),
        ID_City: formData.get('IAD_City'),
        ID_Audit_Trail: formData.get('ID_Audit_Trail') || [],
      });

      const savedIndividualDetails = await individualDetails.save({ session });

      // Create address details
      const addressDetails = new AddressDetails({
        IAD_Individual_Id: savedIndividualDetails._id,
        IAD_Address_Type: '02',
        IAD_Address_Line1: formData.get('IAD_Address_Line1'),
        IAD_City: formData.get('IAD_City'),
        IAD_State: formData.get('IAD_State'),
        IAD_Country: formData.get('IAD_Country'),
        IAD_Pincode: formData.get('IAD_Pincode'),
        IAD_Address_Line2: formData.get('IAD_Address_Line2'),
        IAD_Landmark: formData.get('IAD_Landmark'),
        IAD_Audit_Trail: formData.get('IAD_Audit_Trail') || [],
      });

      await addressDetails.save({ session });

      // Create social profile
      await new SocialProfile({
        SL_Id: savedIndividualDetails._id,
        SL_Individual_Role: savedIndividualDetails.ID_Individual_Role,
        SL_Product_Identifier: '10000',
        SL_Social_Profile_Name: formData.get('SL_Social_Profile_Name') || '',
        SL_LinkedIn_Profile: formData.get('SL_LinkedIn_Profile') || '',
        SL_Website_Url: formData.get('SL_Website_Url') || '',
        SL_Instagram_Url: formData.get('SL_Instagram_Url') || '',
        SL_Facebook_Url: formData.get('SL_Facebook_Url') || '',
        SL_Twitter_Url: formData.get('SL_Twitter_Url') || '',
        SL_Pinterest_Url: formData.get('SL_Pinterest_Url') || '',
        SL_Custom_Url: formData.get('SL_Custom_Url') || '',
        SL_Portfolio_Url: formData.get('SL_Portfolio_Url') || '',
      }).save({ session });

      // Generate EcoLink with QR Code
      const fullName = `${formData.get('ID_First_Name')} ${formData.get('ID_Last_Name')}`;
      const profileUrl = `${process.env.NEXT_PUBLIC_ECOLINK_BASE_URL}/${savedIndividualDetails._id}`;
      
      // Generate QR code (will handle null profile picture automatically)
      const qrBuffer = await generateQRCodeWithLogo(profileUrl, profilePictureUrl);
      
      // Upload QR code to Google Drive
      const qrDriveUrl = await uploadToGoogleDrive(
        qrBuffer,
        `ecolink_qr_${savedIndividualDetails._id}.png`,
        'image/png'
      );

      // Create EcoLink record
      const newEcoLink = new EcoLink({
        ECL_EL_Id: savedIndividualDetails._id,
        ECL_EL_Id_Source: 'IndividualDetails',
        ECL_EL_Photo_ViewPermission: !!profilePictureUrl, // true if profile picture exists
        ECL_EL_Product: 2, // HCJ product code
        ECL_EL_Profile_Url: profileUrl,
        ECL_EL_EcoLink_Name: fullName,
        ECL_EL_EcoLink_QR_Code: qrDriveUrl,
        ECL_EL_Address: formData.get('IAD_Address_Line1'),
        ECL_EL_Address_ViewPermission: true,
        ECL_EL_Current_City: formData.get('IAD_City'),
        ECL_EL_City_ViewPermission: true,
        ECL_EL_Current_State: formData.get('IAD_State'),
        ECL_EL_State_ViewPermission: true,
        ECL_EL_Phone_Number: formData.get('ID_Phone') || '',
        ECL_EL_Phone_ViewPermission: true,
        ECL_EL_Email_Address: formData.get('ID_Email') || '',
        ECL_EL_Email_ViewPermission: true,
        ECL_EL_Website_Url: formData.get('SL_Website_Url') || '',
        ECL_EL_Session_Id: Date.now(),
        ECL_EL_Audit_Trail: 'Profile created via API',
      });

      await newEcoLink.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Set individual_id cookie
      const cookieStore = await cookies();
      cookieStore.set('individual_id', savedIndividualDetails._id.toString(), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Profile created successfully!',
          individualId: savedIndividualDetails._id.toString(),
          profileUrl: profileUrl,
          qrCodeUrl: qrDriveUrl,
          hasProfilePicture: !!profilePictureUrl,
        }),
        { status: 201 }
      );

    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      
      console.error('Transaction Error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Database transaction failed',
          error: error.message 
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during profile creation:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal Server Error',
        error: error.message 
      }),
      { status: 500 }
    );
  }
}