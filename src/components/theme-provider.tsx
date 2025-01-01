import { ThemeProviderContext } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    const updateTheme = useCallback((updatedTheme: "dark" | "light") => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(updatedTheme)

    }, [])

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
        if (theme === "system") {
            const systemTheme = prefersDark.matches ? "dark" : "light"
            updateTheme(systemTheme)
        } else updateTheme(theme)
        prefersDark.addEventListener("change", e => updateTheme(e.matches ? 'dark' : 'light'))
        return () => prefersDark.removeEventListener("change", e => updateTheme(e.matches ? 'dark' : 'light'))
    }, [theme, updateTheme])


    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

