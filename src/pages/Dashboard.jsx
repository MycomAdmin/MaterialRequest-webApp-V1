// src/pages/Dashboard.jsx
import { Add as AddIcon, Bolt as BoltIcon, Build as BuildIcon, History as HistoryIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, HomeRepairService as ToolsIcon } from "@mui/icons-material";
import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox, GradientButton, MaterialCard, StatCard, StatusChip } from "../components/ui/StyledComponents";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
    const navigate = useNavigate();
    const { stats, requests } = useSelector((state) => state.requests);
    const { user, signOut } = useAuth();

    // Inside Dashboard component, add:
    useEffect(() => {
        console.log("PWA Debug Info:");
        console.log("- Standalone:", window.matchMedia("(display-mode: standalone)").matches);
        console.log("- BeforeInstallPrompt supported:", "BeforeInstallPromptEvent" in window);
        console.log("- Service Worker:", navigator.serviceWorker?.controller);

        // Manual trigger for testing
        window.triggerPWA = () => {
            const event = new Event("beforeinstallprompt");
            window.dispatchEvent(event);
        };
    }, []);

    const QuickAction = ({ icon, title, subtitle, onClick, color = "blue" }) => {
        const colorMap = {
            blue: { bg: "#dbeafe", text: "#2563eb" },
            green: { bg: "#dcfce7", text: "#16a34a" },
        };

        const colors = colorMap[color] || colorMap.blue;

        return (
            <Card
                sx={{
                    p: 1.5,
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    "&:hover": {
                        borderColor: colors.text,
                        cursor: "pointer",
                    },
                    transition: "all 0.3s ease",
                }}
                onClick={onClick}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: colors.bg,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                    }}
                >
                    {React.cloneElement(icon, { sx: { color: colors.text, fontSize: 20 } })}
                </Box>
                <Typography variant="body1" fontWeight="600">
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            </Card>
        );
    };

    const RequestCard = ({ request }) => {
        const getIcon = () => {
            switch (request.title) {
                case "Electrical Components":
                    return <BoltIcon sx={{ color: "#2563eb", fontSize: 20 }} />;
                case "Construction Materials":
                    return <BuildIcon sx={{ color: "#16a34a", fontSize: 20 }} />;
                case "Tools & Equipment":
                    return <ToolsIcon sx={{ color: "#9333ea", fontSize: 20 }} />;
                default:
                    return <BoltIcon sx={{ color: "#2563eb", fontSize: 20 }} />;
            }
        };

        return (
            <MaterialCard sx={{ p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#dbeafe",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                            }}
                        >
                            {getIcon()}
                        </Box>
                        <Box>
                            <Typography variant="body1" fontWeight="600">
                                {request.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {request.title}
                            </Typography>
                        </Box>
                    </Box>
                    <StatusChip status={request.status} label={request.status} />
                </Box>
            </MaterialCard>
        );
    };

    return (
        <AppLayout>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
                    pb: 10,
                }}
            >
                {/* Header Section */}
                <GradientBox sx={{ pt: 3, pb: 4, borderRadius: "0 0 24px 24px" }}>
                    <Container maxWidth="sm">
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    MaterialFlow Pro
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Welcome back, {user?.name}!
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button sx={{ minWidth: "auto", width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "50%" }}>
                                    <NotificationsIcon sx={{ color: "white", fontSize: 20 }} />
                                </Button>
                                <Button
                                    sx={{ minWidth: "auto", width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "50%" }}
                                    onClick={() => {
                                        signOut();
                                        navigate("/login");
                                    }}
                                >
                                    <LogoutIcon
                                        sx={{
                                            color: "white",
                                            fontSize: 20,
                                            filter: "drop-shadow(0.2px 0 0 currentColor)",
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Box>

                        {/* Stats Cards */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={4}>
                                <StatCard>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Pending
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {stats.pending}
                                    </Typography>
                                </StatCard>
                            </Grid>
                            <Grid item xs={4}>
                                <StatCard>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Approved
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {stats.approved}
                                    </Typography>
                                </StatCard>
                            </Grid>
                            <Grid item xs={4}>
                                <StatCard>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Completed
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {stats.completed}
                                    </Typography>
                                </StatCard>
                            </Grid>
                        </Grid>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: -3 }}>
                    {/* Quick Actions */}
                    <Card sx={{ p: 2, mb: 2.5 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <QuickAction icon={<AddIcon />} title="New Request" subtitle="Create material request" onClick={() => navigate("/create")} color="blue" />
                            </Grid>
                            <Grid item xs={6}>
                                <QuickAction icon={<HistoryIcon />} title="History" subtitle="View past requests" onClick={() => navigate("/requests")} color="green" />
                            </Grid>
                        </Grid>
                    </Card>

                    {/* Recent Requests */}
                    <Card sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" fontWeight="600">
                                Recent Requests
                            </Typography>
                            <Button color="primary" size="small" sx={{ fontWeight: 600 }}>
                                View All
                            </Button>
                        </Box>

                        <Box>
                            {requests.map((request) => (
                                <RequestCard key={request.id} request={request} />
                            ))}
                        </Box>
                    </Card>
                </Container>

                {/* Floating Action Button */}
                <GradientButton
                    sx={{
                        position: "fixed",
                        bottom: 80,
                        right: 16,
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        minWidth: "auto",
                        zIndex: 999,
                    }}
                    onClick={() => navigate("/create")}
                >
                    <AddIcon />
                </GradientButton>
            </Box>
        </AppLayout>
    );
};

export default Dashboard;
