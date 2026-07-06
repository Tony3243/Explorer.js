import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'//helps navigate between pages with reloading
import type {UserRepoData, Status, Tokens} from './customTypes/types.ts'
import RegisterApp from './authComponenets/RegisterApp.tsx'
import LoginApp from './authComponenets/login.tsx'
import AllFavorites from './favoriteComponents/allFavorites.tsx'

export default function App() {
    const [loginloginUsername, setLoginUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    const [registerStatus, setRegisterStatus] = React.useState<Status<Tokens>>({status: 'idle'})
    const [loginStatus, setLoginStatus] = React.useState<Status<Tokens>>({status: 'idle'})
    const [isLogin, setIsLogin] = React.useState<boolean>(false)
    const [repoStatus, setRepoStatus] = React.useState<Status<UserRepoData[]>>({status: 'idle'})
    const [repos, setRepos] = React.useState<UserRepoData[]>([])
    const [githubUsername, setGithubUsername] = React.useState<string>()


    return (
        <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to='/register' replace/>}/> 
                <Route path='/register' element={<RegisterApp loginUsername={loginloginUsername} 
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
                setRepoStatus={setRepoStatus} 
                repos={repos} 
                setIsLogin ={setIsLogin} 
                setLoginStatus={setLoginStatus}
                githubUsername={githubUsername}
                setGithubUsername={setGithubUsername}/>}/>
            </Routes>
        </BrowserRouter>
        </div>
    )
}