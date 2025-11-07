// src/components/layout/BottomNavigation.jsx
import { AddCircle as CreateIcon, Home as HomeIcon, Person as ProfileIcon, BarChart as ReportsIcon, Description as RequestsIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const CustomBottomNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navigationItems = [
        { id: "home", label: "Home", icon: <HomeIcon />, path: "/" },
        { id: "requests", label: "Requests", icon: <RequestsIcon />, path: "/requests" },
        { id: "create", label: "Create", icon: <CreateIcon />, path: "/create" },
        { id: "reports", label: "Reports", icon: <ReportsIcon />, path: "/reports" },
        { id: "profile", label: "Profile", icon: <ProfileIcon />, path: "/profile" },
    ];

    const isActive = (path) => location.pathname === path;

    const isLogin = location.pathname.includes("login")

    return (
        <Box
            sx={{
                display: isLogin && "none",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "white",
                borderTop: "1px solid",
                borderColor: "grey.200",
                py: 1.5,
                px: 2,
                borderRadius: "18px 18px 0 0"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    maxWidth: 400,
                    mx: "auto",
                }}
            >
                {navigationItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Box
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.5,
                                padding: 1.5,
                                borderRadius: 1,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                color: active ? "primary.main" : "grey.600",
                                backgroundColor: active ? "rgba(67, 97, 238, 0.08)" : "transparent",
                                transform: active ? "scale(0.95)" : "scale(1)",
                                "&:hover": {
                                    backgroundColor: active 
                                        ? "rgba(67, 97, 238, 0.12)" 
                                        : "rgba(0, 0, 0, 0.04)",
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: "1.4rem",
                                    transition: "all 0.2s ease",
                                },
                            }}
                        >
                            {item.icon}
                            <Box
                                component="span"
                                sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: active ? 600 : 400,
                                    lineHeight: 1,
                                    letterSpacing: "0.01em",
                                }}
                            >
                                {item.label}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default CustomBottomNavigation;