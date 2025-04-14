import CompanyDetails from "@/app/models/company_details";
import EcoLink from "@/app/models/ecl_ecolink";
import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";
import IndividualDetails from "@/app/models/individual_details";
import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from "next-auth/providers/linkedin";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login (NextAuth.js)
 *     description: >
 *       Authenticate a user using email and password (or via LinkedIn) with NextAuth.js.
 *       Returns a session token along with user details (id, email, and role).
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description:  Login Successful – Returns a session token and user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65b4f0f0e..."
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "02"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description:  Unauthorized - Invalid email or password.
 *       500:
 *         description:  Server error - Internal failure.
 *
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Retrieve Active Session
 *     description: Get the current authenticated user session details.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description:  Session details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65b4f0f0e..."
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "02"
 *       401:
 *         description: Unauthorized - No active session found.
 */

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, //  Accept role in login request
      },
      async authorize(credentials) {
        // console.log('credentials', credentials);
        await dbConnect();
        //  console.log('inside authOptions');
        try {
          const user = await User.findOne({ UT_Email: credentials.email });
          if (!user) {
            throw new Error("User not found");
          }
          // console.log('finded user');
          //  Compare password securely
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.UT_Password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          //  Ensure correct role validation (Fix: Avoid strict failure)
          if (credentials.role && user.UT_User_Role !== credentials.role) {
            throw new Error("Selected role does not match your account role");
          }

          // console.log('User found:', user);

          //  Check if user has an `individualId`
          const individualDetails = await IndividualDetails.findOne({
            ID_User_Id: user?._id,
          });
          // console.log('find individual id');
          // console.log("individualDetails",individualDetails)

          const ecoLink = await EcoLink.findOne({
            ECL_EL_Id: individualDetails?._id,
          });

          //  Check if user has an `companyId`
          const companyDetails = await CompanyDetails.findOne({
            CD_Individual_Id: individualDetails?._id,
          });
          // console.log('find company id');

          // console.log("companyDetails",companyDetails)
          // Only fetch job seeker details if role is job-seeker related
          let jobSeeker = await Hcj_Job_Seeker.findOne({
            HCJ_JS_Individual_Id: individualDetails?._id,
          });
          // console.log("jobSeeker",jobSeeker?._id)
          return {
            id: user._id.toString(),
            email: user.UT_Email,
            role: user.UT_User_Role,
            individualId: individualDetails
              ? individualDetails?._id.toString()
              : null, //  Store individualId if exists
            companyId: companyDetails ? companyDetails?._id.toString() : null, //  Store companyId if exists
            jobSeekerId: jobSeeker ? jobSeeker?._id.toString() : null,
            hasProfilePicture: ecoLink?.ECL_EL_Photo_ViewPermission || false,
            first_name: individualDetails?.ID_First_Name || "",
            last_name: individualDetails?.ID_Last_Name || "",
          };
        } catch (error) {
          console.error("Authorization error:", error.message);
          return null;
        }
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      scope: "r_liteprofile r_emailaddress",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "linkedin") {
        await dbConnect();
        try {
          let existingUser = await User.findOne({ UT_Email: user.email });
          if (!existingUser) {
            existingUser = new User({
              UT_Email: user.email,
              UT_LinkedIn_Id: user.id,
              UT_User_Role: user.UT_User_Role || "default_role", // Ensure role is set
            });
            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.error("Error in LinkedIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id; //  Fix: Ensure id is stored correctly
        token.email = user.email;
        token.role = user.role;
        token.individualId = user.individualId || null; //  Store individualId
        token.companyId = user.companyId || null; // Store companyId
        token.jobSeekerId = user.jobSeekerId || null;
        token.hasProfilePicture = user.hasProfilePicture || false;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
      }
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
          companyId: session.user.companyId,
          jobSeekerId: session.user.jobSeekerId,
          hasProfilePicture: session.user.hasProfilePicture,
          first_name: session.user.first_name,
          last_name: session.user.last_name,
        };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; //  Fix: Ensure correct field names
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.individualId = token.individualId; // Store individualId
        session.user.companyId = token.companyId; // Store Company Id
        session.user.jobSeekerId = token.jobSeekerId;
        session.user.hasProfilePicture = token.hasProfilePicture;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth/signin", error: "/auth/error" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
