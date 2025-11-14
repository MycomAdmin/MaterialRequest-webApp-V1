import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, Dialog, IconButton, Popper, TextField, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

// Custom Popper for sm+ screens that appears at the top
const TopPopper = styled(Popper)(({ theme }) => ({
    zIndex: 1300,
    '&[data-popper-placement="bottom"]': {
        top: "auto !important",
        bottom: "100% !important",
        transformOrigin: "bottom !important",
    },
    "& .MuiAutocomplete-paper": {
        margin: 0,
        marginBottom: "8px",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        backgroundColor: theme.palette.background.paper,
    },
}));

// Dialog with light blur background
const OverlayDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiBackdrop-root": {
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    "& .MuiDialog-container": {
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: theme.spacing(2),
    },
    "& .MuiPaper-root": {
        borderRadius: 12,
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        maxWidth: "90vw",
        width: "100%",
    },
}));

const DropDown = ({ label, fieldName, valueKey, optionLabelKey1, optionLabelKey2, options, value, onChange, loading, disabled, required = false, requireGroupOrSupplierOnly = false }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const [open, setOpen] = useState(false);
    const optionsList = options || [];
    const findValue = optionsList.find((el) => el?.[valueKey] === value);

    const getLabel = (option) => (optionLabelKey1 ? (optionLabelKey2 ? `${option[optionLabelKey1]} - ${option[optionLabelKey2]}` : `${option[optionLabelKey1]}`) : option?.[valueKey] || "");

    const handleSelect = (newValue) => {
        setOpen(false);
        onChange(fieldName, newValue?.[valueKey]);
    };

    const handleClear = () => {
        onChange(fieldName, null);
    };

    return (
        <Box>
            {/* Label */}
            <Typography
                sx={{
                    // fontFamily: theme.palette.typography.fontFamily,
                    fontSize: "13px",
                    fontWeight: 600,
                    opacity: disabled ? 0.45 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                }}
                variant="subtitle2"
                mb={0.5}
            >
                {label}
                {!requireGroupOrSupplierOnly && required && (
                    <Box component="span" sx={{ color: "red" }}>
                        *
                    </Box>
                )}
            </Typography>

            {isXs ? (
                <>
                    {/* Tap-to-open TextField */}
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={findValue ? getLabel(findValue) : ""}
                        placeholder={`Select ${label}`}
                        onClick={() => !disabled && setOpen(true)}
                        InputProps={{
                            readOnly: true,
                            endAdornment: value && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClear();
                                    }}
                                    disabled={disabled}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            ),
                        }}
                        sx={{ backgroundColor: "#f9f9f9" }}
                    />

                    {/* Dialog with instant focus on Autocomplete */}
                    <OverlayDialog open={open} onClose={() => setOpen(false)}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                            <Typography fontWeight={600}>Select {label}</Typography>
                            <IconButton size="small" onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Autocomplete
                            openOnFocus
                            autoHighlight
                            options={optionsList}
                            getOptionLabel={getLabel}
                            loading={loading}
                            onChange={(_, newValue) => handleSelect(newValue)}
                            value={findValue || null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    // label={`Search ${label}`}
                                    autoFocus
                                    autoComplete="off"
                                    fullWidth
                                />
                            )}
                        />
                    </OverlayDialog>
                </>
            ) : (
                // Normal Autocomplete for larger screens
                <Autocomplete
                    size="small"
                    disablePortal
                    PopperComponent={TopPopper}
                    options={optionsList}
                    getOptionLabel={getLabel}
                    value={findValue || null}
                    onChange={(_, newValue) => onChange(fieldName, newValue?.[valueKey])}
                    loading={loading}
                    disabled={disabled}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={`Select ${label}`}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                // endAdornment: (
                                //   <>
                                //     {value && (
                                //       <IconButton
                                //         size="small"
                                //         onClick={(e) => {
                                //           e.stopPropagation();
                                //           handleClear();
                                //         }}
                                //         disabled={disabled}
                                //       >
                                //         <ClearIcon fontSize="small" />
                                //       </IconButton>
                                //     )}
                                //     {params.InputProps.endAdornment}
                                //   </>
                                // ),
                            }}
                        />
                    )}
                    clearOnEscape
                />
            )}
        </Box>
    );
};

DropDown.propTypes = {
    label: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    valueKey: PropTypes.string.isRequired,
    optionLabelKey1: PropTypes.string,
    optionLabelKey2: PropTypes.string,
    options: PropTypes.array.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    requireGroupOrSupplierOnly: PropTypes.bool,
};

export default DropDown;
