import { dbConnect } from "@/app/utils/dbConnect";
import CompanyContactPerson from "@/app/models/company_contact_person";
import { sendCompanyStaffUpdateEmail } from "@/app/utils/SendMail";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
/**
 * @swagger
 * /api/employee/v1/manage-staff:
  get:
    summary: Get a Single Staff Member
    description: Fetches details of a single staff member using their ID.
    tags: [Manage Team Member/Staff Profile]
    parameters:
      - in: query
        name: id
        required: true
        description: The unique ID of the staff member.
        schema:
          type: string
          example: "67d44d4c088d9c22b86f18c5"
    responses:
      200:
        description: Successfully retrieved the staff member.
        content:
          application/json:
            schema:
              type: object
              properties:
                _id:
                  type: string
                  example: "67d44d4c088d9c22b86f18c5"
                CCP_Contact_Person_First_Name:
                  type: string
                  example: "John"
                CCP_Contact_Person_Last_Name:
                  type: string
                  example: "Doe"
                CCP_Contact_Person_Email:
                  type: string
                  example: "john.doe@example.com"
      400:
        description: Staff ID is missing.
      404:
        description: Staff member not found.
      500:
        description: Internal server error.

  patch:
    summary: Update a Staff Member
    description: Updates details of a staff member using their ID.
    tags: [Team Member/Staff]
    parameters:
      - in: query
        name: id
        required: true
        description: The unique ID of the staff member to update.
        schema:
          type: string
          example: "67d44d4c088d9c22b86f18c5"
    requestBody:
      required: true
      content:
        multipart/form-data:
          schema:
            type: object
            properties:
              CCP_Contact_Person_First_Name:
                type: string
                example: "Updated John"
              CCP_Contact_Person_Last_Name:
                type: string
                example: "Updated Doe"
              CCP_Contact_Person_Email:
                type: string
                example: "updated.john.doe@example.com"
              CCP_Contact_Person_Phone:
                type: string
                example: "+919876543210"
    responses:
      200:
        description: Successfully updated the staff member.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Staff updated successfully"
      400:
        description: Invalid request, missing fields, or email already exists.
      404:
        description: Staff member not found.
      500:
        description: Internal server error.

  delete:
    summary: Delete a Staff Member
    description: Deletes a staff member using their ID.
    tags: [Team Member/Staff]
    parameters:
      - in: query
        name: id
        required: true
        description: The unique ID of the staff member to delete.
        schema:
          type: string
          example: "67d44d4c088d9c22b86f18c5"
    responses:
      200:
        description: Successfully deleted the staff member.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Staff deleted successfully"
      400:
        description: Staff ID is required.
      404:
        description: Staff member not found.
      500:
        description: Internal server error.

 */

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("id");

    if (!staffId) {
      return new Response(JSON.stringify({ error: "Staff ID is required" }), {
        status: 400,
      });
    }

    const staff = await CompanyContactPerson.findById(staffId);
    if (!staff) {
      return new Response(JSON.stringify({ error: "Staff member not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(staff), { status: 200 });
  } catch (error) {
    console.error("Error fetching staff member:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch staff member" }),
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    // Get staff ID from query parameters
    const searchParams = new URL(req.url).searchParams;
    const staffId = searchParams.get("id");

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Parse JSON data from request body
    const data = await req.json();
    const userLang = data.language || "en";

    // Find existing staff member
    const existingStaff = await CompanyContactPerson.findById(staffId);
    if (!existingStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Check if the new email already exists for another staff member
    if (
      data.CCP_Contact_Person_Email &&
      data.CCP_Contact_Person_Email !== existingStaff.CCP_Contact_Person_Email
    ) {
      const existingUser = await CompanyContactPerson.findOne({
        CCP_Contact_Person_Email: data.CCP_Contact_Person_Email,
        _id: { $ne: staffId },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use by another staff member" },
          { status: 400 }
        );
      }
    }

    // Prepare updated staff data
    const updatedData = {
      CCP_Admin_Invitee_Id:
        data.CCP_Admin_Invitee_Id || existingStaff.CCP_Admin_Invitee_Id,
      CCP_Institute_Num:
        data.CCP_Institute_Num || existingStaff.CCP_Institute_Num,
      CCP_Institute_Name:
        data.CCP_Institute_Name || existingStaff.CCP_Institute_Name,
      CCP_Contact_Person_First_Name:
        data.CCP_Contact_Person_First_Name ||
        existingStaff.CCP_Contact_Person_First_Name,
      CCP_Contact_Person_Last_Name:
        data.CCP_Contact_Person_Last_Name ||
        existingStaff.CCP_Contact_Person_Last_Name,
      CCP_Contact_Person_Phone:
        data.CCP_Contact_Person_Phone || existingStaff.CCP_Contact_Person_Phone,
      CCP_Contact_Person_Alternate_Phone:
        data.CCP_Contact_Person_Alternate_Phone ||
        existingStaff.CCP_Contact_Person_Alternate_Phone,
      CCP_Contact_Person_Email:
        data.CCP_Contact_Person_Email || existingStaff.CCP_Contact_Person_Email,
      CCP_Contact_Person_Alternate_Email:
        data.CCP_Contact_Person_Alternate_Email ||
        existingStaff.CCP_Contact_Person_Alternate_Email,
      CCP_Contact_Person_Role:
        data.CCP_Contact_Person_Role || existingStaff.CCP_Contact_Person_Role,
      CCP_Contact_Person_Gender:
        data.CCP_Contact_Person_Gender ||
        existingStaff.CCP_Contact_Person_Gender,
      CCP_Contact_Person_DOB: data.CCP_Contact_Person_DOB
        ? new Date(data.CCP_Contact_Person_DOB)
        : existingStaff.CCP_Contact_Person_DOB,
      CCP_Contact_Person_Country:
        data.CCP_Contact_Person_Country ||
        existingStaff.CCP_Contact_Person_Country,
      CCP_Contact_Person_Pincode:
        data.CCP_Contact_Person_Pincode ||
        existingStaff.CCP_Contact_Person_Pincode,
      CCP_Contact_Person_State:
        data.CCP_Contact_Person_State || existingStaff.CCP_Contact_Person_State,
      CCP_Contact_Person_City:
        data.CCP_Contact_Person_City || existingStaff.CCP_Contact_Person_City,
      CCP_Contact_Person_Address_Line1:
        data.CCP_Contact_Person_Address_Line1 ||
        existingStaff.CCP_Contact_Person_Address_Line1,
      CCP_Contact_Person_Joining_Year:
        data.CCP_Contact_Person_Joining_Year ||
        existingStaff.CCP_Contact_Person_Joining_Year,
      CCP_Contact_Person_Department:
        data.CCP_Contact_Person_Department ||
        existingStaff.CCP_Contact_Person_Department,
      CCP_Contact_Person_Designation:
        data.CCP_Contact_Person_Designation ||
        existingStaff.CCP_Contact_Person_Designation,
      CCP_Contact_Person_Document_Domicile:
        data.CCP_Contact_Person_Document_Domicile ||
        existingStaff.CCP_Contact_Person_Document_Domicile,
      CCP_Contact_Person_Document_Type:
        data.CCP_Contact_Person_Document_Type ||
        existingStaff.CCP_Contact_Person_Document_Type,
      CCP_Contact_Person_Document_Number:
        data.CCP_Contact_Person_Document_Number ||
        existingStaff.CCP_Contact_Person_Document_Number,
      CCP_Contact_Person_Document_Picture:
        data.CCP_Contact_Person_Document_Picture ||
        existingStaff.CCP_Contact_Person_Document_Picture,
      CCP_Company_Id: data.CCP_Company_Id || existingStaff.CCP_Company_Id,
      CCP_Individual_Id:
        data.CCP_Individual_Id || existingStaff.CCP_Individual_Id,
    };

    // Update staff in database
    const updatedStaff = await CompanyContactPerson.findByIdAndUpdate(
      staffId,
      updatedData,
      { new: true }
    );

    if (!updatedStaff) {
      return NextResponse.json(
        { error: "Failed to update staff member" },
        { status: 500 }
      );
    }

    // Generate token with full updated staff data
    const token = jwt.sign(
      {
        id: updatedStaff._id.toString(), // ensure it's a string
        ...updatedStaff.toObject(), // spreads all fields from Mongoose document
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Generate signup URL using this token
    const signupUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${userLang}/team-signup?token=${token}`;

    // Email to staff member
    const roleMap = {
      "10": "Team Member",
      "11": "Support Staff",
    };
    const roleName =
      roleMap[updatedStaff.CCP_Contact_Person_Role] ||
      updatedStaff.CCP_Contact_Person_Role;

    // Call utility function with updated values
    const emailSent = await sendCompanyStaffUpdateEmail(
      updatedStaff.CCP_Contact_Person_Email,
      `${updatedStaff.CCP_Contact_Person_First_Name} ${updatedStaff.CCP_Contact_Person_Last_Name}`,
      updatedStaff.CCP_Institute_Name,
      signupUrl
    );

    if (!emailSent) {
      console.error(
        "Email sending failed for:",
        updatedStaff.CCP_Contact_Person_Email
      );
    }

    return NextResponse.json(
      {
        message: "Staff member updated successfully",
        staff: updatedStaff,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating staff member:", error);
    return NextResponse.json(
      {
        error: "Failed to update staff member",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("id");

    if (!staffId) {
      return new Response(JSON.stringify({ error: "Staff ID is required" }), {
        status: 400,
      });
    }

    const deletedStaff = await CompanyContactPerson.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return new Response(
        JSON.stringify({ error: "Staff member not found or already deleted" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Staff deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting staff member:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete staff member" }),
      { status: 500 }
    );
  }
}
