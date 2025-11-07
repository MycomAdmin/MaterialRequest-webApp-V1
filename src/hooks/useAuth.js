// src/hooks/useAuth.js
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginStart, loginSuccess, logout, updateUser } from "../redux/slices/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const signIn = (userData) => {
        dispatch(loginSuccess(userData));
    };

    const signInWithCredentials = () => {
        dispatch(loginStart());
    };

    const signOut = () => {
        dispatch(logout());
    };

    const updateProfile = (userData) => {
        dispatch(updateUser(userData));
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    return {
        ...auth,
        signIn,
        signInWithCredentials,
        signOut,
        updateProfile,
        clearAuthError,
    };
};
