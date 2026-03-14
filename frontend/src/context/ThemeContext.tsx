import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Theme = "light" | "dark";
type Lang = "fr" | "en" | "ar";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "ltr" | "rtl";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  /* --- Theme -------------------------------------------------------- */
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edumaroc-theme") as Theme | null;
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("edumaroc-theme", next);
      return next;
    });
  }, []);

  // Apply / remove .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  /* --- Language ------------------------------------------------------ */
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edumaroc-lang") as Lang | null;
      if (saved && ["fr", "en", "ar"].includes(saved)) return saved;
    }
    return "fr";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      localStorage.setItem("edumaroc-lang", l);
      i18n.changeLanguage(l);
    },
    [i18n],
  );

  // Sync <html> dir & lang attributes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", dir);
    root.setAttribute("lang", lang);
  }, [dir, lang]);

  // On mount, ensure i18n matches stored lang
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, lang, setLang, dir }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
