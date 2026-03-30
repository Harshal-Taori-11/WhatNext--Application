// Color Palettes for 6 Theme Colors

export interface ColorPalette {
  primary: {
    light: string;
    main: string;
    dark: string;
  };
  secondary: {
    light: string;
    main: string;
    dark: string;
  };
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
}

export const colorPalettes: Record<string, ColorPalette> = {
  blue: {
    primary: {
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1976D2',
    },
    secondary: {
      light: '#FFE082',
      main: '#FFC107',
      dark: '#FFA000',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },

  pink: {
    primary: {
      light: '#F48FB1',
      main: '#E91E63',
      dark: '#C2185B',
    },
    secondary: {
      light: '#CE93D8',
      main: '#9C27B0',
      dark: '#7B1FA2',
    },
    background: {
      default: '#FCE4EC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#880E4F',
      secondary: '#AD1457',
    },
  },

  green: {
    primary: {
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C',
    },
    secondary: {
      light: '#AED581',
      main: '#8BC34A',
      dark: '#689F38',
    },
    background: {
      default: '#E8F5E9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B5E20',
      secondary: '#2E7D32',
    },
  },

  yellow: {
    primary: {
      light: '#FFF176',
      main: '#FFEB3B',
      dark: '#FBC02D',
    },
    secondary: {
      light: '#FFD54F',
      main: '#FFC107',
      dark: '#FFA000',
    },
    background: {
      default: '#FFFDE7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#F57F17',
      secondary: '#F9A825',
    },
  },

  black: {
    primary: {
      light: '#757575',
      main: '#424242',
      dark: '#212121',
    },
    secondary: {
      light: '#BDBDBD',
      main: '#9E9E9E',
      dark: '#616161',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#424242',
    },
  },

  red: {
    primary: {
      light: '#E57373',
      main: '#F44336',
      dark: '#D32F2F',
    },
    secondary: {
      light: '#FF8A65',
      main: '#FF5722',
      dark: '#E64A19',
    },
    background: {
      default: '#FFEBEE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#B71C1C',
      secondary: '#C62828',
    },
  },
};

// Helper function to get note card color (light shade)
export const getNoteCardColor = (themeColor: string): string => {
  const colors: Record<string, string> = {
    blue: '#E3F2FD',
    pink: '#FCE4EC',
    green: '#E8F5E9',
    yellow: '#FFFDE7',
    black: '#F5F5F5',
    red: '#FFEBEE',
  };
  return colors[themeColor] || colors.blue;
};

// Helper function to get note title color (darker shade)
export const getNoteTitleColor = (themeColor: string): string => {
  const colors: Record<string, string> = {
    blue: '#1565C0',
    pink: '#AD1457',
    green: '#2E7D32',
    yellow: '#F57F17',
    black: '#212121',
    red: '#C62828',
  };
  return colors[themeColor] || colors.blue;
};
