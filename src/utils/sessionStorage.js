const getSession = (key) => {
  const item = sessionStorage.getItem(key);

  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return item; // fallback to raw value if not JSON
  }
};

const getClientId = () => {
  return getSession("ClientID");
};

const getLocation = () => {
  return sessionStorage.getItem("LocCode");
};

const getCompanyCode = () => {
  return getSession("comp_code");
};

const getConceptCode = () => {
  return getSession("DivCode");
};

export { getSession, getClientId, getLocation, getCompanyCode, getConceptCode };
