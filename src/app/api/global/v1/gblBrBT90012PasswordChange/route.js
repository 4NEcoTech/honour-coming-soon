import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import User from "@/app/models/user_table"; // Ensure correct model path
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/global/v1/gblBrBT90012PasswordChange:
 *   post:
 *     summary: Change user password
 *     description: |
 *       - Allows a user to change their password by providing the current password.
 *       - Ensures that the new password meets security requirements.
 *       - Stores the new password securely using bcrypt hashing.
 *     tags: [Password Change For All Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UT_User_Id:
 *                 type: string
 *                 example: "aditya@4necotech.in"
 *                 description: "The unique user identifier (email)."
 *               currentPassword:
 *                 type: string
 *                 example: "OldPassword@123"
 *                 description: "The current password of the user."
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword@456"
 *                 description: |
 *                   The new password must meet the following criteria:
 *                   - At least 12 characters long
 *                   - At least one uppercase letter
 *                   - At least one lowercase letter
 *                   - At least one number
 *                   - At least one special character (@$!%*?&)
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword@456"
 *                 description: "Must match the newPassword field."
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully!"
 *       400:
 *         description: Bad request (Validation failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Passwords do not match."
 *       401:
 *         description: Unauthorized (Incorrect current password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Current password is incorrect."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */

//  Strong Password Regex (12+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

export async function POST(req) {
  try {
    await dbConnect();
    const { UT_User_Id, currentPassword, newPassword, confirmPassword } = await req.json();

    //  Validate required fields
    if (!UT_User_Id || !currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    //  Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }

    //  Check password strength
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json({
        error:
          "Password must be at least 12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      }, { status: 400 });
    }

    //  Fetch the user from the database using UT_User_Id
    const user = await User.findOne({ UT_User_Id });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    //  Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.UT_Password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    //  Check if new password is same as old password (Prevent reusing old password)
    const isSamePassword = await bcrypt.compare(newPassword, user.UT_Password);
    if (isSamePassword) {
      return NextResponse.json({ error: "New password cannot be the same as the old password." }, { status: 400 });
    }

    //  Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    //  Update the password in the database
    user.UT_Password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
