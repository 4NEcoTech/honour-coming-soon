import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/utils/dbConnect';
import HcjJobApplication from '@/app/models/hcj_job_applications';

/**
 * @swagger
 * /api/employee/v1/hcjBrBT60061ApplyJobApplications/{id}:
 *   get:
 *     summary: Get a specific job application by ID
 *     description: Retrieves a single job application using its MongoDB ObjectId.
 *     tags:
 *       - Get A Particular Job Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job application
 *         schema:
 *           type: string
 *           example: 68259e7a32419d06f15a7c98
 *     responses:
 *       200:
 *         description: Application found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application:
 *                   type: object
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Application not found
 *       500:
 *         description: Server error while fetching application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

// GET /api/applications/[id]
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const application = await HcjJobApplication.findById(id);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { application },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/employee/v1/hcjBrBT60061ApplyJobApplications/{id}:
 *   patch:
 *     summary: Update a job application by ID
 *     description: >
 *       Allows updating a job application with new data except for restricted fields like applicant ID, job ID, creator ID, and timestamps.
 *     tags:
 *       - Update A Particular Job Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job application to update
 *         schema:
 *           type: string
 *           example: 68259e7a32419d06f15a7c98
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update (excluding restricted fields)
 *             example:
 *               HCJ_AT_Applicant_Email: updated.email@example.com
 *               HCJ_AT_Application_Status: Shortlisted
 *     responses:
 *       200:
 *         description: Application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application updated successfully
 *                 application:
 *                   type: object
 *       400:
 *         description: Attempt to update restricted fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cannot update restricted field: HCJ_AT_Job_Id
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error during update
 */

// PATCH /api/applications/[id]
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const updateData = await request.json();

    // Fields that shouldn't be updated
    const restrictedFields = [
      'HCJ_AT_Applicant_Id',
      'HCJ_AT_Job_Id',
      'HCJ_JA_Job_Created_By',
      'HCJ_Job_JA_Applied_By',
      'HCJ_AT_Applied_At'
    ];

    for (const field of restrictedFields) {
      if (updateData[field]) {
        return NextResponse.json(
          { error: `Cannot update restricted field: ${field}` },
          { status: 400 }
        );
      }
    }

    const updatedApplication = await HcjJobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Application updated successfully', 
        application: updatedApplication 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee/v1/hcjBrBT60061ApplyJobApplications/{id}:
 *   delete:
 *     summary: Delete a job application by ID
 *     description: Deletes a job application permanently from the database.
 *     tags:
 *       - Delete A Particular Job Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job application to delete
 *         schema:
 *           type: string
 *           example: 68259e7a32419d06f15a7c98
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application deleted successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error while deleting application
 */

// DELETE /api/applications/[id]
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const deletedApplication = await HcjJobApplication.findByIdAndDelete(id);

    if (!deletedApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Application deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}