import { useState, useEffect } from "react";
import { Bell, UserCircle } from "lucide-react";

const Topbar = () => {

  // ✅ DYNAMIC USER
  const user = {
    name: localStorage.getItem("name") || "User",
    role: localStorage.getItem("role") || "USER"
  };

  const userId = localStorage.getItem("userId"); // 🔥 IMPORTANT

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // ✅ LOAD + FILTER NOTIFICATIONS
  useEffect(() => {

    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem("notifications")) || [];

      // 🔥 FILTER BASED ON USER
      const filtered = stored.filter(
        (n) => n.toUserId == userId
      );

      setNotifications(filtered);
    };

    loadNotifications();

    window.addEventListener("storage", loadNotifications);
    window.addEventListener("notificationUpdated", loadNotifications);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      window.removeEventListener("notificationUpdated", loadNotifications);
    };

  }, [userId]);

  // ✅ MARK AS READ (ONLY THIS USER'S)
  const markAsRead = () => {
    const all = JSON.parse(localStorage.getItem("notifications")) || [];

    const updated = all.map(n =>
      n.toUserId == userId ? { ...n, seen: true } : n
    );

    localStorage.setItem("notifications", JSON.stringify(updated));

    // refresh
    const filtered = updated.filter(n => n.toUserId == userId);
    setNotifications(filtered);
  };

  const unseenCount = notifications.filter(n => !n.seen).length;

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3">

      {/* LEFT */}
      <div>
        <h1 className="text-lg font-semibold text-gray-700">
          Hi, {user.name} 👋
        </h1>
        <p className="text-xs text-gray-400">
          Welcome back
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6 relative">

        {/* 🔔 BELL */}
        <div className="relative">

          <Bell
            className="cursor-pointer"
            onClick={() => {
              setShowNotifications(true);
              markAsRead();
            }}
          />

          {/* 🔴 BADGE */}
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
              {unseenCount}
            </span>
          )}
        </div>

        {/* 👤 USER */}
        <div className="flex items-center gap-2">
          <UserCircle />
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-400 text-xs">{user.role}</p>
          </div>
        </div>

      </div>

      {/* 🔔 FULL SCREEN NOTIFICATION WINDOW */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <button
            onClick={() => setShowNotifications(false)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>

          <div className="bg-white w-[90%] max-w-2xl max-h-[90%] overflow-y-auto rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4 text-blue-600">
              🔔 All Notifications
            </h2>

            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center">
                No notifications
              </p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedNotification(n)}
                  className="border-b py-3 cursor-pointer hover:bg-gray-50"
                >
                  <p className="font-medium">{n.message}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
              ))
            )}

          </div>
        </div>
      )}

      {/* 📢 DETAILS MODAL */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <button
            onClick={() => setSelectedNotification(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg">

            <h2 className="text-lg font-bold text-blue-600 mb-3">
              📢 Notification Details
            </h2>

            <p className="mb-2">
              <b>Message:</b> {selectedNotification.message}
            </p>

            <p className="text-sm text-gray-500">
              {selectedNotification.time}
            </p>

            {selectedNotification.feedback && (
              <div className="mt-4">
                <h3 className="font-semibold text-green-600 mb-1">
                  ⭐ Feedback
                </h3>
                <p>{selectedNotification.feedback}</p>
              </div>
            )}

            {selectedNotification.rating && (
              <p className="mt-2">
                ⭐ Rating: {selectedNotification.rating} / 5
              </p>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Topbar;