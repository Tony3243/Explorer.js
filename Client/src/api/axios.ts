import axios from 'axios'
import type {AxiosInstance, InternalAxiosRequestConfig} from 'axios'

export const connection: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        'Content-Type': 'application/json'
    }
})
connection.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token:string = localStorage.getItem('accessToken')//goes through local storage to read accessToken value
    if(token) {
        config.headers.Authorization = `Bearer ${token}`//change the authorization key's value into our current access token
    }
    return config
})