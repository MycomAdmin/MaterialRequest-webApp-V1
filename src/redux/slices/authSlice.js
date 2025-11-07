// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");
    const storedClientInfo = sessionStorage.getItem("clientInfo");
    const storedUserAccess = sessionStorage.getItem("userAccess");
    const storedLogin = sessionStorage.getItem("Login");

    return {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        clientInfo: storedClientInfo ? JSON.parse(storedClientInfo) : null,
        userAccess: storedUserAccess ? JSON.parse(storedUserAccess) : [],
        isAuthenticated: storedLogin === "true" || false,
        isLoading: false,
        error: null,
    };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            const { user, clientInfo, userAccess } = action.payload;

            state.user = user;
            state.clientInfo = clientInfo;
            state.userAccess = userAccess;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            // Store in sessionStorage
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("clientInfo", JSON.stringify(clientInfo));
            sessionStorage.setItem("userAccess", JSON.stringify(userAccess));
            sessionStorage.setItem("Login", "true");
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;

            // Clear sessionStorage on failure
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("clientInfo");
            sessionStorage.removeItem("userAccess");
            sessionStorage.setItem("Login", "false");
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.clientInfo = null;
            state.userAccess = [];
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;

            // Clear all auth-related sessionStorage
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("clientInfo");
            sessionStorage.removeItem("userAccess");
            sessionStorage.removeItem("baseURL");
            sessionStorage.removeItem("crud_URL");
            sessionStorage.removeItem("common_url");
            sessionStorage.removeItem("report_URL");
            sessionStorage.removeItem("ClientID");
            sessionStorage.setItem("Login", "false");
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            sessionStorage.setItem("user", JSON.stringify(state.user));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError } = authSlice.actions;

export default authSlice.reducer;
