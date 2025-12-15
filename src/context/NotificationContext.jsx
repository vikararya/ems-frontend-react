import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    const saved = localStorage.getItem("dismissedNotifications");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");

      // filter notif yang sudah dibaca
      const filtered = res.data.filter(
        (n) => !dismissedIds.includes(n._id)
      );

      // batasi maksimal 99 (yang terbaru)
      setNotifications(filtered.slice(0, 99));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const removeNotification = (id) => {
    setDismissedIds((prev) => {
      const updated = [...prev, id];
      localStorage.setItem(
        "dismissedNotifications",
        JSON.stringify(updated)
      );
      return updated;
    });

    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [dismissedIds]);

  return (
    <NotificationContext.Provider
      value={{ notifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
