import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/app/utils/dbConnect';
import HcjJobApplication from '@/app/models/hcj_job_applications';

/**
 * @swagger
 * /api/employee/v1/hcjArET60032CheckApplicationStatus:
 *   get:
 *     summary: Check job application status
 *     description: >
 *       Checks whether a specific user has already applied to a specific job opportunity.
 *     tags:
 *       - Job Applications For Student Posted by Employee
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the applicant (user).
 *         example: 681df7a4bedb829b456e7c93
 *       - in: query
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job posting.
 *         example: 682afc96d14e8f16bf2fae04
 *     responses:
 *       200:
 *         description: Application status found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   enum: [applied, not_applied]
 *                   example: applied
 *       400:
 *         description: Missing or invalid query parameters
 *       500:
 *         description: Internal server error
 */

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    // Validate IDs
    if (!userId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'userId and jobId are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid userId or jobId' },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await HcjJobApplication.findOne({
      HCJ_AT_Applicant_Id: userId,
      HCJ_AT_Job_Id: jobId,
    });

    const status = existingApplication
      ? existingApplication.HCJ_JA_Application_Status || 'applied'
      : 'not_applied';

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error checking application status:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error while checking application status',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
