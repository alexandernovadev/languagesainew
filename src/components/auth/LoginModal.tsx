import { ModalNova } from "@/components/ui/modal-nova";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Lock } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/lib/store/user-store";

interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface LoginForm {
  username: string;
  password: string;
}

export function LoginModal({ open, setOpen }: LoginModalProps) {
  const { login, loading, error, token } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<LoginForm>({
    defaultValues: { username: "", password: "" },
    mode: "onChange",
  });

  // Close modal and reset form when login is successful
  useEffect(() => {
    if (token && open) {
      setOpen(false);
      reset();
    }
  }, [token, open, setOpen, reset]);

  const onSubmit = async (data: LoginForm) => {
    clearErrors();
    await login(data.username, data.password);
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={setOpen}
      title="Bienvenido de nuevo"
      description="Inicia sesión para acceder a tu espacio personal y continuar aprendiendo con LanguagesAI."
      size="sm"
    >
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="bg-sidebar-accent p-3 rounded-full mb-1 flex items-center justify-center">
          <img
            src="/loogo.png"
            alt="Logo"
            className="size-10 rounded-full object-contain"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium flex items-center gap-2"
              htmlFor="login-username"
            >
              <UserIcon className="size-4 text-muted-foreground" /> Usuario o
              email
            </label>
            <Input
              id="login-username"
              placeholder="Usuario o email"
              autoFocus
              autoComplete="username"
              {...register("username", {
                required: "El usuario o email es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                validate: (value) =>
                  value.includes("@") ||
                  value.length >= 3 ||
                  "Debe ser un email válido o un usuario",
              })}
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium flex items-center gap-2"
              htmlFor="login-password"
            >
              <Lock className="size-4 text-muted-foreground" /> Contraseña
            </label>
            <Input
              id="login-password"
              placeholder="Contraseña"
              type="password"
              autoComplete="current-password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>
          {error && !errors.username && !errors.password && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full btn-green-neon mt-2"
            size="lg"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-xs text-center mt-2">
            ¿Olvidaste tu contraseña?{" "}
            <a
              href="#"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              Recupérala aquí
            </a>
          </div>
        </form>
      </ModalNova>
    );
  }
