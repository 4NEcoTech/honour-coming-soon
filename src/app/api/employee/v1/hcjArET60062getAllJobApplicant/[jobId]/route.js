import HcjJobApplication from "@/app/models/hcj_job_applications";
import { dbConnect } from "@/app/utils/dbConnect";
import { getPaginatedResults } from "@/app/utils/paginationUtils";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/employee/v1/hcjArET60062getAllJobApplicant/{jobId}:
 *   get:
 *     summary: Get all applicants for a specific job
 *     description: >
 *       Fetches all job applications for a job ID.  
 *       Supports pagination, search by applicant details, and status filtering (Received, Shortlisted, Hired, Rejected).
 *     tags:
 *       - Job Applications
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job posting
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search keyword for name, email, or phone
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated statuses to filter by (e.g., Received,Shortlisted)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page size (default is 10)
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       500:
 *         description: Server error
 */

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { jobId } = await params;
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Always filter by Job ID
    searchParams.set("HCJ_AT_Job_Id", jobId);

    // Handle multi-status filtering (e.g., Received,Shortlisted)
    const status = searchParams.get("status");
    if (status) {
      const statuses = status.split(",").map((s) => s.trim());
      searchParams.set(
        "HCJ_AT_Application_Status__$in",
        JSON.stringify(statuses)
      );
    }

    const searchableFields = [
      "HCJ_AT_Applicant_First_Name",
      "HCJ_AT_Applicant_Last_Name",
      "HCJ_AT_Applicant_Email",
      "HCJ_AT_Applicant_Phone_Number",
    ];

    const projection = {
      HCJ_AT_Applicant_Id: 1,
      HCJ_AT_Job_Id: 1,
      HCJ_AT_Applicant_First_Name: 1,
      HCJ_AT_Applicant_Last_Name: 1,
      HCJ_AT_Applicant_Email: 1,
      HCJ_AT_Applicant_Phone_Number: 1,
      HCJ_AT_Applicant_Type: 1,
      HCJ_AT_Application_Status: 1,
      HCJ_AT_Applied_At: 1,
      createdAt: 1,
    };

    return await getPaginatedResults(
      HcjJobApplication,
      searchParams,
      searchableFields,
      projection
    );
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
