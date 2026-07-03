import React from 'react'
import type {allFavoritesProps} from '../customTypes/types'
import { allrepos } from '../api/favorites'

export default function AllFavorites({
    repoStatus, setRepoStatus, repos, setRepos
}:allFavoritesProps) {
    React.useEffect(() => {
        const fetchRepos = (async () => {
            setRepoStatus({status: 'loading'})

            try {
                const data = await allrepos();
                console.log(data)
                setRepoStatus({status: 'success', data: data})
            } catch(err) {
                console.log('Allfavorites error:', err)
                setRepoStatus({status: "error", error: err})
            }
        })
        fetchRepos()
    }, [])
}