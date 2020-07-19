import React, { useContext, useEffect } from 'react'
import app from './base'
import Header from './Header'
import { AuthContext } from "./utils/auth";
import * as firebase from 'firebase'


const Home = () => {

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        firebase.database().ref('users/' + currentUser.uid).set({
            email: currentUser.email
        })
    }, []);







    return (
        <>
            <Header>
                <h1>Welcome, {currentUser.email}</h1>
                <button onClick={() => app.auth().signOut()}>Sign Out</button>
            </Header>
        </>
    )
}

export default Home