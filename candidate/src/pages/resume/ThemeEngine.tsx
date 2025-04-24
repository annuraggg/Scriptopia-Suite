import React from "react";
import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";
import { Palette, Type, Layout, Space } from "lucide-react";
import { ThemeStyles } from "@/types/ResumeTheme";

interface ThemeCustomizerProps {
  theme: ThemeStyles;
  onThemeChange: (theme: ThemeStyles) => void;
  themeOptions: {
    fontOptions: {
      heading: Array<{ id: string; name: string; value: string }>;
      body: Array<{ id: string; name: string; value: string }>;
    };
    colorSchemes: Record<string, any>;
    layoutOptions: Array<{
      id: string;
      name: string;
      value: string;
      description: string;
    }>;
    spacingOptions: Array<{ id: string; name: string; value: string }>;
    headerAlignmentOptions: Array<{ id: string; name: string; value: string }>;
    sectionHeadingStyles: Array<{ id: string; name: string; value: string }>;
  };
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  onThemeChange,
  themeOptions,
}) => {
  const {
    fontOptions,
    colorSchemes,
    layoutOptions,
    spacingOptions,
    headerAlignmentOptions,
    sectionHeadingStyles,
  } = themeOptions;

  // Update an individual property in the theme
  const handleThemePropertyChange = (
    property: keyof ThemeStyles | "font.heading" | "font.body",
    value: string
  ) => {
    const updatedTheme = { ...theme };

    // Handle nested font properties
    if (property === "font.heading" || property === "font.body") {
      const [_parentProp, childProp] = property.split(".");
      updatedTheme.font = {
        ...updatedTheme.font,
        [childProp]: value,
      };
    }
    // Handle color scheme changes
    else if (property === "colorScheme") {
      const selectedScheme = colorSchemes[value as keyof typeof colorSchemes];

      updatedTheme.colorScheme = value;
      updatedTheme.primary = selectedScheme.primary;
      updatedTheme.secondary = selectedScheme.secondary;
      updatedTheme.heading = selectedScheme.heading;
      updatedTheme.subheading = selectedScheme.subheading;
      updatedTheme.border = selectedScheme.border;
      updatedTheme.background = selectedScheme.background;
    }
    // Handle all other properties
    else {
      (updatedTheme as any)[property] = value;
    }

    onThemeChange(updatedTheme);
  };

  // Apply spacing class to sections
  const applySpacingToSections = (spacing: string) => {
    const sections = document.querySelectorAll(".resume-section");
    sections.forEach((section) => {
      // Remove all space-y-* classes
      section.classList.forEach((className) => {
        if (className.startsWith("space-y-")) {
          section.classList.remove(className);
        }
      });
      // Add the new spacing class
      section.classList.add(spacing);
    });
  };

  // Handle spacing change with DOM update
  const handleSpacingChange = (value: string) => {
    handleThemePropertyChange("spacing", value);
    applySpacingToSections(value);
  };

  // Get the selected color scheme safely
  const getSelectedColorScheme = () => {
    if (!theme.colorScheme || !colorSchemes[theme.colorScheme]) {
      // Return default color scheme or first available one
      const firstSchemeKey = Object.keys(colorSchemes)[0];
      return colorSchemes[firstSchemeKey] || {};
    }
    return colorSchemes[theme.colorScheme];
  };

  // Get color scheme entries safely
  const selectedColorScheme = getSelectedColorScheme();

  return (
    <Card>
      <CardBody className="p-0">
        <Accordion>
          <AccordionItem
            key="colors"
            title="Colors"
            startContent={<Palette size={18} />}
          >
            <div className="space-y-4 px-2">
              <Select
                label="Color Scheme"
                selectedKeys={[theme.colorScheme]}
                onChange={(e) =>
                  handleThemePropertyChange("colorScheme", e.target.value)
                }
              >
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <SelectItem key={key}>
                    {scheme.name}
                  </SelectItem>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedColorScheme).map(([key, value]) => {
                  if (key === "name") return null;
                  const colorClass =
                    typeof value === "string"
                      ? value.replace("text-", "bg-").replace("border-", "bg-")
                      : "";
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                      <span className="text-sm capitalize">{key}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            key="typography"
            title="Typography"
            startContent={<Type size={18} />}
          >
            <div className="space-y-4 px-2">
              <Select
                label="Heading Font"
                selectedKeys={[theme.font?.heading]}
                onChange={(e) =>
                  handleThemePropertyChange("font.heading", e.target.value)
                }
              >
                {fontOptions.heading.map((font) => (
                  <SelectItem key={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Body Font"
                selectedKeys={[theme.font?.body]}
                onChange={(e) =>
                  handleThemePropertyChange("font.body", e.target.value)
                }
              >
                {fontOptions.body.map((font) => (
                  <SelectItem key={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </AccordionItem>

          <AccordionItem
            key="layout"
            title="Layout"
            startContent={<Layout size={18} />}
          >
            <div className="space-y-4 px-2">
              <Select
                label="Header Layout"
                selectedKeys={[theme.layout]}
                onChange={(e) =>
                  handleThemePropertyChange("layout", e.target.value)
                }
              >
                {layoutOptions.map((layout) => (
                  <SelectItem key={layout.value}>
                    {layout.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Header Alignment"
                selectedKeys={[theme.headerAlignment]}
                onChange={(e) =>
                  handleThemePropertyChange("headerAlignment", e.target.value)
                }
              >
                {headerAlignmentOptions.map((option) => (
                  <SelectItem key={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Section Heading Style"
                selectedKeys={[theme.sectionHeadingStyle]}
                onChange={(e) =>
                  handleThemePropertyChange(
                    "sectionHeadingStyle",
                    e.target.value
                  )
                }
              >
                {sectionHeadingStyles.map((style) => (
                  <SelectItem key={style.value}>
                    {style.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </AccordionItem>

          <AccordionItem
            key="spacing"
            title="Spacing"
            startContent={<Space size={18} />}
          >
            <div className="space-y-4 px-2">
              <Select
                label="Section Spacing"
                selectedKeys={[theme.spacing]}
                onChange={(e) => handleSpacingChange(e.target.value)}
              >
                {spacingOptions.map((option) => (
                  <SelectItem key={option.value} >
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
};

export default ThemeCustomizer;
