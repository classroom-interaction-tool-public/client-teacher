const prod = process.env.APP_ENV === "production";

const getApiBaseUrl = () => {
  return "http://10.212.26.199:5004";
};

const getThirdPartyApiBaseUrl = () => {
  return "http://10.212.26.199:5001";
};

export const API_BASE_URL = getApiBaseUrl();
export const API_BASE_URL_THIRD_PARTY = getThirdPartyApiBaseUrl();
