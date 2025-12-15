import { useEffect, useState } from "react";

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:5000/api/notifications");
      const data = await res.json();
      setNotifications(data);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar">
      <div className="notif">
        🔔 {notifications.length}
        <div className="dropdown">
          {notifications.map((n) => (
            <div key={n._id}>{n.message}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
