import React from 'react'
import { useNavigate } from 'react-router-dom'
import type {AllFavoritesProps} from '../customTypes/types'
import { allrepos } from '../api/favorites'
import { logout } from '../api/auth'

export default function AllFavorites({repoStatus, setRepoStatus, repos, setIsLogin, setLoginStatus}:AllFavoritesProps):React.ReactNode {
    const navigating = useNavigate();

    React.useEffect(() => {
        const fetchRepos = (async () => {
            setRepoStatus({status: 'loading'})

            try {
                const data = await allrepos();
                setRepoStatus({status: 'success', data: data})
            } catch(err) {
                console.log('Allfavorites error:', err)
                setRepoStatus({status: "error", error: err})
            }
        })
        fetchRepos()
    }, [repos])
    
    const logoutHandler = (async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        setLoginStatus({status: 'loading'})

        try{
            const refreshToken = localStorage.getItem('refresh')
            const data = await logout(refreshToken);

            localStorage.removeItem('refresh')//removing the refresh token

            setLoginStatus({status: 'success', data: data})
            setIsLogin(false)
            navigating('/login')
        }catch(err) {
            console.log('Logout Component error:', err);
            setLoginStatus({status: 'error', error: err})
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
        <div>
            <button onClick={logoutHandler} type='submit'>Logout</button>
            {repoStatus.data.map((repo) => (
            <div key={repo.repo_id}>
                <p>{repo.repo_name}</p>
                <a href={repo.repo_url}>View Repo</a>
                <p>{repo.description}</p>
                <p>{repo.rating}</p>
            </div>
        ))}
        </div>
    )
}