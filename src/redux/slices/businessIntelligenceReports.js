import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { axiosBIInstance } from "../../../config/axiosInstance";
import axios from "axios";
import { previousDate } from "../../utils/helper";
const axiosBIInstance = "https://web.mycomsys.com:8814/WEBCLOUD_TESTSRV/api/ai/";

localStorage.setItem("bi_client_id", "client_001")

const initialState = {
    aiToggle: false,
    reportsList: {
        data: null,
        loading: false,
    },
    reportFiltersList: {
        data: null,
        loading: false,
    },
    selectedReport: { name: "Auto_Reorder" },
    reportData: null,
    reportFilters: {
        analysis_date: previousDate(),
        forecast_date: previousDate(),
        period_days: 90,
        group_code: null,
        sub_group_code: null,
        location_code: null,
        supplier_code: null,
        include_ai_analysis: false,
        summary_only: false,
        max_records: null,
    },
    reportLoading: false,
    isFiltersApplied: false,
    reportDropdown: {
        groupList: [],
        subGroupList: [],
        locationList: [],
        supplierList: [],
        groupListLoading: false,
        subGroupListLoading: false,
        locationListLoading: false,
        supplierListLoading: false,
    },
    isSummary: false,
    isFilterDrawerOpen: false,
    isReportOptionsDrawerOpen: false,
};

export const fetchReportsList = createAsyncThunk("fetchReportsList", async (_, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const response = await axios.post(axiosBIInstance + "AI_Dashboard_Filters", {
            client_id: client_id,
            type: "ReportNames",
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});
export const fetchReportFiltersList = createAsyncThunk("fetchReportFiltersList", async (_, { rejectWithValue, getState }) => {
    const { selectedReport, aiToggle } = getState().businessIntelligenceReports;
    const report = selectedReport.name;

    try {
        // const client_id = localStorage.getItem("bi_client_id");
        const response = await axios.post(axiosBIInstance + "AI_Dashboard_Filters", {
            client_id: "client_001",
            // client_id: client_id,
            type: report,
            ai: aiToggle ? "Y" : "N",
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchBelowCostAnalysisReport = createAsyncThunk("fetchBelowCostAnalysisReport", async (filters, { rejectWithValue, getState }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const summary = getState().businessIntelligenceReports.isSummary;

        // const filters = {
        //     analysis_date: analysis_date,
        //     analysis_period_days: period_days,
        //     include_ai_analysis: include_ai_analysis,
        //     summary_only: summary_only,
        // };

        // if (group_code) {
        //     filters.group_code = group_code;
        // }

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }
        // if (max_records) {
        //     filters.max_records = max_records;
        // }

        const response = await axios.post(axiosBIInstance + "below_cost_analysis_using_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                // summary_only: summary,
                ...filters,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchBelowCostAnalysisNonAiReport = createAsyncThunk("fetchBelowCostAnalysisNonAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     analysis_date: analysis_date,
        //     analysis_period_days: period_days,
        //     include_ai_analysis: include_ai_analysis,
        //     summary_only: summary_only,
        // };

        // if (group_code) {
        //     filters.group_code = group_code;
        // }

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }
        // if (max_records) {
        //     filters.max_records = max_records;
        // }
        const response = await axios.post(axiosBIInstance + "below_cost_analysis_v18_without_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                ...filters,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchMarginPerformanceAnalysisReport = createAsyncThunk("fetchMarginPerformanceAnalysisReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     loc_id: location_code,
        //     analysis_date: analysis_date,
        //     analysis_period_days: period_days,
        //     group_code: group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        const response = await axios.post(axiosBIInstance + "margin_performace_inV18_using_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                // include_ai_analysis: "true",
                // margin_threshold_percentage: 5,
                ...filters,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchMarginPerformanceAnalysisNonAiReport = createAsyncThunk("fetchMarginPerformanceAnalysisNonAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     loc_id: location_code,
        //     analysis_date: analysis_date,
        //     analysis_period_days: period_days,
        //     group_code: group_code,
        //     include_ai_analysis: false,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        const response = await axios.post(axiosBIInstance + "margin_performace_inV18_without_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                // margin_threshold_percentage: 5,
                // currency_symbol: "Dhs",
                ...filters,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchStockOutLoseRevenueAnalysisReport = createAsyncThunk("fetchStockOutLoseRevenueAnalysisReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");

        // const filters = {
        //     loc_id: location_code,
        //     analysis_date: analysis_date,
        //     group_code: group_code,
        //     sub_group: sub_group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        const response = await axios.post(axiosBIInstance + "lost_revenue_analysis_invent_v18_ai_test", {
            DATA: {
                client_id: client_id,
                // history_days: 90,
                // max_records: 200,
                ...filters,
                // access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2xpZW50XzAwMSIsImV4cCI6MTc1MTMzNjYzOH0.Ha_WwWcSvWKy5MK6CQNbDo2LPRs_w8YNdU2LcFyuGfA",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchStockOutLoseRevenueAnalysisNonAiReport = createAsyncThunk("fetchStockOutLoseRevenueAnalysisNonAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");

        // const filters = {
        //     loc_id: location_code,
        //     analysis_date: analysis_date,
        //     group_code: group_code,
        //     sub_group: sub_group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        const response = await axios.post(axiosBIInstance + "lost_revenue_analysis_invent_v18_without_ai_test", {
            DATA: {
                client_id: client_id,
                // history_days: 90,
                // max_records: 200,
                ...filters,
                // access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2xpZW50XzAwMSIsImV4cCI6MTc1MTMzNjYzOH0.Ha_WwWcSvWKy5MK6CQNbDo2LPRs_w8YNdU2LcFyuGfA",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchStockForecastAnalysisNonAiReport = createAsyncThunk("fetchStockForecastAnalysisNonAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const payloadFilters = filters;

        const response = await axios.post(axiosBIInstance + "forecast_order_requirement_without_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                // currency_symbol: "Dhs",
                // forecast_months: "3",
                // history_months: 6,
                // max_records: 100,
                // include_test: true,
                // include_suggested_orders: false,
                // include_stock: false,
                ...payloadFilters,
                // access_token: "4d43d5c924ab7fd3b44649920378e1397df1a6bdd8830f379eb71aada7fb3b40",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchStockForecastAnalysisReport = createAsyncThunk("fetchStockForecastAnalysisReport", async (filters, { rejectWithValue }) => {
    console.log(filters, "fil");
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const payloadFilters = filters;
        const response = await axios.post(axiosBIInstance + "forecast_order_requirement_using_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                // currency_symbol: "Dhs",
                // forecast_months: "3",
                // history_months: 6,
                // max_records: 100,
                // include_test: true,
                // include_suggested_orders: false,
                // include_stock: false,
                ...payloadFilters,
                // access_token: "4d43d5c924ab7fd3b44649920378e1397df1a6bdd8830f379eb71aada7fb3b40",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchAutoReOrderProcessReport = createAsyncThunk("fetchAutoReOrderProcessReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     loc_id: location_code,
        //     forecast_date: forecast_date,
        //     group_code: group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        const response = await axios.post(axiosBIInstance + "forecast_order_requirement_using_ai_test", {
            DATA: {
                client_id: client_id,
                // currency_decimals: 3,
                // currency_symbol: "Dhs",
                // forecast_months: "3",
                // history_months: 6,
                // max_records: 100,
                // include_test: true,
                // include_suggested_orders: true,
                // include_stock: true,
                ...filters,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchAutoReOrderProcessNonAiReport = createAsyncThunk("fetchAutoReOrderProcessNonAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     loc_id: location_code,
        //     forecast_date: forecast_date,
        //     group_code: group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        const response = await axios.post(axiosBIInstance + "forecast_order_requirement_without_ai_test", {
            DATA: {
                // client_id: client_id,
                client_id: "client_001",
                // currency_decimals: 3,
                // currency_symbol: "Dhs",
                // forecast_months: "3",
                // history_months: 6,
                // max_records: 100,
                // include_test: true,
                // include_suggested_orders: false,
                // include_stock: true,
                ...filters,
                // access_token: "4d43d5c924ab7fd3b44649920378e1397df1a6bdd8830f379eb71aada7fb3b40",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchSlowMovingItemsAiReport = createAsyncThunk("fetchSlowMovingItemsAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     loc_id: location_code,
        //     analysis_date: analysis_date,
        //     group_code: group_code,
        //     sub_group: sub_group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }

        // if (max_records) {
        //     filters.max_records = max_records;
        // }

        const response = await axios.post(axiosBIInstance + "slow_moving_items_v18_with_ai", {
            DATA: {
                client_id: client_id,
                // history_days_a: 90,
                // history_days_b: 180,
                // history_days_c: 360,
                // min_quantity: 1,
                // include_transfer_out: 1,
                // include_ai_analysis: "true",
                // summary_only: "false",
                ...filters,
                // access_token:
                //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2xpZW50XzAwMSIsImV4cCI6MTc2OTI5NTUwMiwiaWF0IjoxNzUzNzQzNTAyLCJwdXJwb3NlIjoiNi1tb250aCBBUEkgYWNjZXNzIn0.UUuz2sXSeZK4St5ckQWHkPRvd064Gaekhy3vnaNad8g",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});
export const fetchSlowMovingItemsNonAiReport = createAsyncThunk("fetchSlowMovingItemsNonAiReport", async (filters, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        // const filters = {
        //     loc_id: location_code,
        //     analysis_date: analysis_date,
        //     group_code: group_code,
        //     sub_group: sub_group_code,
        // };

        // if (supplier_code) {
        //     filters.supp_code = supplier_code;
        // }
        // if (max_records) {
        //     filters.max_records = max_records;
        // }

        const response = await axios.post(axiosBIInstance + "slow_moving_items_v18_without_ai", {
            DATA: {
                client_id: client_id,
                // history_days_a: 90,
                // history_days_b: 180,
                // history_days_c: 360,
                // min_quantity: 1,
                // include_transfer_out: 1,
                // include_ai_analysis: "true",
                // summary_only: "false",
                ...filters,
                // access_token: "4d43d5c924ab7fd3b44649920378e1397df1a6bdd8830f379eb71aada7fb3b40",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchGroupList = createAsyncThunk("fetchGroupList", async (_, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const response = await axios.post(axiosBIInstance + "AI_Dashboard_Filters", {
            client_id: client_id,
            type: "Group",
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchSubGroupListById = createAsyncThunk("fetchSubGroupListById", async (group_code, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const response = await axios.post(axiosBIInstance + "AI_Dashboard_Filters", {
            client_id: client_id,
            group_code: group_code,
            type: "Sub_group",
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchLocationsList = createAsyncThunk("fetchLocationsList", async (_, { rejectWithValue }) => {
    try {
        const client_id = localStorage.getItem("bi_client_id");
        const response = await axios.post(axiosBIInstance + "AI_Dashboard_Filters", {
            client_id: client_id,
            type: "Location",
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

export const fetchSupplierList = createAsyncThunk("fetchSupplierList", async ({ supplier_code, supplier_name }, { rejectWithValue }) => {
    try {
        const filters = {};

        if (supplier_code) {
            filters.supp_code = supplier_code;
        }
        if (supplier_name) {
            filters.supp_name = supplier_name;
        }

        const client_id = localStorage.getItem("bi_client_id");
        const response = await axios.post(axiosBIInstance + "AI_Dashboard_Filters", {
            client_id: client_id,
            type: "Supplier",
            ...filters,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.mastModuleData || error.message);
    }
});

const businessIntelligenceReportsSlice = createSlice({
    name: "BusinessIntelligenceReports",
    initialState,
    reducers: {
        setReportFilters: (state, action) => {
            state.reportFilters = {
                ...state.reportFilters,
                ...action.payload,
            };
        },
        setIsFiltersApplied: (state, action) => {
            state.isFiltersApplied = action.payload;
        },
        setDeepAnalysisWithAI: (state, action) => {
            state.aiToggle = action.payload;
        },
        resetReportFilters: (state) => {
            state.reportFilters = {
                ...initialState.reportFilters,
                analysis_date: previousDate(),
                forecast_date: previousDate(),
                include_ai_analysis: state.aiToggle,
            };
            state.reportData = null;
        },
        resetIncludedAiAnalysis: (state, action) => {
            state.aiToggle = action.payload;
        },
        setIsFilterDrawerOpen: (state, action) => {
            state.isFilterDrawerOpen = action.payload;
        },
        resetReportDropDown: (state) => {
            state.reportDropdown = {
                ...state.reportDropdown,
                supplierList: [],
                supplierListLoading: false,
            };
        },
        setSelectedReport: (state, action) => {
            state.selectedReport = action.payload;
        },
        setIsReportOptionsDrawerOpen: (state, action) => {
            state.isReportOptionsDrawerOpen = action.payload;
        },
        setAiToggle: (state, action) => {
            state.aiToggle = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBelowCostAnalysisReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchBelowCostAnalysisReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchBelowCostAnalysisReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchBelowCostAnalysisNonAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchBelowCostAnalysisNonAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchBelowCostAnalysisNonAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchStockOutLoseRevenueAnalysisReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchStockOutLoseRevenueAnalysisReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchStockOutLoseRevenueAnalysisReport.rejected, (state) => {
                state.reportLoading = false;
            });
        builder
            .addCase(fetchStockOutLoseRevenueAnalysisNonAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchStockOutLoseRevenueAnalysisNonAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchStockOutLoseRevenueAnalysisNonAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchMarginPerformanceAnalysisReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchMarginPerformanceAnalysisReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchMarginPerformanceAnalysisReport.rejected, (state) => {
                state.reportLoading = false;
            });
        builder
            .addCase(fetchMarginPerformanceAnalysisNonAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchMarginPerformanceAnalysisNonAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchMarginPerformanceAnalysisNonAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchStockForecastAnalysisReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchStockForecastAnalysisReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchStockForecastAnalysisReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchStockForecastAnalysisNonAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchStockForecastAnalysisNonAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchStockForecastAnalysisNonAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchAutoReOrderProcessReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchAutoReOrderProcessReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchAutoReOrderProcessReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchAutoReOrderProcessNonAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchAutoReOrderProcessNonAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchAutoReOrderProcessNonAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchSlowMovingItemsAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchSlowMovingItemsAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchSlowMovingItemsAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchSlowMovingItemsNonAiReport.pending, (state) => {
                state.reportLoading = true;
            })
            .addCase(fetchSlowMovingItemsNonAiReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchSlowMovingItemsNonAiReport.rejected, (state) => {
                state.reportLoading = false;
            });

        builder
            .addCase(fetchReportsList.pending, (state) => {
                state.reportsList.loading = true;
            })
            .addCase(fetchReportsList.fulfilled, (state, action) => {
                state.reportsList.loading = false;
                state.reportsList.data = action.payload?.data || null;
                const data = action.payload?.data || null;
                const filteredReports = data?.filter((report) => !report.hide)?.sort((a, b) => a.order - b.order);
                if (data?.length > 0) {
                    state.selectedReport = filteredReports[0];
                }
            })
            .addCase(fetchReportsList.rejected, (state) => {
                state.reportsList.loading = false;
            });

        builder
            .addCase(fetchReportFiltersList.pending, (state) => {
                state.reportFiltersList.loading = true;
            })
            .addCase(fetchReportFiltersList.fulfilled, (state, action) => {
                state.reportFiltersList.loading = false;

                const sortedData = Array.isArray(action.payload?.data)
                    ? [...action.payload.data].sort((a, b) => {
                          const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
                          const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
                          return orderA - orderB;
                      })
                    : null;

                state.reportFiltersList.data = sortedData;
            })

            .addCase(fetchReportFiltersList.rejected, (state) => {
                state.reportFiltersList.loading = false;
                state.reportFiltersList = initialState.reportFiltersList;
            });

        builder
            .addCase(fetchGroupList.pending, (state) => {
                state.reportDropdown.groupListLoading = true;
            })
            .addCase(fetchGroupList.fulfilled, (state, action) => {
                state.reportDropdown.groupListLoading = false;
                state.reportDropdown.groupList = action.payload?.data || [];
            })
            .addCase(fetchGroupList.rejected, (state) => {
                state.reportDropdown.groupListLoading = false;
                state.reportDropdown.groupList = [];
            });

        builder
            .addCase(fetchSubGroupListById.pending, (state) => {
                state.reportDropdown.subGroupListLoading = true;
            })
            .addCase(fetchSubGroupListById.fulfilled, (state, action) => {
                state.reportDropdown.subGroupListLoading = false;
                state.reportDropdown.subGroupList = action.payload?.data || [];
            })
            .addCase(fetchSubGroupListById.rejected, (state) => {
                state.reportDropdown.subGroupListLoading = false;
                state.reportDropdown.groupList = [];
            });

        builder
            .addCase(fetchLocationsList.pending, (state) => {
                state.reportDropdown.locationListLoading = true;
            })
            .addCase(fetchLocationsList.fulfilled, (state, action) => {
                state.reportDropdown.locationListLoading = false;
                state.reportDropdown.locationList = action.payload?.data || [];
            })
            .addCase(fetchLocationsList.rejected, (state) => {
                state.reportDropdown.locationListLoading = false;
                state.reportDropdown.locationList = [];
            });

        builder
            .addCase(fetchSupplierList.pending, (state) => {
                state.reportDropdown.supplierListLoading = true;
            })
            .addCase(fetchSupplierList.fulfilled, (state, action) => {
                state.reportDropdown.supplierListLoading = false;
                state.reportDropdown.supplierList = action.payload?.data || [];
            })
            .addCase(fetchSupplierList.rejected, (state) => {
                state.reportDropdown.supplierListLoading = false;
                state.reportDropdown.locationList = [];
            });
    },
});

export const {
    setReportFilters,
    setIsFiltersApplied,
    setDeepAnalysisWithAI,
    resetReportFilters,
    resetIncludedAiAnalysis,
    setIsFilterDrawerOpen,
    resetReportDropDown,
    setSelectedReport,
    setIsReportOptionsDrawerOpen,
    setAiToggle,
} = businessIntelligenceReportsSlice.actions;

export default businessIntelligenceReportsSlice.reducer;
