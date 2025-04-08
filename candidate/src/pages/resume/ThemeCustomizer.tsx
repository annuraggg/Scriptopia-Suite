import React, { useState, useEffect } from "react";
import ThemeCustomizer from "./ThemeEngine";
import ThemeSelector from "./ThemeSelector";
import { getThemeByName, getThemeOptions } from "./Themes";
import { ThemeStyles } from "@/types/ResumeTheme";
import "./themes/themes.css";
interface ThemeCustomizerWrapperProps {
  initialTheme?: string;
  onThemeChange: (theme: ThemeStyles) => void;
}

const ThemeCustomizerWrapper: React.FC<ThemeCustomizerWrapperProps> = ({
  initialTheme = "Professional",
  onThemeChange,
}) => {
  const [currentThemeName, setCurrentThemeName] = useState(initialTheme);
  const [currentTheme, setCurrentTheme] = useState<ThemeStyles>(
    getThemeByName(initialTheme)
  );
  const [themeOptions, setThemeOptions] = useState(
    getThemeOptions(initialTheme)
  );

  // Update theme options when theme name changes
  useEffect(() => {
    setThemeOptions(getThemeOptions(currentThemeName));
    setCurrentTheme(getThemeByName(currentThemeName));
  }, [currentThemeName]);

  // Handle theme name change
  const handleThemeNameChange = (theme: ThemeStyles) => {
    setCurrentThemeName(theme.name);
    setCurrentTheme(theme);
    onThemeChange(theme);
  };

  // Handle theme style changes
  const handleThemeStyleChange = (updatedTheme: ThemeStyles) => {
    setCurrentTheme(updatedTheme);
    onThemeChange(updatedTheme);
  };

  return (
    <div className="space-y-4">
      <ThemeSelector
        currentTheme={currentThemeName}
        onThemeChange={handleThemeNameChange}
      />

      <ThemeCustomizer
        theme={currentTheme}
        onThemeChange={handleThemeStyleChange}
        themeOptions={themeOptions}
      />
    </div>
  );
};

export default ThemeCustomizerWrapper;
