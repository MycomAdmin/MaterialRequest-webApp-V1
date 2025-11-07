// src/components/InsightModal.jsx
import { ChevronRight as ChevronRightIcon, Close as CloseIcon, StorageRounded } from "@mui/icons-material";
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { GradientButton } from "./ui/StyledComponents";

const InsightModal = ({ open, onClose, onSelectItem }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const sampleItems = [
        {
            id: 1,
            name: "Electrical Wire 2.5mm",
            code: "MAT-ELEC-001",
            stock: "250m",
            category: "Electrical",
        },
        {
            id: 2,
            name: "PVC Pipe 1-inch",
            code: "MAT-PIPE-015",
            stock: "45 units",
            category: "Plumbing",
        },
        {
            id: 3,
            name: "Hammer Drill",
            code: "MAT-TOOL-203",
            stock: "8 units",
            category: "Tools",
        },
        {
            id: 4,
            name: "Safety Helmet",
            code: "MAT-SAFE-042",
            stock: "32 units",
            category: "Safety",
        },
        {
            id: 5,
            name: "Concrete Mix",
            code: "MAT-CONC-108",
            stock: "15 bags",
            category: "Construction",
        },
    ];

    const filteredItems = sampleItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase()));

    const tabs = [
        { id: "all", label: "All Items" },
        { id: "recently-used", label: "Recent" },
        { id: "favorites", label: "Favorites" },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    maxWidth: 480,
                    maxHeight: "85vh",
                },
            }}
        >
            <DialogTitle sx={{ pb: 1.5, pt: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: "1.1rem" }}>
                        <StorageRounded sx={{ color: "#9333ea", mr: 1.5, fontSize: 22, fontWeight: "800" }} />
                        Insight 360 Data
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ padding: 0.75 }}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ paddingTop: "0.6rem" }}>
                    <TextField
                        fullWidth
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { fontSize: "0.9rem", height: "42px" },
                        }}
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
                    {tabs.map((tab) => (
                        <Chip
                            key={tab.id}
                            label={tab.label}
                            variant={activeTab === tab.id ? "filled" : "outlined"}
                            onClick={() => setActiveTab(tab.id)}
                            size="small"
                            sx={{
                                flex: 1,
                                fontSize: "0.8rem",
                                height: "32px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: activeTab === tab.id ? "#9333ea" : "#F3F4F6",
                                color: activeTab === tab.id ? "white" : "inherit",
                                "&:hover": {
                                    backgroundColor: activeTab === tab.id ? "#9333ea" : "#f3f4f6",
                                },
                            }}
                        />
                    ))}
                </Box>

                <List sx={{ maxHeight: 350, overflow: "auto", py: 0 }}>
                    {filteredItems.map((item) => (
                        <ListItem
                            key={item.id}
                            sx={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                mb: 1,
                                py: 1,
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "#f8fafc",
                                    borderColor: "#cbd5e1",
                                },
                            }}
                            onClick={() => onSelectItem(item.name, item.code)}
                        >
                            {/* <ListItemIcon sx={{ minWidth: 36 }}>
                <InventoryIcon color="primary" sx={{ fontSize: 20 }} />
              </ListItemIcon> */}
                            <ListItemText
                                primary={
                                    <Typography variant="body2" fontWeight="600" sx={{ fontSize: "0.9rem", lineHeight: 1.3, mb: 0 }}>
                                        {item.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        {item.code} • Stock: {item.stock}
                                    </Typography>
                                }
                                sx={{ my: 0 }}
                            />
                            <ChevronRightIcon color="action" sx={{ fontSize: 20, ml: 1 }} />
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onClose}
                        sx={{
                            py: 1,
                            borderRadius: "8px",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            borderColor: "#d1d5db",
                            "&:hover": {
                                borderColor: "#9ca3af",
                                backgroundColor: "#f9fafb",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <GradientButton
                        fullWidth
                        sx={{
                            py: 1,
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                        }}
                        onClick={() => {
                            // Handle import all
                            onClose();
                        }}
                    >
                        Import Selected
                    </GradientButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default InsightModal;
