import axios from "axios";
import { getFromLocalStorage, USER_TOKEN_KEY } from "./local-storage";
import { ENV } from "./consts";

export const getAuthorizationHeader = () =>
  `Bearer ${getFromLocalStorage(USER_TOKEN_KEY) ?? ""}`;

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_ENV === ENV.DEVELOPMENT
      ? "https://" +
        import.meta.env.VITE_VERCEL_BRANCH_URL.replace(
          "shabetzna-git",
          "shabetzna-server-git"
        ) +
        "/api"
      : import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = getAuthorizationHeader();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";

instance.interceptors.request.use((request) => {
  // console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

instance.interceptors.response.use((response) => {
  // console.log("Response:", JSON.stringify(response, null, 2));
  return response;
});

export default instance;
