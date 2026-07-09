import { connection } from "./axios"

type authResponse = {
    access: string,
    refresh: string
}


export const signUp = async (username: string, email: string, password: string) => {
    try {
        const response = await connection.post<authResponse>('auth/register', {username, email, password});
        return response.data
    } catch (err: any) {
        if(err.response?.status === 500) {
            console.log(err);
            throw new Error("Api register technical error")
        }
        throw err//throws if conditional !== 500
    }
}

export const login = async (email: string, password: string) => {
    try {
        const response = await connection.post<authResponse>('auth/login', {email, password});
        return response.data
    } catch(err: any) {
        if(err.response?.status === 500) {
            console.log(err)
            throw new Error("Api login technical error")
        }
        throw err
    }
}

export const logout = async (token: string) => {
    try {
        const response = await connection.post('auth/logout', {token});
        return response.data
    } catch(err: any) {
        if(err.response?.status === 500) {
            console.log(err)
            throw new Error("Api logout technical error")
        }
        throw err
    }
}