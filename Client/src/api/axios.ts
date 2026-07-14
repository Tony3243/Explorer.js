import axios from 'axios'
import type {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError} from 'axios'

export const connection: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        'Content-Type': 'application/json'
    }
})

//handles regular access Tokens
connection.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token:string = localStorage.getItem('access')//goes through local storage to read accessToken value
    console.log(token)
    if(token) {
        config.headers.Authorization = `Bearer ${token}`//change the authorization key's value into our current access token
        
    }
    return config
})

//handles refresh tokens
connection.interceptors.response.use((response:AxiosResponse<any, any>) => response,
    async(error: AxiosError) => {
        const  originalRequest = error.config as any;

        //prevent infinite loop
        if(originalRequest?._retry) {
            return Promise.reject(error)
        }
        const refresh: string | null = localStorage.getItem('refresh')

        //401 + refresh token === expired refreshTokenOkay.
        if(error.response?.status === 401 && refresh) {
            originalRequest._retry = true;
            try {
                const response = await connection.post('auth/refresh', {token: refresh})
                const newToken: string = response.data.accessToken;

                localStorage.setItem('access', newToken);

                //update header and retry connection
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return connection(originalRequest)
            } catch(err) {
                //if resfresh failed remove access and refresh and move to login
                localStorage.removeItem('access');
                localStorage.removeItem('refresh')
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)