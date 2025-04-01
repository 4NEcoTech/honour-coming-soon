import { useState } from "react";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (userId, formData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/global/v1/gblBrBT90012PasswordChange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UT_User_Id: userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, error: "Failed to update password. Please try again later." };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
}
