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
    const token:string = localStorage.getItem('accessToken')//goes through local storage to read accessToken value
    if(token) {
        config.headers.Authorization = `Bearer ${token}`//change the authorization key's value into our current access token
    }
    return config
})

//handles refresh tokens
connection.interceptors.response.use((response:AxiosResponse<any, any>) => response,
    async(error: AxiosError) => {
        const  originalRequest = error.config as any;

        //checks if they can't find token and request has been retried
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true //if so mark as true to prevent infinite loop
            const refresh: string = localStorage.getItem("refreshToken");//if status causes an error, AT expired and retrieve our RT
    
            if(refresh) {
                //post our refresh token 
                const response = await connection.post('auth/refresh', refresh);

                if(error.config) {
                    return Promise.reject(error)//return if refreshToken silently fails
                }
    
                const newToken: string = response.data.accessToken;//access refresh Token
                localStorage.setItem("accessToken", newToken);//switch the AT to newToken
    
                error.config.headers.Authorization = `Bearer ${newToken}`//reinitializes failed orignal header request with NT
                return connection(error.config)//re-calls the connection with the newToken
            }
        }
        return Promise.reject(error)//return if refreshToken silently fails
    }
)