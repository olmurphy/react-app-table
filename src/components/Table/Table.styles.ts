import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    border: {
      light: string;
      main: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    border: {
      light: string;
      main: string;
      dark: string;
    };
  }
}

const getCssVariable = (variableName: string): string => {
  if (typeof window !== "undefined" && window.getComputedStyle) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  // Provide a fallback value for server-side rendering
  console.warn(`CSS variable ${variableName} is not available in the server environment.`);
  return "#FFFFFF"; // You can replace this with a default value if needed
};

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: getCssVariable('--light-link'),
      light: getCssVariable('--light-link-hover'),
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: getCssVariable('--light-bg'),
      paper: getCssVariable('--light-card-bg'),
    },
    text: {
      primary: getCssVariable('--light-text'),
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.06)',
      main: 'rgba(0, 0, 0, 0.12)',
      dark: 'rgba(0, 0, 0, 0.15)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: getCssVariable('--dark-link'),
      light: getCssVariable('--dark-link-hover'),
      dark: '#42a5f5',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
    },
    background: {
      default: getCssVariable('--dark-bg'),
      paper: getCssVariable('--dark-card-bg'),
    },
    text: {
      primary: getCssVariable('--dark-text'),
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
    border: {
      light: 'rgba(255, 255, 255, 0.08)',
      main: 'rgba(255, 255, 255, 0.12)',
      dark: 'rgba(255, 255, 255, 0.15)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
});



// export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   // Move styles here
// }));

// export const commonStyles = {
//   tableCell: {
//     // Shared cell styles
//   },
//   // ... other common styles
// };