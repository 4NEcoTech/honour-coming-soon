// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // ✅ Fetch Notifications
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("/api/notifications");
//       if (response.data.success) {
//         setNotifications(response.data.notifications);
//         setUnreadCount(response.data.notifications.length);
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   // ✅ Mark Notifications as Read
//   const markAsRead = async () => {
//     try {
//       await axios.post("/api/notifications/markAsRead");
//       setUnreadCount(0);
//       setNotifications([]);
//     } catch (error) {
//       console.error("Error marking notifications as read:", error);
//     }
//   };

//   // ✅ Handle Dropdown Toggle
//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     if (unreadCount > 0) {
//       markAsRead();
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <div className="relative">
//       {/* Bell Icon */}
//       <button onClick={toggleDropdown} className="p-2 relative">
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
//           {notifications.length > 0 ? (
//             notifications.map((notification, index) => (
//               <div key={index} className="p-2 border-b text-sm">
//                 {notification.message}
//               </div>
//             ))
//           ) : (
//             <div className="p-4 text-center text-gray-500">No notifications</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;


"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timer, setTimer] = useState(null);

  // ✅ Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ✅ Mark Notifications as Read
  const markAsRead = async () => {
    try {
      await axios.post("/api/notifications/markAsRead");
      setUnreadCount(0);
      setNotifications([]);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // ✅ Handle Dropdown Toggle with Timer
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);

    if (!isDropdownOpen && unreadCount > 0) {
      markAsRead();
    }

    if (!isDropdownOpen) {
      // Open dropdown with timer
      const dropdownTimer = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 5000); // Dropdown stays open for 5 seconds

      setTimer(dropdownTimer);
    } else {
      // Close dropdown and clear timer if manually closed
      clearTimeout(timer);
      setTimer(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button onClick={toggleDropdown} className="p-2 relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="p-2 border-b text-sm">
                {notification.message}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
