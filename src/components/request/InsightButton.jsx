import { Inventory as InventoryIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAutoReOrderProcessNonAiReport, fetchReportFiltersList, setIsFilterDrawerOpen } from "../../redux/slices/businessIntelligenceReports";
import FilterDrawer from "./FilterDrawer";

export default function InsightButton() {
    const dispatch = useDispatch();
    const { selectedReport, reportLoading, reportData, aiToggle, isFilterDrawerOpen, isReportOptionsDrawerOpen } = useSelector((state) => state.businessIntelligenceReports);
    // const [insightModalOpen, setInsightModalOpen] = useState(false);
    // const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const handleFilterToggle = () => {
        dispatch(fetchReportFiltersList());
        dispatch(setIsFilterDrawerOpen(!isFilterDrawerOpen));
    };
    return (
        <>
            <Button
                variant="outlined"
                startIcon={<InventoryIcon sx={{ fontSize: 16 }} />}
                onClick={handleFilterToggle}
                sx={{
                    backgroundColor: "#f3e8ff",
                    color: "#9333ea",
                    borderColor: "#e9d5ff",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    py: 0.75,
                    px: 1.75,
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "#ede9fe",
                        borderColor: "#c084fc",
                    },
                }}
            >
                Insight 360
            </Button>
            <FilterDrawer open={isFilterDrawerOpen} onClose={handleFilterToggle} api={fetchAutoReOrderProcessNonAiReport} />
        </>
    );
}
