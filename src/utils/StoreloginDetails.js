export default function StoreLoginDetails(data) {
    const storeData = JSON.stringify(data);
    sessionStorage.setItem("Api details", storeData);
}
