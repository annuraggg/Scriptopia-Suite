// Theme styles with enhanced type definitions
export interface ThemeStyles {
    name: string;
    colorScheme: string;
    primary: string;
    secondary: string;
    background: string;
    heading: string;
    subheading: string;
    border: string;
    font: {
      heading: string;
      body: string;
    };
    layout: string;
    spacing: string;
    headerStyle: string;
    headerAlignment: string;
    sectionHeadingStyle: string;
  }
  
  // Option type for dropdowns and selections
  export interface Option {
    id: string;
    name: string;
    value: string;
    description?: string;
  }
  
  // Color scheme definition
  export interface ColorScheme {
    name: string;
    primary: string;
    secondary: string;
    heading: string;
    subheading: string;
    border: string;
    background: string;
  }
  
  // Theme configuration export interface
  export interface ThemeConfig {
    getDefaultTheme: () => ThemeStyles;
    fontOptions: {
      heading: Option[];
      body: Option[];
    };
    colorSchemes: {
      [key: string]: ColorScheme;
    };
    layoutOptions: Option[];
    spacingOptions: Option[];
    headerAlignmentOptions: Option[];
    sectionHeadingStyles: Option[];
  }