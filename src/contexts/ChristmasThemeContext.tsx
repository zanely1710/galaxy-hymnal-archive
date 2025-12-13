import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ChristmasThemeContextType {
  isChristmasMode: boolean;
  toggleChristmasMode: () => void;
}

const ChristmasThemeContext = createContext<ChristmasThemeContextType | undefined>(undefined);

export function ChristmasThemeProvider({ children }: { children: ReactNode }) {
  const [isChristmasMode, setIsChristmasMode] = useState(() => {
    const saved = localStorage.getItem('christmas-mode');
    // Default to true during December
    if (saved === null) {
      const month = new Date().getMonth();
      return month === 11; // December
    }
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('christmas-mode', isChristmasMode.toString());
    
    // Add/remove christmas class to document
    if (isChristmasMode) {
      document.documentElement.classList.add('christmas');
    } else {
      document.documentElement.classList.remove('christmas');
    }
  }, [isChristmasMode]);

  const toggleChristmasMode = () => {
    setIsChristmasMode(prev => !prev);
  };

  return (
    <ChristmasThemeContext.Provider value={{ isChristmasMode, toggleChristmasMode }}>
      {children}
    </ChristmasThemeContext.Provider>
  );
}

export function useChristmas() {
  const context = useContext(ChristmasThemeContext);
  if (context === undefined) {
    throw new Error("useChristmas must be used within a ChristmasThemeProvider");
  }
  return context;
}
