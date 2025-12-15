// components/Layout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="main">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
