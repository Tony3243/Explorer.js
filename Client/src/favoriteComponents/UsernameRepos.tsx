import React from 'react'
import {useNavigate} from 'react-router-dom'
import { addRepo } from '../api/favorites'
import type { UsernameReposProps, UserRepoData} from '../customTypes/types'
import { isAxiosError } from 'axios'

export default function UsernameRepos({
    isAdded, setIsAdded, addedId, setAddedId, setRepos, repoStatus, setAddedStatus, githubUsername, repos, isDuplicate, setIsDuplicate, setRepoStatus}: UsernameReposProps) {

        const addedRef = React.useRef<HTMLDialogElement>(null)//modal to show repo added to favorites
        const alreadyAddedRef = React.useRef<HTMLDialogElement>(null)
        const backToFavorites = useNavigate()

        //Modal to show repo was added to favorites
        React.useEffect(() => {
            if(isAdded && addedRef.current) {//if added a favorite
                addedRef.current?.showModal();//open modal notification
                const timer = setTimeout(() => {//after timer hits, close the ref if addReff.current exist
                    addedRef.current?.close()
                    setIsAdded(false)
                }, 3000)
                return () => clearTimeout(timer)
            }
        }, [isAdded])

        //Modal to show duplicate im favorites
        React.useEffect(() => {
            if(isDuplicate && alreadyAddedRef.current) {
                alreadyAddedRef.current?.showModal()
                const timer = setTimeout(() => {
                    alreadyAddedRef.current?.close()
                    setIsDuplicate(false)
                }, 3000);
                return () => clearTimeout(timer)
            }
        }, [isDuplicate])

        const addHandler = (async(repo: UserRepoData) => {
            setAddedStatus({status: 'loading'})
            try {
                const alreadyAdded = repos.some((r: UserRepoData) => r.repo_id === repo.repo_id); //check for duplicates
                if(alreadyAdded) {
                    setIsDuplicate(true)
                    return
                }
                await addRepo(repo);
                setAddedStatus({status: 'success', data: repo})

                setRepos((prevRepos):UserRepoData[] => [...prevRepos, repo]);
                setAddedId(repo.repo_id)
                setIsAdded(true)
            }catch(err) {
                console.log('Add handler error:', err);
                if(isAxiosError(err) && err.response?.status === 500) {
                    setRepoStatus({status: 'success', data: repos})
                } else {
                    setRepoStatus({status: 'error', error: err})
                }
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
            {isDuplicate && <dialog ref={alreadyAddedRef}>
                <p>Repo already added</p>
            </dialog>}
            {isAdded && <dialog ref={addedRef}> 
                <p>Repo added to favorites!</p> {/* if added inside the mapping, we will get the same amount of modals per repo*/}
            </dialog>}
            <button type='button' onClick={() => backToFavorites('/favorites')}>Back</button>
        </div>
    )
}
