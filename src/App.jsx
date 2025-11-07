// src/App.jsx
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
// import LoadingScreen from "./components/common/LoadingScreen";
import Notification from "./components/common/Notification";
import PWAInstallPrompt from "./components/common/PWAInstallPrompt";

// Theme
import theme from "./theme";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    // Show loading screen while checking authentication
    // if (isLoading) {
    //     return <LoadingScreen />;
    // }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    // if (isLoading) {
    //     return <LoadingScreen />;
    // }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

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
                {/* Public routes - only accessible when not logged in */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* Protected routes - only accessible when logged in */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreateRequest />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/requests"
                    element={
                        <ProtectedRoute>
                            <Requests />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all route - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
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
