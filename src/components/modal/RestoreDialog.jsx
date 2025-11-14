// src/components/RestoreDialog.jsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography, useTheme } from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import RestoreIcon from "@mui/icons-material/Restore";

const RestoreDialog = ({ open, onClose, deletedItems = [], onRestoreItem }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                elevation: 8,
                sx: {
                    borderRadius: 1,
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 600,
                    bgcolor: theme.palette.grey[100],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RestoreIcon color="primary" />
                    Restore Deleted Items
                </Box>
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {deletedItems?.length > 0 ? "Select items to restore from the deleted list" : "No items to restore"}
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        maxHeight: 300,
                        overflowY: "auto",
                        borderRadius: 1,
                        px: 1,
                    }}
                >
                    <List disablePadding>
                        {deletedItems?.map((item, index) => (
                            <Box key={item.line_number}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => onRestoreItem(item.line_number)}
                                            color="primary"
                                            sx={{
                                                bgcolor: theme.palette.primary.light,
                                                color: theme.palette.primary.contrastText,
                                                "&:hover": {
                                                    bgcolor: theme.palette.primary.main,
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            <RestoreIcon />
                                        </IconButton>
                                    }
                                    sx={{ py: 1.5 }}
                                >
                                    <ListItemIcon>
                                        <InventoryIcon color="action" />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.item_desc}
                                        secondary={
                                            <Box>
                                                <Typography variant="caption" display="block" fontWeight={600}>
                                                    {item.item_code} • Line #{item.line_number}
                                                </Typography>

                                                <Typography variant="caption" color="text.secondary">
                                                    Qty: {item.pack_qty} • {item.unit_price}
                                                </Typography>
                                            </Box>
                                        }
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    />
                                </ListItem>

                                {index !== deletedItems.length - 1 && <Divider sx={{ mx: 2 }} />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 3,
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RestoreDialog;
