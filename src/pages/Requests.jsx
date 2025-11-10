// src/pages/Requests.jsx
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon, Search as SearchIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Tab,
    Tabs,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox, StatusChip } from "../components/ui/StyledComponents";
import { fetchDeleteMaterialRequest, fetchMaterialRequestById, fetchMaterialRequests } from "../redux/slices/materialRequestSlice";

const Requests = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Get data from materialRequestSlice
    const { materialRequestData, materialRequestLoading, materialRequestError } = useSelector((state) => state.materialRequest);

    // Extract the main request data from the nested structure
    const requestData = materialRequestData || [];

    // Fetch material requests on component mount
    useEffect(() => {
        dispatch(fetchMaterialRequests());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchMaterialRequests());
    };

    // Filter requests based on search query
    const filteredRequests = requestData.filter(
        (request) =>
            request?.doc_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request?.doc_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request?.remarks?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request?.cost_center?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get status counts
    const getStatusCount = (statusType) => {
        switch (statusType) {
            case "pending":
                return requestData.filter((req) => req?.approved === "N" && req?.completed === "N").length;
            case "approved":
                return requestData.filter((req) => req?.approved === "Y" && req?.completed === "N").length;
            case "completed":
                return requestData.filter((req) => req?.completed === "Y").length;
            default:
                return requestData.length;
        }
    };

    const isLargeScreen = useMediaQuery("(min-width:530px)");

    const tabLabels = [`All (${requestData.length})`, `Pending (${getStatusCount("pending")})`, `Approved (${getStatusCount("approved")})`, `Completed (${getStatusCount("completed")})`];

    const getFilteredRequestsByTab = () => {
        const filtered = filteredRequests.filter((request) => {
            switch (activeTab) {
                case 1: // Pending
                    return request?.approved === "N" && request?.completed === "N";
                case 2: // Approved
                    return request?.approved === "Y" && request?.completed === "N";
                case 3: // Completed
                    return request?.completed === "Y";
                default: // All
                    return true;
            }
        });
        return filtered;
    };

    const getStatus = (request) => {
        if (request?.completed === "Y") return "completed";
        if (request?.approved === "Y") return "approved";
        if (request?.posted === "Y") return "pending";
        return "draft";
    };

    const getStatusLabel = (request) => {
        if (request?.completed === "Y") return "Completed";
        if (request?.approved === "Y") return "Approved";
        if (request?.posted === "Y") return "Pending";
        return "Draft";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "Invalid date";
        }
    };

    const getItemCount = (request) => {
        return request?.MQ_TRAN?.length || 0;
    };

    const getLocation = (request) => {
        return request?.loc_no || request?.cost_center || "N/A";
    };

    // Edit handler - triggered by clicking the card
    const handleEdit = (request) => {
        if (canEditRequest(request)) {
            // Fetch the full request data for editing
            dispatch(
                fetchMaterialRequestById({
                    doc_id: request?.doc_id,
                    doc_no: request?.doc_no,
                })
            ).then(() => {
                navigate("/create");
            });
        } else {
            // If not editable, navigate to view details
            navigate(`/requests/${request?.doc_id}`);
        }
    };

    // Delete handler - triggered by clicking delete icon
    const handleDeleteClick = (request) => {
        setSelectedRequest(request);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedRequest) {
            try {
                await dispatch(
                    fetchDeleteMaterialRequest({
                        doc_id: selectedRequest?.doc_id,
                        doc_no: selectedRequest?.doc_no,
                    })
                ).unwrap();

                // Refresh the list after deletion
                dispatch(fetchMaterialRequests());
            } catch (error) {
                console.error("Failed to delete request:", error);
            }
        }
        setDeleteDialogOpen(false);
        setSelectedRequest(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedRequest(null);
    };

    // Check if request can be edited (only draft/pending requests)
    const canEditRequest = (request) => {
        return request?.approved === "N" && request?.completed === "N";
    };

    // Check if request can be deleted (only draft/pending requests)
    const canDeleteRequest = (request) => {
        return request?.approved === "N" && request?.completed === "N";
    };

    // Get edit icon color based on editability
    const getEditIconColor = (request) => {
        return canEditRequest(request) ? "primary" : "disabled";
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
                <GradientBox sx={{ pt: 3, pb: 4, borderRadius: "0 0 24px 24px" }}>
                    <Container maxWidth="sm">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconButton
                                    sx={{
                                        color: "white",
                                        mr: 2,
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.3)",
                                        },
                                    }}
                                    onClick={() => navigate("/")}
                                >
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
                            <IconButton
                                onClick={handleRefresh}
                                disabled={materialRequestLoading}
                                sx={{
                                    color: "white",
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                    },
                                    "&:disabled": {
                                        opacity: 0.5,
                                    },
                                }}
                            >
                                {materialRequestLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <RefreshIcon />}
                            </IconButton>
                        </Box>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: -2 }}>
                    {/* Search and Filter */}
                    <Card sx={{ padding: "12px 12px 8px", mb: 1.5, borderRadius: 1 }}>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                            <TextField
                                fullWidth
                                placeholder="Search by ID, remarks, or location..."
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
                        {materialRequestLoading && requestData.length === 0 ? (
                            <Card sx={{ p: 4, textAlign: "center", borderRadius: 1 }}>
                                <CircularProgress size={40} />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    Loading requests...
                                </Typography>
                            </Card>
                        ) : getFilteredRequestsByTab().length > 0 ? (
                            getFilteredRequestsByTab().map((request) => (
                                <Card
                                    key={request?.doc_id || request?.doc_no}
                                    sx={{
                                        p: 2,
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                    onClick={() => handleEdit(request)}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Box sx={{ flex: 1, mr: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="600" fontSize="0.95rem">
                                                {request?.doc_no || `RQ-${request?.doc_id}`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontSize="0.875rem">
                                                {request?.remarks || "Material Request"}
                                            </Typography>
                                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                                <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                                    Created: {formatDate(request?.doc_date)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                                    {getItemCount(request)} item{getItemCount(request) !== 1 ? "s" : ""}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                                    Location: {getLocation(request)}
                                                </Typography>
                                                {request?.total_amount && (
                                                    <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                                        ${request?.total_amount}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                                            <StatusChip status={getStatus(request)} label={getStatusLabel(request)} size="small" />
                                            <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                                                {/* Edit Icon */}
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(request);
                                                    }}
                                                    sx={{
                                                        color: getEditIconColor(request) === "primary" ? "#2563eb" : "#9ca3af",
                                                        "&:hover": {
                                                            backgroundColor: getEditIconColor(request) === "primary" ? "#dbeafe" : "transparent",
                                                        },
                                                    }}
                                                    title={canEditRequest(request) ? "Edit Request" : "View Details"}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                {/* Delete Icon - Only show for editable requests */}
                                                {canDeleteRequest(request) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(request);
                                                        }}
                                                        sx={{
                                                            color: "#dc2626",
                                                            "&:hover": {
                                                                backgroundColor: "#fee2e2",
                                                            },
                                                        }}
                                                        title="Delete Request"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            ))
                        ) : (
                            <Card sx={{ p: 4, textAlign: "center", borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {searchQuery ? "No requests match your search" : "No requests found"}
                                </Typography>
                                {!searchQuery && (
                                    <Typography
                                        variant="caption"
                                        color="primary"
                                        sx={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            mt: 1,
                                            display: "block",
                                        }}
                                        onClick={() => navigate("/create")}
                                    >
                                        Create your first request
                                    </Typography>
                                )}
                            </Card>
                        )}
                    </Box>
                </Container>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete request <strong>{selectedRequest?.doc_no || `RQ-${selectedRequest?.doc_id}`}</strong>? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCancel}>Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
};

export default Requests;