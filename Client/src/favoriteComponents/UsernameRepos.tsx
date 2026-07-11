import React from 'react'
import {useNavigate} from 'react-router-dom'
import { addRepo } from '../api/favorites'
import type { UsernameReposProps, UserRepoData} from '../customTypes/types'

export default function UsernameRepos({
    isAdded, setIsAdded, addedId, setAddedId, setRepos, repoStatus, setAddedStatus, githubUsername}: UsernameReposProps) {

        const addedRef = React.useRef<HTMLDialogElement>(null)//modal to show repo added to favorites

        React.useEffect(() => {
            if(isAdded && addedRef.current) {//if added a favorite
                addedRef.current.showModal();//open modal notification
                const timer = setTimeout(() => {//after timer hits, close the ref if addReff.current exist
                    addedRef.current?.close()
                }, 3000)
                return () => clearTimeout(timer)
            }
        }, [isAdded])

        const addHandler = (async(repo: UserRepoData) => {
            setAddedStatus({status: 'loading'})

            try {
                await addRepo(repo);
                setAddedStatus({status: 'success', data: repo})

                setRepos((prevRepos):UserRepoData[] => [...prevRepos, repo]);
                setAddedId(repo.repo_id)
                setIsAdded(true)
            }catch(err) {
                console.log('Add handler error:', err);
                setAddedStatus({status: 'error', error: err})
            }
        })
    return (
        <div className='username-data'>
            <h1>{githubUsername}</h1>
            <ul>
                {repoStatus.status === 'success' && repoStatus.data.map((repo:UserRepoData) => (
                    <li key={repo.repo_id}>
                        <div>
                        <p>Name: {repo.repo_name}</p>
                        <a href={repo.repo_url}>View Repo</a>
                        <p>Description: {repo.description}</p>
                        <p>Rating: {repo.rating}</p>
                        <button onClick={() => addHandler(repo)}>Add To favorites</button>
                        </div>
                    </li>
                ))}
            </ul>
            <dialog ref={addedRef}> 
                <p>Repo added to favorites!</p> {/* if added inside the mapping, we will get the same amount of modals per repo*/}
            </dialog>
        </div>
    )
}
