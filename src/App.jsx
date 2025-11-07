// src/App.jsx
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { store } from "./redux/store";

// Pages
import CreateRequest from "./pages/CreateRequest";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";

// Components
import ErrorBoundary from "./components/common/ErrorBoundary";
import Notification from "./components/common/Notification";
import PWAInstallPrompt from "./components/common/PWAInstallPrompt";
import CustomBottomNavigation from "./components/layout/BottomNavigation";

// Theme
import theme from "./theme";

const AppContent = () => {
    useEffect(() => {
        // Add PWA meta tags
        const addMetaTag = (name, content) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement("meta");
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        addMetaTag("theme-color", "#4361ee");
        addMetaTag("apple-mobile-web-app-capable", "yes");
        addMetaTag("apple-mobile-web-app-status-bar-style", "default");
        addMetaTag("apple-mobile-web-app-title", "MaterialFlow Pro");

        // Log PWA status
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        console.log("PWA Standalone mode:", isStandalone);
        console.log("Service Worker support:", "serviceWorker" in navigator);

        // Force service worker update check
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                console.log("Service Worker is ready:", registration);
            });
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateRequest />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            <Notification />
            <PWAInstallPrompt />
        </ThemeProvider>
    );
};

const App = () => {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <Router>
                    <AppContent />
                </Router>
            </Provider>
        </ErrorBoundary>
    );
};

export default App;
