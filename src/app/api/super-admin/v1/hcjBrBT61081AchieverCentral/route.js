import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";
import HcjAchieversCentral from "@/app/models/hcj_achievers_central";

/**
 * PATCH /api/super-admin/v1/hcjArET61032UpdateAchieverStatus
 * Description:
 *  - Super Admin can verify (status = "01") or reject (status = "03") an achiever.
 * Request Body:
 *  {
 *    "achieverId": "MONGO_ID",
 *    "status": "01" or "03",
 *    "superAdminId": "SA123456"
 *  }
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
