import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/utils/dbConnect';
import HcjJobApplication from '@/app/models/hcj_job_applications';
import HcjJobPostings from '@/app/models/hcj_job_postings';

/**
 * @swagger
 * /api/employee/v1/hcjBrBT60061ApplyJobApplications:
 *   post:
 *     summary: Submit a new job application
 *     description: >
 *       Accepts a job application request by a student or applicant. Validates duplicate applications,
 *       job availability, and application limits before submission.
 *     tags:
 *       - Job Applications For Student Posted by Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - HCJ_AT_Applicant_Id
 *               - HCJ_AT_Job_Id
 *               - HCJ_AT_Applicant_First_Name
 *               - HCJ_AT_Applicant_Last_Name
 *               - HCJ_AT_Applicant_Email
 *               - HCJ_AT_Applicant_Phone_Number
 *               - HCJ_AT_Applicant_Type
 *               - HCJ_JA_Job_Created_By
 *               - HCJ_Job_JA_Applied_By
 *             properties:
 *               HCJ_AT_Applicant_Id:
 *                 type: string
 *                 example: 681df7a4bedb829b456e7c93
 *               HCJ_AT_Job_Id:
 *                 type: string
 *                 example: 6824881af1a3518ee2188a09
 *               HCJ_AT_Applicant_First_Name:
 *                 type: string
 *                 example: John
 *               HCJ_AT_Applicant_Last_Name:
 *                 type: string
 *                 example: Doe
 *               HCJ_AT_Applicant_Email:
 *                 type: string
 *                 example: john.doe@example.com
 *               HCJ_AT_Applicant_Phone_Number:
 *                 type: string
 *                 example: +911234567890
 *               HCJ_AT_Applicant_Type:
 *                 type: string
 *                 example: Student
 *               HCJ_JA_Job_Created_By:
 *                 type: string
 *                 example: admin789
 *               HCJ_Job_JA_Applied_By:
 *                 type: string
 *                 example: studentPortal
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application submitted successfully
 *                 application:
 *                   type: object
 *       400:
 *         description: Validation error or duplicate application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You have already applied for this job
 *       404:
 *         description: Job not found or closed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Job not found or applications are closed
 *       500:
 *         description: Server error while submitting application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

// POST /api/applications
export async function POST(request) {
  try {
    await dbConnect();
    
    const applicationData = await request.json();

    // Validate required fields
    const requiredFields = [
      'HCJ_AT_Applicant_Id',
      'HCJ_AT_Job_Id',
      'HCJ_AT_Applicant_First_Name',
      'HCJ_AT_Applicant_Last_Name',
      'HCJ_AT_Applicant_Email',
      'HCJ_AT_Applicant_Phone_Number',
      'HCJ_AT_Applicant_Type',
      'HCJ_JA_Job_Created_By',
      'HCJ_Job_JA_Applied_By'
    ];

    for (const field of requiredFields) {
      if (!applicationData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if job exists and is still open
    const job = await HcjJobPostings.findOne({ 
      _id: applicationData.HCJ_AT_Job_Id,
      HCJ_JDT_Job_Status: 'active',
      HCJ_JDT_Application_Deadline: { $gt: new Date() }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or applications are closed' },
        { status: 404 }
      );
    }

    // Check if student has already applied
    const existingApplication = await HcjJobApplication.findOne({
      HCJ_AT_Applicant_Id: applicationData.HCJ_AT_Applicant_Id,
      HCJ_AT_Job_Id: applicationData.HCJ_AT_Job_Id
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    // Check application limit if exists
    if (job.HCJ_JP_Application_Limit) {
      const applicationCount = await HcjJobApplication.countDocuments({
        HCJ_AT_Job_Id: applicationData.HCJ_AT_Job_Id
      });
      
      if (applicationCount >= job.HCJ_JP_Application_Limit) {
        return NextResponse.json(
          { error: 'Application limit reached for this job' },
          { status: 400 }
        );
      }
    }

    // Set default status and timestamps
    const newApplication = new HcjJobApplication({
      ...applicationData,
      HCJ_AT_Application_Status: 'Received', // Default status
      HCJ_AT_Applied_At: new Date()
    });

    await newApplication.save();

    return NextResponse.json(
      { message: 'Application submitted successfully', application: newApplication },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee/v1/hcjBrBT60061ApplyJobApplications:
 *   get:
 *     summary: Get all job applications for a specific applicant
 *     description: >
 *       Fetches a list of all job applications submitted by an applicant, sorted by creation date (latest first).
 *     tags:
 *       - Get All Job Applications For Student Posted by Employee
 *     parameters:
 *       - in: query
 *         name: applicantId
 *         required: true
 *         description: The ID of the applicant
 *         schema:
 *           type: string
 *           example: 681df7a4bedb829b456e7c93
 *     responses:
 *       200:
 *         description: List of job applications returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing applicantId query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: applicantId query parameter is required
 *       500:
 *         description: Server error while fetching applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */


// GET /api/applications
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const applicantId = searchParams.get('applicantId');
    
    if (!applicantId) {
      return NextResponse.json(
        { error: 'applicantId query parameter is required' },
        { status: 400 }
      );
    }

    const applications = await HcjJobApplication.find({ 
      HCJ_AT_Applicant_Id: applicantId 
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { applications },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}