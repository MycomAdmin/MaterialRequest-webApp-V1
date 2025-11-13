import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, Box, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Switch, TextField, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupplierList, resetReportDropDown } from "../../redux/slices/businessIntelligenceReports";

const SupplierSearch = ({ handleChange, searchText, setSearchText, selectedSupplier, setSelectedSupplier }) => {
    const theme = useTheme();

    const { reportDropdown } = useSelector((state) => state.businessIntelligenceReports);
    const suppliersList = reportDropdown.supplierList || [];

    // const [searchText, setSearchText] = useState("");
    const [searchByCode, setSearchByCode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    // const [selectedSupplier, setSelectedSupplier] = useState(null);
    const dispatch = useDispatch();
    const debounceRef = useRef(null);

    const handleInputChange = (e, value, reason) => {
        setSearchText(value);
        clearTimeout(debounceRef.current);

        if (reason === "input" && value.trim().length >= 2) {
            setIsLoading(true);
            debounceRef.current = setTimeout(() => {
                dispatch(
                    fetchSupplierList({
                        supplier_code: searchByCode ? value.trim() : "",
                        supplier_name: !searchByCode ? value.trim() : "",
                    })
                ).finally(() => setIsLoading(false));
            }, 500);
        } else if (reason === "clear") {
            setSelectedSupplier(null);
            setSearchText("");
            dispatch(resetReportDropDown());
        }
    };

    const handleSupplierSelect = (event, newValue) => {
        setSelectedSupplier(newValue);
        if (newValue) {
            setSearchText(newValue?.supp_code || "");
            handleChange("supp_code", newValue?.supp_code);
        } else {
            setSearchText("");
            handleChange("supp_code", null);
        }
    };

    const handleSwitchChange = () => {
        setSearchByCode(!searchByCode);
        setSearchText("");
        setSelectedSupplier(null);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={searchByCode}
                                onChange={handleSwitchChange}
                                color="primary"
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: theme.palette.primary.main, // green when checked
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: theme.palette.primary.main, // green track
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ fontFamily: `${theme.palette.typography.fontFamily} !important`, fontSize: "0.85rem", fontWeight: 600, color: "text.primary" }}>
                                {searchByCode ? "Search by Supplier Code" : "Search by Supplier Name"}
                            </Typography>
                        }
                    />
                </Grid>
                <Box item xs={12} sx={{ width: "100%", padding: "0.5rem 0" }}>
                    <FormControl fullWidth>
                        <FormLabel sx={{ fontFamily: `${theme.palette.typography.fontFamily} !important`, fontWeight: 600, fontSize: 13, color: "text.primary", mb: 0.5 }}>
                            {searchByCode ? "Supplier Code" : "Supplier Name"}
                        </FormLabel>
                        <Autocomplete
                            freeSolo
                            options={suppliersList}
                            loading={isLoading}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") return option;
                                if (!option?.supp_code) return "";
                                return `${option?.supp_code} - ${option?.supplier_name || ""}`;
                            }}
                            filterOptions={(options, { inputValue }) => {
                                if (inputValue.trim().length < 2) return [];
                                return options;
                            }}
                            value={selectedSupplier}
                            inputValue={searchText}
                            onInputChange={handleInputChange}
                            onChange={handleSupplierSelect}
                            clearOnBlur={false}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={`Enter at least 2 ${searchByCode ? "code" : "characters"}...`}
                                    fullWidth
                                    size="small"
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                        },
                                        "& input": {
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            fontFamily: "Poppins",
                                            fontSize: "14px",
                                        },
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start" sx={{ pt: 0.5, m: 0 }}>
                                                    <SearchIcon sx={{ fontSize: 20 }} />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            slotProps={{
                                paper: {
                                    sx: {
                                        fontFamily: theme.palette.typography.fontFamily,
                                        fontSize: "13px",
                                    },
                                },
                            }}
                        />
                    </FormControl>

                    <Typography variant="caption" color="text.secondary" mt={0.5} sx={{ fontFamily: `${theme.palette.typography.fontFamily} !important` }}>
                        {searchText.length < 2
                            ? `Start typing at least 2 ${searchByCode ? "digits of the supplier code" : "characters of the supplier name"} to search.`
                            : suppliersList.length === 0
                            ? "No suppliers found. Try a different search."
                            : selectedSupplier
                            ? "" // <-- hide caption
                            : `Results matching: "${searchText}"`}
                    </Typography>
                </Box>
            </Grid>
        </Box>
    );
};

export default SupplierSearch;
