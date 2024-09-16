import axios from "axios";
import * as jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const token = localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access')) : "";
const refreshToken = localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : "";

const baseURL = 'http://localhost:8000/api/';

const AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' }
});

AxiosInstance.interceptors.request.use(async req => {
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
        const user = jwtDecode(token);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
            return req;
        } else {
            try {
                const refreshRes = await axios.post(`${baseURL}/token/refresh/`, { refresh: refreshToken });
                console.log(refreshRes.data);
                if (refreshRes.status === 200) {
                    localStorage.setItem('access', JSON.stringify(refreshRes.data.access));
                    req.headers.Authorization = `Bearer ${refreshRes.data.access}`;
                    return req;
                } else {
                    const res = await axios.post(`${baseURL}/token/refresh/`, { refresh: refreshToken });
                    if (res.status === 200) {
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                    }
                }
            } catch (error) {
                console.error("Token Refresh Error:", error);
                // Handle token refresh error (e.g., redirect to login page)
            }
        }
    }
    return req;
});

export default AxiosInstance;
