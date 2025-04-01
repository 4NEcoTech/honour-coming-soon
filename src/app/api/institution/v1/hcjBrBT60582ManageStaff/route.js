
import { dbConnect } from "@/app/utils/dbConnect";
import CompanyContactPerson from "@/app/models/company_contact_person";
import { sendStaffUpdateEmail } from "@/app/utils/SendMail";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60582ManageStaff:
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
      return new Response(
        JSON.stringify({ error: "Staff ID is required" }),
        { status: 400 }
      );
    }

    const staff = await CompanyContactPerson.findById(staffId);
    if (!staff) {
      return new Response(
        JSON.stringify({ error: "Staff member not found" }),
        { status: 404 }
      );
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
      const { searchParams } = new URL(req.url);
      const staffId = searchParams.get("id"); // Get ID from URL, not form data
  
      if (!staffId) {
        return new Response(
          JSON.stringify({ error: "Staff ID is required" }),
          { status: 400 }
        );
      }
  
      const formData = await req.formData();
      const updatedData = Object.fromEntries(formData.entries());
  
      if (updatedData.CCP_Contact_Person_DOB) {
        updatedData.CCP_Contact_Person_DOB = new Date(updatedData.CCP_Contact_Person_DOB);
      }
  
      // 🔹 Check if the new email already exists for another staff member
      if (updatedData.CCP_Contact_Person_Email) {
        const existingUser = await CompanyContactPerson.findOne({
          CCP_Contact_Person_Email: updatedData.CCP_Contact_Person_Email,
          _id: { $ne: staffId }, // Exclude the current staff member
        });
  
        if (existingUser) {
          return new Response(
            JSON.stringify({ error: "Email already in use by another staff member" }),
            { status: 400 }
          );
        }
      }
  
      const updatedStaff = await CompanyContactPerson.findByIdAndUpdate(
        staffId,
        updatedData,
        { new: true }
      );
  
      if (!updatedStaff) {
        return new Response(
          JSON.stringify({ error: "Failed to update staff member" }),
          { status: 404 }
        );
      }

       // Step 5: Send Update Notification Email
    const emailSent = await sendStaffUpdateEmail(
      updatedStaff.CCP_Contact_Person_Email,
      `${updatedStaff.CCP_Contact_Person_First_Name} ${updatedStaff.CCP_Contact_Person_Last_Name}`,
      updatedStaff.CCP_Institute_Name
    );

    if (!emailSent) {
      console.error("Email sending failed for:", updatedStaff.CCP_Contact_Person_Email);
    }
  
      return new Response(
        JSON.stringify({ message: "Staff updated successfully", updatedStaff }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating staff member:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update staff member" }),
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
      return new Response(
        JSON.stringify({ error: "Staff ID is required" }),
        { status: 400 }
      );
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
