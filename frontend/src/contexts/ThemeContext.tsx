import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Function to get the effective theme
    const getEffectiveTheme = (currentTheme: Theme): "light" | "dark" => {
      if (currentTheme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return currentTheme;
    };

    const applyTheme = (currentTheme: Theme) => {
      const effective = getEffectiveTheme(currentTheme);
      setEffectiveTheme(effective);

      // Remove both classes first
      root.classList.remove("light", "dark");
      // Add the effective theme class
      root.classList.add(effective);

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          effective === "dark" ? "#0f172a" : "#ffffff"
        );
      }
    };

    // Apply theme immediately
    applyTheme(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Listen for system theme changes if theme is set to 'system'
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
