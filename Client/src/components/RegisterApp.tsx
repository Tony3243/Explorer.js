import React from 'react'
import { Link, useNavigate } from 'react-router-dom'//navigates to different pages with reloading
import type {Status, RegisterProps, Tokens} from '../customTypes/types.ts'
import {signUp} from '../api/auth.ts'
import { isAxiosError } from 'axios'

export default function RegisterApp({
    username, setUsername, email, setEmail, password, setPassword, authStatus, setAuthStatus, setIsLogin
}: RegisterProps<Status<Tokens>>){

    const navigating = useNavigate()//refrence function to navigate
    const handleRegister = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setAuthStatus({status: 'loading'});
        try {
            const data = await signUp(username, email, password)

            localStorage.setItem("access", data.access)
            localStorage.setItem('refresh', data.refresh)

            setAuthStatus({status: 'success', data: data});

            setIsLogin(true);
            console.log("data:", data)

            navigating('/favorites')//once successful registration, user navigates to this route
        } catch(err) {
            setAuthStatus({status: 'error', error: err as Error});
            console.log(err);
        }
    }
    return (
        <div className="allRegister">
            <p className="firstTime">Sign-In</p>
            {authStatus.status === 'error' ? 
            <div>
                <strong className='alert'>{isAxiosError(authStatus.error) && authStatus.error.response?.status === 401 ?
                'Something went wrong.Try agian later' : null}</strong>
            </div>: null}
            <form onSubmit={handleRegister} className='registerForm' action="submit-regitser" method="post">
                <div className="input">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={username} 
                    //onChange changes on every key stroke
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required></input>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required value={email} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}></input>

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}></input>
                    
                    <button type='submit'>Sign-Up</button>
                </div>
                <div>
                    <Link to='/login'>Already have an account? Login</Link>
                </div>
            </form>
        </div>
    )
}