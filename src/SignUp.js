import React, { useCallback } from 'react'
import { withRouter } from 'react-router'
import app from './base'
import { Link } from 'react-router-dom'
import './loginstyles.css'


const SignUp = ({ history }) => {
    const handleSignUp = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await app
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value);
            history.push('/');

        } catch (er) {
            alert(er)
        }
    }, [history]);

    return (
        <div className='container'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
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
                <button type='submit'>Sign Up</button>
            </form>
            <div>
                <p>Already have an Account?</p>
                <Link to='/Login'>Click here to Sign In</Link>
            </div>
        </div>
    )

}

export default withRouter(SignUp)