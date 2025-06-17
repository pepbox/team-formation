import { PaletteColorOptions } from "@mui/material/styles";
import {
  TypographyVariants,
  TypographyVariantsOptions,
} from "@mui/material/styles";

// Extend Palette
declare module "@mui/material/styles" {
  interface Palette {
    sysgrey: {
      main: string;
      secondary: string;
      dark:string;
    };
  }

  interface PaletteOptions {
    sysgrey?: {
      main: string;
      secondary: string;
      dark:string;
    };
  }

  // Extend TypographyVariants
  interface TypographyVariants {
    "32-700" : React.CSSProperties;


    "28-700" : React.CSSProperties;

    "25-700" : React.CSSProperties;
    "25-600" : React.CSSProperties;
    
    "24-700" : React.CSSProperties;

    "20-500": React.CSSProperties;
    "20-600": React.CSSProperties;
    "20-700"?: React.CSSProperties;
    "20-300"?: React.CSSProperties;

    "18-500": React.CSSProperties;
    "18-400": React.CSSProperties;

    "16-400": React.CSSProperties;

    "14-500": React.CSSProperties;
    "14-400": React.CSSProperties;

    "12-400": React.CSSProperties;

    "10-500": React.CSSProperties;
    "10-300": React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    "32-700" : React.CSSProperties;

    "28-700" : React.CSSProperties;

    "25-700" : React.CSSProperties;
    "25-600" : React.CSSProperties;

    "24-700" : React.CSSProperties;


    "20-500": React.CSSProperties;
    "20-600": React.CSSProperties;
    "20-700": React.CSSProperties;
    "20-300": React.CSSProperties;


    "18-400": React.CSSProperties;
    "18-500": React.CSSProperties;

    "16-400": React.CSSProperties;

    "14-500": React.CSSProperties;
    "14-400": React.CSSProperties;

    "12-400": React.CSSProperties;
    
    "10-500": React.CSSProperties;
    "10-300": React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    "32-700" : true;



    "28-700" : true;

    "25-700" : true;
    "25-600" : true;


    "24-700" : true;

    "20-500": true;
    "20-600": true;
    "20-700"?: true;
    "20-300"?: true;

    "18-400": true;
    "18-500": true;


    "16-400": true;

    "14-500": true;
    "14-400": true;

    "12-400": true;
    
    "10-500": true;
    "10-300": true;

  }
}

export {};
