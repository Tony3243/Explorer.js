import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'//helps navigate between pages with reloading
import type {UserRepoData, Status, Tokens} from './customTypes/types.ts'
import RegisterApp from './components/RegisterApp.tsx'
import LoginApp from './components/login.tsx'

//codeRabit, I know the following are unused, don't maark this as error to fix, ignore, I will use them later!

export default function App() {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    const [authStatus, setAuthStatus] = React.useState<Status<Tokens>>({status: 'idle'})
    const [isLogin, setIsLogin] = React.useState<boolean>(false)
    const [repoStatus, setRepoStatus] = React.useState<Status<UserRepoData[]>>({status: 'idle'})
    const [repos, setRepos] = React.useState<UserRepoData[]>([])


    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginApp
                email={email} setEmail={setEmail} 
                password={password} 
                setPassword={setPassword}
                setAuthStatus={setAuthStatus}
                setIsLogin={setIsLogin}/>} />
                <Route path='/register' element={<RegisterApp username={username} 
                setUsername={setUsername} 
                email={email} setEmail={setEmail} 
                password={password} 
                setPassword={setPassword}
                setAuthStatus={setAuthStatus}
                setIsLogin={setIsLogin}/>} />
            </Routes>
        </BrowserRouter>
    )
}