import React from 'react';
import { Select, SelectItem, Card, CardBody } from "@heroui/react";
import { getAllThemeNames, getThemeByName } from './Themes';
import { ThemeStyles } from '@/types/ResumeTheme';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: ThemeStyles) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onThemeChange 
}) => {
  const themeNames = getAllThemeNames();
  
  const handleThemeChange = (themeName: string) => {
    const newTheme = getThemeByName(themeName);
    onThemeChange(newTheme);
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Resume Theme</h3>
          <p className="text-sm text-gray-500">Select a theme to customize your resume</p>
          
          <Select
            label="Theme"
            selectedKeys={[currentTheme]}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="mt-2"
          >
            {themeNames.map((name) => (
              <SelectItem key={name}>
                {name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardBody>
    </Card>
  );
};

export default ThemeSelector;