import React, { useContext, useEffect, useState } from 'react'
import app from './base'
import { AuthContext } from "./utils/auth";
import * as firebase from 'firebase'
import './homestyles.css'
import { Link } from 'react-router-dom'

/*TODO


clean up the code now that i have a central room reference.
[x(ithink)] I only really want the room key and name to show up in the user-side room reference and I can stop sending other info to RoomPage because its accessed in another way now.





*/

const Home = () => {

    const [domVars, setDomVars] = useState(['Loading...'])


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

        let elements = []
        for (let i in arr) {

            if (arr.hasOwnProperty(i)) {

                elements.push([arr[i].name, arr[i].amount, arr[i].id, i]);

            }
        }
        /*
        for (const [index, value] of elements.entries()) {
            list.push(<li key={index}><Link to='/'>{value}</Link></li>)
        }
        */
        return elements
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

        //let uid = currentUser.uid
        let roomName = prompt("Please enter the room name", "Room 1")
        let amount = parseFloat(prompt("Please enter the amount you would like to raise"), 10)
        let room = { id: createUniqueId(), name: roomName, amount: amount, members: [currentUser.uid] }
        if (roomName && (typeof amount == 'number')) {
            let newPostKey = firebase.database().ref('rooms/').push().key
            let updates = {}
            updates['/rooms/' + newPostKey] = room
            updates['/users/' + currentUser.uid + '/rooms/' + newPostKey] = { name: room.name, id: room.id }
            return firebase.database().ref().update(updates)
        }
        else {
            console.log(typeof amount)
        }

    }



    //updates the dom with the room list
    useEffect(() => {
        let roomRef = firebase.database().ref('users/' + currentUser.uid + '/rooms')
        roomRef.on('value', function (data) {
            setDomVars(populateRooms(data.val()))


        })

    }, [/*currentUser.uid, domVars, setDomVars*/])








    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Welcome, {currentUser.displayName}</h1>
            <button onClick={() => app.auth().signOut()}>Sign Out</button>
            <h2 style={{ textAlign: 'center' }} >Rooms</h2>
            <div style={{ textAlign: 'center', listStylePosition: 'inside' }} id='roomList'>

                {/*This function gets all keyvalue pairs from domvars and sends them to their location, ie, element[0] is the name of the room and [1] is the amount*/}
                {domVars.map(element => (
                    <li key={element[0] + element[2]}><Link to={{ pathname: `/rooms/${element[2]}`, state: { name: element[0], id: element[2], roomKey: element[3] } }}>{element[0]}</Link></li>
                ))}
                {console.log('Home page reached')}
            </div>
            <div className='roombuttonwrapper'>
                <button className='addRoomButton' onClick={handleClick}>Add new Room</button>
            </div>
        </>
    )
}

export default Home