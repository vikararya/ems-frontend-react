import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../context/NotificationContext";
import "../styles/notification.css";

export default function NotificationButton() {
  const { notifications, removeNotification } =
    useContext(NotificationContext);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badgeCount =
    notifications.length > 99 ? "99+" : notifications.length;

  return (
    <div className="notif-wrapper" ref={ref}>
      <button
        className="notif-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="badge">{badgeCount}</span>
        )}
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdown-header">Notifikasi</div>

          {notifications.length === 0 ? (
            <div className="empty">Belum ada notifikasi</div>
          ) : (
            <div className="notif-list">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className="notif-item"
                  onClick={() => removeNotification(n._id)}
                >
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
