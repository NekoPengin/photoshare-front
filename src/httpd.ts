import axios from "axios";

const baseDomain = import.meta.env.VITE_API_BASE_DOMAIN;
const apiPath = import.meta.env.VITE_API_PATH;
const baseURL = `${baseDomain}${apiPath}`;

const http = axios.create({
  // Access to XMLHttpRequest at 'http://localhost:8787/api/direct-upload-url/2'
  // from origin 'http://localhost:5173' has been blocked by CORS policy:
  // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'
  // when the request's credentials mode is 'include'. The credentials mode of requests initiated
  // by the XMLHttpRequest is controlled by the withCredentials attribute.

  withCredentials: true, //false, //cookie
  baseURL: baseURL,
});

export default http;
