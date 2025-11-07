export default function getCurrentDateTimeUTC() {
    const now = new Date();
    return now.toISOString().split(".")[0] + "Z";
}
