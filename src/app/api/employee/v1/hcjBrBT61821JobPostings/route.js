import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/utils/dbConnect";
import HcjJobPostings from "@/app/models/hcj_job_postings";
import mongoose from "mongoose";
import HCJJobContactPersonMapping from "@/app/models/hcj_job_contact_person_mapping";
import { validateJobPosting } from "@/app/validation/jobPostingValidator";

/**
 * @swagger
 * /api/employee/v1/hcjBrBT61821JobPostings:
 *   post:
 *     summary: Create a new job/internship/project opportunity
 *     description: |
 *       - Accepts opportunity details and creates a new job, internship, or project.
 *       - Requires authentication and session validation.
 *     tags: [Employer Job Postings Post APi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - opportunityType
 *               - title
 *             properties:
 *               opportunityType:
 *                 type: string
 *                 enum: [job, internship, project]
 *               title:
 *                 type: string
 *                 example: "UI/UX Designer"
 *               description:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               additionalPreferences:
 *                 type: string
 *               assessmentQuestions:
 *                 type: array
 *                 items:
 *                   type: string
 *               skillsRequired:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               closingDate:
 *                 type: string
 *                 format: date
 *               isEqualOpportunity:
 *                 type: boolean
 *               whoCanApply:
 *                 type: array
 *                 items:
 *                   type: string
 *               additionalRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               perks:
 *                 type: array
 *                 items:
 *                   type: string
 *               salaryType:
 *                 type: string
 *                 enum: [fixed, negotiable, performance-based]
 *               salaryCurrency:
 *                 type: string
 *               salaryAmount:
 *                 type: string
 *               salaryDuration:
 *                 type: string
 *               jobType:
 *                 type: string
 *               duration:
 *                 type: string
 *               startDate:
 *                 type: string
 *               probationPeriod:
 *                 type: boolean
 *               durationValue:
 *                 type: string
 *               durationType:
 *                 type: string
 *               graduationStatus:
 *                 type: string
 *               numberOfInterns:
 *                 type: string
 *               applicationLimits:
 *                 type: string
 *     responses:
 *       201:
 *         description: Opportunity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     opportunityType:
 *                       type: string
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate job posting
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Fetch a list of opportunities
 *     description: |
 *       - Returns paginated and filtered list of job, internship, or project postings.
 *     tags: [Employer Job Postings Get All Individual APi]
 *     parameters:
 *       - in: query
 *         name: opportunityType
 *         schema:
 *           type: string
 *         description: Filter by opportunity type (job, internship, project)
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (active, draft, expired, closed)
 *     responses:
 *       200:
 *         description: Opportunities fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       500:
 *         description: Failed to fetch opportunities
 */

export async function POST(req) {
  let session;
  let transactionCommitted = false;

  try {
    await dbConnect();
    const body = await req.json();

    // Validate the request body
    const validationResult = validateJobPosting(body);
    if (!validationResult.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation failed",
          errors: validationResult.errors,
        }),
        { status: 400 }
      );
    }

    // Get user session
    const userSession = await getServerSession(authOptions);
    if (!userSession) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Map frontend data to database schema
    const jobPostingData = mapFrontendToDatabaseSchema(body, userSession);

    // Create new job posting
    const newJobPosting = new HcjJobPostings(jobPostingData);
    await newJobPosting.save({ session });

    // Add job contact person mapping
    await HCJJobContactPersonMapping.create(
      [
        {
          HCJ_JCPM_Company_Id: userSession.user.companyId,
          HCJ_JCPM_Employee_Id: userSession.user.individualId,
          HCJ_JCPM_Job_Id: newJobPosting._id,
          HCJ_JCPM_Session_Id: userSession.user.sessionId,
          HCJ_JCPM_Creation_DtTym: new Date(),
          HCJ_JCPM_Audit_Trail: [],
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    transactionCommitted = true;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Opportunity created successfully",
        data: {
          jobId: newJobPosting._id,
          opportunityType: newJobPosting.HCJ_JP_Opportunity_Type,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    // Abort transaction if not committed
    if (session && !transactionCommitted) await session.abortTransaction();

    console.error("Error creating opportunity:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Duplicate opportunity detected",
          error: "A similar opportunity already exists",
        }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to create opportunity",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    // End session if it exists
    if (session) session.endSession();
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const opportunityType = searchParams.get("opportunityType");
    const companyId = searchParams.get("companyId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    // const status = searchParams.get("status") || "active";
    const status = searchParams.get("status");

    // Build query
    const query = {};
    if (opportunityType) {
      query.HCJ_JP_Opportunity_Type = opportunityType;
    }
    if (companyId) {
      query.HCJ_JP_Company_Id = companyId;
    }

    if (status && status !== "all") {
      const statuses = status.split(",");
      query.HCJ_JDT_Job_Status =
        statuses.length > 1 ? { $in: statuses } : statuses[0];
    }

    // Get total count for pagination
    const total = await HcjJobPostings.countDocuments(query);

    // Get paginated results
    const postings = await HcjJobPostings.find(query)
      .sort({ HCJ_JDT_Posted_DtTym: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return new Response(
      JSON.stringify({
        success: true,
        data: postings,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch opportunities",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

function mapFrontendToDatabaseSchema(frontendData, userSession) {
  const commonFields = {
    HCJ_JP_Company_Id: userSession.user.companyId,
    HCJ_JP_Job_Headline: frontendData.title,
    HCJ_JP_Job_Title: frontendData.title,
    HCJ_JP_Job_Description: frontendData.description,
    HCJ_JP_Responsibility: frontendData.responsibilities,
    HCJ_JP_Additional_Preferences: frontendData.additionalPreferences,
    HCJ_JP_Assessment_Questions:
      frontendData.assessmentQuestions?.map((q) => ({
        question: q.question,
        isMandatory: q.isMandatory || false,
      })) || [],
    HCJ_JP_Job_Skills: frontendData.skillsRequired || [],
    HCJ_JDT_Job_Location: frontendData.location,
    HCJ_JP_Closing_Date: frontendData.closingDate,
    HCJ_JDT_Application_Deadline: frontendData.closingDate,
    // HCJ_JDT_Job_Status: "active",
    HCJ_JDT_Job_Status: frontendData.status === "draft" ? "draft" : "active",
    HCJ_JDT_Session_Id: userSession.user.sessionId,
    HCJ_JP_Equal_Opportunity_Flag: frontendData.isEqualOpportunity,
    HCJ_JP_Who_Can_Apply: frontendData.whoCanApply?.join(", ") || "",
    HCJ_JP_Additional_Requirement:
      frontendData.additionalRequirements?.join(", ") || "",
    HCJ_JP_Perks: frontendData.perks || [],
    HCJ_JP_Salary_Currency: frontendData.salaryCurrency || "USD",
    HCJ_JP_Salary_Amount: parseFloat(frontendData.salaryAmount) || 0,
    HCJ_JDT_Salary: parseFloat(frontendData.salaryAmount) || 0,
    HCJ_JP_Work_Mode: frontendData.workMode,
    HCJ_JP_Start_Date_Flag:
      frontendData.startDate === "immediately" ? true : false,
  };

  // Opportunity type specific fields
  if (frontendData.opportunityType === "job") {
    return {
      ...commonFields,
      HCJ_JP_Opportunity_Type: "job",
      HCJ_JP_Job_Duration: frontendData.duration,
      HCJ_JP_Number_Of_Openings: parseInt(frontendData.numberOfOpenings) || 1,
      HCJ_JP_Long_Term_Indicator: frontendData.duration === "permanent",
    };
  } else if (frontendData.opportunityType === "internship") {
    return {
      ...commonFields,
      HCJ_JP_Opportunity_Type: "internship",
      HCJ_JP_Internship_Duration: `${frontendData.durationValue} ${frontendData.durationType}`,
      HCJ_JP_Interns_Required: parseInt(frontendData.numberOfInterns) || 1,
      HCJ_JP_Long_Term_Possibility: frontendData.longTermPossibility || false,
    };
  } else if (frontendData.opportunityType === "project") {
    return {
      ...commonFields,
      HCJ_JP_Opportunity_Type: "project",
      HCJ_Project_Duration: `${frontendData.durationValue} ${frontendData.durationType}`,
      HCJ_JP_Interns_Required: parseInt(frontendData.numberOfInterns) || 1,
      HCJ_JP_Long_Term_Possibility: frontendData.longTermPossibility || false,
    };
  }

  return commonFields;
}
