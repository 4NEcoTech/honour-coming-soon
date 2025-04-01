import { dbConnect } from "@/app/utils/dbConnect";
import IndividualEducation from "@/app/models/individual_education";
import { generateAuditTrail } from "@/app/utils/audit-trail";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60861AddEducation/{id}:
 *   get:
 *     summary: Get a single education record
 *   patch:
 *     summary: Update a single education record
 *   delete:
 *     summary: Delete a single education record
 */

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params; // Updated to use Next.js App Router params
  console.log(id);
  const education = await IndividualEducation.findById(id);
  if (!education)
    return new Response(JSON.stringify({ message: "Education not found" }), {
      status: 404,
    });
  return new Response(JSON.stringify(education), { status: 200 });
}

export async function PATCH(req, { params }) {
  await dbConnect();
  const { id } = await params;
  const updateData = await req.json();
  const auditTrail = await generateAuditTrail(req);
  const updatedEducation = await IndividualEducation.findByIdAndUpdate(
    id,
    { $set: updateData, $push: { ieAuditTrail: auditTrail } },
    { new: true }
  );
  if (!updatedEducation)
    return new Response(JSON.stringify({ message: "Education not found" }), {
      status: 404,
    });
  return new Response(
    JSON.stringify({ message: "Education details updated successfully!" }),
    { status: 200 }
  );
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = await params;
  const deletedEducation = await IndividualEducation.findByIdAndDelete(id);
  if (!deletedEducation)
    return new Response(JSON.stringify({ message: "Education not found" }), {
      status: 404,
    });
  return new Response(
    JSON.stringify({ message: "Education details deleted successfully!" }),
    { status: 200 }
  );
}
