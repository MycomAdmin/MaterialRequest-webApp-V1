export const previousDate = (days = 90) => {
    const date = new Date().toISOString().split("T")[0];
    // date.setDate(date.getDate() - days);
    return date;
};
