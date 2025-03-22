// Import the createTheme function from Material-UI, which is used to define a custom theme.
import { createTheme } from '@mui/material/styles';

// Define a custom Material-UI theme by calling createTheme.
const theme = createTheme({
    // The palette defines the main colors used throughout the application.
    palette: {
        primary: {
            main: '#424242', // The main primary color (e.g., buttons, highlights).
            light: '#6d6d6d', // A lighter shade of the primary color.
            dark: '#1b1b1b', // A darker shade of the primary color.
        },
        secondary: {
            main: '#9c27b0', // The main secondary color (e.g., secondary buttons, accents).
            light: '#ba68c8', // A lighter shade of the secondary color.
            dark: '#7b1fa2', // A darker shade of the secondary color.
        },
        success: {
            main: '#2e7d32', // The main color for success states (e.g., success messages).
            light: '#4caf50', // A lighter success color.
            dark: '#1b5e20', // A darker success color.
        },
        error: {
            main: '#d32f2f', // The main color for error states (e.g., error messages).
            light: '#ef5350', // A lighter error color.
            dark: '#c62828', // A darker error color.
        },
        background: {
            default: '#f5f5f5', // The default background color for pages.
            paper: '#ffffff', // The background color for cards and other surfaces.
        },
    },
    // The typography section defines the font family and size/weight for headings and body text.
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Primary font stack.
        h1: {
            fontSize: '2.5rem', // Font size for h1 headers.
            fontWeight: 500, // Font weight for h1 headers.
        },
        h2: {
            fontSize: '2rem', // Font size for h2 headers.
            fontWeight: 500, // Font weight for h2 headers.
        },
        h3: {
            fontSize: '1.75rem', // Font size for h3 headers.
            fontWeight: 500, // Font weight for h3 headers.
        },
        h4: {
            fontSize: '1.5rem', // Font size for h4 headers.
            fontWeight: 500, // Font weight for h4 headers.
        },
        h5: {
            fontSize: '1.25rem', // Font size for h5 headers.
            fontWeight: 500, // Font weight for h5 headers.
        },
        h6: {
            fontSize: '1rem', // Font size for h6 headers.
            fontWeight: 500, // Font weight for h6 headers.
        },
    },
    // The components section allows for customization of specific Material-UI components.
    components: {
        // Override the default styles for Material-UI buttons.
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable the default uppercase text transformation.
                    borderRadius: 8, // Add slightly rounded corners.
                },
            },
        },
        // Override the default styles for Material-UI cards.
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Add more rounded corners to cards.
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Set a subtle shadow for cards.
                },
            },
        },
        // Override the default styles for Material-UI chips.
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6, // Add rounded corners to chips.
                },
            },
        },
    },
});

// Export the custom theme so it can be used by the application.
export default theme;
