import React, { useCallback, useContext } from 'react'
import { withRouter, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import app from './base'
import { AuthContext } from "./utils/auth"
import './loginstyles.css'

const Login = ({ history }) => {
    const handleLogin = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await app
                .auth()
                .signInWithEmailAndPassword(email.value, password.value);
            history.push('/');

        } catch (er) {
            alert(er)
        }
    }, [history]);

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to='/' />
    }


    return (
        <div className='container'>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
                <label>
                    email: &nbsp;
                    <input name='email' type='email' placeholder='email' />
                </label>
                <br />
                <label>
                    password: &nbsp;
                    <input name='password' type='password' placeholder='password'></input>

                </label>
                <br />
                <button type='submit'>Log in</button>
            </form>
            <div>
                <p>Don't have an account?</p>
                <Link to='/Signup'>Click Here to Sign Up</Link>
            </div>
        </div>
    )

}

export default withRouter(Login)