import { connection } from "./axios";

type UserRepoData = {
    repo_name: string,
    repo_url: string,
    description: string,
    rating: number
}

export const allrepos = async() => {
    try {
        const response = await connection.get('user/favorites'); 
        return response.data
    } catch(err: any) {
        if(err.response?.status === 500) {
            console.log(err)
            throw new Error('Api to get all repos suffered technical error')
        }
    }
}

export const addRepo = async(repoData: UserRepoData) => {
    try {
        const response = await connection.post<UserRepoData[]>('user/favorites', {repoData});
        return response.data
    } catch (err: any) {
        if(err.response?.status === 500) {
            console.log(err)
            throw new Error('Api to add new repo suffered technical error')
        }
    }
}

export const deleteRepo = async(id: number) => {
    try {
        const response = await connection.delete(`user/favorites/${id}`)
        return response.data
    }catch(err: any) {
        if(err.response?.status === 500) {
            console.log(err)
            throw new Error('Api to delete repo suffered technical error')
        }
    }
}

export const search = async(loginUsername: string) => {
    try {
        const response = await connection.get(`user/search/${loginUsername}`);
        return response.data
    } catch(err: any) {
        if(err.response?.status === 500) {
            console.log(err)
            throw new Error('Api to search user suffered technical error')
        }
    }
}