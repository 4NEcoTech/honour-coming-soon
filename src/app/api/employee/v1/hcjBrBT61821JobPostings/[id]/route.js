import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/utils/dbConnect";
import HcjJobPostings from "@/app/models/hcj_job_postings";
import mongoose from "mongoose";
import { validateJobPosting } from "@/app/validation/jobPostingValidator";
/**
 * @swagger
 * /api/employee/v1/hcjBrBT61821JobPostings/{id}:
 *   get:
 *     summary: Fetch a specific opportunity
 *     description: Retrieves a single job/internship/project posting by its ID.
 *     tags: [Employer Job Postings Single Get]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the opportunity
 *     responses:
 *       200:
 *         description: Job posting fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid job posting ID
 *       404:
 *         description: Job posting not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an existing opportunity
 *     description: |
 *       - Updates a job/internship/project posting by its ID.
 *       - Requires authentication and session validation.
 *       - Company ID must match the logged-in user's company.
 *     tags: [Employer Job Postings Update]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the opportunity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostingPayload'
 *     responses:
 *       200:
 *         description: Job posting updated successfully
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
 *                     jobId:
 *                       type: string
 *       400:
 *         description: Invalid input or job posting ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not owner of job posting
 *       404:
 *         description: Job posting not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete an opportunity (soft delete)
 *     description: |
 *       - Soft-deletes an opportunity by setting its status to "deleted".
 *       - Requires authentication and ownership validation.
 *     tags: [Employer Job Postings Soft Delete]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the opportunity
 *     responses:
 *       200:
 *         description: Job posting deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid job posting ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not owner of job posting
 *       404:
 *         description: Job posting not found
 *       500:
 *         description: Server error
 */

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid opportunity ID" }),
        { status: 400 }
      );
    }

    const opportunity = await HcjJobPostings.findById(id).lean();

    if (!opportunity) {
      return new Response(
        JSON.stringify({ success: false, message: "Opportunity not found" }),
        { status: 404 }
      );
    }

    // Ensure assessment questions are properly formatted
    const formattedOpportunity = {
      ...opportunity,
      assessmentQuestions:
        opportunity.HCJ_JP_Assessment_Questions?.map((q) => ({
          question: q.question || "",
          isMandatory: q.isMandatory || false,
        })) || [],
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: opportunity,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch opportunity",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  let session;
  let transactionCommitted = false;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid opportunity ID" }),
        { status: 400 }
      );
    }

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

    // Find the existing opportunity
    const existingOpportunity = await HcjJobPostings.findById(id).session(
      session
    );
    if (!existingOpportunity) {
      return new Response(
        JSON.stringify({ success: false, message: "Opportunity not found" }),
        { status: 404 }
      );
    }

    if (
      existingOpportunity.HCJ_JP_Company_Id.toString() !==
      userSession.user.companyId.toString()
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized to update this opportunity",
        }),
        { status: 403 }
      );
    }

    // Map frontend data to database schema
    const updatedData = mapFrontendToDatabaseSchema(body, userSession);

    // Update the opportunity
    Object.assign(existingOpportunity, updatedData);
    await existingOpportunity.save({ session });

    // Commit transaction
    await session.commitTransaction();
    transactionCommitted = true;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Opportunity updated successfully",
        data: {
          jobId: existingOpportunity._id,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    // Abort transaction if not committed
    if (session && !transactionCommitted) await session.abortTransaction();

    console.error("Error updating opportunity:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update opportunity",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    // End session if it exists
    if (session) session.endSession();
  }
}

export async function DELETE(req, { params }) {
  let session;
  let transactionCommitted = false;

  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid opportunity ID" }),
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

    // Find the existing opportunity
    const existingOpportunity = await HcjJobPostings.findById(id).session(
      session
    );
    if (!existingOpportunity) {
      return new Response(
        JSON.stringify({ success: false, message: "Opportunity not found" }),
        { status: 404 }
      );
    }

    if (
      existingOpportunity.HCJ_JP_Company_Id.toString() !==
      userSession.user.companyId.toString()
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized to update this opportunity",
        }),
        { status: 403 }
      );
    }

    // Soft delete by updating status
    existingOpportunity.HCJ_JDT_Job_Status = "deleted";
    await existingOpportunity.save({ session });

    // Commit transaction
    await session.commitTransaction();
    transactionCommitted = true;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Opportunity deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    // Abort transaction if not committed
    if (session && !transactionCommitted) await session.abortTransaction();

    console.error("Error deleting opportunity:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete opportunity",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    // End session if it exists
    if (session) session.endSession();
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
