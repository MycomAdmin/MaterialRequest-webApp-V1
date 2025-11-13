import { 
  ArrowBack as ArrowBackIcon, 
  Cameraswitch as CameraswitchIcon, 
  DocumentScanner, 
  Edit as EditIcon, 
  FlashOff as FlashOffIcon, 
  FlashOn as FlashOnIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { 
  Alert, 
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
  TextField,
  Typography 
} from "@mui/material";
import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { GradientBox, GradientButton } from "../ui/StyledComponents";

export default function BarcodeScannerModal({ barcodeScannerOpen, setBarcodeScannerOpen, scanningStatus, scanError, scannerRef, handleScanned, handleScannerError }) {
    const [cameraFacingMode, setCameraFacingMode] = useState("environment");
    const [torchOn, setTorchOn] = useState(false);
    const [manualEntryOpen, setManualEntryOpen] = useState(false);
    const [manualBarcode, setManualBarcode] = useState("");
    const [manualError, setManualError] = useState("");

    const handleManualBarcodeEntry = () => {
        setManualEntryOpen(true);
    };

    const submitManualBarcode = () => {
        if (!manualBarcode.trim()) {
            setManualError("Please enter a barcode");
            return;
        }
        
        handleScanned(manualBarcode.trim());
        setManualBarcode("");
        setManualError("");
        setManualEntryOpen(false);
    };

    const closeManualEntry = () => {
        setManualBarcode("");
        setManualError("");
        setManualEntryOpen(false);
    };

    // Toggle camera facing mode
    const toggleCamera = () => {
        setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    };

    // Toggle torch
    const toggleTorch = () => {
        setTorchOn((prev) => !prev);
    };

    return (
        <>
            {/* Manual Entry Dialog */}
            <Dialog
                open={manualEntryOpen}
                onClose={closeManualEntry}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    pb: 1 
                }}>
                    <Typography variant="h6" fontWeight="bold">
                        Enter Barcode Manually
                    </Typography>
                    <IconButton onClick={closeManualEntry} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Barcode"
                        value={manualBarcode}
                        onChange={(e) => {
                            setManualBarcode(e.target.value);
                            setManualError("");
                        }}
                        error={!!manualError}
                        helperText={manualError}
                        placeholder="Enter barcode number"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                submitManualBarcode();
                            }
                        }}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={closeManualEntry}
                        sx={{ 
                            borderRadius: "12px",
                            fontWeight: 600 
                        }}
                    >
                        Cancel
                    </Button>
                    <GradientButton 
                        onClick={submitManualBarcode}
                        sx={{ 
                            borderRadius: "12px",
                            fontWeight: 600 
                        }}
                    >
                        Submit
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Main Scanner Dialog */}
            <Dialog
                fullScreen
                open={barcodeScannerOpen}
                onClose={() => setBarcodeScannerOpen(false)}
                PaperProps={{
                    sx: {
                        background: "transparent",
                        "& .MuiDialogContent-root": {
                            backgroundColor: "background.paper",
                        },
                    },
                }}
            >
                {/* Header */}
                <GradientBox sx={{ pt: 2, pb: 2, borderRadius: "0 0 24px 24px", position: "relative", zIndex: 20 }}>
                    <Container maxWidth="sm">
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <IconButton
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderRadius: "50%",
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                                    }}
                                    onClick={() => setBarcodeScannerOpen(false)}
                                >
                                    <ArrowBackIcon />
                                </IconButton>

                                <Box>
                                    <Typography variant="h6" fontWeight="bold" color="white">
                                        Scan Barcode
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                                        Align barcode inside the frame
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                                    }}
                                    onClick={toggleTorch}
                                >
                                    {torchOn ? <FlashOffIcon /> : <FlashOnIcon />}
                                </IconButton>

                                <IconButton
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                                    }}
                                    onClick={toggleCamera}
                                >
                                    <CameraswitchIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Container>
                </GradientBox>

                {/* CONTENT */}
                <DialogContent
                    sx={{
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: "background.paper",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    {/* 🟦 STATUS OVERLAY - Only show relevant messages */}
                    {scanningStatus !== "idle" && (
                        <Box sx={{ position: "absolute", top: 16, left: 0, right: 0, zIndex: 10, px: 2 }}>
                            {scanningStatus === "scanning" && (
                                <Alert
                                    severity="info"
                                    icon={<CircularProgress size={18} />}
                                    sx={{
                                        backgroundColor: "rgba(67,97,238,0.95)",
                                        color: "white",
                                        borderRadius: "12px",
                                    }}
                                >
                                    Processing barcode...
                                </Alert>
                            )}
                            {scanningStatus === "success" && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        backgroundColor: "rgba(34,197,94,0.95)",
                                        color: "white",
                                        borderRadius: "12px",
                                    }}
                                >
                                    Item added!
                                </Alert>
                            )}
                            {/* Only show error alert if there's a specific scan error */}
                            {scanningStatus === "error" && scanError && (
                                <Alert severity="error" sx={{ borderRadius: "12px" }}>
                                    {scanError}
                                </Alert>
                            )}
                        </Box>
                    )}

                    {/*  SCANNER AREA FIXED */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "55dvh",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            backgroundColor: "background.paper",
                        }}
                    >
                        {/*  SCAN FRAME CLEAN VERSION */}
                        <Box
                            sx={{
                                width: 360,
                                height: 260,
                                borderRadius: "14px",
                                border: "3px solid #4361ee",
                                position: "absolute",
                                zIndex: 5,
                                boxShadow: "0 0 0 100vmax rgba(0,0,0,0.7)",
                            }}
                        />

                        {/* 🔵 SCAN LINE FIXED */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: "70%",
                                height: 3,
                                background: "linear-gradient(90deg, transparent, #4361ee, #3a0ca3, transparent)",
                                animation: "move 5s linear infinite",
                                "@keyframes move": {
                                    "0%": { top: "25%" },
                                    "50%": { top: "75%" },
                                    "100%": { top: "25%" },
                                },
                                zIndex: 6,
                            }}
                        />

                        {/* CAMERA FEED FIX */}
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#000",
                            }}
                        >
                            <BarcodeScannerComponent
                                ref={scannerRef}
                                width={"100%"}
                                height={"100%"}
                                facingMode={cameraFacingMode}
                                torch={torchOn}
                                onUpdate={(err, result) => {
                                    if (result) handleScanned(result.text);
                                    if (err) handleScannerError(err);
                                }}
                                stopStream={!barcodeScannerOpen}
                                videoStyle={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    backgroundColor: "#000",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* INSTRUCTIONS */}
                    <Container maxWidth="sm" sx={{ py: 2, position: "relative", zIndex: 5 }}>
                        <Card
                            sx={{
                                p: 3,
                                textAlign: "center",
                                borderRadius: "16px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                backgroundColor: "background.paper",
                            }}
                        >
                            <DocumentScanner sx={{ color: "#4361ee", mb: 1, fontSize: 28 }} />

                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0, mb: 2 }}>
                                Place barcode inside the square frame and keep the phone steady.
                            </Typography>

                            <Button
                                variant="outlined"
                                onClick={handleManualBarcodeEntry}
                                startIcon={<EditIcon />}
                                sx={{
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Enter Barcode Manually
                            </Button>
                        </Card>
                    </Container>
                </DialogContent>

                {/* FOOTER BUTTONS */}
                <DialogActions sx={{ p: 2, backgroundColor: "background.paper", position: "relative", zIndex: 20 }}>
                    <Container maxWidth="sm">
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setBarcodeScannerOpen(false)}
                                sx={{
                                    borderRadius: "12px",
                                    fontWeight: 600,
                                }}
                            >
                                Cancel
                            </Button>

                            <GradientButton fullWidth onClick={handleManualBarcodeEntry} sx={{ borderRadius: "12px", fontWeight: 600 }}>
                                Manual Entry
                            </GradientButton>
                        </Box>
                    </Container>
                </DialogActions>
            </Dialog>
        </>
    );
}