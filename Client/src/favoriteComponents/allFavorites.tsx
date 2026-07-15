import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type {AllFavoritesProps, UserRepoData} from '../customTypes/types'
import { allrepos, search, deleteRepo } from '../api/favorites'
import { logout } from '../api/auth'
import { isAxiosError } from 'axios'

export default function AllFavorites({
    setRepos, repoStatus, setRepoStatus, setIsLogin, setLoginStatus, setGithubUsername, githubUsername, isDelete, setIsDelete, deletedId, setDeletedId, repos, userNotFound, setuserNotFound
}:AllFavoritesProps):React.ReactNode {
    const navigating = useNavigate();
    const searchModal = useRef<HTMLDialogElement>(null)
    const deleteModal = useRef<HTMLDialogElement>(null)
    const idDeleteModal = useRef<null | number>(null) //ussed to store deletedID in an async function(redners on every function call)

    //loads all the user favorite repos once logged in
    React.useEffect(() => {
        const fetchRepos = (async () => {
            setRepoStatus({status: 'loading'})

            try {
                const data = await allrepos();
                console.log('favorites payload:', data)
                setRepoStatus({status: 'success', data: data})
                setRepos(data)
            } catch(err) {
                console.log('Allfavorites error:', err)
                setRepoStatus({status: "error", error: err})
            }
        })
        fetchRepos()
    }, [])
    
    //handles user logging out
    const logoutHandler = (async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        setLoginStatus({status: 'loading'})

        try{
            const refreshToken = localStorage.getItem('refresh')

            if(!refreshToken) {
                localStorage.removeItem('refresh')//removing the refresh token
                setIsLogin(false)
                navigating('/login')
                return
            }
            const data = await logout(refreshToken);
            setLoginStatus({status: 'success', data: data})

            setIsLogin(false)
            navigating('/login')
            localStorage.removeItem('refresh')//removing the refresh token
        }catch(err) {
            console.log('Logout Component error:', err);
            setLoginStatus({status: 'error', error: err})
        }
    })

    //searches username and their repos
    const handleSearch = (async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setRepoStatus({status: 'loading'})
        try {  
            const data = await search(githubUsername)
            setRepoStatus({status: 'success', data: data})
            navigating(`/search/${githubUsername}`)//navigating to the searched usernames repos
        }catch(err) {
            if(isAxiosError(err) && err.response?.status === 404) {
                setuserNotFound(true);//username not found
                setRepoStatus({status: 'success', data: repos})//still show repos eventhough username not found
            } else {
                setRepoStatus({status: 'error', error: err})//anything else shown
            }
        }
    })

    //modal for unknown username
    React.useEffect(() => {
        if(userNotFound && searchModal.current){
            searchModal.current.showModal();
            const timer = setTimeout(() => {
                searchModal.current?.close()
                setuserNotFound(false)//resets after timer
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [userNotFound])//references current typed username

    //deleting favorite repos
    const deleteHandler = (async( id: number) => {
            setIsDelete(true) //start loading
            console.log('id: ', id)
            try {
                await deleteRepo(id)
                setRepos(repos.filter((repo) => repo.repo_id !== id)) //filter out the repos that are not equal to the deleted Id'd
                setIsDelete(false)//reset
                deleteModal.current?.close()
            }catch(err) {
                console.log('Delete Handler error:', err)
                setIsDelete(false)
                setRepoStatus({status: 'error', error: err})
            }
    })

    if(repoStatus.status === 'idle') return null

    if(repoStatus.status === 'loading') return (
        <div className='state'>
            <div className='spinner' />
            <p>Loading your favorites…</p>
        </div>
    )
    if(repoStatus.status === 'error') return (
        <div className='state error'>
            <p>Something went wrong: {repoStatus.error.message}</p>
        </div>
    )

    if(repoStatus.status === 'success') return (
        <main className='page'>
            <div className='toolbar'>
                <div className='search-group'>
                    <input type='text' id='githubusername' name='githubUsername' placeholder='Search a GitHub username…' value={githubUsername}
                    onChange={((e) => setGithubUsername(e.target.value))}></input>
                    <button className='btn-primary' onClick={handleSearch} type='button'>Search</button>
                </div>
                <button className='logout btn-ghost' onClick={logoutHandler} type='button'>Logout</button>
            </div>

            <div className='page-head'>
                <h2 className='page-title'>Your <span className='accent'>favorite</span> repos</h2>
                <span className='count-pill'>{repos.length} saved</span>
            </div>

            <ul className='repo-grid'>
                {repos.length === 0 && (
                    <li className='empty'>No favorites yet — search a username above to start adding repos.</li>
                )}
                {repos.map((repo: UserRepoData) => (
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
                            <button className='btn-danger' onClick={() => {idDeleteModal.current = repo.repo_id; setDeletedId(idDeleteModal.current); deleteModal.current?.showModal()}}>Delete</button>
                        </div>
                    </li>
                ))}
                <dialog ref={deleteModal}>
                    <h6>Are you sure you want to delete?</h6>
                    <div className='modal-actions'>
                        <button className='btn-danger' type='button' onClick={() => deleteHandler(idDeleteModal.current!)} disabled={isDelete}>{isDelete ? "Deleting…" : 'Yes, delete'}</button>
                        <button className='btn-ghost' type='button' onClick={() => deleteModal.current.close()}>Cancel</button>
                    </div>
                </dialog>
            </ul>
            <dialog ref={searchModal}>
                <p>Username not found</p>
            </dialog>
        </main>
    )
}