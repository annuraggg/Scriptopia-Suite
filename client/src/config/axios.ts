import axios from "axios";

const api = (getToken: any) => {
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL as string,
    });

    axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;


    api.interceptors.request.use(async (request) => {
        const token = await getToken();
        request.headers.Authorization = `Bearer ${token}`;
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return request;
    });

    api.interceptors.response.use(
        (response) => {
            console.log(response);
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    return api;
}

export default api;


