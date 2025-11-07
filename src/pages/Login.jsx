// src/pages/Login.jsx
import { EmailRounded, LockRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Card, CardContent, Fade, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GradientButton } from "../components/ui/StyledComponents";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

const Login = () => {
    const [credentials, setCredentials] = useState({ client_id: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { show } = useNotification();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise((res) => setTimeout(res, 1000));

            signIn({
                user: {
                    name: "Alex",
                    email: credentials.email,
                    client_id: credentials?.client_id,
                    password: credentials?.password,
                    role: "user",
                },
                token: "mock-jwt-token",
            });

            show("Welcome back! 👋", "success");
            navigate("/");
        } catch {
            show(`Invalid credentials. Please try again.`, "error");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                // p: { xs: 3, sm: 4 },
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
                                        label="Email Address"
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        required
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailRounded color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    transform: "translateY(-1px)",
                                                },
                                            },
                                            marginBottom: "1rem",
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        required
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockRounded color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={togglePasswordVisibility}>
                                                    {showPassword ? <VisibilityOff color="action" /> : <Visibility color="action" />}
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    transform: "translateY(-1px)",
                                                },
                                            },
                                        }}
                                    />

                                    <GradientButton
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            mt: 4,
                                            py: "8px",
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                                            },
                                            "&:active": {
                                                transform: "translateY(0)",
                                            },
                                        }}
                                    >
                                        {loading ? (
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
                                        💡 Demo: Use any email and password to sign in
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
