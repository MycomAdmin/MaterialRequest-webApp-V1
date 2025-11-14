import { AutoAwesome } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Checkbox, Drawer, FormControlLabel, IconButton, keyframes, Skeleton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchGroupList,
    fetchLocationsList,
    fetchSubGroupListById,
    resetIncludedAiAnalysis,
    resetReportDropDown,
    resetReportFilters,
    setIsFiltersApplied,
    setReportFilters,
} from "../../redux/slices/businessIntelligenceReports";
import { showNotification } from "../../redux/slices/notificationSlice";
import { handleApiResponse } from "../../utils/notificationUtils";
import DropDown from "./DropDown";
import SupplierSearch from "./SupplierSearch";

const FilterDrawer = ({ open, api, onClose, toggleInsightModal }) => {
    // All hooks must be called unconditionally at the top level
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const { reportData, reportFiltersList, selectedReport, reportFilters, reportLoading, reportDropdown, aiToggle, isReportOptionsDrawerOpen } = useSelector((state) => state.businessIntelligenceReports);
    const { groupList, subGroupList, locationList, groupListLoading, subGroupListLoading, locationListLoading } = reportDropdown || {};
    const suppliersList = reportDropdown.supplierList || [];

    const [searchText, setSearchText] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Memoized values
    const visibleFilters = useMemo(() => {
        return reportFiltersList.data?.filter((filter) => filter.show) || [];
    }, [reportFiltersList.data]);

    const initializeFilters = useMemo(() => {
        const initialFilters = {};
        reportFiltersList.data?.forEach((filter) => {
            if (filter.type === "checkbox") {
                initialFilters[filter.name] = filter.value === "true";
            } else {
                initialFilters[filter.name] = filter.value || "";
            }
        });
        return initialFilters;
    }, [reportFiltersList.data]);

    const [filters, setFilters] = useState(initializeFilters);

    // Sync selectedSupplier with filters.supp_code
    useEffect(() => {
        if (filters?.supp_code) {
            const foundSupp = suppliersList?.find((supp) => supp.supp_code === filters.supp_code);
            setSelectedSupplier(foundSupp || null);
            if (!foundSupp) {
                setSearchText("");
            }
        } else {
            setSelectedSupplier(null);
            setSearchText("");
        }
    }, [filters.supp_code]);

    const handleChange = (field, value) => {
        if (field === "group_code") {
            setFilters((prev) => ({
                ...prev,
                [field]: value,
                sub_group_code: null,
            }));
            dispatch(fetchSubGroupListById(value));
        } else if (field === "include_ai_analysis") {
            dispatch(resetIncludedAiAnalysis(value));
            setFilters((prev) => ({
                ...prev,
                [field]: value,
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [field]: value,
            }));
        }

        // Special handling for supplier code changes
        if (field === "supp_code") {
            if (value) {
                const foundSupp = suppliersList?.find((supp) => supp.supp_code === value);
                setSelectedSupplier(foundSupp || null);
            } else {
                setSelectedSupplier(null);
            }
        }
    };

    const handleApply = () => {
        if (reportFiltersList.loading) return;

        const requiredFields = [];

        visibleFilters.forEach((filter) => {
            if (filter.criteria === "Mandatory" && !filters[filter.name]) {
                requiredFields.push(filter.label);
            }
        });

        if (requiredFields.length) {
            dispatch(
                showNotification({
                    severity: "error",
                    message: `Please select: ${requiredFields.join(", ")}`,
                })
            );
            return;
        }

        // if (aiToggle) {
        //     setIsConfirmOpen(true);
        //     return;
        // }

        proceedToApply();
    };
    
    const proceedToApply = async () => {
        try {
            onClose();
            toggleInsightModal(true);

            const invalidFields = [];

            const formatValueByType = (value, dataType, label, uiType) => {
                if (value === null || value === undefined || value === "") return null;

                const typeLower = (dataType || "").toLowerCase();
                const uiTypeLower = (uiType || "").toLowerCase();

                // Special handling for checkbox fields
                if (uiTypeLower === "checkbox") {
                    if (typeLower === "bit") {
                        // Return as 1 or 0
                        if (typeof value === "boolean") return value ? 1 : 0;
                        if (typeof value === "number") return value === 1 ? 1 : 0;
                        if (typeof value === "string") {
                            const valLower = value.trim().toLowerCase();
                            if (["true", "1", "yes"].includes(valLower)) return 1;
                            if (["false", "0", "no"].includes(valLower)) return 0;
                        }
                        return 0; // default unchecked
                    } else {
                        // Return as true/false
                        if (typeof value === "boolean") return value;
                        if (typeof value === "number") return value === 1;
                        if (typeof value === "string") {
                            const valLower = value.trim().toLowerCase();
                            if (["true", "1", "yes"].includes(valLower)) return true;
                            if (["false", "0", "no"].includes(valLower)) return false;
                        }
                        return false; // default unchecked
                    }
                }

                // Standard type formatting
                switch (typeLower) {
                    case "int":
                        if (isNaN(Number(value)) || value === true || value === false) {
                            invalidFields.push(label || "Unknown Field");
                            return null;
                        }
                        return Number(value);

                    case "bit":
                        if (typeof value === "boolean") return value;
                        if (typeof value === "number") return value === 1;
                        if (typeof value === "string") {
                            const valLower = value.trim().toLowerCase();
                            if (["true", "1", "yes"].includes(valLower)) return true;
                            if (["false", "0", "no"].includes(valLower)) return false;
                        }
                        invalidFields.push(label || "Unknown Field");
                        return null;

                    case "date":
                        const dateObj = new Date(value);
                        if (isNaN(dateObj.getTime())) {
                            invalidFields.push(label || "Unknown Field");
                            return null;
                        }
                        return dateObj.toISOString().split("T")[0];

                    case "string":
                    default:
                        return String(value).trim();
                }
            };

            // Use ALL filters from metadata, not just visible ones
            const transformedFilters = {};
            (reportFiltersList?.data || []).forEach((filter) => {
                const rawValue = filters?.[filter.name];
                const formattedValue = formatValueByType(rawValue, filter.data_type, filter.label, filter.type);

                // Only add key if value is not null
                if (formattedValue !== null && formattedValue !== undefined && formattedValue !== "") {
                    transformedFilters[filter.name] = formattedValue;
                }
            });

            if (invalidFields.length) {
                dispatch(
                    showNotification({
                        severity: "error",
                        message: `Invalid values for: ${invalidFields.join(", ")}`,
                    })
                );
                return;
            }

            const response = await handleApiResponse(dispatch, api, transformedFilters);

            if (response?.meta?.requestStatus === "fulfilled") {
                dispatch(setReportFilters(filters));
                dispatch(setIsFiltersApplied(true));

                // Reset search text after successful application
                setSearchText("");
            }
        } catch (error) {
            console.error("Error in proceedToApply:", error);
            dispatch(
                showNotification({
                    severity: "error",
                    message: "Something went wrong while applying filters. Please try again.",
                })
            );
        }
    };

    const handleReset = () => {
        if (reportFiltersList.loading) return;

        dispatch(resetReportFilters());
        setFilters(initializeFilters);
        setSelectedSupplier(null);
        setSearchText("");
        dispatch(resetReportDropDown());
    };

    useEffect(() => {
        if (open) {
            setFilters(reportData && Object.keys(reportData).length > 0 ? reportFilters : initializeFilters);
        }
    }, [open, reportFilters, initializeFilters, reportData]);

    useEffect(() => {
        if (visibleFilters.some((f) => f.name === "group_code")) {
            dispatch(fetchGroupList());
        }
        if (visibleFilters.some((f) => f.name === "loc_id" || f.name === "location_code")) {
            dispatch(fetchLocationsList());
        }
    }, [visibleFilters, dispatch]);

    const renderFilterField = (filter) => {
        if (!filter.show) return null;

        if (reportFiltersList.loading) {
            return (
                <Box key={filter.name} mb={2}>
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="rectangular" width="100%" height={44} />
                </Box>
            );
        }

        switch (filter.type) {
            case "date":
                return (
                    <Box key={filter.name} mb={2}>
                        <Typography
                            variant="subtitle2"
                            mb={0.5}
                            sx={{
                                // fontFamily: theme.palette.typography.fontFamily,
                                fontSize: "14px",
                                fontWeight: 600,
                            }}
                        >
                            {filter.label}{" "}
                            {filter.criteria === "Mandatory" && (
                                <Box component="span" sx={{ color: "red" }}>
                                    *
                                </Box>
                            )}
                        </Typography>
                        <DatePicker
                            value={filters[filter.name] ? dayjs(filters[filter.name]) : null}
                            onChange={(newValue) => handleChange(filter.name, newValue?.format("YYYY-MM-DD"))}
                            format={"DD/MM/YYYY"}
                            maxDate={dayjs()}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: "small",
                                    sx: {
                                        "& .MuiInputBase-root": {
                                            height: "36px",
                                        },
                                    },
                                },
                                mobilePaper: {
                                    sx: {
                                        "& .MuiPickersLayout-root": {
                                            minWidth: "300px",
                                        },
                                    },
                                },
                            }}
                            disableFuture
                        />
                    </Box>
                );

            case "checkbox":
                return (
                    <Box key={filter.name} sx={{ display: "flex", alignItems: "center", justifyContent: "end", mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters[filter.name]}
                                    onChange={(e) => handleChange(filter.name, e.target.checked)}
                                    size="small"
                                    sx={{
                                        padding: "8px",
                                        marginRight: "4px",
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        opacity: 0.95,
                                        // fontFamily: theme.palette.typography.fontFamily,
                                    }}
                                >
                                    {filter.label}{" "}
                                    {filter.criteria === "Mandatory" && (
                                        <Box component="span" sx={{ color: "red" }}>
                                            *
                                        </Box>
                                    )}
                                </Typography>
                            }
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    fontSize: {
                                        xs: "20px",
                                        sm: "16px",
                                        md: "18px",
                                        lg: "20px",
                                    },
                                },
                            }}
                        />
                    </Box>
                );

            case "textbox":
            case "number":
                return (
                    <Box key={filter.name} mb={2}>
                        <Typography
                            variant="subtitle2"
                            mb={1}
                            sx={{
                                // fontFamily: theme.palette.typography.fontFamily,
                                fontSize: "14px",
                                fontWeight: 600,
                            }}
                        >
                            {filter.label}{" "}
                            {filter.criteria === "Mandatory" && (
                                <Box component="span" sx={{ color: "red" }}>
                                    *
                                </Box>
                            )}
                        </Typography>
                        <TextField
                            type={filter.type === "number" ? "number" : "text"}
                            fullWidth
                            size="small"
                            placeholder={`Enter ${filter.label}`}
                            value={filters[filter.name] || ""}
                            onChange={(e) => {
                                let value = e.target.value;
                                if (filter.type === "number" || filter.name.includes("days") || filter.name.includes("months")) {
                                    if (!/^\d*$/.test(value)) return;
                                    if (value === "") {
                                        handleChange(filter.name, "");
                                    } else {
                                        const num = parseInt(value, 10);
                                        if (filter.limit && num > filter.limit) {
                                            value = filter.limit.toString();
                                        }
                                        handleChange(filter.name, value);
                                    }
                                } else {
                                    handleChange(filter.name, value);
                                }
                            }}
                            inputProps={{
                                maxLength: 50,
                                ...(filter.type === "number" || filter.name.includes("days") || filter.name.includes("months")
                                    ? {
                                          inputMode: "numeric",
                                          pattern: "[0-9]*",
                                          max: filter.limit || undefined,
                                      }
                                    : {}),
                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: "36px",
                                },
                            }}
                        />
                        {filter.limit && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                mt={0.5}
                                sx={
                                    {
                                        // fontFamily: theme.palette.typography.fontFamily
                                    }
                                }
                            >
                                Max {filter.limit} {filter.name.includes("days") ? "days" : filter.name.includes("months") ? "months" : "records"} allowed.
                            </Typography>
                        )}
                    </Box>
                );

            case "dropdown":
                if (filter.name === "supp_code") {
                    return (
                        <Box key={filter.name} mb={2}>
                            <SupplierSearch
                                filters={filters}
                                handleChange={handleChange}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                selectedSupplier={selectedSupplier}
                                setSelectedSupplier={setSelectedSupplier}
                            />
                        </Box>
                    );
                }

                let options = [];
                let loading = false;
                let valueKey = "code";
                let labelKey1 = "code";
                let labelKey2 = "description";

                if (filter.name === "group_code") {
                    options = groupList;
                    loading = groupListLoading;
                    valueKey = "group_code";
                    labelKey1 = "group_code";
                    labelKey2 = "group_des";
                } else if (filter.name === "sub_group") {
                    options = subGroupList;
                    loading = subGroupListLoading;
                    valueKey = "sub_group";
                    labelKey1 = "sub_group";
                    labelKey2 = "sub_group_des";
                } else if (filter.name === "loc_id" || filter.name === "location_code") {
                    options = locationList;
                    loading = locationListLoading;
                    valueKey = "loc_code";
                    labelKey1 = "loc_code";
                    labelKey2 = "loc_name";
                }

                return (
                    <Box key={filter.name} mb={2}>
                        {reportFiltersList.loading ? (
                            <>
                                <Skeleton variant="text" width="40%" height={24} />
                                <Skeleton variant="rectangular" width="100%" height={44} />
                            </>
                        ) : (
                            <DropDown
                                label={filter.label}
                                onChange={handleChange}
                                options={options}
                                fieldName={filter.name}
                                valueKey={valueKey}
                                optionLabelKey1={labelKey1}
                                optionLabelKey2={labelKey2}
                                value={filters[filter.name]}
                                loading={loading}
                                required={filter.criteria === "Mandatory"}
                                menuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: "300px",
                                            "& li": {
                                                padding: "12px 16px",
                                                fontSize: "14px",
                                            },
                                        },
                                    },
                                }}
                            />
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    const thinkingAnimation = keyframes`
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    `;

    // Early return moved after all hooks
    if (isReportOptionsDrawerOpen || !open) return null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Drawer
                anchor={isDesktop ? "right" : "bottom"}
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                slotProps={{
                    paper: {
                        sx: {
                            width: isDesktop ? "500px" : "100%",
                            height: isDesktop ? "100vh" : "90dvh",
                            borderTopLeftRadius: isDesktop ? 0 : 12,
                            borderTopRightRadius: isDesktop ? 0 : 12,
                            boxShadow: 6,
                            bgcolor: "background.paper",
                            display: "flex",
                            flexDirection: "column",
                            "*": {
                                // fontFamily: `${theme.palette.typography.fontFamily}" !important`,
                                letterSpacing: "0em !important",
                                WebkitTapHighlightColor: "transparent",
                            },
                            "@supports (-webkit-touch-callout: none)": {
                                height: "100dvh",
                            },
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: { xs: 2, sm: 2.5, md: 3 },
                        pb: 6,
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            pb: { xs: 1.5, sm: 2, md: 3 },
                            gap: 0,
                        }}
                    >
                        {reportFiltersList.loading ? (
                            <Skeleton variant="text" width="60%" height={32} />
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{
                                    // fontFamily: theme.palette.typography.fontFamily,
                                    fontWeight: 600,
                                    color: "text.title",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Box component="span">{selectedReport?.label || "Insight 360"}</Box>
                                {aiToggle && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontStyle: "italic",
                                                color: "#6b7280",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            Powered by{" "}
                                            <span
                                                style={{
                                                    color: "#3730a3",
                                                    letterSpacing: "2px",
                                                    fontStyle: "normal",
                                                    fontWeight: "600",
                                                    fontSize: "16px",
                                                    marginRight: "3px",
                                                }}
                                            >
                                                AI
                                            </span>
                                        </Typography>
                                        <AutoAwesome
                                            fontSize="small"
                                            sx={{
                                                animation: reportLoading ? `${thinkingAnimation} 1.5s ease-in-out infinite` : "none",
                                                color: reportLoading ? "#3730a3" : "inherit",
                                            }}
                                        />
                                    </Box>
                                )}
                            </Typography>
                        )}

                        <IconButton
                            onClick={onClose}
                            sx={{
                                padding: "8px",
                                marginRight: "-8px",
                            }}
                            disabled={reportFiltersList.loading}
                        >
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        {reportFiltersList.loading ? (
                            <Skeleton variant="text" width="30%" height={28} />
                        ) : (
                            <Typography
                                sx={{
                                    // fontFamily: theme.palette.typography.fontFamily,
                                    fontSize: "1.2rem",
                                    fontWeight: 600,
                                }}
                            >
                                Filters
                            </Typography>
                        )}
                    </Box>

                    {reportFiltersList.loading
                        ? Array(5)
                              .fill(0)
                              .map((_, index) => (
                                  <Box key={`skeleton-${index}`} mb={2}>
                                      <Skeleton variant="text" width="40%" height={24} />
                                      <Skeleton variant="rectangular" width="100%" height={44} />
                                  </Box>
                              ))
                        : reportFiltersList.data?.map((filter) => renderFilterField(filter))}
                </Box>

                <Box
                    sx={{
                        padding: "8px 16px 16px 16px",
                        bgcolor: "background.paper",
                        borderTop: 1,
                        borderColor: "divider",
                        display: "flex",
                        gap: 2,
                        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
                        width: "100%",
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            // fontFamily: theme.palette.typography.fontFamily,
                            textTransform: "none",
                            color: "#374151",
                            backgroundColor: "#f3f4f6 !important",
                            fontSize: "16px",
                            fontWeight: "500",
                            padding: "5px 8px",
                            minHeight: "38px",
                            borderRadius: "12px",
                        }}
                        onClick={handleReset}
                        disabled={reportFiltersList.loading || reportLoading}
                        disableElevation
                    >
                        {reportFiltersList.loading ? <Skeleton width="100%" /> : "Reset"}
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            // fontFamily: theme.palette.typography.fontFamily,
                            textTransform: "none",
                            color: "white",
                            backgroundColor: "#4f46e5 !important",
                            fontSize: "16px",
                            fontWeight: "500",
                            padding: "5px 8px",
                            minHeight: "38px",
                            borderRadius: "12px",
                        }}
                        loadingPosition="start"
                        loading={reportFiltersList.loading || reportLoading}
                        onClick={handleApply}
                        disableElevation
                    >
                        {reportFiltersList.loading ? <Skeleton width="100%" /> : "Apply Filters"}
                    </Button>
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
};

FilterDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    api: PropTypes.func.isRequired,
};

export default FilterDrawer;
