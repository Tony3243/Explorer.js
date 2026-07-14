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
                if(isAxiosError(err) && err.response?.status === 500) {
                    setRepoStatus({status: 'success', data: repos})
                } else {
                    setRepoStatus({status: 'error', error: err})
                }
            }
    })

    if(repoStatus.status === 'idle') return null

    if(repoStatus.status === 'loading') return (
        <p>Loading Favorites...</p>
    )
    if(repoStatus.status === 'error') return (
        <p>Error: {repoStatus.error.message}</p>
    )

    if(repoStatus.status === 'success') return (
        <div className='adjust-logout'>
            <div>
                <input type='text' id='githubusername' name='githubUsername' placeholder='Github username' value={githubUsername}
                onChange={((e) => setGithubUsername(e.target.value))}></input>
                <button onClick={handleSearch}type='button'>search</button> 
            </div>
            <button className='logout' onClick={logoutHandler} type='button'>Logout</button>
            <ul>
                {repos.map((repo: UserRepoData) => (
                    <li key={repo.repo_id}>
                        <div>
                        <p>Name: {repo.repo_name}</p>
                        <a href={repo.repo_url}>View Repo</a>
                        <p>Description: {repo.description}</p>
                        <p>Rating: {repo.rating}</p>
                        <button onClick={() => {idDeleteModal.current = repo.repo_id; setDeletedId(idDeleteModal.current); deleteModal.current?.showModal()}}>Delete</button>
                        </div>
                    </li>
                ))}
                <dialog ref={deleteModal}>
                    <h6>Are you sure you want to delete?</h6>
                    <button type='button' onClick={() => deleteHandler(idDeleteModal.current!)} disabled={isDelete}>{isDelete ? "Deleting..." : 'Yes'}</button>
                    <button type='button' onClick={() => deleteModal.current.close()}>No</button>
                </dialog>
            </ul>
            <dialog ref={searchModal}>
                <p>Username not found</p>
            </dialog>
        </div>
    )
}