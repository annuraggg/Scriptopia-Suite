import { ThemeStyles } from '@/types/ResumeTheme';

// Font options for the Minimal theme
export const fontOptions = {
  heading: [
    { id: 'inter', name: 'Inter', value: 'font-["Inter"]' },
    { id: 'system', name: 'System UI', value: 'font-sans' },
    { id: 'helvetica', name: 'Helvetica Neue', value: 'font-["Helvetica_Neue"]' },
    { id: 'roboto', name: 'Roboto', value: 'font-["Roboto"]' },
    { id: 'manrope', name: 'Manrope', value: 'font-["Manrope"]' }
  ],
  body: [
    { id: 'inter', name: 'Inter', value: 'font-["Inter"]' },
    { id: 'system', name: 'System UI', value: 'font-sans' },
    { id: 'sf', name: 'SF Pro Text', value: 'font-["SF_Pro_Text"]' },
    { id: 'roboto', name: 'Roboto', value: 'font-["Roboto"]' },
    { id: 'ibm', name: 'IBM Plex Sans', value: 'font-["IBM_Plex_Sans"]' }
  ]
};

// Color schemes for the Minimal theme
export const colorSchemes = {
  monochrome: {
    name: 'Monochrome',
    primary: 'text-gray-800',
    secondary: 'text-gray-500',
    heading: 'text-gray-900',
    subheading: 'text-gray-700',
    border: 'border-gray-200',
    background: 'bg-white'
  },
  warmGray: {
    name: 'Warm Gray',
    primary: 'text-stone-800',
    secondary: 'text-stone-500',
    heading: 'text-stone-900',
    subheading: 'text-stone-700',
    border: 'border-stone-200',
    background: 'bg-stone-50'
  },
  coolGray: {
    name: 'Cool Gray',
    primary: 'text-slate-800',
    secondary: 'text-slate-500',
    heading: 'text-slate-900',
    subheading: 'text-slate-700',
    border: 'border-slate-200',
    background: 'bg-white'
  },
  inkBlue: {
    name: 'Ink Blue',
    primary: 'text-slate-800',
    secondary: 'text-gray-500',
    heading: 'text-blue-900',
    subheading: 'text-blue-800',
    border: 'border-gray-200',
    background: 'bg-white'
  },
  earthtone: {
    name: 'Earthtone',
    primary: 'text-amber-900',
    secondary: 'text-stone-500',
    heading: 'text-amber-950',
    subheading: 'text-amber-800',
    border: 'border-stone-200',
    background: 'bg-stone-50'
  }
};

// Layout options for the Minimal theme
export const layoutOptions = [
  {
    id: 'clean',
    name: 'Clean',
    value: 'clean',
    description: 'Ultra clean layout with minimal visual elements'
  },
  {
    id: 'compact',
    name: 'Compact',
    value: 'compact',
    description: 'Space-efficient layout that maximizes content'
  }
];

// Spacing options for the Minimal theme
export const spacingOptions = [
  { id: 'tight', name: 'Tight', value: 'space-y-3' },
  { id: 'balanced', name: 'Balanced', value: 'space-y-4' },
  { id: 'minimal', name: 'Minimal', value: 'space-y-5' }
];

// Header alignment options
export const headerAlignmentOptions = [
  { id: 'left', name: 'Left', value: 'text-left' },
  { id: 'center', name: 'Center', value: 'text-center' }
];

// Section heading styles
export const sectionHeadingStyles = [
  { id: 'simple', name: 'Simple', value: 'font-medium' },
  { id: 'minimal', name: 'Minimal', value: 'uppercase text-xs tracking-wider font-medium' },
  { id: 'clean', name: 'Clean', value: 'border-b pb-1' }
];

// Generate the default Minimal theme
const getDefaultMinimalTheme = (): ThemeStyles => ({
  name: 'Minimal',
  colorScheme: 'monochrome',
  primary: colorSchemes.monochrome.primary,
  secondary: colorSchemes.monochrome.secondary,
  background: colorSchemes.monochrome.background,
  heading: colorSchemes.monochrome.heading,
  subheading: colorSchemes.monochrome.subheading,
  border: colorSchemes.monochrome.border,
  font: {
    heading: fontOptions.heading[0].value,
    body: fontOptions.body[0].value
  },
  layout: layoutOptions[0].value,
  spacing: spacingOptions[1].value,
  headerStyle: 'mb-6',
  headerAlignment: headerAlignmentOptions[0].value,
  sectionHeadingStyle: sectionHeadingStyles[1].value
});

export default getDefaultMinimalTheme;