// src/components/Navbar.jsx
import NotificationButton from "./NotificationButton";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">EMS Dashboard</h2>
      <div className="navbar-right">
        <NotificationButton />
      </div>
    </nav>
  );
}
