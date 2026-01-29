import { Button } from "@/shared/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => navigate("/login")}
      className="gap-2"
    >
      <LogIn className="h-4 w-4" />
      <span>Iniciar Sesión</span>
    </Button>
  );
}
