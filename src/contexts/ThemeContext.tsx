import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      if (!user) {
        // For non-logged in users, check localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          setDarkMode(true);
          document.documentElement.classList.add("dark");
        }
        setInitialized(true);
        return;
      }

      // For logged in users, load from database
      const { data } = await supabase
        .from("profiles")
        .select("appearance_mode")
        .eq("id", user.id)
        .single();

      if (data?.appearance_mode === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
      
      setInitialized(true);
    };

    loadThemePreference();
  }, [user]);

  // Apply dark mode class whenever it changes
  useEffect(() => {
    if (!initialized) return;
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, initialized]);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (user) {
      // Save to database for logged in users
      await supabase
        .from("profiles")
        .update({ appearance_mode: newMode ? "dark" : "light" })
        .eq("id", user.id);
    } else {
      // Save to localStorage for non-logged in users
      localStorage.setItem("theme", newMode ? "dark" : "light");
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
