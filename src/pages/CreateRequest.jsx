// src/pages/CreateRequest.jsx
import {
    AddCircle as AddCircleIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    DocumentScanner,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
    Inventory as InventoryIcon,
    Restore as RestoreIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import BarcodeScannerModal from "../components/modal/BarcodeScannerModal";
import InsightModal from "../components/modal/InsightModal";
import { GradientBox, GradientButton } from "../components/ui/StyledComponents";
import { useNotification } from "../hooks/useNotification";
import useProductsWithBarcodes from "../hooks/useProductsWithBarcodes";
import { fetchAllMasterData, selectLocations, selectSubLocations } from "../redux/slices/masterDataSlice";
import { fetchUpdateMaterialRequest, resetMaterialRequestDataForCreate, updateMaterialRequestDetails, updateMaterialRequestFields } from "../redux/slices/materialRequestSlice";
import getCurrentDateTimeUTC from "../utils/getCurrentDateTimeUTC";
import getUserDetails from "../utils/getUserDetails";

const CreateRequest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { show } = useNotification();
    const scannerRef = useRef(null);

    const [insightModalOpen, setInsightModalOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
    const [scanningStatus, setScanningStatus] = useState("idle"); // idle, scanning, success, error
    const [scanError, setScanError] = useState("");

    const { findByBarcode } = useProductsWithBarcodes(barcodeScannerOpen);

    // Get data from materialRequestSlice
    const { materialRequestDataForCreate, materialRequestCreateLoader } = useSelector((state) => state.materialRequest);

    const mrHdr = materialRequestDataForCreate.master_data;

    // Get master data from Redux store
    const locations = useSelector(selectLocations);
    const subLocations = useSelector(selectSubLocations);

    // Check if we're in edit mode
    const isEditMode = !!materialRequestDataForCreate.master_data.doc_id;

    // Format date for input fields (convert from "2025-11-05T00:00:00Z" to "2025-11-05")
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    // Initialize form data and fetch master data when component mounts
    useEffect(() => {
        if (!isEditMode) {
            dispatch(resetMaterialRequestDataForCreate());
        }
        // Fetch all master data when component mounts
        dispatch(fetchAllMasterData());
    }, [dispatch, isEditMode]);

    // Reset scanning state when scanner opens/closes
    useEffect(() => {
        if (barcodeScannerOpen) {
            setScanningStatus("idle");
            setScanError("");
        }
    }, [barcodeScannerOpen]);

    // Set default dates for new requests
    const today = new Date().toISOString().split("T")[0];
    const requestedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Handle form field changes
    const handleFieldChange = (field, value) => {
        // If location is changed, reset sub-location
        if (field === "loc_no") {
            dispatch(
                updateMaterialRequestFields({
                    [field]: value,
                    sub_loc_code: "", // Reset sub-location when location changes
                })
            );
        } else {
            dispatch(updateMaterialRequestFields({ [field]: value }));
        }
    };

    // Switch to create mode
    const handleSwitchToCreateMode = () => {
        dispatch(resetMaterialRequestDataForCreate());
    };

    // Get filtered sub-locations based on selected location
    const getFilteredSubLocations = () => {
        const selectedLocation = materialRequestDataForCreate.master_data.loc_no;
        if (!selectedLocation) return subLocations;

        return subLocations.filter((subLocation) => subLocation.loc_code === selectedLocation || subLocation.master_location_id === selectedLocation);
    };

    // Get the next available line number - FIXED LOGIC (like admin app)
    const getNextLineNumber = () => {
        const rows = materialRequestDataForCreate.details[0].data;
        if (!rows || rows.length === 0) return 1;

        // Find the maximum line number from existing items (like admin app logic)
        const lastLineNumber = rows.length > 0 ? Math.max(...rows.map((row) => row.line_number || 0)) : 0;

        return parseInt(lastLineNumber) + 1;
    };

    // Handle adding multiple items
    const handleAddItems = (itemsArray) => {
        console.log(itemsArray, "itma");
        let nextLineNumber = getNextLineNumber();

        const newItems = itemsArray.map((itemData, index) => {
            const itemName = itemData.name || itemData.item_desc || "Unknown Item";
            const itemCode = itemData.code || itemData.item_code || "UNKNOWN";
            const unitPrice = itemData.price1 || itemData?.price || 0;

            return {
                line_number: nextLineNumber + index, // Sequential line numbers starting from next available
                item_code: itemCode,
                item_desc: itemName,
                pack_id: "",
                item_type: "MATERIAL",
                pack_qty: 1,
                unit_price: unitPrice,
                total_amount: unitPrice,
                tax_amount: 0,
                net_amount: unitPrice,
                _upd: "C", // Create operation for new items
                cost_center: materialRequestDataForCreate.master_data.cost_center || "001",
                created_date: getCurrentDateTimeUTC(),
                created_user: getUserDetails()?.user_name || "",
                tran_id: "",
                doc_id: materialRequestDataForCreate.master_data.doc_id || "",
                doc_no: materialRequestDataForCreate.master_data.doc_no || "",
                doc_type: "MQ",
                line_type: "Detail",
                updTimeStamp: getCurrentDateTimeUTC(),
                updated_date: getCurrentDateTimeUTC(),
                updated_user: getUserDetails()?.user_name || "",
                client_id: materialRequestDataForCreate.master_data.client_id,
            };
        });

        const updatedItems = [...materialRequestDataForCreate.details[0].data, ...newItems];
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Handle removing items (NO LINE NUMBER RECALCULATION)
    const handleRemoveItem = (index) => {
        const itemToRemove = materialRequestDataForCreate.details[0].data[index];
        let updatedItems;

        if (itemToRemove._upd === "C" && !itemToRemove.tran_id) {
            // If it's a newly created item (not saved yet), just remove it
            updatedItems = materialRequestDataForCreate.details[0].data.filter((_, i) => i !== index);
        } else {
            // If it's an existing item, mark it for deletion
            updatedItems = materialRequestDataForCreate.details[0].data.map((item, i) => (i === index ? { ...item, _upd: "D" } : item));
        }

        dispatch(updateMaterialRequestDetails(updatedItems));

        // Remove from expanded items state
        const newExpandedItems = { ...expandedItems };
        delete newExpandedItems[index];
        setExpandedItems(newExpandedItems);
    };

    // Handle restoring deleted items (NO LINE NUMBER RECALCULATION)
    const handleRestoreItem = (index) => {
        const updatedItems = materialRequestDataForCreate.details[0].data.map((item, i) => (i === index ? { ...item, _upd: "U" } : item));
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Handle quantity changes
    const handleQuantityChange = (index, quantity) => {
        const updatedItems = [...materialRequestDataForCreate.details[0].data];
        const packQty = parseInt(quantity) || 1;
        const currentItem = updatedItems[index];

        updatedItems[index] = {
            ...currentItem,
            pack_qty: packQty,
            total_amount: (currentItem.unit_price || 0) * packQty,
            net_amount: (currentItem.unit_price || 0) * packQty,
            _upd: currentItem._upd === "C" ? "C" : "U", // Keep as Create or mark as Update
        };
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Handle unit price changes
    const handleUnitPriceChange = (index, unitPrice) => {
        const updatedItems = [...materialRequestDataForCreate.details[0].data];
        const price = parseFloat(unitPrice) || 0;
        const currentItem = updatedItems[index];

        updatedItems[index] = {
            ...currentItem,
            unit_price: price,
            total_amount: price * (currentItem.pack_qty || 1),
            net_amount: price * (currentItem.pack_qty || 1),
            _upd: currentItem._upd === "C" ? "C" : "U", // Keep as Create or mark as Update
        };
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Toggle item expansion (local state only)
    const toggleItemExpand = (index) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Check if item is expanded
    const isItemExpanded = (index) => {
        return !!expandedItems[index];
    };

    // Calculate total amount
    const calculateTotalAmount = () => {
        return materialRequestDataForCreate.details[0].data
            .filter((item) => item._upd !== "D") // Exclude deleted items from total
            .reduce((total, item) => total + (item.total_amount || 0), 0);
    };

    // Get deleted items for restoration
    const getDeletedItems = () => {
        return materialRequestDataForCreate.details[0].data
            .filter((item) => item._upd === "D")
            .map((item, index) => ({
                ...item,
                originalIndex: materialRequestDataForCreate.details[0].data.indexOf(item),
            }));
    };

    // Prepare data for API submission
    const prepareDataForSubmission = (isDraft = false) => {
        const itemsForApi = materialRequestDataForCreate.details[0].data.map((item) => {
            // Create a clean copy without any local-only fields
            const { expanded, originalIndex, ...cleanItem } = item;
            return cleanItem;
        });

        const baseData = {
            ...materialRequestDataForCreate,
            master_data: {
                ...materialRequestDataForCreate.master_data,
                doc_date: mrHdr?.doc_date || today,
                doc_req_date: mrHdr?.doc_req_date || requestedDate,
                total_amount: calculateTotalAmount(),
                total_net_amount: calculateTotalAmount(),
                total_tax_amount: 0,
                posted: isDraft ? "N" : "Y",
                updated_date: getCurrentDateTimeUTC(),
                updated_user: getUserDetails()?.user_name || "",
                updTimeStamp: getCurrentDateTimeUTC(),
            },
            details: [
                {
                    table: "MQ_TRAN",
                    data: itemsForApi,
                },
            ],
        };

        // For new requests, ensure operation is "create"
        if (!isEditMode) {
            baseData.operation = "create";
            baseData.master_data.created_date = getCurrentDateTimeUTC();
            baseData.master_data.created_user = getUserDetails()?.user_name || "";
        }

        return baseData;
    };

    // Handle form submission
    const handleSubmit = async (isDraft = false) => {
        try {
            if (!mrHdr?.loc_code || !mrHdr?.sub_loc_code) {
                show("Pls fill the required feilds", "error");
                return;
            }
            const submissionData = prepareDataForSubmission(isDraft);
            const response = await dispatch(fetchUpdateMaterialRequest(submissionData)).unwrap();
            if (response?.success) {
                dispatch(resetMaterialRequestDataForCreate());
                show(`${isEditMode ? "Material request updated successfully!" : "Material request submitted successfully!"}`, "success");
                navigate("/requests");
            }
        } catch (error) {
            console.error("Failed to submit request:", error);
        }
    };

    const handleScanned = async (barcode) => {
        const item = findByBarcode(barcode);

        if (!item) {
            show("Item not found for this barcode", "error");
            return;
        }

        const itemData = {
            item_code: item.item_code,
            item_desc: item.item_desc,
            price1: item.price,
        };

        handleAddItems([itemData]);
        show("Item added successfully!", "success");
        setBarcodeScannerOpen(false);
    };

    const handleScannerError = (err) => {
        console.log("Scanner error (likely non-critical):", err);

        // Only show errors for actual permission denials
        if (err?.name === "NotAllowedError") {
            setScanError("Camera access denied. Please allow camera permissions.");
            setScanningStatus("error");
            show("Camera access denied. Please allow camera permissions.", "error");
        }
    };

    const items = materialRequestDataForCreate.details[0].data;
    const deletedItems = getDeletedItems();
    const activeItems = items.filter((item) => item._upd !== "D");
    const filteredSubLocations = getFilteredSubLocations();

    return (
        <AppLayout>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
                    pb: 10,
                }}
            >
                {/* Header */}
                <GradientBox sx={{ pt: 3, pb: 3.5, borderRadius: "0 0 24px 24px" }}>
                    <Container maxWidth="sm">
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <IconButton
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderRadius: "50%",
                                    }}
                                    onClick={() => navigate("/requests")}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {isEditMode ? "Edit Material Request" : "New Material Request"}
                                        {isEditMode && (
                                            <Typography variant="caption" sx={{ ml: 1, opacity: 0.8 }}>
                                                ({materialRequestDataForCreate.master_data.doc_no})
                                            </Typography>
                                        )}
                                    </Typography>
                                    {isEditMode && (
                                        <Button
                                            size="small"
                                            startIcon={<AddCircleIcon />}
                                            onClick={handleSwitchToCreateMode}
                                            sx={{
                                                color: "white",
                                                mt: 0.5,
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            Switch to New Request
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: -2 }}>
                    {/* Request Details */}
                    <Card sx={{ padding: "1rem", mb: 3 }}>
                        <Typography variant="h6" fontWeight="600" sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                            {isEditMode ? <EditIcon sx={{ color: "#4361ee", mr: 1 }} /> : <DescriptionIcon sx={{ color: "#4361ee", mr: 1 }} />}
                            Request Details {isEditMode && "(Editing)"}
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, padding: "0rem 0.2rem" }}>
                            {isEditMode && <TextField InputLabelProps={{ shrink: true }} label="Document Number" value={materialRequestDataForCreate.master_data.doc_no || ""} InputProps={{ readOnly: true }} fullWidth />}

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                label="Date"
                                type="date"
                                value={formatDateForInput(materialRequestDataForCreate.master_data.doc_date) || today}
                                onChange={(e) => handleFieldChange("doc_date", e.target.value)}
                                fullWidth
                                required
                            />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                label="Location"
                                select
                                value={materialRequestDataForCreate.master_data.loc_no || ""}
                                onChange={(e) => handleFieldChange("loc_no", e.target.value)}
                                fullWidth
                                required
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Location
                                </MenuItem>
                                {locations.map((location) => (
                                    <MenuItem key={location.loc_code} value={location.loc_code}>
                                        {location.loc_name || location.loc_code}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                label="Sub-location"
                                select
                                value={materialRequestDataForCreate.master_data.sub_loc_code || ""}
                                onChange={(e) => handleFieldChange("sub_loc_code", e.target.value)}
                                fullWidth
                                disabled={!materialRequestDataForCreate.master_data.loc_no}
                                required
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Sub-location
                                </MenuItem>
                                {filteredSubLocations.map((subLocation) => (
                                    <MenuItem key={subLocation.sub_loc_code} value={subLocation.sub_loc_code}>
                                        {subLocation.sub_loc_name || subLocation.sub_loc_code}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                label="Requested Date"
                                type="date"
                                value={formatDateForInput(materialRequestDataForCreate.master_data.doc_req_date) || requestedDate}
                                onChange={(e) => handleFieldChange("doc_req_date", e.target.value)}
                                fullWidth
                                required
                            />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                label="Remarks"
                                multiline
                                rows={1}
                                value={materialRequestDataForCreate.master_data.remarks || ""}
                                onChange={(e) => handleFieldChange("remarks", e.target.value)}
                                placeholder="Enter any additional remarks..."
                                fullWidth
                            />
                        </Box>
                    </Card>

                    {/* Items Section */}
                    <Card sx={{ p: 2, mb: 2, borderRadius: "12px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: "0.7rem", width: "100%" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant="subtitle1" fontWeight="600" sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
                                        <InventoryIcon sx={{ color: "#4361ee", mr: 1, fontSize: 18 }} />
                                        Request Items ({activeItems.length})
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DocumentScanner sx={{ fontSize: 16, transform: "rotate(90deg)", transition: "transform 0.3s ease" }} />}
                                        onClick={() => setBarcodeScannerOpen(true)}
                                        sx={{
                                            backgroundColor: "#e0f7fa",
                                            color: "#00796b",
                                            borderColor: "#b2ebf2",
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            py: 0.75,
                                            px: 1.75,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: "#b2ebf2",
                                                borderColor: "#80deea",
                                            },
                                        }}
                                    >
                                        Scan Barcode
                                    </Button>
                                </Box>
                                {isEditMode && deletedItems.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<RestoreIcon sx={{ fontSize: 16 }} />}
                                        onClick={() => setRestoreDialogOpen(true)}
                                        sx={{
                                            backgroundColor: "#f0fdf4",
                                            color: "#16a34a",
                                            borderColor: "#bbf7d0",
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            py: 0.75,
                                            px: 1.75,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            minWidth: "auto",
                                            "&:hover": {
                                                backgroundColor: "#dcfce7",
                                                borderColor: "#4ade80",
                                                transform: "translateY(-1px)",
                                                boxShadow: "0 4px 10px rgba(22, 163, 74, 0.15)",
                                            },
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        Restore
                                        {deletedItems.length > 0 && (
                                            <Typography variant="caption" color="error" sx={{ ml: "0.2rem" }}>
                                                ({deletedItems.length})
                                            </Typography>
                                        )}
                                    </Button>
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1.5,
                                    width: "100%",
                                }}
                            >
                                <Typography variant="body2" fontWeight="600" color="primary" sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                                    Total: ${calculateTotalAmount().toFixed(2)}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        marginLeft: "auto",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<InventoryIcon sx={{ fontSize: 16 }} />}
                                        onClick={() => setInsightModalOpen(true)}
                                        sx={{
                                            backgroundColor: "#f3e8ff",
                                            color: "#9333ea",
                                            borderColor: "#e9d5ff",
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            py: 0.75,
                                            px: 1.75,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: "#ede9fe",
                                                borderColor: "#c084fc",
                                            },
                                        }}
                                    >
                                        Insight 360
                                    </Button>

                                    <Button
                                        color="primary"
                                        startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                                        onClick={() => setInsightModalOpen(true)}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            py: 0.75,
                                            px: 1.75,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            minWidth: "auto",
                                        }}
                                    >
                                        Add Items
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Items List */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {activeItems.map((item, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: "12px",
                                        borderColor: item._upd === "U" ? "#f59e0b" : "#e2e8f0",
                                        backgroundColor: item._upd === "U" ? "#fffbeb" : "white",
                                    }}
                                >
                                    <CardContent sx={{ p: "12px !important" }}>
                                        {/* Item Header */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                gap: 1,
                                            }}
                                            onClick={() => toggleItemExpand(index)}
                                        >
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    backgroundColor: item._upd === "U" ? "#fef3c7" : "#dbeafe",
                                                    borderRadius: "6px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <InventoryIcon sx={{ color: item._upd === "U" ? "#d97706" : "#2563eb", fontSize: 16 }} />
                                            </Box>

                                            <Box
                                                sx={{
                                                    flexGrow: 1,
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr auto auto",
                                                    gap: 1,
                                                    alignItems: "center",
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="body2" fontWeight="600" sx={{ fontSize: "0.8rem", lineHeight: 1.2 }}>
                                                        {item.item_desc}
                                                        {item._upd === "U" && <Chip label="Modified" size="small" color="warning" sx={{ ml: 0.5, height: 20, fontSize: "0.6rem", display: !isEditMode && "none" }} />}
                                                        {item._upd === "C" && <Chip label="New" size="small" color="success" sx={{ ml: 0.5, height: 20, fontSize: "0.6rem", display: !isEditMode && "none" }} />}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                                                        {item.item_code} • Line #{item.line_number}
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        color: "#475569",
                                                        px: 1,
                                                        py: 0.25,
                                                        borderRadius: "4px",
                                                        fontSize: "0.8rem",
                                                        fontWeight: 600,
                                                        minWidth: "40px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {item.pack_qty}
                                                </Box>

                                                <IconButton
                                                    color="error"
                                                    sx={{ padding: 1 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveItem(index);
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Box>

                                            <IconButton size="small" sx={{ padding: 0.5, ml: 0.5 }}>
                                                <ExpandMoreIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        transform: isItemExpanded(index) ? "rotate(180deg)" : "none",
                                                        transition: "transform 0.2s ease",
                                                    }}
                                                />
                                            </IconButton>
                                        </Box>

                                        {/* Expanded Content */}
                                        <Collapse in={isItemExpanded(index)}>
                                            <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                                    <TextField
                                                        InputLabelProps={{ shrink: true }}
                                                        label="Item Code"
                                                        value={item.item_code}
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                            sx: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                    />
                                                    <TextField
                                                        InputLabelProps={{ shrink: true }}
                                                        label="Line Number"
                                                        value={item.line_number}
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                            sx: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                                    <TextField
                                                        InputLabelProps={{ shrink: true }}
                                                        label="Quantity"
                                                        type="number"
                                                        value={item.pack_qty}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        size="small"
                                                        inputProps={{
                                                            min: 1,
                                                            style: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                    />
                                                    <TextField
                                                        InputLabelProps={{ shrink: true }}
                                                        label="Unit Price"
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                                                        size="small"
                                                        inputProps={{
                                                            min: 0,
                                                            step: 0.01,
                                                            style: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                    />
                                                </Box>

                                                <TextField
                                                    InputLabelProps={{ shrink: true }}
                                                    label="Total Amount"
                                                    value={(item.unit_price * item.pack_qty).toFixed(2)}
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { fontSize: "0.8rem", height: "32px" },
                                                    }}
                                                />
                                            </Box>
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            ))}

                            {activeItems.length === 0 && (
                                <Card sx={{ p: 3, textAlign: "center", border: "2px dashed #e2e8f0" }}>
                                    <InventoryIcon sx={{ color: "#cbd5e1", fontSize: 40, mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        No items added yet
                                    </Typography>
                                    <Button variant="text" onClick={() => setInsightModalOpen(true)} sx={{ mt: 1 }}>
                                        Add your first item
                                    </Button>
                                </Card>
                            )}
                        </Box>
                    </Card>

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<SaveIcon />}
                            fullWidth
                            disabled={materialRequestCreateLoader}
                            onClick={() => handleSubmit(true)}
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                fontWeight: 600,
                                borderColor: "#d1d5db",
                                "&:hover": {
                                    borderColor: "#9ca3af",
                                    backgroundColor: "#f9fafb",
                                },
                            }}
                        >
                            {materialRequestCreateLoader ? "Saving..." : "Save Draft"}
                        </Button>
                        <GradientButton fullWidth disabled={materialRequestCreateLoader || activeItems.length === 0} onClick={() => handleSubmit(false)} sx={{ py: 1.5 }}>
                            {materialRequestCreateLoader ? "Submitting..." : isEditMode ? "Update Request" : "Submit Request"}
                        </GradientButton>
                    </Box>
                </Container>

                {/* Insight Modal */}
                <InsightModal open={insightModalOpen} onClose={() => setInsightModalOpen(false)} onSelectItems={handleAddItems} />

                {/* Restore Deleted Items Dialog */}
                <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <RestoreIcon color="primary" />
                            Restore Deleted Items
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select items to restore from the deleted list:
                        </Typography>
                        <List>
                            {deletedItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => handleRestoreItem(item.originalIndex)} color="primary">
                                            <RestoreIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon>
                                        <InventoryIcon color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.item_desc}
                                        secondary={
                                            <Box>
                                                <Typography variant="caption" display="block">
                                                    {item.item_code} • Line #{item.line_number}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Qty: {item.pack_qty} • ${item.unit_price}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRestoreDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <BarcodeScannerModal
                barcodeScannerOpen={barcodeScannerOpen}
                setBarcodeScannerOpen={setBarcodeScannerOpen}
                scanningStatus={scanningStatus}
                scanError={scanError}
                scannerRef={scannerRef}
                handleScanned={handleScanned}
                handleScannerError={handleScannerError}
            />
        </AppLayout>
    );
};

export default CreateRequest;
