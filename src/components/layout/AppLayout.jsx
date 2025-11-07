import { Box } from "@mui/material";
import CustomBottomNavigation from "./BottomNavigation";

export default function AppLayout({children}) {
    return (
        <Box sx={{ pb: 7 }}>
            {children}
            <CustomBottomNavigation />
        </Box>
    );
}
