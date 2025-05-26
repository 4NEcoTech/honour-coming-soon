// import company_contact_person from "@/app/models/company_contact_person";
// import CompanyDetails from "@/app/models/company_details";
// import EcoLink from "@/app/models/ecl_ecolink";
// import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";
// import IndividualDetails from "@/app/models/individual_details";
// import User from "@/app/models/user_table";
// import { dbConnect } from "@/app/utils/dbConnect";
// import bcrypt from "bcrypt";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import LinkedInProvider from "next-auth/providers/linkedin";
// import jwt from "jsonwebtoken";

// /**
//  * @swagger
//  * /api/auth/login:
//  *   post:
//  *     summary: User Login (NextAuth.js)
//  *     description: >
//  *       Authenticate a user using email and password (or via LinkedIn) with NextAuth.js.
//  *       Returns a session token along with user details (id, email, and role).
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 description: User's registered email
//  *                 example: "user@example.com"
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 description: User's password
//  *                 example: "securePassword123"
//  *     responses:
//  *       200:
//  *         description:  Login Successful – Returns a session token and user details.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 user:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: "65b4f0f0e..."
//  *                     email:
//  *                       type: string
//  *                       example: "user@example.com"
//  *                     role:
//  *                       type: string
//  *                       example: "02"
//  *                 token:
//  *                   type: string
//  *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//  *       401:
//  *         description:  Unauthorized - Invalid email or password.
//  *       500:
//  *         description:  Server error - Internal failure.
//  *
//  * @swagger
//  * /api/auth/session:
//  *   get:
//  *     summary: Retrieve Active Session
//  *     description: Get the current authenticated user session details.
//  *     tags: [Authentication]
//  *     responses:
//  *       200:
//  *         description:  Session details retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 user:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: "65b4f0f0e..."
//  *                     email:
//  *                       type: string
//  *                       example: "user@example.com"
//  *                     role:
//  *                       type: string
//  *                       example: "02"
//  *       401:
//  *         description: Unauthorized - No active session found.
//  */

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//         role: { label: "Role", type: "text" }, //  Accept role in login request
//       },
//       async authorize(credentials) {
//         // console.log('credentials', credentials);
//         await dbConnect();
//         //  console.log('inside authOptions');
//         try {
//           const user = await User.findOne({
//             UT_Email: credentials.email,
//           }).collation({ locale: "en", strength: 2 });
//           if (!user) {
//             throw new Error("User not found");
//           }
//           // console.log('finded user');
//           //  Compare password securely
//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.UT_Password
//           );
//           if (!isPasswordCorrect) {
//             throw new Error("Invalid password");
//           }

//           //  Ensure correct role validation (Fix: Avoid strict failure)
//           if (credentials.role && user.UT_User_Role !== credentials.role) {
//             throw new Error("Selected role does not match your account role");
//           }

//           // console.log('User found:', user);

//           //  Check if user has an `individualId`
//           const individualDetails = await IndividualDetails.findOne({
//             ID_User_Id: user?._id,
//           });
//           // console.log('find individual id');
//           // console.log("individualDetails",individualDetails)

//           const ecoLink = await EcoLink.findOne({
//             ECL_EL_Id: individualDetails?._id,
//           });

//           //  Check if user has an `companyId`

//           // const companyDetails = await CompanyDetails.findOne({
//           //   CD_Individual_Id: individualDetails?._id,
//           // });

//           let companyId = null;

//           if (["07", "08"].includes(user.UT_User_Role)) {
//             const contactPerson = await company_contact_person.findOne({
//               CCP_Contact_Person_Email: user.UT_Email,
//             });

//             if (contactPerson) {
//               companyId = contactPerson.CCP_Company_Id.toString();
//             }
//           } else {
//             const companyDetails = await CompanyDetails.findOne({
//               CD_Individual_Id: individualDetails?._id,
//             });
//             if (companyDetails) {
//               companyId = companyDetails._id.toString();
//             }
//           }

//           // console.log('find company id');

//           // console.log("companyDetails",companyDetails)
//           // Only fetch job seeker details if role is job-seeker related
//           let jobSeeker = await Hcj_Job_Seeker.findOne({
//             HCJ_JS_Individual_Id: individualDetails?._id,
//           });
//           // console.log("jobSeeker",jobSeeker?._id)

//           const backendToken = jwt.sign(
//             {
//               id: user._id.toString(),
//               individualId: individualDetails?._id.toString(),
//               role: user.UT_User_Role,
//               email: user.UT_Email,
//             },
//             process.env.JWT_SECRET, // must match your Express backend's
//             { expiresIn: "7d" }
//           );

//           return {
//             id: user._id.toString(),
//             email: user.UT_Email,
//             role: user.UT_User_Role,
//             individualId: individualDetails
//               ? individualDetails?._id.toString()
//               : null, //  Store individualId if exists
//             companyId: companyId, //  Store companyId if exists
//             jobSeekerId: jobSeeker ? jobSeeker?._id.toString() : null,
//             hasProfilePicture: ecoLink?.ECL_EL_Photo_ViewPermission || false,
//             first_name: individualDetails?.ID_First_Name || "",
//             last_name: individualDetails?.ID_Last_Name || "",
//             profileImage: individualDetails?.ID_Profile_Picture || "",
//             backendToken,
//           };
//         } catch (error) {
//           console.error("Authorization error:", error.message);
//           return null;
//         }
//       },
//     }),
//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID || "",
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
//       scope: "r_liteprofile r_emailaddress",
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "linkedin") {
//         await dbConnect();
//         try {
//           let existingUser = await User.findOne({ UT_Email: user.email });
//           if (!existingUser) {
//             existingUser = new User({
//               UT_Email: user.email,
//               UT_LinkedIn_Id: user.id,
//               UT_User_Role: user.UT_User_Role || "default_role", // Ensure role is set
//             });
//             await existingUser.save();
//           }
//           return true;
//         } catch (error) {
//           console.error("Error in LinkedIn callback:", error);
//           return false;
//         }
//       }
//       return true;
//     },
//     async jwt({ token, user, trigger, session }) {
//       if (user) {
//         token.id = user.id; //  Fix: Ensure id is stored correctly
//         token.email = user.email;
//         token.role = user.role;
//         token.individualId = user.individualId || null; //  Store individualId
//         token.companyId = user.companyId || null; // Store companyId
//         token.jobSeekerId = user.jobSeekerId || null;
//         token.hasProfilePicture = user.hasProfilePicture || false;
//         token.first_name = user.first_name;
//         token.last_name = user.last_name;
//         token.profileImage = user.profileImage;
//         token.backendToken = user.backendToken;
//       }
//       if (trigger === "update") {
//         return {
//           ...token,
//           ...session.user,
//           companyId: session.user.companyId,
//           jobSeekerId: session.user.jobSeekerId,
//           hasProfilePicture: session.user.hasProfilePicture,
//           first_name: session.user.first_name,
//           last_name: session.user.last_name,
//           profileImage: session.user.profileImage,
//           backendToken: session.user.backendToken,
//         };
//       }
//       return { ...token, ...user };
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id; //  Fix: Ensure correct field names
//         session.user.email = token.email;
//         session.user.role = token.role;
//         session.user.individualId = token.individualId; // Store individualId
//         session.user.companyId = token.companyId; // Store Company Id
//         session.user.jobSeekerId = token.jobSeekerId;
//         session.user.hasProfilePicture = token.hasProfilePicture;
//         session.user.first_name = token.first_name;
//         session.user.last_name = token.last_name;
//         session.user.profileImage = token.profileImage;
//         session.user.backendToken = token.backendToken;
//       }
//       return session;
//     },
//   },
//   jwt: {
//     encryption: false,
//     secret: process.env.JWT_SECRET,
//   },

//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: { signIn: "/auth/signin", error: "/auth/error" },
// };


// // import { useSession } from "next-auth/react";

// // const { data } = useSession();
// // console.log(data?.user?.backendToken);

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


import company_contact_person from "@/app/models/company_contact_person";
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
        //  Check if credentials are provided
        await dbConnect();
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.role
        ) {
          throw new Error(
            JSON.stringify({
              code: "6035_3",
              title: "Missing Credentials",
              description: "Email, password, and role are required.",
              status: 400,
            })
          );
        }
        try {
          const user = await User.findOne({
            UT_Email: credentials.email,
          }).collation({ locale: "en", strength: 2 });
          if (!user) {
            throw new Error(
              JSON.stringify({
                code: "6035_4",
                title: "User Not Found",
                description: "No user exists with the given email.",
                status: 404,
              })
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.UT_Password
          );
          if (!isPasswordCorrect) {
            throw new Error(
              JSON.stringify({
                code: "6035_5",
                title: "Incorrect Password",
                description: "The password you entered is incorrect.",
                status: 401,
              })
            );
          }

          //  Ensure correct role validation (Fix: Avoid strict failure)
          if (credentials.role && user.UT_User_Role !== credentials.role) {
            throw new Error(
              JSON.stringify({
                code: "6035_6",
                title: "Role Mismatch",
                description: "The selected role does not match your account.",
                status: 403,
              })
            );
          }
          //  Check if user has an `individualId`
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
          // Only fetch job seeker details if role is job-seeker related
          let jobSeeker = await Hcj_Job_Seeker.findOne({
            HCJ_JS_Individual_Id: individualDetails?._id,
          });
          return {
            id: user._id.toString(),
            email: user.UT_Email,
            role: user.UT_User_Role,
            individualId: individualDetails
              ? individualDetails?._id.toString()
              : null, //  Store individualId if exists
            companyId: companyId, //  Store companyId if exists
            jobSeekerId: jobSeeker ? jobSeeker?._id.toString() : null,
            hasProfilePicture: ecoLink?.ECL_EL_Photo_ViewPermission || false,
            first_name: individualDetails?.ID_First_Name || "",
            last_name: individualDetails?.ID_Last_Name || "",
            profileImage: individualDetails?.ID_Profile_Picture || "",
          };
        } catch (err) {
          // Fallback for unstructured or system errors
          if (typeof err?.message === "string" && err.message.startsWith("{")) {
            throw err; // structured JSON message from earlier throw
          }
          throw new Error(
            JSON.stringify({
              code: "6035_7",
              title: "Login Error",
              description: "Something went wrong. Please try again later.",
              status: 500,
            })
          );
        }
      },
    }),

    //  LinkedIn Provider
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
        token.profileImage = user.profileImage;
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
          profileImage: session.user.profileImage,
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
        session.user.profileImage = token.profileImage;
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
