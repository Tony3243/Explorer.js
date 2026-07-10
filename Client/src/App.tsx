import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'//helps navigate between pages with reloading
import type {UserRepoData, Status, Tokens} from './customTypes/types.ts'
import RegisterApp from './authComponenets/RegisterApp.tsx'
import LoginApp from './authComponenets/login.tsx'
import AllFavorites from './favoriteComponents/allFavorites.tsx'
import UsernameRepos from './favoriteComponents/UsernameRepos.tsx'

export default function App() {
    const [loginUsername, setLoginUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    const [registerStatus, setRegisterStatus] = React.useState<Status<Tokens>>({status: 'idle'})
    const [loginStatus, setLoginStatus] = React.useState<Status<Tokens>>({status: 'idle'})
    const [isLogin, setIsLogin] = React.useState<boolean>(false)
    const [repoStatus, setRepoStatus] = React.useState<Status<UserRepoData[]>>({status: 'idle'})
    const [repos, setRepos] = React.useState<UserRepoData[]>([])
    const [githubUsername, setGithubUsername] = React.useState<string>('')
    const [isDelete, setIsDelete] = React.useState<boolean>(false);
    const [deletedId, setDeletedId] = React.useState<number | null>(null)
    const [isAdded, setIsAdded] = React.useState<boolean>(false)
    const [addedId, setAddedId] = React.useState<string | null>(null)


    return (
        <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to='/register' replace/>}/> 
                <Route path='/register' element={<RegisterApp loginUsername={loginUsername} 
                setLoginUsername={setLoginUsername} 
                email={email} setEmail={setEmail} 
                password={password} 
                setPassword={setPassword}
                setAuthStatus={setRegisterStatus}
                authStatus={registerStatus}
                setIsLogin={setIsLogin}/>} />
                <Route path='/login' element={<LoginApp
                email={email} setEmail={setEmail} 
                password={password} 
                setPassword={setPassword}
                setAuthStatus={setLoginStatus}
                authStatus={loginStatus}
                setIsLogin={setIsLogin}/>} />
                <Route path='/favorites' element={<AllFavorites repoStatus={repoStatus}
                setDeletedId={setDeletedId}
                deletedId={deletedId}
                setIsDelete={setIsDelete} 
                isDelete={isDelete}
                setRepoStatus={setRepoStatus} 
                repos={repos} 
                setIsLogin ={setIsLogin} 
                setLoginStatus={setLoginStatus}
                githubUsername={githubUsername}
                setGithubUsername={setGithubUsername}/>}/>
                <Route path='/search/:username' element={<UsernameRepos
                repoStatus={repoStatus}
                isAdded={isAdded}
                setIsAdded={setIsAdded}
                addedId={addedId}
                setAddedId={setAddedId}
                setRepoStatus={setRepoStatus}
                setRepos={setRepos}/>}/>
            </Routes>
        </BrowserRouter>
        </div>
    )
}