import company_contact_person from "@/app/models/company_contact_person";
import CompanyDetails from "@/app/models/company_details";
import EcoLink from "@/app/models/ecl_ecolink";
import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";
import IndividualDetails from "@/app/models/individual_details";
import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/global/v1/gblBrBt6035Login:
 *   post:
 *     summary: Login with email, password, and role
 *     description: >
 *       Authenticates a user using email, password, and role.  
 *       On successful authentication, returns a JWT token along with basic user profile data.  
 *       Validates the role against the registered user account.  
 *       Fetches additional linked data like individual ID, company ID, job seeker ID, and profile image.
 *     tags:
 *       - Global Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered user email
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User account password
 *                 example: P@ssw0rd123
 *               role:
 *                 type: string
 *                 description: Role code (e.g., '05' for Student, '06' for Institution Admin, etc.)
 *                 example: "05"
 *     responses:
 *       200:
 *         description: Login successful, token and user info returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token valid for 30 days
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     individualId:
 *                       type: string
 *                     companyId:
 *                       type: string
 *                     jobSeekerId:
 *                       type: string
 *                     hasProfilePicture:
 *                       type: boolean
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: 6035_3
 *                 title:
 *                   type: string
 *                   example: Missing Credentials
 *                 description:
 *                   type: string
 *                   example: Email, password, and role are required.
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: 6035_5
 *                 title:
 *                   type: string
 *                   example: Incorrect Password
 *                 description:
 *                   type: string
 *                   example: The password you entered is incorrect.
 *                 status:
 *                   type: integer
 *                   example: 401
 *       403:
 *         description: Role does not match the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: 6035_6
 *                 title:
 *                   type: string
 *                   example: Role Mismatch
 *                 description:
 *                   type: string
 *                   example: The selected role does not match your account.
 *                 status:
 *                   type: integer
 *                   example: 403
 *       404:
 *         description: User with given email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: 6035_4
 *                 title:
 *                   type: string
 *                   example: User Not Found
 *                 description:
 *                   type: string
 *                   example: No user exists with the given email.
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: 6035_7
 *                 title:
 *                   type: string
 *                   example: Login Error
 *                 description:
 *                   type: string
 *                   example: Something went wrong. Please try again later.
 *                 status:
 *                   type: integer
 *                   example: 500
 */


export async function POST(request) {
  await dbConnect();

  try {
    const { email, password, role } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return Response.json(
        {
          code: "6035_3",
          title: "Missing Credentials",
          description: "Email, password, and role are required.",
          status: 400,
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({
      UT_Email: email,
    }).collation({ locale: "en", strength: 2 });

    if (!user) {
      return Response.json(
        {
          code: "6035_4",
          title: "User Not Found",
          description: "No user exists with the given email.",
          status: 404,
        },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.UT_Password);
    if (!isPasswordCorrect) {
      return Response.json(
        {
          code: "6035_5",
          title: "Incorrect Password",
          description: "The password you entered is incorrect.",
          status: 401,
        },
        { status: 401 }
      );
    }

    // Verify role
    if (role && user.UT_User_Role !== role) {
      return Response.json(
        {
          code: "6035_6",
          title: "Role Mismatch",
          description: "The selected role does not match your account.",
          status: 403,
        },
        { status: 403 }
      );
    }

    // Get additional user details
    const individualDetails = await IndividualDetails.findOne({
      ID_User_Id: user?._id,
    });
    const ecoLink = await EcoLink.findOne({
      ECL_EL_Id: individualDetails?._id,
    });

    let companyId = null;

    if (["07", "08"].includes(user.UT_User_Role)) {
      const contactPerson = await company_contact_person.findOne({
        CCP_Contact_Person_Email: user.UT_Email,
      });

      if (contactPerson) {
        companyId = contactPerson.CCP_Company_Id.toString();
      }
    } else {
      const companyDetails = await CompanyDetails.findOne({
        CD_Individual_Id: individualDetails?._id,
      });
      if (companyDetails) {
        companyId = companyDetails._id.toString();
      }
    }

    let jobSeeker = await Hcj_Job_Seeker.findOne({
      HCJ_JS_Individual_Id: individualDetails?._id,
    });

    // Create JWT token
    const tokenPayload = {
      id: user._id.toString(),
      email: user.UT_Email,
      role: user.UT_User_Role,
      individualId: individualDetails ? individualDetails?._id.toString() : null,
      companyId: companyId,
      jobSeekerId: jobSeeker ? jobSeeker?._id.toString() : null,
      hasProfilePicture: ecoLink?.ECL_EL_Photo_ViewPermission || false,
      first_name: individualDetails?.ID_First_Name || "",
      last_name: individualDetails?.ID_Last_Name || "",
      profileImage: individualDetails?.ID_Profile_Picture || "",
    };

    const token = jwt.sign(tokenPayload, process.env.NEXTAUTH_SECRET, {
      expiresIn: "30d",
    });

    return Response.json({
      success: true,
      token,
      user: tokenPayload,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      {
        code: "6035_7",
        title: "Login Error",
        description: "Something went wrong. Please try again later.",
        status: 500,
      },
      { status: 500 }
    );
  }
}