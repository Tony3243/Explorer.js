import React from 'react'
import {useNavigate} from 'react-router-dom'
import { addRepo } from '../api/favorites'
import type { UsernameReposProps, UserRepoData} from '../customTypes/types'

export default function UsernameRepos({
    setRepoStatus, repoStatus, isAdded, setIsAdded, addedId, setAddedId, setRepos}: UsernameReposProps) {

        const addHandler = (async(repo: UserRepoData) => {
            setRepoStatus({status: 'loading'})

            try {
                const data = await addRepo(repo)
                console.log('data: ', data)

                setRepos((prevRepos):UserRepoData[] => [...prevRepos, data]);
                setAddedId(repo.repo_id)
                setIsAdded(true)
            }catch(err) {
                console.log('Add handler error:', err);
                setRepoStatus({status: 'error', error: err})
            }
        })
    return (
        <div className='username-data'>
            <ul>
                {repoStatus.status === 'success' && repoStatus.data.map((repo:UserRepoData) => (
                    <li key={repo.repo_id}>
                        <div>
                        <p>Name: {repo.repo_name}</p>
                        <a href={repo.repo_url}>View Repo</a>
                        <p>Description: {repo.description}</p>
                        <p>Rating: {repo.rating}</p>
                        <button onClick={() => addHandler(repo)}>Add To favorites</button>
                        {isAdded && <dialog>Repo Added!</dialog>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
