import { NextResponse } from "next/server";
import HCJStudent from "@/app/models/hcj_student"; // Ensure this model path is correct
import { dbConnect } from "@/app/utils/dbConnect";
import nodemailer from "nodemailer";
import { sendStudentUpdateEmail } from "@/app/utils/SendMail";
/**
 * @swagger
 * /api/institution/v1/hcjBrBT60552ManageStudents:
 *   get:
 *     summary: Get a Single Student
 *     description: Fetches details of a single student using their ID.
 *     tags: [Manage Student Profile ]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The unique ID of the student.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4c001f8e4d3a"
 *     responses:
 *       200:
 *         description: Successfully retrieved the student details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1d4c001f8e4d3a"
 *                 HCJ_ST_Student_First_Name:
 *                   type: string
 *                   example: "John"
 *                 HCJ_ST_Student_Last_Name:
 *                   type: string
 *                   example: "Doe"
 *                 HCJ_ST_Educational_Email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       400:
 *         description: Student ID is missing.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update a Student
 *     description: Updates a student's details using their ID. Send only the fields that need to be updated.
 *     tags: [Student]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The unique ID of the student.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4c001f8e4d3a"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_ST_Student_First_Name:
 *                 type: string
 *                 example: "Jonathan"
 *               HCJ_ST_Gender:
 *                 type: string
 *                 example: "02"
 *               HCJ_ST_DOB:
 *                 type: string
 *                 format: date
 *                 example: "2001-05-10"
 *     responses:
 *       200:
 *         description: Successfully updated the student details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student updated successfully"
 *                 student:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d4c001f8e4d3a"
 *                     HCJ_ST_Student_First_Name:
 *                       type: string
 *                       example: "Jonathan"
 *                     HCJ_ST_Gender:
 *                       type: string
 *                       example: "02"
 *       400:
 *         description: Student ID is missing or invalid request.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete a Student
 *     description: Deletes a student from the system using their ID.
 *     tags: [Student]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The unique ID of the student to be deleted.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4c001f8e4d3a"
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student deleted successfully"
 *       400:
 *         description: Student ID is missing.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 */


export async function GET(req) {
  try {
    await dbConnect();
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const student = await HCJStudent.findById(studentId).lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData.entries());

    if (updatedData.HCJ_ST_DOB) {
      updatedData.HCJ_ST_DOB = new Date(updatedData.HCJ_ST_DOB);
    }

    const updatedStudent = await HCJStudent.findByIdAndUpdate(studentId, updatedData, { new: true });

    if (!updatedStudent) {
      return NextResponse.json({ error: "Student not found or update failed" }, { status: 404 });
    }

     // Step 5: Send Update Notification Email
     const emailSent = await sendStudentUpdateEmail(
      updatedStudent.HCJ_ST_Educational_Email,
      `${updatedStudent.HCJ_ST_Student_First_Name} ${updatedStudent.HCJ_ST_Student_Last_Name}`,
      updatedStudent.HCJ_ST_Institution_Name
    );

    if (!emailSent) {
      console.error("Email sending failed for:", updatedStudent.HCJ_ST_Educational_Email);
    }


    return NextResponse.json({ message: "Student updated successfully", student: updatedStudent }, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const deletedStudent = await HCJStudent.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
