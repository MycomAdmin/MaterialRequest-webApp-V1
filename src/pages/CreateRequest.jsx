// src/pages/CreateRequest.jsx
import { Add as AddIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Description as DescriptionIcon, ExpandMore as ExpandMoreIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Collapse, Container, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InsightModal from "../components/InsightModal";
import { GradientBox, GradientButton } from "../components/ui/StyledComponents";
import AppLayout from "../components/layout/AppLayout";

const CreateRequest = () => {
    const navigate = useNavigate();
    const [insightModalOpen, setInsightModalOpen] = useState(false);
    const [items, setItems] = useState([
        {
            id: 1,
            name: "Electrical Wire 2.5mm",
            code: "MAT-ELEC-001",
            quantity: 1,
            expanded: false,
        },
    ]);

    const handleAddItem = (name, code) => {
        const newItem = {
            id: Date.now(),
            name,
            code,
            quantity: 1,
            expanded: false,
        };
        setItems([...items, newItem]);
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const toggleItemExpand = (id) => {
        setItems(items.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : { ...item, expanded: false })));
    };

    const handleQuantityChange = (id, quantity) => {
        setItems(items.map((item) => (item.id === id ? { ...item, quantity: parseInt(quantity) || 1 } : item)));
    };

    // Set default dates
    const today = new Date().toISOString().split("T")[0];
    const requestedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

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
            <GradientBox sx={{ pt: 3, pb: 2, borderRadius: "0 0 24px 24px" }}>
                <Container maxWidth="sm">
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                        <IconButton sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "50%" }} onClick={() => navigate("/")}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">
                            New Material Request
                        </Typography>
                        <Box width={40} /> {/* Spacer for alignment */}
                    </Box>
                </Container>
            </GradientBox>

            <Container maxWidth="sm" sx={{ mt: 1.5 }}>
                {/* Request Details */}
                <Card sx={{ padding: "1rem", mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                        <DescriptionIcon sx={{ color: "#4361ee", mr: 1 }} />
                        Request Details
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, padding: "0rem 0.2rem" }}>
                        <TextField label="Date" type="date" defaultValue={today} fullWidth />

                        <TextField label="Location" select defaultValue="Main Warehouse" fullWidth>
                            <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                            <MenuItem value="Construction Site A">Construction Site A</MenuItem>
                            <MenuItem value="Construction Site B">Construction Site B</MenuItem>
                            <MenuItem value="Office Building">Office Building</MenuItem>
                        </TextField>

                        <TextField label="Sub-location" select defaultValue="Storage Area 1" fullWidth>
                            <MenuItem value="Storage Area 1">Storage Area 1</MenuItem>
                            <MenuItem value="Storage Area 2">Storage Area 2</MenuItem>
                            <MenuItem value="Tool Room">Tool Room</MenuItem>
                            <MenuItem value="Electrical Room">Electrical Room</MenuItem>
                        </TextField>

                        <TextField label="Requested Date" type="date" defaultValue={requestedDate} fullWidth />
                    </Box>
                </Card>

                {/* Items Section */}
                <Card sx={{ p: 2, mb: 2, borderRadius: "12px" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: "0.7rem" }}>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
                            <InventoryIcon sx={{ color: "#4361ee", mr: 1, fontSize: 18 }} />
                            Request Items
                        </Typography>

                        <Box sx={{ display: "flex", gap: 0.5, marginLeft: "auto" }}>
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

                    {/* Items List */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {items.map((item) => (
                            <Card key={item.id} variant="outlined" sx={{ borderRadius: "12px" }}>
                                <CardContent sx={{ p: "12px !important" }}>
                                    {/* Item Header */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            gap: 1,
                                        }}
                                        onClick={() => toggleItemExpand(item.id)}
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
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                                                    {item.code}
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
                                                {item.quantity}
                                            </Box>

                                            <IconButton
                                                color="error"
                                                sx={{ padding: 1 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveItem(item.id);
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
                                                    label="Barcode"
                                                    value={item.code}
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
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                    size="small"
                                                    inputProps={{
                                                        min: 1,
                                                        style: { fontSize: "0.8rem", height: "32px" },
                                                    }}
                                                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                                                />
                                            </Box>

                                            <TextField
                                                label="Notes"
                                                multiline
                                                rows={1}
                                                placeholder="Add notes..."
                                                size="small"
                                                InputProps={{
                                                    sx: { fontSize: "0.8rem" },
                                                }}
                                                InputLabelProps={{ sx: { fontSize: "0.7rem" } }}
                                            />

                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: "0.8rem",
                                                        py: 0.25,
                                                        px: 1,
                                                    }}
                                                >
                                                    Scan
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: "0.8rem",
                                                        py: 0.25,
                                                        px: 1,
                                                    }}
                                                >
                                                    Image
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Card>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        fullWidth
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
                        Save Draft
                    </Button>
                    <GradientButton
                        fullWidth
                        sx={{ py: 1.5 }}
                        onClick={() => {
                            // Handle submit
                            navigate("/");
                        }}
                    >
                        Submit Request
                    </GradientButton>
                </Box>
            </Container>

            {/* Insight Modal */}
            <InsightModal open={insightModalOpen} onClose={() => setInsightModalOpen(false)} onSelectItem={handleAddItem} />
        </Box>
      </AppLayout>

    );
};

export default CreateRequest;
