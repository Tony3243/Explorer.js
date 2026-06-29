export type UserRepoData = {
    repo_name: string,
    repo_url: string,
    description: string,
    rating: number
}

export type Status<T> = 
    | {status: 'idle'}
    | {status: 'loading'}
    | {status: 'success', data: T}
    | {status: 'error', error: Error}

export type RegisterProps<T> = {
    username?: string,
    setUsername?: (value: string) => void
    email: string,
    setEmail: (value: string) => void,
    password: string, 
    setPassword: (value: string) => void
    setAuthStatus: (status: T, error?: Error) => void
    setIsLogin: (value: boolean) => void
}

export type Tokens = {access: string, refresh: string}