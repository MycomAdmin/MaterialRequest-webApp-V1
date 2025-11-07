import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { axiosCrudInstance } from "../../config/axiosInstance";
import getCurrentDateTimeUTC from "../../utils/getCurrentDateTimeUTC";
import getUserDetails from "../../utils/getUserDetails";
import { getClientId } from "../../utils/sessionStorage";

const initialState = {
    materialRequestLoading: false,
    materialRequestError: null,
    materialRequestData: [],
    materialRequestCreateLoader: false,
    materialRequestCreateStatus: "",
    materialRequestDataForCreate: {
        table: "MQ_HDR",
        operation: "create",
        master_data: {
            client_id: sessionStorage.getItem("ClientID"),
            doc_id: "",
            doc_no: "",
            loc_no: "",
            doc_date: "",
            doc_type: "MQ",
            tran_type: "Request",
            posted: "N",
            completed: "N",
            approved: "N",
            closed: "N",
            remarks: "",
            created_date: "",
            created_user: "",
            updated_user: "",
            updated_date: "",
            updTimeStamp: "",
            cost_center: "",
            doc_req_date: "",
            doc_req_time: "",
            total_amount: "",
            total_tax_amount: "",
            total_net_amount: "",
        },
        details: [
            {
                table: "MQ_TRAN",
                data: [],
            },
        ],
    },
    singleMaterialRequestData: null,
};

export const fetchMaterialRequests = createAsyncThunk("fetchMaterialRequests", async (_, { getState }) => {
    const ClientID = getState().auth.clientInfo?.client_id;

    try {
        const response = await axiosCrudInstance.post(
            `material_request`,
            {
                table: "MQ_HDR",
                operation: "list",
                filter: `client_id = '${ClientID}'`,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const fetchMaterialRequestById = createAsyncThunk("fetchMaterialRequestById", async ({ doc_id, doc_no }, { getState }) => {
    const ClientID = getState().auth.clientInfo?.client_id;

    try {
        const response = await axiosCrudInstance.post(
            `material_request`,
            {
                table: "MQ_HDR",
                operation: "read",
                master_data: {
                    doc_no,
                    doc_id,
                    client_id: ClientID,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const fetchDeleteMaterialRequest = createAsyncThunk("fetchDeleteMaterialRequest", async ({ doc_id, doc_no }, { dispatch, getState }) => {
    const ClientID = getState().auth.clientInfo?.client_id;

    try {
        const response = await axiosCrudInstance.post(
            `material_request`,
            {
                table: "MQ_HDR",
                operation: "delete",
                master_data: {
                    doc_no,
                    doc_id,
                    client_id: ClientID,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        dispatch(fetchMaterialRequests());
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const fetchUpdateMaterialRequest = createAsyncThunk("fetchUpdateMaterialRequest", async (data, { dispatch }) => {
    try {
        const response = await axiosCrudInstance.post(`material_request`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        await dispatch(fetchMaterialRequests());
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const fetchPrintMaterialRequest = createAsyncThunk("fetchPrintMaterialRequest", async (_, { getState }) => {
    try {
        const payload = getState().materialRequest.singleMaterialRequestData;
        const response = await axiosInstance.post(`CloudERP_GetSC_PrintFile`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

const materialRequestSlice = createSlice({
    name: "materialRequest",
    initialState,
    // In materialRequestSlice.js - Update the reducer
    reducers: {
        updateMaterialRequestFields: (state, action) => {
            state.materialRequestDataForCreate.master_data = {
                ...state.materialRequestDataForCreate.master_data,
                ...action.payload,
            };
        },
        updateMaterialRequestDetails: (state, action) => {
            // Remove expanded property from items before storing
            const cleanedItems = action.payload.map((item) => {
                const { expanded, ...cleanItem } = item;
                return cleanItem;
            });
            state.materialRequestDataForCreate.details[0].data = cleanedItems;
        },
        updateMaterialRequestDetailsWithUI: (state, action) => {
            // Use this for UI state updates that include expanded property
            state.materialRequestDataForCreate.details[0].data = action.payload;
        },
        resetMaterialRequestDataForCreate: (state) => {
            state.materialRequestDataForCreate = {
                ...initialState.materialRequestDataForCreate,
                master_data: {
                    ...initialState.materialRequestDataForCreate.master_data,
                    client_id: getClientId(),
                    created_user: getUserDetails()?.user_name || "",
                    created_date: getCurrentDateTimeUTC() || "",
                    updTimeStamp: getCurrentDateTimeUTC(),
                    updated_date: getCurrentDateTimeUTC(),
                    updated_user: getUserDetails()?.user_name || "",
                },
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaterialRequests.pending, (state) => {
                state.materialRequestLoading = true;
                state.materialRequestError = null;
            })
            .addCase(fetchMaterialRequests.fulfilled, (state, action) => {
                state.materialRequestLoading = false;
                state.materialRequestError = null;
                state.materialRequestData = action.payload.data;
            })
            .addCase(fetchMaterialRequests.rejected, (state, action) => {
                state.materialRequestLoading = false;
                state.materialRequestError = action.error.message;
            })
            .addCase(fetchMaterialRequestById.fulfilled, (state, action) => {
                state.materialRequestDataForCreate = {
                    table: "MQ_HDR",
                    operation: "update",
                    master_data: {
                        ...action.payload.data.MQ_HDR,
                        _upd: "U",
                        updTimeStamp: getCurrentDateTimeUTC(),
                        updated_date: getCurrentDateTimeUTC(),
                        updated_user: getUserDetails()?.user_name || "",
                    },
                    details: [
                        {
                            table: "MQ_TRAN",
                            data: action.payload.data.MQ_TRAN,
                        },
                    ],
                };
                state.singleMaterialRequestData = action.payload.data;
            })
            .addCase(fetchUpdateMaterialRequest.fulfilled, (state) => {
                state.materialRequestCreateLoader = false;
            })
            .addCase(fetchUpdateMaterialRequest.pending, (state) => {
                state.materialRequestCreateLoader = true;
            })
            .addCase(fetchUpdateMaterialRequest.rejected, (state, action) => {
                state.materialRequestCreateLoader = false;
                state.materialRequestError = action.error.message;
            });
    },
});

export const { updateMaterialRequestFields, updateMaterialRequestDetails, resetMaterialRequestDataForCreate } = materialRequestSlice.actions;

export default materialRequestSlice.reducer;
