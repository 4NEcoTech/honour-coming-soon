export const roleProfileSteps = {
    "05": { 
        steps: ["studentProfile","studentdocument", "studentkyc"],
        routes: ["/set-studnt-dtls", "/stdnt-dcmnt", "/studentkyc"] 
      }, 
    "06": {
      steps: ["institutionAdminProfile", "institutiondocument", "educationDetails", "educationaldocument", "institutionAdminKyc"],
      routes: ["/set-admin-dtls", "/set-edu-dtls"],
    },
    "07": { 
      steps: ["institutionProfile", "institutiondocument", "institutionTeamKyc"], 
      routes: ["/set-admin-dtls"] 
    },
    "08": { 
      steps: ["institutionProfile", "institutiondocument", "institutionStaffKyc"], 
      routes: ["/set-admin-dtls"] 
    },
    "09": { 
      steps: ["employerProfile"], 
      routes: ["/employer/set-emp-dtls"] 
    },
    "10": { 
      steps: ["employerProfile"], 
      routes: ["/employer/set-emp-dtls"] 
    },
    "11": { 
      steps: ["employerProfile"], 
      routes: ["/employer/set-emp-dtls"] 
    },
    "12": { 
      steps: ["jobSeekerProfile"], 
      routes: ["/job-seeker/set-job-dtls"] 
    },
  };
  