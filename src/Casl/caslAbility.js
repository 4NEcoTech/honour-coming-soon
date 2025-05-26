import { Ability, AbilityBuilder } from "@casl/ability";

// 01 Guest User
// 02 SA - Admin
// 03 SA - Team
// 04 SA - Support
// 05 Student
// 06 In Admin
// 07 In Team
// 08 In Support
// 09 Em Admin
// 10 Em Team
// 11 Em Support
// 12 Job Seeker

export function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);
  const role = user?.role || "guest"; // default to 'guest' if no user
  switch (role) {
    case "02":
      can("manage", "all");
      break;
    case "03":
    case "04":
      can("read", "AdminPage");
      can("read", "Post");
      can("create", "Post");
      can("update", "Post");
      cannot("delete", "Post");
      can("read", "User");
      break;

    case "05":
      can("read", "StudentPage");
      can("read", "Post");
      can("create", "Post");
      can("update", "Post");
      cannot("delete", "Post");
      can("read", "EmployerPage");
      // can("read", "User", { id: user.id });
      // can("update", "User", { id: user.id });
      // cannot("delete", "User", { id: user.id });
      break;

    case "06":
      // In Admin

      // personalInfo is a custom entity for the user to  edit their own information
      can("manage", "PersonalInfo"); // personalInfo is a custom entity for the user to  edit their own information
      can("manage", "AccountSettings"); // AccountSettings is a custom entity for the user to  edit their own information

      // In Admin student invitation access
      can("invite", "Student");
      can("read", "Student");
      can("create", "Student");
      can("update", "Student");
      can("delete", "Student");

      // In Admin staff invitation access
      can("invite", "Staff");
      can("read", "Staff");
      can("create", "Staff");
      can("update", "Staff");
      can("delete", "Staff");

      can("read", "Institution");
      can("create", "Institution");
      can("update", "Institution");
      can("delete", "Institution");

      can("read", "AccountSettings");
      can("create", "AccountSettings");
      can("update", "AccountSettings");
      can("delete", "AccountSettings");

      break;
    case "07":
      // In Team

      // personalInfo is a custom entity for the user to  edit their own information
      can("manage", "PersonalInfo"); // personalInfo is a custom entity for the user to  edit their own information
      can("manage", "AccountSettings"); // AccountSettings is a custom entity for the user to  edit their own information

      can("invite", "Student");
      can("read", "Student");
      can("create", "Student");
      can("update", "Student");
      can("delete", "Student");

      cannot("invite", "Staff");
      can("read", "Staff");
      cannot("create", "Staff");
      cannot("update", "Staff");
      cannot("delete", "Staff");

      can("read", "Institution");
      cannot("create", "Institution");
      cannot("update", "Institution");
      cannot("delete", "Institution");
      break;
    case "08":
      // In Support

      // personalInfo is a custom entity for the user to  edit their own information
      can("manage", "PersonalInfo"); // personalInfo is a custom entity for the user to  edit their own information
      can("manage", "AccountSettings"); // AccountSettings is a custom entity for the user to  edit their own information

      cannot("invite", "Student");
      can("read", "Student");
      cannot("create", "Student");
      cannot("update", "Student");
      cannot("delete", "Student");

      cannot("invite", "Staff");
      can("read", "Staff");
      cannot("create", "Staff");
      cannot("update", "Staff");
      cannot("delete", "Staff");

      can("read", "Institution");
      cannot("create", "Institution");
      cannot("update", "Institution");
      cannot("delete", "Institution");

      break;

    case "09":
      can("read", "AdminPage");
      can("manage", "PersonalInfo");

      can("read", "Institution");
      can("create", "Institution");
      can("update", "Institution");
      can("delete", "Institution");

      // In Admin staff invitation access
      can("invite", "Staff");
      can("read", "Staff");
      can("create", "Staff");
      can("update", "Staff");
      can("delete", "Staff");

      can("read", "AccountSettings");
      can("create", "AccountSettings");
      can("update", "AccountSettings");
      can("delete", "AccountSettings");

      can("read", "Post");
      can("create", "Post");
      can("update", "Post", { authorId: user.id });
      can("delete", "Post", { authorId: user.id });
      can("read", "User", { id: user.id });

      break;
    case "10":
      can("read", "AdminPage");
      can("manage", "PersonalInfo");

      can("read", "Institution");
      cannot("create", "Institution");
      cannot("update", "Institution");
      cannot("delete", "Institution");

      cannot("invite", "Staff");
      can("read", "Staff");
      cannot("create", "Staff");
      cannot("update", "Staff");
      cannot("delete", "Staff");

      can("read", "Post");
      can("create", "Post");

      can("update", "Post", { authorId: user.id });
      can("delete", "Post", { authorId: user.id });
      can("read", "User", { id: user.id });

      break;

    case "11":
      can("read", "AdminPage");
      can("manage", "PersonalInfo");

      can("read", "Institution");
      cannot("create", "Institution");
      cannot("update", "Institution");
      cannot("delete", "Institution");

      cannot("invite", "Staff");
      can("read", "Staff");
      cannot("create", "Staff");
      cannot("update", "Staff");
      cannot("delete", "Staff");

      can("read", "Post");
      can("create", "Post");
      can("update", "Post", { authorId: user.id });
      can("delete", "Post", { authorId: user.id });
      can("read", "User", { id: user.id });
      break;
    case "12":
      can("read", "AdminPage");
      can("manage", "PersonalInfo");
      can("read", "Post");
      can("create", "Post");
      can("update", "Post", { authorId: user.id });
      can("delete", "Post", { authorId: user.id });
      can("read", "User", { id: user.id });
      break;

    default:
      can("read", "Post", { published: true });
  }
  return build(); // Build and return the Ability instance
}
