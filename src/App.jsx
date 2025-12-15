import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDetail from "./pages/EmployeeDetail";
import Employees from "./pages/Employees"; // ← TAMBAHKAN INI
import { NotificationProvider } from "./context/NotificationContext";


function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);

  // Optional: bisa tambahkan loading state di sini
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Login />} />

          {/* PROTECTED */}
        <Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <NotificationProvider>
        <Dashboard />
      </NotificationProvider>
    </PrivateRoute>
  }
/>
<Route
  path="/employees"
  element={
    <PrivateRoute>
      <NotificationProvider>
        <Employees />
      </NotificationProvider>
    </PrivateRoute>
  }
/>
<Route
  path="/employees/:id"
  element={
    <PrivateRoute>
      <NotificationProvider>
        <EmployeeDetail />
      </NotificationProvider>
    </PrivateRoute>
  }
/>

          <Route path="/employees/:id" element={
  <PrivateRoute>
    <EmployeeDetail />
  </PrivateRoute>
} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
