import React, { useContext, useEffect, useState } from 'react'
import app from './base'
import { AuthContext } from "./utils/auth";
import * as firebase from 'firebase'
import './homestyles.css'
import { Link } from 'react-router-dom'

/*TODO


make them redirect to a generated room page [/]
learn how to make dynamic webroutes with <route to=:/name />




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

                elements.push([arr[i].name, arr[i].amount, arr[i].id]);

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

        let roomName = prompt("Please enter the room name", "Room 1")
        let amount = parseFloat(prompt("Please enter the amount you would like to raise"), 10)
        //let newPostKey = firebase.database().ref('users/' + currentUser.uid + '/rooms').push().key;
        let room = { id: createUniqueId(), name: roomName, amount: amount }
        if (roomName && (typeof amount == 'number')) {
            firebase.database().ref('users/' + currentUser.uid + '/rooms').push(room)
        }
        else {
            console.log(typeof amount)
        }

    }



    //updates the dom with the room list
    useEffect(() => {
        let roomRef = firebase.database().ref('users/' + currentUser.uid + '/rooms')
        roomRef.on('value', function (data) {
            //deletes the entire list, then adds the entire thing again, or else it will just repeat the list over with the one added element
            /*
            while (root.firstChild) {
                root.removeChild(root.firstChild)
            }
            */
            //populates ref with array of room names, not supoposed to change but if doesnt use createref
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
                    <li key={element[0] + element[2]}><Link to={{ pathname: `/rooms/${element[2]}`, state: { amount: parseFloat(element[1]).toFixed(2), id: element[2] } }}>{element[0]}</Link></li>
                ))}
            </div>
            <div className='roombuttonwrapper'>
                <button className='addRoomButton' onClick={handleClick}>Add new Room</button>
            </div>
        </>
    )
}

export default Home