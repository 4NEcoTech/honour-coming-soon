import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/utils/dbConnect';
import HcjJobApplication from '@/app/models/hcj_job_applications';

/**
 * @swagger
 * /api/employee/v1/hcjBrBT61681UpdateApplicationStatus:
 *   patch:
 *     summary: Update job application status
 *     description: >
 *       Allows company admins to update the status of a job application.
 *       Valid statuses are: Received, Shortlisted, Hired, Rejected.
 *     tags:
 *       - Job Applications For Student Posted by Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - status
 *             properties:
 *               applicationId:
 *                 type: string
 *                 example: 6824abcde1234567890abcd1
 *               status:
 *                 type: string
 *                 enum: [Received, Shortlisted, Hired, Rejected]
 *                 example: Shortlisted
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid request or status
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */

export async function PATCH(request) {
  try {
    await dbConnect();
    const { applicationId, status } = await request.json();

    // Validate presence
    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'applicationId and status are required' },
        { status: 400 }
      );
    }

    // Validate allowed statuses
    const allowedStatuses = ['Received', 'Shortlisted', 'Hired', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await HcjJobApplication.findByIdAndUpdate(
      applicationId,
      {
        HCJ_AT_Application_Status: status,
        HCJ_AT_Status_Updated_At: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Status updated successfully', application: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
