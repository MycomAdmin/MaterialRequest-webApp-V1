// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import masterDataSlice from "./slices/masterDataSlice";
import materialRequestSlice from "./slices/materialRequestSlice";
import notificationSlice from "./slices/notificationSlice";
import themeSlice from "./slices/themeSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        theme: themeSlice,
        notification: notificationSlice,
        materialRequest: materialRequestSlice,
        masterData: masterDataSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
});

export default store;
