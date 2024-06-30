import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;

axios.interceptors.response.use((response) => response);

export default axios;
