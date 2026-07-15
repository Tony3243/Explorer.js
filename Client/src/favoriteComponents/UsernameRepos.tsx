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
            try {
                const alreadyAdded = repos.some((r: UserRepoData) => r.repo_id === repo.repo_id); //check for duplicates
                if(alreadyAdded) {
                    setIsDuplicate(true)
                    return
                }
                setAddedStatus({status: 'loading'})
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
        <main className='page username-data'>
            <div className='page-head'>
                <h2 className='page-title'><span className='accent'>@{githubUsername}</span>'s repos</h2>
                <button className='btn-ghost' type='button' onClick={() => backToFavorites('/favorites')}>← Back to favorites</button>
            </div>
            <ul className='repo-grid'>
                {repoStatus.status === 'success' && repoStatus.data.length === 0 && (
                    <li className='empty'>This user has no public repositories.</li>
                )}
                {repoStatus.status === 'success' && repoStatus.data.map((repo:UserRepoData) => (
                    <li className='repo-card' key={repo.repo_id}>
                        <div className='repo-card-body'>
                            <div className='repo-top'>
                                <h3 className='repo-name'>{repo.repo_name}</h3>
                                <span className='rating-badge'>★ {repo.rating}</span>
                            </div>
                            <p className='repo-desc'>{repo.description || 'No description provided.'}</p>
                        </div>
                        <div className='repo-actions'>
                            <a className='btn btn-ghost' href={repo.repo_url} target='_blank' rel='noreferrer'>View Repo</a>
                            <button className='btn-primary' onClick={() => addHandler(repo)}>+ Add to favorites</button>
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
        </main>
    )
}
