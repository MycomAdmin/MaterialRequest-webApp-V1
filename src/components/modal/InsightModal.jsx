// src/components/InsightModal.jsx
import {
    QrCode as BarcodeIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    Close as CloseIcon,
    Inventory as InventoryIcon,
    Search as SearchIcon,
    StorageRounded,
} from "@mui/icons-material";
import { Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, List, ListItem, ListItemText, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import useProductsWithBarcodes from "../../hooks/useProductsWithBarcodes";
import { GradientButton } from "../ui/StyledComponents";

const InsightModal = ({ open, onClose, onSelectItems }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedItems, setSelectedItems] = useState([]);

    const { productsWithBarcodes, loading } = useProductsWithBarcodes(open);

    // Apply barcode combination to all products
    const allItemsWithBarcodes = productsWithBarcodes;

    // Filter items based on active tab first
    const getTabFilteredItems = (items) => {
        switch (activeTab) {
            case "barcode":
                return items.filter((item) => item.isBarcodeItem && item.valid === "Y");
            case "products":
                return items.filter((item) => !item.isBarcodeItem);
            default:
                return items;
        }
    };

    // Then apply search filter locally
    const getSearchFilteredItems = (items) => {
        if (!searchQuery.trim()) return items;

        const searchLower = searchQuery.toLowerCase();
        return items.filter((item) => {
            if (!item) return false;

            return (
                item.item_desc?.toLowerCase().includes(searchLower) ||
                item.product_des?.toLowerCase().includes(searchLower) ||
                item.product_id?.toString().toLowerCase().includes(searchLower) ||
                item.product_code?.toLowerCase().includes(searchLower) ||
                item.item_code?.toLowerCase().includes(searchLower) ||
                (item.isBarcodeItem && item.barcode_description?.toLowerCase().includes(searchLower)) ||
                (item.isBarcodeItem && item.barcode_type?.toLowerCase().includes(searchLower))
            );
        });
    };

    // Get final display items by applying both tab and search filters
    const tabFilteredItems = getTabFilteredItems(allItemsWithBarcodes);
    const displayItems = getSearchFilteredItems(tabFilteredItems);

    const tabs = [
        { id: "all", label: "All Items" },
        { id: "barcode", label: "With Barcodes" },
        { id: "products", label: "Products Only" },
    ];

    const handleToggleSelect = (item) => {
        setSelectedItems((prev) => {
            const isSelected = prev.some((selected) => selected.uniqueId === item.uniqueId);

            if (isSelected) {
                return prev.filter((selected) => selected.uniqueId !== item.uniqueId);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleImportSelected = () => {
        if (selectedItems.length > 0) {
            onSelectItems(selectedItems);
        }
        setSelectedItems([]);
        onClose();
    };

    const isItemSelected = (item) => {
        return selectedItems.some((selected) => selected.uniqueId === item.uniqueId);
    };

    const handleSelectAll = () => {
        if (selectedItems.length === displayItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems([...displayItems]);
        }
    };

    const getItemitem_desc = (item) => {
        return item.item_desc || item.product_des || "Unknown Item";
    };

    const getItemitem_code = (item) => {
        return item.item_code || item.product_code || "UNKNOWN";
    };

    const getStockInfo = (item) => {
        if (item.stock !== undefined && item.uom) {
            return `Stock: ${item.stock} ${item.uom}`;
        }
        if (item.item_qty !== undefined && item.uom_code) {
            return `Stock: ${item.item_qty} ${item.uom_code}`;
        }
        return "Stock: N/A";
    };

    const getCategoryInfo = (item) => {
        if (item.isBarcodeItem) {
            const barcodeType = item.barcode_type || "Standard";
            const supplierBarcode = item.is_supplier_barcode === "Y" ? "Supplier" : "";
            return supplierBarcode ? `Barcode - ${barcodeType} (${supplierBarcode})` : `Barcode - ${barcodeType}`;
        }
        return item.category || item.item_type || "General";
    };

    const getUnitPrice = (item) => {
        const price = item.price || item.price1;
        return price ? `$${parseFloat(price).toFixed(2)}` : "Price: N/A";
    };

    const getBarcodeStatusInfo = (item) => {
        if (!item.isBarcodeItem) return null;

        const status = item.valid === "Y" ? "Valid" : "Invalid";
        const isDefault = item.is_default === "Y";

        return {
            status,
            isDefault,
            tooltip: `${status} ${item.barcode_type} barcode${isDefault ? " (Default)" : ""}`,
        };
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    // maxWidth: 500,
                    maxHeight: "90dvh",
                },
            }}
        >
            <DialogTitle sx={{ pb: 1.5, pt: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: "1.1rem" }}>
                        <StorageRounded sx={{ color: "#9333ea", mr: 1.5, fontSize: 22 }} />
                        Select Materials
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ padding: 0.75 }}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 1, pt: 1 }}>
                {/* Search Section */}
                <Box sx={{ paddingTop: "0.6rem" }}>
                    <TextField
                        fullWidth
                        placeholder="Search by product name, code, barcode description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: loading ? (
                                <InputAdornment position="end">
                                    <CircularProgress size={20} />
                                </InputAdornment>
                            ) : searchQuery ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={handleClearSearch}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                            sx: { fontSize: "0.9rem", height: "42px" },
                        }}
                    />
                </Box>

                {/* Tabs Section */}
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
                                backgroundColor: activeTab === tab.id ? "#9333ea" : "#f8fafc",
                                color: activeTab === tab.id ? "white" : "#64748b",
                                borderColor: activeTab === tab.id ? "#9333ea" : "#e2e8f0",
                                "&:hover": {
                                    backgroundColor: activeTab === tab.id ? "#7c3aed" : "#f1f5f9",
                                },
                            }}
                        />
                    ))}
                </Box>

                {/* Selection Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {selectedItems.length} of {displayItems.length} selected
                    </Typography>
                    <Button size="small" onClick={handleSelectAll} disabled={displayItems.length === 0} sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        {selectedItems.length === displayItems.length ? "Deselect All" : "Select All"}
                    </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Materials List */}
                <List sx={{ maxHeight: 350, overflow: "auto", py: 0 }}>
                    {loading && allItemsWithBarcodes.length === 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={30} />
                        </Box>
                    ) : displayItems.length > 0 ? (
                        displayItems.map((item, index) => {
                            const barcodeInfo = getBarcodeStatusInfo(item);

                            return (
                                <ListItem
                                    key={item.uniqueId || index}
                                    sx={{
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        mb: 1,
                                        py: 1.5,
                                        cursor: "pointer",
                                        backgroundColor: isItemSelected(item) ? "#f0f9ff" : "white",
                                        borderColor: isItemSelected(item) ? "#0ea5e9" : "#e2e8f0",
                                        opacity: barcodeInfo && barcodeInfo.status === "Invalid" ? 0.7 : 1,
                                        "&:hover": {
                                            backgroundColor: isItemSelected(item) ? "#e0f2fe" : "#f8fafc",
                                            borderColor: isItemSelected(item) ? "#0ea5e9" : "#cbd5e1",
                                        },
                                    }}
                                    onClick={() => handleToggleSelect(item)}
                                >
                                    {/* Checkbox */}
                                    <Checkbox
                                        checked={isItemSelected(item)}
                                        onChange={() => handleToggleSelect(item)}
                                        onClick={(e) => e.stopPropagation()}
                                        icon={<CheckBoxOutlineBlankIcon />}
                                        checkedIcon={<CheckBoxIcon />}
                                        sx={{
                                            mr: 1.5,
                                            color: isItemSelected(item) ? "#0ea5e9" : "#64748b",
                                            "&.Mui-checked": {
                                                color: "#0ea5e9",
                                            },
                                        }}
                                    />

                                    {/* Item Icon */}
                                    <Tooltip title={barcodeInfo?.tooltip || "Product"} arrow>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: isItemSelected(item) ? "#0ea5e9" : item.isBarcodeItem ? (barcodeInfo?.status === "Valid" ? "#dcfce7" : "#fef2f2") : "#dbeafe",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mr: 2,
                                                flexShrink: 0,
                                                border: item.isBarcodeItem ? (barcodeInfo?.status === "Valid" ? "1px solid #bbf7d0" : "1px solid #fecaca") : "none",
                                            }}
                                        >
                                            {item.isBarcodeItem ? (
                                                <BarcodeIcon
                                                    sx={{
                                                        fontSize: 18,
                                                        color: isItemSelected(item) ? "white" : barcodeInfo?.status === "Valid" ? "#16a34a" : "#dc2626",
                                                    }}
                                                />
                                            ) : (
                                                <InventoryIcon
                                                    sx={{
                                                        fontSize: 18,
                                                        color: isItemSelected(item) ? "white" : "#2563eb",
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Tooltip>

                                    {/* Item Details */}
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                                <Typography variant="body2" fontWeight="600" sx={{ fontSize: "0.9rem", lineHeight: 1.3, mb: 0.5 }}>
                                                    {getItemitem_desc(item)}
                                                </Typography>
                                                {barcodeInfo?.isDefault && (
                                                    <Chip
                                                        label="Default"
                                                        size="small"
                                                        sx={{
                                                            height: "18px",
                                                            fontSize: "0.55rem",
                                                            backgroundColor: "#dcfce7",
                                                            color: "#166534",
                                                        }}
                                                    />
                                                )}
                                                {barcodeInfo && barcodeInfo.status === "Invalid" && (
                                                    <Chip
                                                        label="Invalid"
                                                        size="small"
                                                        sx={{
                                                            height: "18px",
                                                            fontSize: "0.55rem",
                                                            backgroundColor: "#fef2f2",
                                                            color: "#dc2626",
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>
                                                    {getItemitem_code(item)} • {getStockInfo(item)}
                                                </Typography>
                                                <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center", flexWrap: "wrap" }}>
                                                    <Typography variant="caption" sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                                                        {getCategoryInfo(item)}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontSize: "0.7rem", color: "#16a34a", fontWeight: 600 }}>
                                                        {getUnitPrice(item)}
                                                    </Typography>
                                                    {item.uom && (
                                                        <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "#6366f1", fontStyle: "italic" }}>
                                                            UOM: {item.uom}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {item.isBarcodeItem && item.barcode_type && (
                                                    <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "#8b5cf6", display: "block", mt: 0.5 }}>
                                                        Type: {item.barcode_type}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        sx={{ my: 0, flex: 1 }}
                                    />
                                </ListItem>
                            );
                        })
                    ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <InventoryIcon sx={{ color: "#cbd5e1", fontSize: 48, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery
                                    ? "No materials found matching your search"
                                    : activeTab === "barcode"
                                    ? "No valid barcode items available"
                                    : activeTab === "products"
                                    ? "No products available"
                                    : "No materials available"}
                            </Typography>
                            {searchQuery && (
                                <Button variant="text" size="small" onClick={handleClearSearch} sx={{ mt: 1 }}>
                                    Clear search
                                </Button>
                            )}
                        </Box>
                    )}
                </List>

                {/* Stats Info */}
                {displayItems.length > 0 && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Showing {displayItems.length} items • With barcodes: {displayItems.filter((item) => item.isBarcodeItem).length} • Products only: {displayItems.filter((item) => !item.isBarcodeItem).length}
                        </Typography>
                    </Box>
                )}

                {/* Action Buttons */}
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
                        disabled={selectedItems.length === 0}
                        sx={{
                            py: 1,
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                        }}
                        onClick={handleImportSelected}
                    >
                        Import Selected ({selectedItems.length})
                    </GradientButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default InsightModal;
