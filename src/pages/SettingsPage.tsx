import { Outlet } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Outlet />
    </div>
  );
}
