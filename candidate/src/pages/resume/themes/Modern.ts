import { ThemeStyles } from "@/types/ResumeTheme";

// Font options for the Modern theme
export const fontOptions = {
  heading: [
    { id: "raleway", name: "Raleway", value: 'font-["Raleway"]' },
    { id: "montserrat", name: "Montserrat", value: 'font-["Montserrat"]' },
    { id: "opensans", name: "Open Sans", value: 'font-["Open_Sans"]' },
    { id: "poppins", name: "Poppins", value: 'font-["Poppins"]' },
    { id: "roboto", name: "Roboto", value: 'font-["Roboto"]' },
  ],
  body: [
    { id: "opensans", name: "Open Sans", value: 'font-["Open_Sans"]' },
    { id: "roboto", name: "Roboto", value: 'font-["Roboto"]' },
    { id: "lato", name: "Lato", value: 'font-["Lato"]' },
    { id: "nunito", name: "Nunito", value: 'font-["Nunito"]' },
    {
      id: "sourcesanspro",
      name: "Source Sans Pro",
      value: 'font-["Source_Sans_Pro"]',
    },
  ],
};

// Color schemes for the Modern theme
export const colorSchemes = {
  teal: {
    name: "Teal Accent",
    primary: "text-teal-600",
    secondary: "text-gray-600",
    heading: "text-teal-700",
    subheading: "text-teal-500",
    border: "border-teal-200",
    background: "bg-gray-50",
  },
  violet: {
    name: "Violet Modern",
    primary: "text-violet-600",
    secondary: "text-gray-500",
    heading: "text-violet-800",
    subheading: "text-violet-600",
    border: "border-violet-200",
    background: "bg-gray-50",
  },
  slate: {
    name: "Slate Minimal",
    primary: "text-slate-700",
    secondary: "text-slate-500",
    heading: "text-slate-800",
    subheading: "text-slate-600",
    border: "border-slate-200",
    background: "bg-white",
  },
  rose: {
    name: "Rose Accent",
    primary: "text-rose-600",
    secondary: "text-gray-600",
    heading: "text-rose-700",
    subheading: "text-rose-500",
    border: "border-rose-200",
    background: "bg-gray-50",
  },
  indigo: {
    name: "Indigo Fresh",
    primary: "text-indigo-600",
    secondary: "text-gray-500",
    heading: "text-indigo-700",
    subheading: "text-indigo-500",
    border: "border-indigo-200",
    background: "bg-slate-50",
  },
};

// Layout options for the Modern theme
export const layoutOptions = [
  {
    id: "minimal",
    name: "Minimal",
    value: "minimal",
    description: "Clean minimal layout with ample whitespace",
  },
  {
    id: "sideBySide",
    name: "Side by Side",
    value: "sideBySide",
    description: "Name and title side by side with contact info",
  },
];

// Spacing options for the Modern theme
export const spacingOptions = [
  { id: "tight", name: "Tight", value: "space-y-2" },
  { id: "balanced", name: "Balanced", value: "space-y-4" },
  { id: "airy", name: "Airy", value: "space-y-6" },
];

// Header alignment options
export const headerAlignmentOptions = [
  { id: "left", name: "Left", value: "text-left" },
  { id: "center", name: "Center", value: "text-center" },
];

// Section heading styles
export const sectionHeadingStyles = [
  { id: "minimal", name: "Minimal", value: "border-b border-opacity-30" },
  { id: "accent", name: "Accent Line", value: "border-l-4 pl-2" },
  {
    id: "clean",
    name: "Clean",
    value: "font-medium tracking-wide uppercase text-sm",
  },
];

// Generate the default Modern theme
const getDefaultModernTheme = (): ThemeStyles => ({
  name: "Modern",
  colorScheme: "teal",
  primary: colorSchemes.teal.primary,
  secondary: colorSchemes.teal.secondary,
  background: colorSchemes.teal.background,
  heading: colorSchemes.teal.heading,
  subheading: colorSchemes.teal.subheading,
  border: colorSchemes.teal.border,
  font: {
    heading: fontOptions.heading[0].value,
    body: fontOptions.body[0].value,
  },
  layout: layoutOptions[0].value,
  spacing: spacingOptions[1].value,
  headerStyle: "mb-6",
  headerAlignment: headerAlignmentOptions[0].value,
  sectionHeadingStyle: sectionHeadingStyles[2].value,
});

export default getDefaultModernTheme;
