import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User as UserIcon, Lock } from "lucide-react"
import React from "react"
import { useLogin } from "./useLogin"

interface LoginModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function LoginModal({ open, setOpen }: LoginModalProps) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    touched,
    handleLogin
  } = useLogin(setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm mx-auto rounded-xl p-6">
        <DialogHeader className="items-center text-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="bg-sidebar-accent p-3 rounded-full mb-1 flex items-center justify-center">
              <img src="/loogo.png" alt="Logo" className="size-10 rounded-full object-cover" />
            </div>
            <DialogTitle className="text-2xl font-bold">Bienvenido de nuevo</DialogTitle>
            <DialogDescription>Inicia sesión para acceder a tu espacio personal y continuar aprendiendo con LanguagesAI.</DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" htmlFor="login-username">
              <UserIcon className="size-4 text-muted-foreground" /> Usuario o email
            </label>
            <Input
              id="login-username"
              placeholder="Usuario o email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" htmlFor="login-password">
              <Lock className="size-4 text-muted-foreground" /> Contraseña
            </label>
            <Input
              id="login-password"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && touched && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full btn-green-neon mt-2" size="lg" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-xs text-center mt-2">
            ¿Olvidaste tu contraseña? <a href="#" className="text-primary underline hover:text-primary/80 transition-colors">Recupérala aquí</a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 