import { Navigate } from "react-router-dom";

export default function SettingsIndexRedirect() {
  return <Navigate to="/settings/general" replace />;
}
