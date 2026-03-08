'use client'

import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    template: "modern",
    accentColor: "#3B82F6",
  });

  return (
    <ResumeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);