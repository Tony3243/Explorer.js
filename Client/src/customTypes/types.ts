export type UserRepoData = {
    repo_id: string
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

export type RegisterProps = {
    loginUsername?: string,
    setLoginUsername?: (value: string) => void
    email: string,
    setEmail: (value: string) => void,
    password: string, 
    setPassword: (value: string) => void,
    authStatus: Status<Tokens>
    setAuthStatus: (status: Status<Tokens>) => void
    setIsLogin: (value: boolean) => void
}

export type AllFavoritesProps = {
    repoStatus:Status<UserRepoData[]>, 
    setRepoStatus: (status: Status<UserRepoData[]>) => void,
    repos: UserRepoData[],
    setIsLogin: (value: boolean) => void,
    setLoginStatus: (value: Status<Tokens>) => void,
    githubUsername: string,
    setGithubUsername: (value: string) => void
}

export type Tokens = {access: string, refresh: string}

export type SearchUsername = {status: 'success', username: string}