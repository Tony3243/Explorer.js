import React from 'react'
import {useNavigate} from 'react-router-dom'
import { addRepo } from '../api/favorites'
import type { UsernameReposProps, UserRepoData} from '../customTypes/types'

export default function UsernameRepos({
    setRepoStatus, repoStatus, isAdded, setIsAdded, addedId, setAddedId}: UsernameReposProps) {

        const addHandler = (( repo: UserRepoData) => {
            setRepoStatus({status: 'loading'})

            try {
                const data = addRepo(repo)
                setIsAdded(true)
            }catch(err) {
                console.log('Add handler error:', err);
                setRepoStatus({status: 'error', error: err})
            }
        })
    return (
        <div className='username-data'>
            {repoStatus.status === 'success' && repoStatus.data.map((repo:any) => (
            <div className='other-repos'key={repo.repo_id}>
                <p>Name: {repo.repo_name}</p>
                <a href={repo.repo_url}>View Repo</a>
                <p>Description: {repo.description}</p>
                <p>Rating: {repo.rating}</p>
                <button onClick={() => addHandler(repo)}>Add To favorites</button>
            </div>
        ))}
        </div>
    )
}