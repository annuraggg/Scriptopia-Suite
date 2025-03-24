import getDefaultProfessionalTheme, { 
    fontOptions as professionalFontOptions,
    colorSchemes as professionalColorSchemes,
    layoutOptions as professionalLayoutOptions,
    spacingOptions as professionalSpacingOptions,
    headerAlignmentOptions as professionalHeaderAlignmentOptions,
    sectionHeadingStyles as professionalSectionHeadingStyles
  } from './themes/Professional';
  
  import getDefaultModernTheme, { 
    fontOptions as modernFontOptions,
    colorSchemes as modernColorSchemes,
    layoutOptions as modernLayoutOptions,
    spacingOptions as modernSpacingOptions,
    headerAlignmentOptions as modernHeaderAlignmentOptions,
    sectionHeadingStyles as modernSectionHeadingStyles
  } from './themes/Modern';
  
  import getDefaultCreativeTheme, { 
    fontOptions as creativeFontOptions,
    colorSchemes as creativeColorSchemes,
    layoutOptions as creativeLayoutOptions,
    spacingOptions as creativeSpacingOptions,
    headerAlignmentOptions as creativeHeaderAlignmentOptions,
    sectionHeadingStyles as creativeSectionHeadingStyles
  } from './themes/Creative';
  
  import getDefaultMinimalTheme, { 
    fontOptions as minimalFontOptions,
    colorSchemes as minimalColorSchemes,
    layoutOptions as minimalLayoutOptions,
    spacingOptions as minimalSpacingOptions,
    headerAlignmentOptions as minimalHeaderAlignmentOptions,
    sectionHeadingStyles as minimalSectionHeadingStyles
  } from './themes/Minimal';
  
  import { ThemeStyles } from '@/types/ResumeTheme';
  
  export const themeOptions = {
    Professional: {
      getDefaultTheme: getDefaultProfessionalTheme,
      fontOptions: professionalFontOptions,
      colorSchemes: professionalColorSchemes,
      layoutOptions: professionalLayoutOptions,
      spacingOptions: professionalSpacingOptions,
      headerAlignmentOptions: professionalHeaderAlignmentOptions,
      sectionHeadingStyles: professionalSectionHeadingStyles
    },
    Modern: {
      getDefaultTheme: getDefaultModernTheme,
      fontOptions: modernFontOptions,
      colorSchemes: modernColorSchemes,
      layoutOptions: modernLayoutOptions,
      spacingOptions: modernSpacingOptions,
      headerAlignmentOptions: modernHeaderAlignmentOptions,
      sectionHeadingStyles: modernSectionHeadingStyles
    },
    Creative: {
      getDefaultTheme: getDefaultCreativeTheme,
      fontOptions: creativeFontOptions,
      colorSchemes: creativeColorSchemes,
      layoutOptions: creativeLayoutOptions,
      spacingOptions: creativeSpacingOptions,
      headerAlignmentOptions: creativeHeaderAlignmentOptions,
      sectionHeadingStyles: creativeSectionHeadingStyles
    },
    Minimal: {
      getDefaultTheme: getDefaultMinimalTheme,
      fontOptions: minimalFontOptions,
      colorSchemes: minimalColorSchemes,
      layoutOptions: minimalLayoutOptions,
      spacingOptions: minimalSpacingOptions,
      headerAlignmentOptions: minimalHeaderAlignmentOptions,
      sectionHeadingStyles: minimalSectionHeadingStyles
    }
  };
  
  export const defaultThemes: { [key: string]: ThemeStyles } = {
    Professional: getDefaultProfessionalTheme(),
    Modern: getDefaultModernTheme(),
    Creative: getDefaultCreativeTheme(),
    Minimal: getDefaultMinimalTheme()
  };
  
  export const getAllThemeNames = (): string[] => {
    return Object.keys(defaultThemes);
  };
  
  export const getThemeByName = (name: string): ThemeStyles => {
    return defaultThemes[name] || defaultThemes.Professional;
  };
  
  export const getThemeOptions = (themeName: string) => {
    return themeOptions[themeName as keyof typeof themeOptions] || themeOptions.Professional;
  };
  
  export default {
    defaultThemes,
    getAllThemeNames,
    getThemeByName,
    getThemeOptions
  };