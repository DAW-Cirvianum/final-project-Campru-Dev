// ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./components/context";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
