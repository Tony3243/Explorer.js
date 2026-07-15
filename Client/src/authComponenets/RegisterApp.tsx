import React from 'react'
import { Link, useNavigate } from 'react-router-dom'//navigates to different pages with reloading
import type {RegisterProps} from '../customTypes/types.ts'
import {signUp} from '../api/auth.ts'

export default function RegisterApp({
    loginUsername, setLoginUsername, email, setEmail, password, setPassword, authStatus, setAuthStatus, setIsLogin
}: RegisterProps){

    const navigating = useNavigate()//refrence function to navigate
    const handleRegister = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setAuthStatus({status: 'loading'});
        try {
            const data = await signUp(loginUsername, email, password)

            localStorage.setItem("access", data.access)
            localStorage.setItem('refresh', data.refresh)

            setAuthStatus({status: 'success', data: data});

            setIsLogin(true);

            navigating('/favorites')//once successful registration, user navigates to this route
        } catch(err) {
            setAuthStatus({status: 'error', error: err});
            console.log(err);
        }
    }
    return (
        <div className="auth-page">
            <div className="allRegister">
                <p className="firstTime">Create account</p>
                <p className="auth-subtitle">Start exploring and saving your favorite repos.</p>
                {authStatus.status === 'error' &&
                <strong className='alert'>{Number(authStatus.error.response?.status) === 401 ?
                    'Credentials are invalid. Try again' : 'Something went wrong. Try again later'}</strong>}
                <form onSubmit={handleRegister} className='registerForm' action="submit-regitser" method="post">
                    <div className="field">
                        <label htmlFor="loginUsername">Username</label>
                        <input type="text" id="loginUsername" name="loginUsername" placeholder="yourname" value={loginUsername}
                        //onChange changes on every key stroke
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginUsername(e.target.value)} required></input>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@example.com" required value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="••••••••" required value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}></input>
                    </div>
                    <button type='submit'>Sign Up</button>
                    <div className="auth-switch">
                        <Link to='/login'>Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}