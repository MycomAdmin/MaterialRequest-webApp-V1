// src/pages/Profile.jsx
import { Business as BusinessIcon, Email as EmailIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, Security as SecurityIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Avatar, Box, Card, Container, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { GradientBox } from "../components/ui/StyledComponents";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = () => {
        signOut();
        navigate("/login");
    };

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
                <GradientBox sx={{ pt: 3, pb: 2, pl: 2, borderRadius: "0 0 24px 24px", minHeight: "9rem" }}>
                    <Container maxWidth="sm">
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Profile
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Manage your account settings
                        </Typography>
                    </Container>
                </GradientBox>
                <Container maxWidth="sm" sx={{ mt: -4 }}>
                    {/* User Info Card */}
                    <Card sx={{ p: 3, mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    backgroundColor: "#4361ee",
                                    mr: 2,
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "white",
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="600">
                                    {user?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                                    {user?.role}
                                </Typography>
                            </Box>
                        </Box>

                        <List disablePadding>
                            <ListItem disableGutters>
                                <ListItemIcon>
                                    <EmailIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Email" secondary={user?.email} />
                            </ListItem>
                            {/* <ListItem disableGutters>
                                <ListItemIcon>
                                    <BusinessIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Department" secondary="Construction & Maintenance" />
                            </ListItem> */}
                        </List>
                    </Card>

                    {/* Settings */}
                    <Card sx={{ mb: 2 }}>
                        <List disablePadding>
                            <ListItem button>
                                <ListItemIcon>
                                    <SettingsIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Account Settings" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <NotificationsIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Notifications" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <SecurityIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Privacy & Security" />
                            </ListItem>
                        </List>
                    </Card>

                    {/* Logout */}
                    <Card>
                        <List disablePadding>
                            <ListItem
                                button
                                onClick={handleLogout}
                                sx={{
                                    color: "#dc2626",
                                    "&:hover": {
                                        backgroundColor: "#fef2f2",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <LogoutIcon sx={{ color: "#dc2626" }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Logout"
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: "#dc2626",
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Card>
                </Container>
            </Box>
        </AppLayout>
    );
};

export default Profile;
