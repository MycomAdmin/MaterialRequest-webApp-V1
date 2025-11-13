import { showNotification } from "../redux/slices/notificationSlice";

export const handleApiResponse = async (dispatch, apiCall, data, msg) => {
    if (apiCall === "isNormalNotification") {
        return dispatch(
            showNotification({
                severity: data ? "success" : "error",
                message: msg,
            })
        );
    }
    try {
        const res = await dispatch(apiCall(data));
        const { status, message, Message, Status, STATUS, LoginResult, MESSAGE, success, SUCCESS, Success } = res.payload?.[0] || res.payload || res.payload || {};

        console.log(res, "res");

        const isFulFilled = res?.meta?.requestStatus === "fulfilled";
        const fulFilledMessage = "Operation successful";
        // Checking success status based on the response
        const isSuccess =
            Success === "True" ||
            SUCCESS === "TRUE" ||
            SUCCESS === "true" ||
            STATUS ||
            success ||
            Status ||
            Status === "SUCCESS" ||
            isFulFilled ||
            (LoginResult && LoginResult.Result === "SUCCESS") ||
            status ||
            status === "success" ||
            (status && status.toLowerCase() === "success") ||
            (Status && Status.toUpperCase() === "SUCCESS") ||
            res.payload?.[0]?.Status;

        const notificationMessage =
            message ||
            Message ||
            (LoginResult && LoginResult.Message) ||
            MESSAGE ||
            res.payload?.[0]?.Message ||
            (Status && "Data Saved Successfully") ||
            (success === "true" && "Operation Successful") ||
            (isFulFilled && fulFilledMessage) ||
            (!Status && "An unexpected error occurred") ||
            Message;

        console.log(res.payload, isSuccess, notificationMessage, "notificationMessage");

        if (res.message?.toLowerCase() === "context deadline exceeded") {
            dispatch(
                showNotification({
                    severity: "error",
                    message: "Server is currently Busy, please try again later",
                })
            );
            return res;
        }

        if (res.error || res.meta?.requestStatus === "rejected") {
            dispatch(
                showNotification({
                    severity: "error",
                    message: "Sorry, we couldn't find any results. Please change your filter and try again.",
                })
            );
            return res;
        }

        dispatch(
            showNotification({
                severity: isSuccess ? "success" : "error",
                message: notificationMessage,
            })
        );
        return res;
    } catch (error) {
        console.error(error, "error msg");
        dispatch(
            showNotification({
                severity: "error",
                message: "An unexpected error occurred.",
            })
        );
        return error;
    }
};
