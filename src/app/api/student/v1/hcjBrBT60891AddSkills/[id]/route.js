import { dbConnect } from "@/app/utils/dbConnect";
import hcjSkills from "@/app/models/hcj_skill";
import { generateAuditTrail } from "@/app/utils/audit-trail";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60891AddSkills/[id]:
 *   get:
 *     summary: Get a single skill record
 *     description: Fetches a skill entry by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill found.
 *       404:
 *         description: Skill not found.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update a skill entry
 *     description: Updates an existing skill record.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_SKT_Industry:
 *                 type: string
 *                 example: "Data Science"
 *               HCJ_SKT_Skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Python", "Machine Learning", "TensorFlow"]
 *               HCJ_SKT_Session_Id:
 *                 type: string
 *                 example: "session_67890"
 *     responses:
 *       200:
 *         description: Skill updated successfully.
 *       404:
 *         description: Skill not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete a skill entry
 *     description: Removes a skill entry from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill deleted successfully.
 *       404:
 *         description: Skill not found.
 *       500:
 *         description: Internal server error.
 */

//  GET single skill
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const skill = await hcjSkills.findById(id);
    if (!skill) {
      return new Response(
        JSON.stringify({ success: false, message: "Skill not found." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, skill }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching skill:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching skill" }),
      { status: 500 }
    );
  }
}

//  PATCH update skill
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();
    const auditTrail = await generateAuditTrail(req);

    const updatedSkills = await hcjSkills.findByIdAndUpdate(
      id,
      {
        $set: {
          HCJ_SKT_Industry: updates.HCJ_SKT_Industry,
          HCJ_SKT_Skills: updates.HCJ_SKT_Skills,
          HCJ_SKT_Session_Id: updates.HCJ_SKT_Session_Id,
        },
        $push: { HCJ_SKT_Audit_Trail: auditTrail },
      },
      { new: true }
    );

    if (!updatedSkills) {
      return new Response(
        JSON.stringify({ success: false, message: "Skill not found." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, updatedSkills }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error updating skill" }),
      { status: 500 }
    );
  }
}

//  DELETE skill
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedSkill = await hcjSkills.findByIdAndDelete(id);
    if (!deletedSkill) {
      return new Response(
        JSON.stringify({ success: false, message: "Skill not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Skill deleted successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting skill" }),
      { status: 500 }
    );
  }
}
