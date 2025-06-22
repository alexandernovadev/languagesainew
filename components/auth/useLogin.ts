import { useState } from "react"
import { useUserStore } from "@/lib/store/user-store"

export function useLogin(setOpen: (open: boolean) => void) {
  const { login, loading, error } = useUserStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    await login(username, password)
    if (useUserStore.getState().user) {
      setOpen(false)
      setUsername("")
      setPassword("")
      setTouched(false)
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    touched,
    handleLogin,
  }
} 