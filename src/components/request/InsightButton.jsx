import { Inventory as InventoryIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
// import { useState } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAutoReOrderProcessNonAiReport, fetchReportFiltersList, setIsFilterDrawerOpen } from "../../redux/slices/businessIntelligenceReports";
import { updateMaterialRequestDetails } from "../../redux/slices/materialRequestSlice";
import getCurrentDateTimeUTC from "../../utils/getCurrentDateTimeUTC";
import getUserDetails from "../../utils/getUserDetails";
import InsightModal from "../modal/InsightModal";
import FilterDrawer from "./FilterDrawer";

export default function InsightButton() {
    const dispatch = useDispatch();
    const { selectedReport, reportLoading, reportData, aiToggle, isFilterDrawerOpen, isReportOptionsDrawerOpen } = useSelector((state) => state.businessIntelligenceReports);

    // Get data from materialRequestSlice
    const { materialRequestDataForCreate, materialRequestCreateLoader } = useSelector((state) => state.materialRequest);

    const [openInsightModal, setOpenInsightModal] = useState(false);

    const handleFilterToggle = () => {
        dispatch(fetchReportFiltersList());
        dispatch(setIsFilterDrawerOpen(!isFilterDrawerOpen));
    };

    const getNextLineNumber = () => {
        const rows = materialRequestDataForCreate.details[0].data;
        if (!rows || rows.length === 0) return 1;

        // Find the maximum line number from existing items (like admin app logic)
        const lastLineNumber = rows.length > 0 ? Math.max(...rows.map((row) => row.line_number || 0)) : 0;

        return parseInt(lastLineNumber) + 1;
    };

    const handleAddItems = (itemsArray) => {
        console.log(itemsArray, "itma");
        let nextLineNumber = getNextLineNumber();

        const newItems = itemsArray.map((itemData, index) => {
            const itemName = itemData.name || itemData.item_des || "Unknown Item";
            const itemCode = itemData.code || itemData.item_code || "UNKNOWN";
            const unitPrice = itemData.price1 || itemData?.price || 0;

            return {
                line_number: nextLineNumber + index, // Sequential line numbers starting from next available
                item_code: itemCode,
                item_desc: itemName,
                pack_id: "",
                item_type: "MATERIAL",
                pack_qty: 1,
                unit_price: unitPrice,
                total_amount: unitPrice,
                tax_amount: 0,
                net_amount: unitPrice,
                _upd: "C", // Create operation for new items
                cost_center: materialRequestDataForCreate.master_data.cost_center || "001",
                created_date: getCurrentDateTimeUTC(),
                created_user: getUserDetails()?.user_name || "",
                tran_id: "",
                doc_id: materialRequestDataForCreate.master_data.doc_id || "",
                doc_no: materialRequestDataForCreate.master_data.doc_no || "",
                doc_type: "MQ",
                line_type: "Detail",
                updTimeStamp: getCurrentDateTimeUTC(),
                updated_date: getCurrentDateTimeUTC(),
                updated_user: getUserDetails()?.user_name || "",
                client_id: materialRequestDataForCreate.master_data.client_id,
            };
        });

        const updatedItems = [...materialRequestDataForCreate.details[0].data, ...newItems];
        dispatch(updateMaterialRequestDetails(updatedItems));
    };

    const handleToggleInsightModal = (bool = false) => {
        setOpenInsightModal(bool);
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
            <FilterDrawer open={isFilterDrawerOpen} onClose={handleFilterToggle} api={fetchAutoReOrderProcessNonAiReport} toggleInsightModal={handleToggleInsightModal} />
            {/* Add Items Modal */}
            <InsightModal open={openInsightModal} onClose={() => setOpenInsightModal(false)} onSelectItems={handleAddItems} />
        </>
    );
}
