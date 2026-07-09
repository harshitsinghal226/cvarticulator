import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    localStorage.setItem("app-theme", "light");
  }, []);

  const toggleTheme = () => {
    // Toggling disabled to keep application strictly in light mode
  };

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
