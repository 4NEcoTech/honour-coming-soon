import { dbConnect } from "@/app/utils/dbConnect";
import HcjJobPostings from "@/app/models/hcj_job_postings";
import CompanyDetails from "@/app/models/company_details";
import { getPaginatedResults } from "@/app/utils/paginationUtils";
import { cache } from "react";

/**
 * @swagger
 * /api/employee/v1/hcjJobPostings:
 *   get:
 *     summary: Fetch job postings with filters and pagination
 *     description: >
 *       Retrieves a paginated list of active job postings, filtered by type, location, salary, and skills. Optionally includes company details and full job descriptions.
 *     tags:
 *       - Fetch All job postings
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated opportunity types to filter (e.g., internship, full-time)
 *         example: internship,full-time
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter jobs by location
 *         example: Bangalore
 *       - in: query
 *         name: minSalary
 *         required: false
 *         schema:
 *           type: number
 *         description: Minimum salary to filter
 *         example: 500000
 *       - in: query
 *         name: maxSalary
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum salary to filter
 *         example: 1000000
 *       - in: query
 *         name: skills
 *         required: false
 *         schema:
 *           type: string
 *         description: Skills to filter by (comma-separated)
 *         example: React,Node.js
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Full-text search on title, headline, description, etc.
 *         example: frontend developer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Pagination page number
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of items per page (max 50)
 *         example: 10
 *       - in: query
 *         name: detailed
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Include full job descriptions and preferences
 *         example: true
 *       - in: query
 *         name: withCompany
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Include company name, logo and website
 *         example: true
 *     responses:
 *       200:
 *         description: Paginated list of job postings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 123
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       HCJ_JP_Job_Title:
 *                         type: string
 *                         example: Frontend Developer
 *                       HCJ_JP_Job_Headline:
 *                         type: string
 *                         example: Build interactive UI for web
 *                       HCJ_JP_Opportunity_Type:
 *                         type: string
 *                         example: full-time
 *                       HCJ_JDT_Job_Location:
 *                         type: string
 *                         example: Remote
 *                       displaySalary:
 *                         type: string
 *                         example: INR 8,00,000
 *                       postedDate:
 *                         type: string
 *                         format: date
 *                         example: 2024-01-05
 *                       deadlineDate:
 *                         type: string
 *                         format: date
 *                         example: 2024-01-20
 *                       company:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           CD_Company_Name:
 *                             type: string
 *                             example: Honour Tech
 *                           CD_Company_Logo_URL:
 *                             type: string
 *                             example: https://cdn.example.com/logo.png
 *                           CD_Company_Website:
 *                             type: string
 *                             example: https://honour.tech
 *       400:
 *         description: Invalid or missing query parameters
 *       500:
 *         description: Internal server error
 */


// Cache company details
const getCachedCompanyDetails = cache(async (companyId) => {
  return await CompanyDetails.findById(companyId)
    .select("CD_Company_Name CD_Company_Logo_URL CD_Company_Website")
    .lean();
});

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const DEFAULT_PAGE_SIZE = 10;
  const MAX_PAGE_SIZE = 50;

  // Create a new URLSearchParams object with the original params
  const cleanedSearchParams = new URLSearchParams();

  // Set default filters for student view
  cleanedSearchParams.set("HCJ_JDT_Job_Status", "active");

  if (searchParams.get("type")) {
    const types = searchParams
      .get("type")
      .split(",")
      .map((type) => type.trim());
    if (types.length === 1) {
      cleanedSearchParams.set("HCJ_JP_Opportunity_Type", types[0]);
    } else {
      cleanedSearchParams.set(
        "HCJ_JP_Opportunity_Type_in",
        JSON.stringify(types)
      );
    }
  }

  if (searchParams.get("location")) {
    cleanedSearchParams.set(
      "HCJ_JDT_Job_Location",
      searchParams.get("location")
    );
  }

  if (searchParams.get("minSalary")) {
    cleanedSearchParams.set(
      "HCJ_JP_Salary_Amount_gte",
      searchParams.get("minSalary")
    );
  }

  if (searchParams.get("maxSalary")) {
    cleanedSearchParams.set(
      "HCJ_JP_Salary_Amount_lte",
      searchParams.get("maxSalary")
    );
  }

  if (searchParams.get("skills")) {
    cleanedSearchParams.set("HCJ_JP_Job_Skills", searchParams.get("skills"));
  }

  // Add search term if exists
  if (searchParams.get("search")) {
    cleanedSearchParams.set("search", searchParams.get("search"));
  }

  // Add pagination params
  if (searchParams.get("page")) {
    cleanedSearchParams.set("page", searchParams.get("page"));
  }
  if (searchParams.get("pageSize")) {
    cleanedSearchParams.set(
      "pageSize",
      Math.min(
        parseInt(
          searchParams.get("pageSize") || DEFAULT_PAGE_SIZE,
          MAX_PAGE_SIZE
        ).toString()
      )
    );
  }

  // Define searchable fields
  const searchFields = [
    "HCJ_JP_Job_Headline",
    "HCJ_JP_Job_Title",
    "HCJ_JP_Job_Description",
    "HCJ_JP_Responsibility",
    "HCJ_JDT_Job_Location",
    "HCJ_JP_Job_Skills",
  ];

  // Define projection
  const projection = {
    HCJ_JP_Company_Id: 1,
    HCJ_JP_Opportunity_Type: 1,
    HCJ_JP_Job_Title: 1,
    HCJ_JP_Job_Headline: 1,
    HCJ_JP_Job_Type: 1,
    HCJ_JDT_Job_Location: 1,
    HCJ_JP_Salary_Currency: 1,
    HCJ_JP_Salary_Amount: 1,
    HCJ_JP_Perks: 1,
    HCJ_JP_Job_Skills: 1,
    HCJ_JDT_Posted_DtTym: 1,
    HCJ_JDT_Application_Deadline: 1,
    ...(searchParams.get("detailed") === "true"
      ? {
          HCJ_JP_Job_Description: 1,
          HCJ_JP_Responsibility: 1,
          HCJ_JP_Additional_Preferences: 1,
        }
      : {}),
  };

  // Data formatter

  const dataFormatter = async (job) => {
    const baseJob = job.toObject();

    if (
      searchParams.get("withCompany") === "true" &&
      baseJob.HCJ_JP_Company_Id
    ) {
      try {
        baseJob.company = await getCachedCompanyDetails(
          baseJob.HCJ_JP_Company_Id
        );
      } catch (error) {
        console.error("Failed to fetch company details", error);
        baseJob.company = null;
      }
    }

    if (baseJob.HCJ_JP_Salary_Amount) {
      baseJob.displaySalary = `${
        baseJob.HCJ_JP_Salary_Currency
      } ${baseJob.HCJ_JP_Salary_Amount.toLocaleString()}`;
    }

    baseJob.postedDate = baseJob.HCJ_JDT_Posted_DtTym
      ? new Date(baseJob.HCJ_JDT_Posted_DtTym).toISOString().split("T")[0]
      : null;

    baseJob.deadlineDate = baseJob.HCJ_JDT_Application_Deadline
      ? new Date(baseJob.HCJ_JDT_Application_Deadline)
          .toISOString()
          .split("T")[0]
      : null;

    return baseJob;
  };

  // Manual patch for "_in" fields to enable $in queries
  if (cleanedSearchParams.get("HCJ_JP_Opportunity_Type_in")) {
    const inValues = JSON.parse(
      cleanedSearchParams.get("HCJ_JP_Opportunity_Type_in")
    );
    cleanedSearchParams.delete("HCJ_JP_Opportunity_Type_in");
    cleanedSearchParams.set(
      "HCJ_JP_Opportunity_Type__$in",
      JSON.stringify(inValues)
    );
  }

  return getPaginatedResults(
    HcjJobPostings,
    cleanedSearchParams,
    searchFields,
    projection,
    dataFormatter
  );
}
