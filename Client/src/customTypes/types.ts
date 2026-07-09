import type { AxiosError } from "axios"

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
    | {status: 'error', error: AxiosError}

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
    setGithubUsername: (value: string) => void,
    isDelete: boolean,
    setIsDelete: (value: boolean) => void,
    deletedId: null,
    setDeletedId: (value: null) => void,
}

export type UsernameReposProps = {
    repoStatus: Status<UserRepoData[]>
    setRepoStatus: (status: Status<UserRepoData[]>) => void,
    isAdded: boolean
    setIsAdded: (value: boolean) => void,
    addedId: null,
    setAddedId: (value: null) => void,
}

export type Tokens = {access: string, refresh: string}
