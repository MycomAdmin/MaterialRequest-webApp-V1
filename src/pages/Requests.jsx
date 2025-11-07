// src/pages/Requests.jsx
import { ArrowBack as ArrowBackIcon, Search as SearchIcon } from "@mui/icons-material";
import { Box, Card, Container, IconButton, InputAdornment, Tab, Tabs, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox, StatusChip } from "../components/ui/StyledComponents";

const Requests = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const { requests } = useSelector((state) => state.requests);

    const filteredRequests = requests.filter((request) => request.id.toLowerCase().includes(searchQuery.toLowerCase()) || request.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const getStatusCount = (status) => {
        return requests.filter((req) => req.status === status).length;
    };
    const isLargeScreen = useMediaQuery('(min-width:530px)');

    const tabLabels = [`All (${requests.length})`, `Pending (${getStatusCount("pending")})`, `Approved (${getStatusCount("approved")})`, `Completed (${getStatusCount("completed")})`];

    const getFilteredRequestsByTab = () => {
        switch (activeTab) {
            case 1:
                return filteredRequests.filter((req) => req.status === "pending");
            case 2:
                return filteredRequests.filter((req) => req.status === "approved");
            case 3:
                return filteredRequests.filter((req) => req.status === "completed");
            default:
                return filteredRequests;
        }
    };

    return (
        <AppLayout>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
                    pb: 8,
                }}
            >
                {/* Header */}
                <GradientBox sx={{ pt: 3, pb: 2, borderRadius: "0 0 24px 24px" }}>
                    <Container maxWidth="sm">
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <IconButton sx={{ color: "white", mr: 2, backgroundColor: "rgba(255,255,255,0.2)", }} onClick={() => navigate("/")}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Material Requests
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Manage and track your material requests
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: 2 }}>
                    {/* Search and Filter */}
                    <Card sx={{ padding: "12px 12px 8px", mb: 1.5, borderRadius: 1 }}>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                            <TextField
                                fullWidth
                                placeholder="Search requests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                            {/* <Button 
                                variant="outlined" 
                                startIcon={<FilterIcon />}
                                size="small"
                                sx={{ minWidth: 'auto', px: 2 }}
                            >
                                Filter
                            </Button> */}
                        </Box>
                    </Card>

                    {/* Tabs */}
        <Card sx={{ mb: 1.5, borderRadius: 1 }}>
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isLargeScreen ? "standard" : "scrollable"}
                scrollButtons="auto"
                allowScrollButtonsMobile
                centered={isLargeScreen}
                sx={{
                    minHeight: 48,
                    "& .MuiTabScrollButton-root": {
                        width: 32,
                        opacity: 1,
                    },
                }}
            >
                {tabLabels.map((label, index) => (
                    <Tab
                        key={index}
                        label={label}
                        sx={{
                            minHeight: 48,
                            fontSize: "0.8rem",
                            py: 1,
                            minWidth: isLargeScreen ? "120px" : "fit-content",
                            px: 2,
                        }}
                    />
                ))}
            </Tabs>
        </Card>

                    {/* Requests List */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {getFilteredRequestsByTab().map((request) => (
                            <Card key={request.id} sx={{ p: 2, borderRadius: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Box sx={{ flex: 1, mr: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="600" fontSize="0.95rem">
                                            {request.id}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom fontSize="0.875rem">
                                            {request.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                            Created: {request.date} • {request.items} items • {request.location}
                                        </Typography>
                                    </Box>
                                    <StatusChip status={request.status} label={request.status} size="small" />
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>
        </AppLayout>
    );
};

export default Requests;
