// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import materialRequestSlice from "./slices/materialRequestSlice";
import notificationSlice from "./slices/notificationSlice";
import themeSlice from "./slices/themeSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        theme: themeSlice,
        notification: notificationSlice,
        materialRequest: materialRequestSlice,
    },
});

export default store;
