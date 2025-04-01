// Helper function to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// Helper function to get verification status
export const getVerificationStatus = (user) => {
  if (!user || !user.UT_User_Verification_Status) return "Pending";
  const statusMap = {
    "01": "Verified",
    "02": "Pending",
    "03": "Not Verified",
    "04": "Requested Information"

  }
  return statusMap[user.UT_User_Verification_Status] || "Pending"
}

// Helper function to get user type
export const getUserType = (user) => {
  if (!user || !user.UT_User_Role) return "Unknown";
  const roleMap = {
    "05": "Student",
    "06": "Institution",
    "07": "Institution Team Member",
    "08": "Institution Support Staff",
    "09": "Company",
    "10": "Company Team Member",
    "11": "Company Support Staff",
  }
  return roleMap[user.UT_User_Role] || "Unknown"
}

// Helper function to get account status
export const getAccountStatus = (user) => {
  if (!user || !user.UT_User_Status) return "Inactive";
  const statusMap = {
    "04": "Active",
    // Add other status codes as needed
  }
  return statusMap[user.UT_User_Status] || "Inactive"
}

// Get avatar fallback text
export const getAvatarFallback = (name) => {
  if (!name) return "?"
  const nameParts = name.split(" ")
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
  }
  return name[0].toUpperCase()
}

// Get verification badge color
export const getVerificationBadgeColor = (status) => {
  switch (status) {
    case "Verified":
      return "bg-green-500 hover:bg-green-600 text-white"
    case "Pending":
      return "bg-yellow-400 hover:bg-yellow-500 text-black"
    case "Not Verified":
      return "bg-red-500 hover:bg-red-600 text-white"
    case "Requested Information":
      return "bg-blue-500 hover:bg-blue-600 text-white"
    default:
      return "bg-gray-500 hover:bg-gray-600 text-white"
  }
}
