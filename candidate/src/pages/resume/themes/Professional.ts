import { ThemeStyles } from '@/types/ResumeTheme';

// Font options for the Professional theme
export const fontOptions = {
  heading: [
    { id: 'serif', name: 'Serif', value: 'font-serif' },
    { id: 'sans', name: 'Sans-serif', value: 'font-sans' },
    { id: 'georgia', name: 'Georgia', value: 'font-["Georgia"]' },
    { id: 'times', name: 'Times New Roman', value: 'font-["Times_New_Roman"]' },
    { id: 'merriweather', name: 'Merriweather', value: 'font-["Merriweather"]' }
  ],
  body: [
    { id: 'sans', name: 'Sans-serif', value: 'font-sans' },
    { id: 'serif', name: 'Serif', value: 'font-serif' },
    { id: 'arial', name: 'Arial', value: 'font-["Arial"]' },
    { id: 'helvetica', name: 'Helvetica', value: 'font-["Helvetica"]' },
    { id: 'calibri', name: 'Calibri', value: 'font-["Calibri"]' }
  ]
};

// Color schemes for the Professional theme
export const colorSchemes = {
  classic: {
    name: 'Classic Blue',
    primary: 'text-blue-800',
    secondary: 'text-gray-600',
    heading: 'text-blue-900',
    subheading: 'text-blue-700',
    border: 'border-blue-300',
    background: 'bg-gray-50'
  },
  navy: {
    name: 'Navy Professional',
    primary: 'text-navy-700',
    secondary: 'text-slate-600',
    heading: 'text-navy-900',
    subheading: 'text-navy-600',
    border: 'border-navy-200',
    background: 'bg-slate-50'
  },
  maroon: {
    name: 'Maroon Classic',
    primary: 'text-red-800',
    secondary: 'text-gray-700',
    heading: 'text-red-900',
    subheading: 'text-red-700',
    border: 'border-red-200',
    background: 'bg-stone-50'
  },
  forest: {
    name: 'Forest Green',
    primary: 'text-green-800',
    secondary: 'text-stone-600',
    heading: 'text-green-900',
    subheading: 'text-green-700',
    border: 'border-green-200',
    background: 'bg-stone-50'
  },
  charcoal: {
    name: 'Charcoal',
    primary: 'text-gray-800',
    secondary: 'text-gray-500',
    heading: 'text-gray-900',
    subheading: 'text-gray-700',
    border: 'border-gray-300',
    background: 'bg-gray-50'
  }
};

// Layout options for the Professional theme
export const layoutOptions = [
  {
    id: 'traditional',
    name: 'Traditional',
    value: 'traditional',
    description: 'Classic centered header with sections below'
  },
  {
    id: 'modern',
    name: 'Modern Split',
    value: 'modern',
    description: 'Split header with contact details on the right'
  }
];

// Spacing options for the Professional theme
export const spacingOptions = [
  { id: 'compact', name: 'Compact', value: 'space-y-3' },
  { id: 'balanced', name: 'Balanced', value: 'space-y-4' },
  { id: 'spacious', name: 'Spacious', value: 'space-y-6' }
];

// Header alignment options
export const headerAlignmentOptions = [
  { id: 'center', name: 'Center', value: 'text-center' },
  { id: 'left', name: 'Left', value: 'text-left' },
  { id: 'right', name: 'Right', value: 'text-right' }
];

// Section heading styles
export const sectionHeadingStyles = [
  { id: 'underline', name: 'Underline', value: 'border-b' },
  { id: 'box', name: 'Box', value: 'border-l-4 pl-2' },
  { id: 'plain', name: 'Plain', value: '' }
];

// Generate the default Professional theme with the first options
const getDefaultProfessionalTheme = (): ThemeStyles => ({
  name: 'Professional',
  colorScheme: 'classic',
  primary: colorSchemes.classic.primary,
  secondary: colorSchemes.classic.secondary,
  background: colorSchemes.classic.background,
  heading: colorSchemes.classic.heading,
  subheading: colorSchemes.classic.subheading,
  border: colorSchemes.classic.border,
  font: {
    heading: fontOptions.heading[0].value,
    body: fontOptions.body[0].value
  },
  layout: layoutOptions[0].value,
  spacing: spacingOptions[1].value,
  headerStyle: 'mb-6',
  headerAlignment: headerAlignmentOptions[0].value,
  sectionHeadingStyle: sectionHeadingStyles[0].value
});

export default getDefaultProfessionalTheme;