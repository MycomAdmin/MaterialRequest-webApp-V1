// src/pages/Login.jsx
import { AdminPanelSettings, EmailRounded, LockRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Card, CardContent, Fade, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GradientButton } from "../components/ui/StyledComponents";
import { loginAPI, setBaseURL } from "../config/axiosInstance";
import { useNotification } from "../hooks/useNotification";
import { clearError, loginFailure, loginStart, loginSuccess } from "../redux/slices/authSlice";

const Login = () => {
    const [credentials, setCredentials] = useState({
        client_id: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);
    const { show } = useNotification();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            // Step 1: Set base URL using client_id
            await setBaseURL(credentials.client_id);

            // Step 2: Authenticate user
            const loginResponse = await loginAPI(credentials);

            if (loginResponse.LoginResult.Result === "SUCCESS") {
                // Prepare user data from API response
                const userData = {
                    name: loginResponse.LoginResult.user_name.trim(),
                    email: credentials.email,
                    user_type: loginResponse.LoginResult.user_type.trim(),
                    client_id: credentials.client_id,
                };

                const clientInfo = {
                    client_id: loginResponse.ClientInfo.client_id,
                    client_name: loginResponse.ClientInfo.client_name,
                    rounding: loginResponse.ClientInfo.Rounding,
                    business_type: loginResponse.ClientInfo.business_type,
                };

                // Step 3: Dispatch login success
                dispatch(
                    loginSuccess({
                        user: userData,
                        clientInfo: clientInfo,
                        userAccess: loginResponse.UserAccess,
                    })
                );

                show(`Welcome back, ${userData.name}! 👋`, "success");
                navigate("/");
            } else {
                throw new Error("Invalid email or password. Please check your credentials and try again.");
            }
        } catch (error) {
            let errorMessage = "Invalid credentials or configuration failed";

            if (error.response?.data) {
                // Handle API response errors
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            dispatch(loginFailure(errorMessage));
            show(errorMessage, "error");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (field, value) => {
        setCredentials((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (error) {
            dispatch(clearError());
        }
    };

    return (
        <Box
            sx={{
                height: "100dvh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                flexDirection: "column",
                padding: "0 !important",
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                },
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 3,
                    pt: 8,
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Typography
                        variant="h3"
                        fontWeight="800"
                        gutterBottom
                        sx={{
                            color: "white",
                            fontSize: { xs: "2rem", sm: "2.75rem" },
                            textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        MaterialFlow Pro
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: "300",
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}
                    >
                        Streamline Your Material Management
                    </Typography>
                </Box>
            </Box>

            {/* Form Section - Drawer Style */}
            <Fade in timeout={800}>
                <Box sx={{ width: "100%", mt: "auto" }}>
                    <Box sx={{ position: "relative" }}>
                        <Card
                            sx={{
                                padding: "0 1rem",
                                borderRadius: "16px 16px 0 0",
                                boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.15)",
                                background: "rgba(255, 255, 255, 0.98)",
                                backdropFilter: "blur(20px)",
                                border: "none",
                                minHeight: "auto",
                            }}
                        >
                            <CardContent sx={{ pt: 4, px: { xs: 1, sm: 2 }, pb: "0" }}>
                                <Box textAlign="center" mb={3}>
                                    <Typography
                                        variant="h5"
                                        fontWeight="700"
                                        gutterBottom
                                        sx={{
                                            color: "text.primary",
                                        }}
                                    >
                                        Welcome Back
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Sign in to continue to your account
                                    </Typography>
                                </Box>

                                <form onSubmit={handleLogin}>
                                    <TextField
                                        fullWidth
                                        label="Client ID"
                                        type="text"
                                        value={credentials.client_id}
                                        onChange={(e) => handleInputChange("client_id", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        error={!!error}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AdminPanelSettings color={error ? "error" : "action"} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            marginBottom: "1rem",
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        error={!!error}
                                        sx={{
                                            marginBottom: "1rem",
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailRounded color={error ? "error" : "action"} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        value={credentials.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        required
                                        disabled={isLoading}
                                        error={!!error}
                                        helperText={error}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockRounded color={error ? "error" : "action"} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={togglePasswordVisibility}>
                                                    <IconButton>{showPassword ? <VisibilityOff color={error ? "error" : "action"} /> : <Visibility color={error ? "error" : "action"} />}</IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <GradientButton
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        disabled={isLoading}
                                        sx={{
                                            mt: 4,
                                            py: "8px",
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            "&:disabled": {
                                                opacity: 0.6,
                                            },
                                        }}
                                    >
                                        {isLoading ? (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        border: "2px solid transparent",
                                                        borderTop: "2px solid currentColor",
                                                        borderRadius: "50%",
                                                        animation: "spin 1s linear infinite",
                                                    }}
                                                />
                                                Signing in...
                                            </Box>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </GradientButton>
                                </form>

                                {/* Demo credentials hint */}
                                {/* <Box mt={4} textAlign="center">
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: "block",
                                            background: "rgba(0, 0, 0, 0.03)",
                                            padding: 2,
                                            borderRadius: 1,
                                            border: "1px solid rgba(0, 0, 0, 0.06)",
                                        }}
                                    >
                                        🔐 Enter your Client ID, email and password to sign in
                                    </Typography>
                                </Box> */}
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default Login;
