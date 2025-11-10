// src/pages/Reports.jsx
import { BarChart as BarChartIcon, Inventory as InventoryIcon, Schedule as ScheduleIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox } from "../components/ui/StyledComponents";

const Reports = () => {
    const navigate = useNavigate();
    const { materialRequestData } = useSelector((state) => state.materialRequest);

    // Calculate stats from materialRequestData
    const stats = useMemo(() => {
        const requestData = materialRequestData || [];

        return {
            total: requestData.length,
            pending: requestData.filter((req) => req.approved === "N" && req.completed === "N").length,
            approved: requestData.filter((req) => req.approved === "Y" && req.completed === "N").length,
            completed: requestData.filter((req) => req.completed === "Y").length,
            draft: requestData.filter((req) => req.posted === "N").length,
        };
    }, [materialRequestData]);

    // Calculate additional metrics
    const additionalMetrics = useMemo(() => {
        const requestData = materialRequestData || [];

        const totalAmount = requestData.reduce((sum, req) => sum + (parseFloat(req.total_amount) || 0), 0);
        const averageAmount = requestData.length > 0 ? totalAmount / requestData.length : 0;

        // Get unique locations
        const locations = [...new Set(requestData.map((req) => req.loc_no).filter(Boolean))];

        // Get items count
        const totalItems = requestData.reduce((sum, req) => sum + (req.MQ_TRAN?.length || 0), 0);

        return {
            totalAmount,
            averageAmount,
            locationCount: locations.length,
            totalItems,
        };
    }, [materialRequestData]);

    const ReportCard = ({ title, value, subtitle, icon, color = "primary", onClick }) => (
        <Card
            sx={{
                p: 2,
                textAlign: "center",
                height: "100%",
                cursor: onClick ? "pointer" : "default",
                transition: "all 0.2s ease",
                "&:hover": onClick
                    ? {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }
                    : {},
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: color === "primary" ? "#dbeafe" : color === "success" ? "#dcfce7" : color === "warning" ? "#fef3c7" : color === "error" ? "#fee2e2" : color === "info" ? "#e0f2fe" : "#f3e8ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 1.5,
                }}
            >
                {React.cloneElement(icon, {
                    sx: {
                        color: color === "primary" ? "#2563eb" : color === "success" ? "#16a34a" : color === "warning" ? "#d97706" : color === "error" ? "#dc2626" : color === "info" ? "#0369a1" : "#9333ea",
                        fontSize: 24,
                    },
                })}
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: "1.5rem" }}>
                {value}
            </Typography>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: "0.9rem" }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                {subtitle}
            </Typography>
        </Card>
    );

    return (
        <AppLayout>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
                    pb: 6,
                }}
            >
                {/* Header */}
                <GradientBox sx={{ pt: 3, pb: 2, borderRadius: "0 0 24px 24px" }}>
                    <Container maxWidth="sm">
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Reports & Analytics
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Insights from {stats.total} material requests
                        </Typography>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: 2 }}>
                    {/* Status Overview */}
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 2, fontSize: "1rem" }}>
                        Request Status Overview
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                            <ReportCard title="Total Requests" value={stats.total} subtitle="All requests" icon={<BarChartIcon />} color="primary" onClick={() => navigate("/requests")} />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Pending" value={stats.pending} subtitle="Awaiting approval" icon={<ScheduleIcon />} color="warning" onClick={() => navigate("/requests?tab=pending")} />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Approved" value={stats.approved} subtitle="Ready for processing" icon={<TrendingUpIcon />} color="success" onClick={() => navigate("/requests?tab=approved")} />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Completed" value={stats.completed} subtitle="Successfully delivered" icon={<InventoryIcon />} color="info" onClick={() => navigate("/requests?tab=completed")} />
                        </Grid>
                    </Grid>

                    {/* Additional Metrics */}
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 2, fontSize: "1rem" }}>
                        Additional Metrics
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                            <ReportCard title="Total Value" value={`$${additionalMetrics.totalAmount.toFixed(2)}`} subtitle="Combined amount" icon={<TrendingUpIcon />} color="success" />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Avg. per Request" value={`$${additionalMetrics.averageAmount.toFixed(2)}`} subtitle="Average amount" icon={<BarChartIcon />} color="primary" />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Total Items" value={additionalMetrics.totalItems} subtitle="All items requested" icon={<InventoryIcon />} color="info" />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Locations" value={additionalMetrics.locationCount} subtitle="Active locations" icon={<ScheduleIcon />} color="warning" />
                        </Grid>
                    </Grid>

                    {/* Quick Stats Summary */}
                    <Card sx={{ p: 2.5, mb: 2, backgroundColor: "#f8fafc" }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ fontSize: "0.95rem" }}>
                            Quick Stats Summary
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Completion Rate:
                            </Typography>
                            <Typography variant="body2" fontWeight="600" textAlign="right">
                                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Approval Rate:
                            </Typography>
                            <Typography variant="body2" fontWeight="600" textAlign="right">
                                {stats.total > 0 ? (((stats.approved + stats.completed) / stats.total) * 100).toFixed(1) : 0}%
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Avg Items/Request:
                            </Typography>
                            <Typography variant="body2" fontWeight="600" textAlign="right">
                                {stats.total > 0 ? (additionalMetrics.totalItems / stats.total).toFixed(1) : 0}
                            </Typography>
                        </Box>
                    </Card>

                    {/* Coming Soon Section */}
                    <Card sx={{ p: 2.5, textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                        <BarChartIcon sx={{ fontSize: 48, color: "white", mb: 1.5, opacity: 0.9 }} />
                        <Typography variant="h6" gutterBottom sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                            Advanced Analytics Coming Soon
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
                            Detailed charts, trends analysis, and predictive insights are under development.
                        </Typography>
                    </Card>
                </Container>
            </Box>
        </AppLayout>
    );
};

export default Reports;
