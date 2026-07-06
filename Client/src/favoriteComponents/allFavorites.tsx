import React from 'react'
import { useNavigate } from 'react-router-dom'
import type {AllFavoritesProps, SearchUsername} from '../customTypes/types'
import { allrepos, search } from '../api/favorites'
import { logout } from '../api/auth'

export default function AllFavorites({repoStatus, setRepoStatus, repos, setIsLogin, setLoginStatus, githubUsername, setGithubUsername}:AllFavoritesProps):React.ReactNode {
    const navigating = useNavigate();

    //loads all the user favorite repos once logged in
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
    
    //handles user logging out
    const logoutHandler = (async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        setLoginStatus({status: 'loading'})

        try{
            const refreshToken: string = localStorage.getItem('refresh')

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

    const handleSearch = (async(e) => {
        e.preventDefault();

        setRepoStatus({status: 'loading'})
        try {  
            const data = await search(githubUsername)
            console.log(data)
            setRepoStatus({status: 'success', data: data})
            navigating(`/search/:${githubUsername}`)//navigating to the searched usernames repos

        }catch(err) {
            console.log('Search handler error:', err)
            setRepoStatus({status: 'error', error: err})
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
            <div>
                <input type='text' id='githubusername' name='githubUsername' placeholder='Github username' value={githubUsername}
                onChange={((e) => setGithubUsername(e.target.value))}></input>
                <button onClick={handleSearch}type='submit'>search</button>
            </div>
            <button className='logout' onClick={logoutHandler} type='submit'>Logout</button>
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