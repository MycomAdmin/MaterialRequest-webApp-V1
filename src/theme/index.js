// src/theme/index.js
import { createTheme } from "@mui/material/styles";

export const customColors = {
    primary: "#4361ee",
    primaryDark: "#3a56d4",
    secondary: "#7209b7",
    accent: "#06d6a0",
    dark: "#1e293b",
    light: "#f8fafc",

    // Status colors
    status: {
        pending: {
            background: "#fff3cd",
            color: "#856404",
        },
        approved: {
            background: "#d1edff",
            color: "#0c63e4",
        },
        completed: {
            background: "#d1fae5",
            color: "#065f46",
        },
    },

    // Custom color shades like Tailwind
    blue: {
        100: "#dbeafe",
        200: "#bfdbfe",
        600: "#2563eb",
    },
    green: {
        100: "#dcfce7",
        600: "#16a34a",
    },
    purple: {
        100: "#f3e8ff",
        600: "#9333ea",
    },
};

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: customColors.primary,
            dark: customColors.primaryDark,
        },
        secondary: {
            main: customColors.secondary,
        },
        background: {
            default: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    fontWeight: 600,
                    textTransform: "none",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: "36px",
                        fontSize: "16px",
                        "&:hover fieldset": {
                            borderColor: customColors.primary,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: customColors.primary,
                            boxShadow: "0 0 0 2px rgba(67, 97, 238, 0.1)",
                        },
                        "& input": {
                            padding: "0 12px 4px",
                            fontSize: "13px",
                        },
                    },
                    // Keep the label but make it static (non-floating)
                    "& .MuiInputLabel-root": {
                        position: "static",
                        transform: "none",
                        marginBottom: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        lineHeight: 1.2,
                        "&.Mui-focused": {
                            color: customColors.primary,
                        },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        "& legend": {
                            display: "none",
                        },
                    },
                },
            },
        },
    },
});

export default theme;
