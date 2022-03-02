import axios from "axios";

// tao ra instance
const axiosClient = axios.create({
  baseURL: "http://js-post-api.herokuapp.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

localStorage.setItem("access_token", "fake - token");
// Interceptors : apply 1 cai gi do vao request or response
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    // Attach token to request if exists
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger response
    // Do something with response data

    return response.data;
  },
  function (error) {
    console.log("axiosClient - response error", error.response);
    if (!error.response) {
      throw new Error("Network error. Please try again later");
    }

    // if (error.response.status === 401) {
    //   // window.location.assign("/login.html");
    //   return;
    // }
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosClient;
