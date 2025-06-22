"use client"

import { useEffect } from "react"

export function ThemeEnforcer() {
  useEffect(() => {
    // Forzar modo oscuro al cargar
    document.documentElement.classList.add("dark")
    document.documentElement.style.colorScheme = "dark"

    // Observar cambios y mantener el modo oscuro
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark")
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return null
}
