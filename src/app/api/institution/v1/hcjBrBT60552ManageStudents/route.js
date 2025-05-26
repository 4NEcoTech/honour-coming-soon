import HCJStudent from "@/app/models/hcj_student"; // Ensure this model path is correct
import { sendStudentUpdateEmail } from "@/app/utils/SendMail";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_27",
          title: t("errorCode.6055_27.title"),
          message: t("errorCode.6055_27.description"),
        },
        { status: 400 }
      );
    }

    const student = await HCJStudent.findById(studentId).lean();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_28",
          title: t("errorCode.6055_28.title"),
          message: t("errorCode.6055_28.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6055_29",
        title: t("errorCode.6055_29.title"),
        message: t("errorCode.6055_29.description"),
        data: student,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6055_30",
        title: t("errorCode.6055_30.title"),
        message: t("errorCode.6055_30.description"),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();

    // Get student ID from query parameters
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json(
        {
          success: true,
          code: "6055_31",
          title: t("errorCode.6055_31.title"),
          message: t("errorCode.6055_31.description"),
        },
        { status: 400 }
      );
    }

    // Parse JSON data from request body
    const data = await req.json();
    const userLang = data.language || "en";

    // Find existing student
    const existingStudent = await HCJStudent.findById(studentId);
    if (!existingStudent) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_28",
          title: t("errorCode.6055_28.title"),
          message: t("errorCode.6055_28.description"),
        },
        { status: 404 }
      );
    }

    // Generate audit trail for the update
    const auditTrail = await generateAuditTrail(req);

    // Prepare updated student data
    const updatedData = {
      HCJ_ST_InstituteNum:
        data.HCJ_ST_InstituteNum || existingStudent.HCJ_ST_InstituteNum,
      HCJ_ST_Institution_Name:
        data.HCJ_ST_Institution_Name || existingStudent.HCJ_ST_Institution_Name,
      HCJ_ST_Student_First_Name:
        data.HCJ_ST_Student_First_Name ||
        existingStudent.HCJ_ST_Student_First_Name,
      HCJ_ST_Student_Last_Name:
        data.HCJ_ST_Student_Last_Name ||
        existingStudent.HCJ_ST_Student_Last_Name,
      HCJ_ST_Educational_Email:
        data.HCJ_ST_Educational_Email ||
        existingStudent.HCJ_ST_Educational_Email,
      HCJ_ST_Phone_Number:
        data.HCJ_ST_Phone_Number || existingStudent.HCJ_ST_Phone_Number,
      HCJ_ST_Gender: data.HCJ_ST_Gender || existingStudent.HCJ_ST_Gender,
      HCJ_ST_DOB: data.HCJ_ST_DOB
        ? new Date(data.HCJ_ST_DOB)
        : existingStudent.HCJ_ST_DOB,
      HCJ_ST_Student_Country:
        data.HCJ_ST_Student_Country || existingStudent.HCJ_ST_Student_Country,
      HCJ_ST_Student_Pincode:
        data.HCJ_ST_Student_Pincode || existingStudent.HCJ_ST_Student_Pincode,
      HCJ_ST_Student_State:
        data.HCJ_ST_Student_State || existingStudent.HCJ_ST_Student_State,
      HCJ_ST_Student_City:
        data.HCJ_ST_Student_City || existingStudent.HCJ_ST_Student_City,
      HCJ_ST_Address: data.HCJ_ST_Address || existingStudent.HCJ_ST_Address,
      HCJ_ST_Enrollment_Year:
        data.HCJ_ST_Enrollment_Year || existingStudent.HCJ_ST_Enrollment_Year,
      HCJ_ST_Student_Program_Name:
        data.HCJ_ST_Student_Program_Name ||
        existingStudent.HCJ_ST_Student_Program_Name,
      HCJ_ST_Score_Grade_Type:
        data.HCJ_ST_Score_Grade_Type || existingStudent.HCJ_ST_Score_Grade_Type,
      HCJ_ST_Score_Grade:
        data.HCJ_ST_Score_Grade || existingStudent.HCJ_ST_Score_Grade,
      HCJ_ST_Student_Document_Domicile:
        data.HCJ_ST_Student_Document_Domicile ||
        existingStudent.HCJ_ST_Student_Document_Domicile,
      HCJ_ST_Student_Document_Type:
        data.HCJ_ST_Student_Document_Type ||
        existingStudent.HCJ_ST_Student_Document_Type,
      HCJ_ST_Student_Document_Number:
        data.HCJ_ST_Student_Document_Number ||
        existingStudent.HCJ_ST_Student_Document_Number,
      HCJ_ST_Educational_Alternate_Email:
        data.HCJ_ST_Educational_Alternate_Email ||
        existingStudent.HCJ_ST_Educational_Alternate_Email,
      HCJ_ST_Alternate_Phone_Number:
        data.HCJ_ST_Alternate_Phone_Number ||
        existingStudent.HCJ_ST_Alternate_Phone_Number,
      HCJ_ST_Class_Of_Year:
        data.HCJ_ST_Class_Of_Year || existingStudent.HCJ_ST_Class_Of_Year,
      HCJ_Student_Documents_Image:
        data.HCJ_Student_Documents_Image ||
        existingStudent.HCJ_Student_Documents_Image,
      HCJ_ST_Student_Branch_Specialization:
        data.HCJ_ST_Student_Branch_Specialization ||
        existingStudent.HCJ_ST_Student_Branch_Specialization,
      $push: { HCJ_ST_Audit_Trail: auditTrail }, // Add new audit trail entry
    };

    // Update student in database
    const updatedStudent = await HCJStudent.findByIdAndUpdate(
      studentId,
      updatedData,
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_32",
          title: t("errorCode.6055_32.title"),
          message: t("errorCode.6055_32.description"),
        },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: updatedStudent._id.toString(),
        ...updatedStudent.toObject(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${token}`;
    const mobileDeepLink = `hcj://register?token=${token}`;

    const emailSent = await sendStudentUpdateEmail(
      updatedStudent.HCJ_ST_Educational_Email,
      `${updatedStudent.HCJ_ST_Student_First_Name} ${updatedStudent.HCJ_ST_Student_Last_Name}`,
      updatedStudent.HCJ_ST_Institution_Name,
      signupUrl,
      mobileDeepLink
    );

    if (!emailSent) {
      console.error(
        "Email sending failed for:",
        updatedStudent.HCJ_ST_Educational_Email
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6055_33",
        title: t("errorCode.6055_33.title"),
        message: t("errorCode.6055_33.description"),
        student: updatedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      {
        success: true,
        code: "6055_34",
        title: t("errorCode.6055_34.title"),
        message: t("errorCode.6055_34.description", { message: error.message }),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_27",
          title: t("errorCode.6055_27.title"),
          message: t("errorCode.6055_27.description"),
        },
        { status: 400 }
      );
    }

    const deletedStudent = await HCJStudent.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_28",
          title: t("errorCode.6055_28.title"),
          message: t("errorCode.6055_28.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6055_35",
        title: t("errorCode.6055_35.title"),
        message: t("errorCode.6055_35.description"),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6055_34",
        title: t("errorCode.6055_34.title"),
        message: t("errorCode.6055_34.description", { message: error.message }),
      },
      { status: 500 }
    );
  }
}
