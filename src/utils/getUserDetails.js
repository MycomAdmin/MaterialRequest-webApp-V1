export default function getUserDetails() {
    const userDetails = JSON.parse(sessionStorage.getItem("UserDetails"));
    if (userDetails) {
        return userDetails;
    } else {
        return null;
    }
}
