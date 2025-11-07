// src/pages/CreateRequest.jsx
import { 
  Add as AddIcon, 
  ArrowBack as ArrowBackIcon, 
  Delete as DeleteIcon, 
  Description as DescriptionIcon, 
  ExpandMore as ExpandMoreIcon, 
  Inventory as InventoryIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Collapse, 
  Container, 
  IconButton, 
  MenuItem, 
  TextField, 
  Typography,
  Snackbar,
  Alert 
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InsightModal from "../components/InsightModal";
import { GradientBox, GradientButton } from "../components/ui/StyledComponents";
import AppLayout from "../components/layout/AppLayout";
import { 
  updateMaterialRequestFields, 
  updateMaterialRequestDetails, 
  resetMaterialRequestDataForCreate,
  fetchUpdateMaterialRequest 
} from "../redux/slices/materialRequestSlice";
import getCurrentDateTimeUTC from "../utils/getCurrentDateTimeUTC";
import getUserDetails from "../utils/getUserDetails";

const CreateRequest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [insightModalOpen, setInsightModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Get data from materialRequestSlice
    const { 
        materialRequestDataForCreate,
        materialRequestCreateLoader 
    } = useSelector((state) => state.materialRequest);

    // Initialize form data
    useEffect(() => {
        dispatch(resetMaterialRequestDataForCreate());
    }, [dispatch]);

    // Set default dates
    const today = new Date().toISOString().split("T")[0];
    const requestedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Handle form field changes
    const handleFieldChange = (field, value) => {
        dispatch(updateMaterialRequestFields({ [field]: value }));
    };

    // Handle adding items from InsightModal
    const handleAddItem = (name, code) => {
        const newItem = {
            line_number: (materialRequestDataForCreate.details[0].data.length + 1),
            item_code: code,
            item_desc: name,
            pack_id: "",
            item_type: "MATERIAL",
            pack_qty: 1,
            unit_price: 0,
            total_amount: 0,
            tax_amount: 0,
            net_amount: 0,
            _upd: "C",
            cost_center: materialRequestDataForCreate.master_data.cost_center || "001",
            created_date: getCurrentDateTimeUTC(),
            created_user: getUserDetails()?.user_name || "",
            tran_id: "",
            doc_id: "",
            doc_no: "",
            doc_type: "MQ",
            line_type: "Detail",
            updTimeStamp: getCurrentDateTimeUTC(),
            updated_date: getCurrentDateTimeUTC(),
            updated_user: getUserDetails()?.user_name || "",
            client_id: materialRequestDataForCreate.master_data.client_id
        };

        const updatedItems = [...materialRequestDataForCreate.details[0].data, newItem];
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Handle removing items
    const handleRemoveItem = (index) => {
        const updatedItems = materialRequestDataForCreate.details[0].data.filter((_, i) => i !== index);
        // Update line numbers
        const renumberedItems = updatedItems.map((item, idx) => ({
            ...item,
            line_number: idx + 1
        }));
        dispatch(updateMaterialRequestDetails(renumberedItems));
    };

    // Handle quantity changes
    const handleQuantityChange = (index, quantity) => {
        const updatedItems = [...materialRequestDataForCreate.details[0].data];
        const packQty = parseInt(quantity) || 1;
        updatedItems[index] = {
            ...updatedItems[index],
            pack_qty: packQty,
            total_amount: (updatedItems[index].unit_price || 0) * packQty,
            net_amount: (updatedItems[index].unit_price || 0) * packQty
        };
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Handle unit price changes
    const handleUnitPriceChange = (index, unitPrice) => {
        const updatedItems = [...materialRequestDataForCreate.details[0].data];
        const price = parseFloat(unitPrice) || 0;
        updatedItems[index] = {
            ...updatedItems[index],
            unit_price: price,
            total_amount: price * (updatedItems[index].pack_qty || 1),
            net_amount: price * (updatedItems[index].pack_qty || 1)
        };
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    // Calculate total amount
    const calculateTotalAmount = () => {
        return materialRequestDataForCreate.details[0].data.reduce((total, item) => total + (item.total_amount || 0), 0);
    };

    // Handle form submission
    const handleSubmit = async (isDraft = false) => {
        try {
            // Update totals before submission
            const totalAmount = calculateTotalAmount();
            const updatedData = {
                ...materialRequestDataForCreate,
                master_data: {
                    ...materialRequestDataForCreate.master_data,
                    total_amount: totalAmount,
                    total_net_amount: totalAmount,
                    total_tax_amount: 0,
                    posted: isDraft ? "N" : "Y"
                }
            };

            await dispatch(fetchUpdateMaterialRequest(updatedData)).unwrap();
            
            setShowSuccess(true);
            setTimeout(() => {
                navigate("/requests");
            }, 1500);
        } catch (error) {
            console.error("Failed to submit request:", error);
        }
    };

    // Toggle item expansion
    const toggleItemExpand = (index) => {
        const updatedItems = materialRequestDataForCreate.details[0].data.map((item, i) => ({
            ...item,
            expanded: i === index ? !item.expanded : false
        }));
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    const items = materialRequestDataForCreate.details[0].data;

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
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                            <IconButton 
                                sx={{ 
                                    color: "white", 
                                    backgroundColor: "rgba(255,255,255,0.2)", 
                                    borderRadius: "50%" 
                                }} 
                                onClick={() => navigate("/requests")}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" fontWeight="bold">
                                New Material Request
                            </Typography>
                            <Box width={40} /> {/* Spacer for alignment */}
                        </Box>
                    </Container>
                </GradientBox>

                <Container maxWidth="sm" sx={{ mt: -2 }}>
                    {/* Request Details */}
                    <Card sx={{ padding: "1rem", mb: 3 }}>
                        <Typography variant="h6" fontWeight="600" sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                            <DescriptionIcon sx={{ color: "#4361ee", mr: 1 }} />
                            Request Details
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, padding: "0rem 0.2rem" }}>
                            <TextField 
                                label="Date" 
                                type="date" 
                                value={materialRequestDataForCreate.master_data.doc_date || today}
                                onChange={(e) => handleFieldChange('doc_date', e.target.value)}
                                fullWidth 
                            />

                            <TextField 
                                label="Location" 
                                select 
                                value={materialRequestDataForCreate.master_data.loc_no || "001"}
                                onChange={(e) => handleFieldChange('loc_no', e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="001">Main Warehouse</MenuItem>
                                <MenuItem value="002">Construction Site A</MenuItem>
                                <MenuItem value="003">Construction Site B</MenuItem>
                                <MenuItem value="004">Office Building</MenuItem>
                            </TextField>

                            <TextField 
                                label="Sub-location" 
                                select 
                                value={materialRequestDataForCreate.master_data.sub_loc_code || "001"}
                                onChange={(e) => handleFieldChange('sub_loc_code', e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="001">Storage Area 1</MenuItem>
                                <MenuItem value="002">Storage Area 2</MenuItem>
                                <MenuItem value="003">Tool Room</MenuItem>
                                <MenuItem value="004">Electrical Room</MenuItem>
                            </TextField>

                            <TextField 
                                label="Cost Center" 
                                select 
                                value={materialRequestDataForCreate.master_data.cost_center || "001"}
                                onChange={(e) => handleFieldChange('cost_center', e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="001">Main Cost Center</MenuItem>
                                <MenuItem value="002">Construction Cost Center</MenuItem>
                                <MenuItem value="003">Office Cost Center</MenuItem>
                            </TextField>

                            <TextField 
                                label="Requested Date" 
                                type="date" 
                                value={materialRequestDataForCreate.master_data.doc_req_date || requestedDate}
                                onChange={(e) => handleFieldChange('doc_req_date', e.target.value)}
                                fullWidth 
                            />

                            <TextField 
                                label="Remarks" 
                                multiline 
                                rows={2}
                                value={materialRequestDataForCreate.master_data.remarks || ""}
                                onChange={(e) => handleFieldChange('remarks', e.target.value)}
                                placeholder="Enter any additional remarks..."
                                fullWidth
                            />
                        </Box>
                    </Card>

                    {/* Items Section */}
                    <Card sx={{ p: 2, mb: 2, borderRadius: "12px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: "0.7rem" }}>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
                                <InventoryIcon sx={{ color: "#4361ee", mr: 1, fontSize: 18 }} />
                                Request Items ({items.length})
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight="600" color="primary">
                                    Total: ${calculateTotalAmount().toFixed(2)}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
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
                                            py: 0.5,
                                            minWidth: "auto",
                                            px: 1.5,
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
                                            py: 0.5,
                                            minWidth: "auto",
                                            px: 1.5,
                                        }}
                                    >
                                        Add Items
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Items List */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {items.map((item, index) => (
                                <Card key={index} variant="outlined" sx={{ borderRadius: "12px" }}>
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
                                                    backgroundColor: "#dbeafe",
                                                    borderRadius: "6px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <InventoryIcon sx={{ color: "#2563eb", fontSize: 16 }} />
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
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                                                        {item.item_code}
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
                                                        transform: item.expanded ? "rotate(180deg)" : "none",
                                                        transition: "transform 0.2s ease",
                                                    }}
                                                />
                                            </IconButton>
                                        </Box>

                                        {/* Expanded Content */}
                                        <Collapse in={item.expanded}>
                                            <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                                    <TextField
                                                        label="Item Code"
                                                        value={item.item_code}
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                            sx: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                        InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                                                    />
                                                    <TextField
                                                        label="Quantity"
                                                        type="number"
                                                        value={item.pack_qty}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        size="small"
                                                        inputProps={{
                                                            min: 1,
                                                            style: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                        InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                                    <TextField
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
                                                        InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                                                    />
                                                    <TextField
                                                        label="Total Amount"
                                                        value={(item.unit_price * item.pack_qty).toFixed(2)}
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                            sx: { fontSize: "0.8rem", height: "32px" },
                                                        }}
                                                        InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                                                    />
                                                </Box>

                                                <TextField
                                                    label="Item Type"
                                                    value={item.item_type}
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { fontSize: "0.8rem" },
                                                    }}
                                                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                                                />
                                            </Box>
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            ))}

                            {items.length === 0 && (
                                <Card sx={{ p: 3, textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                                    <InventoryIcon sx={{ color: '#cbd5e1', fontSize: 40, mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        No items added yet
                                    </Typography>
                                    <Button 
                                        variant="text" 
                                        onClick={() => setInsightModalOpen(true)}
                                        sx={{ mt: 1 }}
                                    >
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
                            {materialRequestCreateLoader ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <GradientButton
                            fullWidth
                            disabled={materialRequestCreateLoader || items.length === 0}
                            onClick={() => handleSubmit(false)}
                            sx={{ py: 1.5 }}
                        >
                            {materialRequestCreateLoader ? 'Submitting...' : 'Submit Request'}
                        </GradientButton>
                    </Box>
                </Container>

                {/* Insight Modal */}
                <InsightModal open={insightModalOpen} onClose={() => setInsightModalOpen(false)} onSelectItem={handleAddItem} />

                {/* Success Snackbar */}
                <Snackbar 
                    open={showSuccess} 
                    autoHideDuration={3000} 
                    onClose={() => setShowSuccess(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" onClose={() => setShowSuccess(false)}>
                        Material request submitted successfully!
                    </Alert>
                </Snackbar>
            </Box>
        </AppLayout>
    );
};

export default CreateRequest;