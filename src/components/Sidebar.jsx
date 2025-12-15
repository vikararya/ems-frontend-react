// components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="logo">EMS</h2>
      <nav>
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>
        <Link
          to="/employees"
          className={location.pathname === "/employees" ? "active" : ""}
        >
          Karyawan
        </Link>
      </nav>
    </div>
  );
}
