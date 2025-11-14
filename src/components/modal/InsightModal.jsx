import { Close as CloseIcon, Inventory as InventoryIcon, Timeline as SalesIcon, Search as SearchIcon, StorageRounded, TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";

import { Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, List, ListItem, ListItemText, TextField, Tooltip, Typography } from "@mui/material";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GradientButton } from "../ui/StyledComponents";

const InsightModal = ({ open, onClose, onSelectItems }) => {
    // --------------------------
    // Redux Data
    // --------------------------
    const { reportData, reportLoading } = useSelector((state) => state?.businessIntelligenceReports || {});

    const data = reportData?.items_data ?? [];

    // --------------------------
    // Local States
    // --------------------------
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedItems, setSelectedItems] = useState([]);

    // --------------------------
    // Tabs with counts (optimized)
    // --------------------------
    const tabs = useMemo(() => {
        const withSales = data?.filter((item) => item?.monthly_sales_history?.length > 0) || [];
        const noSales = data?.filter((item) => !item?.monthly_sales_history?.length) || [];

        return [
            { id: "all", label: "All Items", count: data?.length || 0 },
            { id: "withSales", label: "With Sales", count: withSales?.length || 0 },
            { id: "noSales", label: "No Sales", count: noSales?.length || 0 },
        ];
    }, [data]);

    // --------------------------
    // Filter items by tab
    // --------------------------
    const tabFiltered = useMemo(() => {
        if (activeTab === "withSales") {
            return data?.filter((item) => item?.monthly_sales_history?.length > 0) ?? [];
        }
        if (activeTab === "noSales") {
            return data?.filter((item) => !item?.monthly_sales_history?.length) ?? [];
        }
        return data ?? [];
    }, [activeTab, data]);

    // --------------------------
    // Search Filtering
    // --------------------------
    const displayItems = useMemo(() => {
        if (!searchQuery?.trim?.()) return tabFiltered || [];

        const q = searchQuery?.toLowerCase?.() || "";

        return (
            tabFiltered?.filter?.(
                (item) => item?.item_des?.toLowerCase?.().includes(q) || item?.item_code?.toLowerCase?.().includes(q) || item?.group_des?.toLowerCase?.().includes(q) || item?.supp_code?.toLowerCase?.().includes(q)
            ) ?? []
        );
    }, [searchQuery, tabFiltered]);

    // --------------------------
    // Select / Deselect
    // --------------------------
    const toggleSelect = (item) => {
        setSelectedItems((prev = []) => (prev?.some((x) => x?.item_code === item?.item_code) ? prev?.filter((x) => x?.item_code !== item?.item_code) : [...prev, item]));
    };

    const isSelected = (item) => selectedItems?.some((x) => x?.item_code === item?.item_code);

    const handleSelectAll = () => {
        selectedItems?.length === displayItems?.length ? setSelectedItems([]) : setSelectedItems(displayItems);
    };

    const handleImport = () => {
        onSelectItems?.(selectedItems);
        setSelectedItems([]);
        onClose?.();
    };

    const clearSearch = () => setSearchQuery("");

    // --------------------------
    // Sales Status Badge
    // --------------------------
    const getSalesStatus = (item = {}) => {
        const salesCount = item?.monthly_sales_history?.length ?? 0;

        return salesCount === 0
            ? {
                  color: "#ef4444",
                  icon: <TrendingDownIcon />,
                  label: "",
              }
            : salesCount <= 3
            ? {
                  color: "#f59e0b",
                  icon: <SalesIcon />,
                  label: `${salesCount} months`,
              }
            : {
                  color: "#10b981",
                  icon: <TrendingUpIcon />,
                  label: `${salesCount} months`,
              };
    };

    // --------------------------
    // JSX
    // --------------------------
    return (
        <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, maxHeight: "90dvh" } }}>
            {/* ---------------- HEADER ---------------- */}
            <DialogTitle sx={{ pb: 1.5, pt: 2.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "1.1rem",
                            }}
                        >
                            <StorageRounded sx={{ color: "#9333ea", mr: 1.5, fontSize: 22 }} />
                            Insight 360 Data
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Select items to add
                        </Typography>
                    </Box>

                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* ---------------- CONTENT ---------------- */}
            <DialogContent sx={{ p: 2 }}>
                {/* --- Search --- */}
                <TextField
                    fullWidth
                    placeholder="Search by name, code, supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value ?? "")}
                    size="small"
                    sx={{ my: 1 }}
                    InputProps={{
                        sx: { borderRadius: 1 },
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={clearSearch}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* --- Tabs --- */}
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {tabs?.map((tab) => (
                        <Chip
                            key={tab?.id}
                            label={`${tab?.label} (${tab?.count ?? 0})`}
                            variant={activeTab === tab?.id ? "filled" : "outlined"}
                            onClick={() => setActiveTab(tab?.id)}
                            size="small"
                            sx={{
                                flex: 1,
                                fontSize: "0.8rem",
                                height: "32px",
                                borderRadius: "8px",
                                backgroundColor: activeTab === tab?.id ? "#9333ea" : "#f8fafc",
                                color: activeTab === tab?.id ? "white" : "#64748b",
                            }}
                        />
                    ))}
                </Box>

                {/* --- Selection Info --- */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {selectedItems?.length ?? 0} of {displayItems?.length ?? 0} selected
                    </Typography>

                    <Button
                        onClick={handleSelectAll}
                        size="small"
                        sx={{
                            borderRadius: "6px",
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        {selectedItems?.length === displayItems?.length ? "Deselect All" : "Select All"}
                    </Button>
                </Box>

                <Divider sx={{ mb: 1 }} />

                {/* --- Items List --- */}
                <List sx={{ maxHeight: 350, overflow: "auto", py: 0 }}>
                    {/* Loader */}
                    {reportLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                py: 4,
                            }}
                        >
                            <CircularProgress size={32} />
                            <Typography sx={{ ml: 2 }} color="text.secondary">
                                Loading items...
                            </Typography>
                        </Box>
                    ) : displayItems?.length === 0 ? (
                        // Empty State
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <InventoryIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                            <Typography color="text.secondary">No items found</Typography>

                            {searchQuery && (
                                <Button variant="text" size="small" onClick={clearSearch} sx={{ mt: 1 }}>
                                    Clear search
                                </Button>
                            )}
                        </Box>
                    ) : (
                        // Render Items
                        displayItems?.map?.((item, idx) => {
                            const salesStatus = getSalesStatus(item);
                            const itemSelected = isSelected(item);

                            return (
                                <ListItem
                                    key={item?.item_code || idx}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: itemSelected ? "#9333ea" : "#e2e8f0",
                                        borderRadius: "8px",
                                        mb: 1,
                                        py: 1.5,
                                        cursor: "pointer",
                                        backgroundColor: itemSelected ? "#faf5ff" : "white",
                                        transition: "0.2s ease",
                                        "&:hover": {
                                            borderColor: "#9333ea",
                                            backgroundColor: itemSelected ? "#faf5ff" : "#f8fafc",
                                        },
                                    }}
                                    onClick={() => toggleSelect(item)}
                                >
                                    {/* Checkbox */}
                                    <Checkbox checked={!!itemSelected} onClick={(e) => e.stopPropagation()} sx={{ mr: 1.5 }} />

                                    {/* Sales Icon */}
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "8px",
                                            backgroundColor: `${salesStatus?.color}15`,
                                            border: `1px solid ${salesStatus?.color}30`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 2,
                                        }}
                                    >
                                        <Box sx={{ color: salesStatus?.color }}>{salesStatus?.icon}</Box>
                                    </Box>

                                    {/* Item Text */}
                                    <ListItemText
                                        primary={
                                            <Typography fontWeight="600" sx={{ fontSize: "0.95rem", mb: 0.5 }}>
                                                {item?.item_des || "--"}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        color: "#64748b",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {item?.item_code || "--"} • {item?.supp_code || "--"}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 2,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "#475569",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Stock: {item?.current_stock ?? 0}
                                                    </Typography>

                                                    <Tooltip title="Sales history months">
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: salesStatus?.color,
                                                                fontWeight: 500,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 0.5,
                                                            }}
                                                        >
                                                            {salesStatus?.label}
                                                        </Typography>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            );
                        })
                    )}
                </List>

                {/* --- Stats Footer --- */}
                {displayItems?.length > 0 && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            All: {tabs?.[0]?.count ?? 0} • With Sales: {tabs?.[1]?.count ?? 0} • No Sales: {tabs?.[2]?.count ?? 0}
                        </Typography>
                    </Box>
                )}

                {/* --- Action Buttons --- */}
                <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            borderRadius: "8px",
                            py: 1,
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Cancel
                    </Button>

                    <GradientButton
                        fullWidth
                        disabled={!selectedItems?.length}
                        onClick={handleImport}
                        sx={{
                            borderRadius: "8px",
                            py: 1,
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Import Selected ({selectedItems?.length ?? 0})
                    </GradientButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default InsightModal;
