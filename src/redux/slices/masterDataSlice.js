// src/redux/slices/masterDataSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosCrudInstance } from "../../config/axiosInstance";

const initialState = {
    // Cost Centers
    costCenters: [],
    costCentersLoading: false,
    costCentersError: null,

    // Locations
    locations: [],
    locationsLoading: false,
    locationsError: null,

    // Sub Locations
    subLocations: [],
    subLocationsLoading: false,
    subLocationsError: null,

    // Location Divisions
    locationDivisions: [],
    locationDivisionsLoading: false,
    locationDivisionsError: null,

    // Barcodes
    barcodes: [],
    barcodesLoading: false,
    barcodesError: null,

    // Products
    products: [],
    productsLoading: false,
    productsError: null,

    // Search Results
    searchResults: [],
    searchLoading: false,
    searchError: null,
};

// Generic list fetch function
const fetchListData = async (endpoint, payload) => {
    const response = await axiosCrudInstance.post(endpoint, payload, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Cost Centers
export const fetchCostCenters = createAsyncThunk("masterData/fetchCostCenters", async (_, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "mast_costcenter",
        operation: "list",
        filter: `client_id = '${clientId}'`,
    };
    return await fetchListData("cost_center", payload);
});

// Locations
export const fetchLocations = createAsyncThunk("masterData/fetchLocations", async (_, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "mast_location",
        operation: "list",
        filter: `client_id = '${clientId}'`,
    };
    return await fetchListData("mast_location", payload);
});

// Sub Locations
export const fetchSubLocations = createAsyncThunk("masterData/fetchSubLocations", async (_, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "mast_sub_location",
        operation: "list",
        filter: `client_id = '${clientId}'`,
    };
    return await fetchListData("mast_sub_location", payload);
});

// Location Divisions
export const fetchLocationDivisions = createAsyncThunk("masterData/fetchLocationDivisions", async (_, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "location_divison",
        operation: "list",
        filter: `client_id = '${clientId}'`,
    };
    return await fetchListData("location_divison", payload);
});

// Barcodes
export const fetchBarcodes = createAsyncThunk("masterData/fetchBarcodes", async (_, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "mast_barcode",
        operation: "list",
        filter: `client_id = '${clientId}'`,
    };
    return await fetchListData("mast_barcode", payload);
});

// Products
export const fetchProducts = createAsyncThunk("masterData/fetchProducts", async (product_code, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "mast_product",
        operation: "list",
        filter: `client_id = '${clientId}'${product_code ? ` AND product_code = '${product_code}'` : ''}`,
    };
    return await fetchListData("mast_product", payload);
});

// Search Products
export const searchProducts = createAsyncThunk("masterData/searchProducts", async (searchQuery, { getState }) => {
    const clientId = getState().auth.clientInfo?.client_id;
    const payload = {
        table: "mast_product",
        operation: "list",
        filter: `client_id = '${clientId}' AND (product_des LIKE '%${searchQuery}%' OR product_id LIKE '%${searchQuery}%' OR product_code LIKE '%${searchQuery}%')`,
    };
    return await fetchListData("mast_product", payload);
});

// Fetch all master data at once
export const fetchAllMasterData = createAsyncThunk("masterData/fetchAllMasterData", async (_, { dispatch }) => {
    await Promise.all([dispatch(fetchLocations()), dispatch(fetchSubLocations()), dispatch(fetchBarcodes()), dispatch(fetchProducts())]);
});

const masterDataSlice = createSlice({
    name: "masterData",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchError = null;
        },
        clearErrors: (state) => {
            state.costCentersError = null;
            state.locationsError = null;
            state.subLocationsError = null;
            state.locationDivisionsError = null;
            state.barcodesError = null;
            state.productsError = null;
            state.searchError = null;
        },
    },
    extraReducers: (builder) => {
        // Cost Centers
        builder
            .addCase(fetchCostCenters.pending, (state) => {
                state.costCentersLoading = true;
                state.costCentersError = null;
            })
            .addCase(fetchCostCenters.fulfilled, (state, action) => {
                state.costCentersLoading = false;
                state.costCenters = action.payload.data || [];
            })
            .addCase(fetchCostCenters.rejected, (state, action) => {
                state.costCentersLoading = false;
                state.costCentersError = action.error.message;
            });

        // Locations
        builder
            .addCase(fetchLocations.pending, (state) => {
                state.locationsLoading = true;
                state.locationsError = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.locationsLoading = false;
                state.locations = action.payload.data || [];
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.locationsLoading = false;
                state.locationsError = action.error.message;
            });

        // Sub Locations
        builder
            .addCase(fetchSubLocations.pending, (state) => {
                state.subLocationsLoading = true;
                state.subLocationsError = null;
            })
            .addCase(fetchSubLocations.fulfilled, (state, action) => {
                state.subLocationsLoading = false;
                state.subLocations = action.payload.data || [];
            })
            .addCase(fetchSubLocations.rejected, (state, action) => {
                state.subLocationsLoading = false;
                state.subLocationsError = action.error.message;
            });

        // Location Divisions
        builder
            .addCase(fetchLocationDivisions.pending, (state) => {
                state.locationDivisionsLoading = true;
                state.locationDivisionsError = null;
            })
            .addCase(fetchLocationDivisions.fulfilled, (state, action) => {
                state.locationDivisionsLoading = false;
                state.locationDivisions = action.payload.data || [];
            })
            .addCase(fetchLocationDivisions.rejected, (state, action) => {
                state.locationDivisionsLoading = false;
                state.locationDivisionsError = action.error.message;
            });

        // Barcodes
        builder
            .addCase(fetchBarcodes.pending, (state) => {
                state.barcodesLoading = true;
                state.barcodesError = null;
            })
            .addCase(fetchBarcodes.fulfilled, (state, action) => {
                state.barcodesLoading = false;
                state.barcodes = action.payload.data || [];
            })
            .addCase(fetchBarcodes.rejected, (state, action) => {
                state.barcodesLoading = false;
                state.barcodesError = action.error.message;
            });

        // Products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.productsLoading = true;
                state.productsError = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.productsLoading = false;
                state.products = action.payload.data || [];
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.error.message;
            });

        // Search Products
        builder
            .addCase(searchProducts.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload.data || [];
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.error.message;
            });
    },
});

export const { clearSearchResults, clearErrors } = masterDataSlice.actions;

// Selectors
export const selectCostCenters = (state) => state.masterData.costCenters;
export const selectLocations = (state) => state.masterData.locations;
export const selectSubLocations = (state) => state.masterData.subLocations;
export const selectLocationDivisions = (state) => state.masterData.locationDivisions;
export const selectBarcodes = (state) => state.masterData.barcodes;
export const selectProducts = (state) => state.masterData.products;
export const selectSearchResults = (state) => state.masterData.searchResults;

export const selectMasterDataLoading = (state) => ({
    costCenters: state.masterData.costCentersLoading,
    locations: state.masterData.locationsLoading,
    subLocations: state.masterData.subLocationsLoading,
    locationDivisions: state.masterData.locationDivisionsLoading,
    barcodes: state.masterData.barcodesLoading,
    products: state.masterData.productsLoading,
    search: state.masterData.searchLoading,
});

export const selectMasterDataErrors = (state) => ({
    costCenters: state.masterData.costCentersError,
    locations: state.masterData.locationsError,
    subLocations: state.masterData.subLocationsError,
    locationDivisions: state.masterData.locationDivisionsError,
    barcodes: state.masterData.barcodesError,
    products: state.masterData.productsError,
    search: state.masterData.searchError,
});

export default masterDataSlice.reducer;
