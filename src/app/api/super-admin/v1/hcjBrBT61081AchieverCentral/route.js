import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";
import HcjAchieversCentral from "@/app/models/hcj_achievers_central";

/**
 * @swagger
 * /api/super-admin/v1/hcjBrBT61081AchieverCentral:
 *   patch:
 *     summary: Verify or Reject an Achiever
 *     description: >
 *       Allows Super Admin to update the status of an achiever as "01" (Verified) or "03" (Rejected).  
 *       Also appends an audit trail with action metadata.
 *     tags:
 *       - Super-Admin Verify A Achiver Central
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - achieverId
 *               - status
 *               - superAdminId
 *             properties:
 *               achieverId:
 *                 type: string
 *                 description: MongoDB ObjectId of the achiever to update
 *               status:
 *                 type: string
 *                 enum: ["01", "03"]
 *                 description: "01 = Verified, 03 = Rejected"
 *               superAdminId:
 *                 type: string
 *                 description: ID of the Super Admin performing the action
 *     responses:
 *       200:
 *         description: Achiever status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedStatus:
 *                   type: string
 *                 auditLog:
 *                   type: object
 *                   properties:
 *                     actionBy:
 *                       type: string
 *                     actionType:
 *                       type: string
 *                     actionAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing or invalid fields
 *       404:
 *         description: Achiever not found
 *       500:
 *         description: Internal Server Error
 */


export async function PATCH(req) {
  try {
    await dbConnect();
    const { achieverId, status, superAdminId } = await req.json();

    if (!achieverId || !status || !superAdminId) {
      return NextResponse.json(
        { error: "Missing required fields: achieverId, status, superAdminId." },
        { status: 400 }
      );
    }

    if (!["01", "03"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Use '01' (Verified) or '03' (Rejected)." },
        { status: 400 }
      );
    }

    const achiever = await HcjAchieversCentral.findById(achieverId);
    if (!achiever) {
      return NextResponse.json({ error: "Achiever not found." }, { status: 404 });
    }

    // Update status and audit trail
    achiever.HCJ_AC_Status = status;
    achiever.updatedAt = new Date();

    const auditEntry = {
      actionBy: superAdminId,
      actionType: status === "01" ? "Verified" : "Rejected",
      actionAt: new Date(),
    };

    if (!Array.isArray(achiever.HCJ_AC_Audit_Trail)) {
      achiever.HCJ_AC_Audit_Trail = [];
    }

    achiever.HCJ_AC_Audit_Trail.push(auditEntry);
    await achiever.save();

    return NextResponse.json(
      {
        message: `Achiever ${status === "01" ? "verified" : "rejected"} successfully.`,
        updatedStatus: status,
        auditLog: auditEntry,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
