import React from 'react'
import { isAxiosError } from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import type {RegisterProps} from '../customTypes/types.ts'
import {login} from '../api/auth.ts'

export default function LoginApp({
    email, setEmail, password, setPassword, authStatus, setAuthStatus, setIsLogin
}:RegisterProps){

    const navigating = useNavigate()
    const handleLogin = (async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setAuthStatus({status: 'loading'})
        try{
            const data = await login(email, password)

            localStorage.setItem('access', data.access)
            localStorage.setItem('refresh', data.refresh)

            setAuthStatus({status: "success", data: data})
            setIsLogin(true)

            navigating('/favorites')//once successful login, user navigates to this route
        } catch(err) {
            console.log('err:', err) 
            console.log('isAxiosError:', isAxiosError(err))
            console.log('response:', isAxiosError(err) && err.response)
            console.log('status:', isAxiosError(err) && err.response?.status)
            setAuthStatus({status: 'error', error: err})
        }
    })
    return (
        <div className='allLogin'>
            <p className='loginTitle'>Login-In</p>
            {authStatus.status === 'error' && 
            <div>
                <strong className='alert'>{Number(authStatus.error.response?.status) === 401 ?//401 means unauthorized, wrong email/password
                'Wrong email/password' : 'Something went wrong. Try again later'}</strong>
            </div>}
            <form className='loginForm'onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} required
                onChange={(e) => setEmail(e.target.value)}></input>

                <label htmlFor='password'>Password:</label>
                <input type="password" id="password" name='password' value={password} required
                onChange={(e) => setPassword(e.target.value)}></input>

                <button type='submit'>LogIn</button>
                <div>
                    <Link to='/register'>Don't have an account? Sign-Up</Link>
                </div>
            </form>
        </div>
    )
}