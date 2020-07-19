import React, { useContext, useEffect } from 'react'
import app from './base'
import Header from './Header'
import { AuthContext } from "./utils/auth";
import * as firebase from 'firebase'
import './homestyles.css'

/*PROBLEMS



*/

const Home = () => {

    const { currentUser } = useContext(AuthContext);

    //check for any profile updates / set profile data in db
    useEffect(() => {
        firebase.database().ref('users/' + currentUser.uid).update({
            nickname: currentUser.displayName,
            email: currentUser.email
        })
    }, [currentUser.uid, currentUser.email, currentUser.displayName]);

    //updateroomlist helper function, iterates through the object returned from the database and gets the name tag of each room to display it on the dom
    const populateRooms = (arr) => {
        let list = document.getElementById('roomList')
        console.log(typeof arr)
        for (let i in arr) {
            if (arr.hasOwnProperty(i)) {
                let item = document.createElement('li');
                item.appendChild(document.createTextNode(arr[i].name));
                list.appendChild(item)
            }
        }
        return list
    }




    //creates uuid
    const createUniqueId = () => {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            // eslint-disable-next-line no-mixed-operators
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid
    }


    //handles button creating new room
    const handleClick = () => {

        let roomName = prompt("Please enter the room name", "Room 1")
        //let newPostKey = firebase.database().ref('users/' + currentUser.uid + '/rooms').push().key;
        let room = { id: createUniqueId(), name: roomName }
        if (roomName) {
            firebase.database().ref('users/' + currentUser.uid + '/rooms').push(room)
        }

    }



    //updates the dom with the room list
    useEffect(() => {
        const updateRoomList = () => {
            let roomRef = firebase.database().ref('users/' + currentUser.uid + '/rooms')
            roomRef.on('value', function (data) {
                //deletes the entire list, then adds the entire thing again, or else it will just repeat the list over with the one added element
                let root = document.getElementById('roomList')
                while (root.firstChild) {
                    root.removeChild(root.firstChild)
                }
                populateRooms(data.val())
            })
        }
        updateRoomList()
    }, [currentUser.uid,])










    return (
        <>
            <Header>
                <h1 style={{ textAlign: 'center' }}>Welcome, {currentUser.displayName}</h1>
                <button onClick={() => app.auth().signOut()}>Sign Out</button>
                <h2 style={{ textAlign: 'center' }} >Rooms</h2>
                <div style={{ textAlign: 'center', listStylePosition: 'inside' }} id='roomList'>

                </div>
                <div className='roombuttonwrapper'>
                    <button className='addRoomButton' onClick={handleClick}>Add new Room</button>
                </div>
            </Header>
        </>
    )
}

export default Home