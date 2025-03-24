import { ThemeStyles } from "@/types/ResumeTheme";

// Font options for the Creative theme
export const fontOptions = {
  heading: [
    {
      id: "playfair",
      name: "Playfair Display",
      value: 'font-["Playfair_Display"]',
    },
    { id: "josefin", name: "Josefin Sans", value: 'font-["Josefin_Sans"]' },
    { id: "abril", name: "Abril Fatface", value: 'font-["Abril_Fatface"]' },
    { id: "quicksand", name: "Quicksand", value: 'font-["Quicksand"]' },
    { id: "comfortaa", name: "Comfortaa", value: 'font-["Comfortaa"]' },
  ],
  body: [
    { id: "muli", name: "Muli", value: 'font-["Muli"]' },
    { id: "quicksand", name: "Quicksand", value: 'font-["Quicksand"]' },
    { id: "worksans", name: "Work Sans", value: 'font-["Work_Sans"]' },
    { id: "karla", name: "Karla", value: 'font-["Karla"]' },
    { id: "cabin", name: "Cabin", value: 'font-["Cabin"]' },
  ],
};

// Color schemes for the Creative theme
export const colorSchemes = {
  coral: {
    name: "Coral Gradient",
    primary: "text-orange-500",
    secondary: "text-gray-600",
    heading: "text-orange-600",
    subheading: "text-orange-400",
    border: "border-orange-200",
    background: "bg-orange-50",
  },
  ocean: {
    name: "Ocean Blue",
    primary: "text-cyan-600",
    secondary: "text-slate-500",
    heading: "text-cyan-700",
    subheading: "text-cyan-500",
    border: "border-cyan-200",
    background: "bg-cyan-50",
  },
  mint: {
    name: "Mint Fresh",
    primary: "text-emerald-500",
    secondary: "text-gray-600",
    heading: "text-emerald-600",
    subheading: "text-emerald-400",
    border: "border-emerald-200",
    background: "bg-emerald-50",
  },
  plum: {
    name: "Plum Accent",
    primary: "text-purple-600",
    secondary: "text-gray-600",
    heading: "text-purple-700",
    subheading: "text-purple-500",
    border: "border-purple-200",
    background: "bg-purple-50",
  },
  sunset: {
    name: "Sunset",
    primary: "text-amber-500",
    secondary: "text-gray-600",
    heading: "text-amber-600",
    subheading: "text-amber-400",
    border: "border-amber-200",
    background: "bg-amber-50",
  },
};

// Layout options for the Creative theme
export const layoutOptions = [
  {
    id: "asymmetric",
    name: "Asymmetric",
    value: "asymmetric",
    description: "Bold asymmetric layout with creative elements",
  },
  {
    id: "centered",
    name: "Bold Centered",
    value: "centered",
    description: "Centered layout with large header and bold elements",
  },
];

// Spacing options for the Creative theme
export const spacingOptions = [
  { id: "creative", name: "Creative", value: "space-y-5" },
  { id: "balanced", name: "Balanced", value: "space-y-4" },
  { id: "artistic", name: "Artistic", value: "space-y-7" },
];

// Header alignment options
export const headerAlignmentOptions = [
  { id: "left", name: "Left", value: "text-left" },
  { id: "center", name: "Center", value: "text-center" },
];

// Section heading styles
export const sectionHeadingStyles = [
  { id: "stylized", name: "Stylized", value: "border-b-2 pb-1 inline-block" },
  {
    id: "colorblock",
    name: "Color Block",
    value: "px-3 py-1 rounded bg-opacity-10",
  },
  { id: "artistic", name: "Artistic", value: "border-b border-dotted italic" },
];

// Generate the default Creative theme
const getDefaultCreativeTheme = (): ThemeStyles => ({
  name: "Creative",
  colorScheme: "coral",
  primary: colorSchemes.coral.primary,
  secondary: colorSchemes.coral.secondary,
  background: colorSchemes.coral.background,
  heading: colorSchemes.coral.heading,
  subheading: colorSchemes.coral.subheading,
  border: colorSchemes.coral.border,
  font: {
    heading: fontOptions.heading[0].value,
    body: fontOptions.body[0].value,
  },
  layout: layoutOptions[0].value,
  spacing: spacingOptions[0].value,
  headerStyle: "mb-8",
  headerAlignment: headerAlignmentOptions[0].value,
  sectionHeadingStyle: sectionHeadingStyles[0].value,
});

export default getDefaultCreativeTheme;
