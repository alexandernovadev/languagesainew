import { Outlet } from "react-router-dom";

export default function SettingsPage() {
  return (
    <div className="min-h-[60vh]">
      <Outlet />
    </div>
  );
}
