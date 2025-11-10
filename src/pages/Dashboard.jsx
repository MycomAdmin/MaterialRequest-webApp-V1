// src/pages/Dashboard.jsx
import { Add as AddIcon, Bolt as BoltIcon, Build as BuildIcon, Restaurant as FoodIcon, History as HistoryIcon, Logout as LogoutIcon, Refresh as RefreshIcon, HomeRepairService as ToolsIcon } from "@mui/icons-material";
import { Box, Button, Card, CircularProgress, Container, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox, GradientButton, MaterialCard, StatCard, StatusChip } from "../components/ui/StyledComponents";
import { useAuth } from "../hooks/useAuth";
import { fetchMaterialRequests, resetMaterialRequestDataForCreate } from "../redux/slices/materialRequestSlice";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, signOut } = useAuth();

    // Get data from materialRequestSlice instead of requests slice
    const { materialRequestData, materialRequestLoading, materialRequestError } = useSelector((state) => state.materialRequest);

    // Extract the main request data from the nested structure
    const requestData = materialRequestData || [];

    // Calculate stats from material request data
    const stats = {
        pending: requestData.filter((item) => item.approved === "N" && item.completed === "N").length || 0,
        approved: requestData.filter((item) => item.approved === "Y" && item.completed === "N").length || 0,
        completed: requestData.filter((item) => item.completed === "Y").length || 0,
        total: requestData.length || 0,
    };

    // Fetch material requests on component mount
    useEffect(() => {
        dispatch(resetMaterialRequestDataForCreate());
        dispatch(fetchMaterialRequests());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchMaterialRequests());
    };

    const QuickAction = ({ icon, title, subtitle, onClick, color = "blue" }) => {
        const colorMap = {
            blue: { bg: "#dbeafe", text: "#2563eb" },
            green: { bg: "#dcfce7", text: "#16a34a" },
            purple: { bg: "#f3e8ff", text: "#9333ea" },
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
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
            // Check item descriptions to determine icon
            const hasFoodItems = request.MQ_TRAN?.some((item) => item.item_desc?.toLowerCase().includes("chicken") || item.item_desc?.toLowerCase().includes("food") || item.item_desc?.toLowerCase().includes("menu"));

            const hasElectrical = request.remarks?.toLowerCase().includes("electrical") || request.cost_center?.toLowerCase().includes("electrical");

            const hasConstruction = request.remarks?.toLowerCase().includes("construction") || request.cost_center?.toLowerCase().includes("construction");

            const hasTools = request.remarks?.toLowerCase().includes("tool") || request.cost_center?.toLowerCase().includes("tool");

            if (hasFoodItems) {
                return <FoodIcon sx={{ color: "#dc2626", fontSize: 20 }} />;
            } else if (hasElectrical) {
                return <BoltIcon sx={{ color: "#2563eb", fontSize: 20 }} />;
            } else if (hasConstruction) {
                return <BuildIcon sx={{ color: "#16a34a", fontSize: 20 }} />;
            } else if (hasTools) {
                return <ToolsIcon sx={{ color: "#9333ea", fontSize: 20 }} />;
            } else {
                return <BoltIcon sx={{ color: "#2563eb", fontSize: 20 }} />;
            }
        };

        const getStatus = () => {
            if (request.completed === "Y") return "completed";
            if (request.approved === "Y") return "approved";
            if (request.posted === "Y") return "pending";
            return "draft";
        };

        const getStatusLabel = () => {
            if (request.completed === "Y") return "Completed";
            if (request.approved === "Y") return "Approved";
            if (request.posted === "Y") return "Pending";
            return "Draft";
        };

        // Get item count and total amount
        const itemCount = request.MQ_TRAN?.length || 0;
        const totalAmount = request.total_amount || 0;

        return (
            <MaterialCard sx={{ p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
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
                                flexShrink: 0,
                                mt: 0.5,
                            }}
                        >
                            {getIcon()}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body1" fontWeight="600" noWrap>
                                {request.doc_no || `RQ-${request.doc_id}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {request.remarks || "Material Request"}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {totalAmount?.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {request.doc_date ? new Date(request.doc_date).toLocaleDateString() : "No date"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <StatusChip status={getStatus()} label={getStatusLabel()} />
                </Box>
            </MaterialCard>
        );
    };

    // Get recent requests (last 5)
    const recentRequests = [...requestData]
        .sort((a, b) => b.doc_id - a.doc_id) // sort descending by doc_id
        .slice(0, 3); // then take top 5

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
                                <IconButton
                                    onClick={handleRefresh}
                                    disabled={materialRequestLoading}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        "&:disabled": {
                                            opacity: 0.5,
                                        },
                                    }}
                                >
                                    {materialRequestLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <RefreshIcon sx={{ color: "white", fontSize: 20 }} />}
                                </IconButton>
                                <Button
                                    sx={{
                                        minWidth: "auto",
                                        width: 40,
                                        height: 40,
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderRadius: "50%",
                                    }}
                                    onClick={() => {
                                        signOut();
                                        navigate("/login");
                                    }}
                                >
                                    <LogoutIcon sx={{ color: "white", fontSize: 20 }} />
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
                                <QuickAction icon={<HistoryIcon />} title="All Requests" subtitle="View all requests" onClick={() => navigate("/requests")} color="green" />
                            </Grid>
                        </Grid>
                    </Card>

                    {/* Recent Requests */}
                    <Card sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" fontWeight="600">
                                Recent Requests
                                {materialRequestLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                            </Typography>
                            <Button color="primary" size="small" sx={{ fontWeight: 600 }} onClick={() => navigate("/requests")} disabled={materialRequestLoading}>
                                View All
                            </Button>
                        </Box>

                        <Box>
                            {materialRequestLoading && requestData.length === 0 ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                                    <CircularProgress size={30} />
                                </Box>
                            ) : recentRequests.length > 0 ? (
                                recentRequests.map((request) => <RequestCard key={request.doc_id || request.doc_no} request={request} />)
                            ) : (
                                <Box sx={{ textAlign: "center", py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No material requests found
                                    </Typography>
                                    <Button variant="text" size="small" onClick={() => navigate("/create")} sx={{ mt: 1 }}>
                                        Create your first request
                                    </Button>
                                </Box>
                            )}
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
                        boxShadow: "0 4px 20px rgba(67, 97, 238, 0.3)",
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
