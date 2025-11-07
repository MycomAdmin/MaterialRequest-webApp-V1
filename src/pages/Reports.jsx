// src/pages/Reports.jsx
import { BarChart as BarChartIcon, Inventory as InventoryIcon, Schedule as ScheduleIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox } from "../components/ui/StyledComponents";

const Reports = () => {
    const navigate = useNavigate();
    const { stats } = useSelector((state) => state.requests);

    const ReportCard = ({ title, value, subtitle, icon, color = "primary" }) => (
        <Card sx={{ p: 2, textAlign: "center", height: "100%" }}>
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: color === "primary" ? "#dbeafe" : color === "success" ? "#dcfce7" : color === "warning" ? "#fef3c7" : "#f3e8ff",
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
                        color: color === "primary" ? "#2563eb" : color === "success" ? "#16a34a" : color === "warning" ? "#d97706" : "#9333ea",
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
                            View insights and analytics
                        </Typography>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <ReportCard title="Total Requests" value={stats.pending + stats.approved + stats.completed} subtitle="All time" icon={<BarChartIcon />} color="primary" />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Pending" value={stats.pending} subtitle="Awaiting approval" icon={<ScheduleIcon />} color="warning" />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Approved" value={stats.approved} subtitle="Ready for processing" icon={<TrendingUpIcon />} color="success" />
                        </Grid>
                        <Grid item xs={6}>
                            <ReportCard title="Completed" value={stats.completed} subtitle="Successfully delivered" icon={<InventoryIcon />} color="secondary" />
                        </Grid>
                    </Grid>

                    {/* Coming Soon Section */}
                    <Card sx={{ p: 2.5, textAlign: "center", mt: 2 }}>
                        <BarChartIcon sx={{ fontSize: 48, color: "primary.main", mb: 1.5 }} />
                        <Typography variant="h6" gutterBottom sx={{ fontSize: "0.95rem" }}>
                            Advanced Analytics Coming Soon
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                            Detailed reports, charts, and insights are under development.
                        </Typography>
                    </Card>
                </Container>
            </Box>
        </AppLayout>
    );
};

export default Reports;
