import React, { useEffect, useState, useContext } from 'react'
import { Component } from 'react'
import './roompagestyles.css'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'
import { AuthContext } from "./utils/auth"




/*TODO

Need a button to add funds, perhaps hooked up to a cloud function











*/
const RoomPage = (props) => {


    const [amount, setAmount] = useState([0])
    const [members, setMembers] = useState([[[]]]) //potential problem
    const { currentUser } = useContext(AuthContext);
    const roomId = props.location.state.roomKey



    /*
    constructor() {
        super()
        this.currentUser = AuthContext
        this.state = {
            amount: 0,
            roomKey: '',
            members: []
        }
    }
    */

    useEffect(() => {

        let ref = firebase.database().ref('rooms/' + props.location.state.roomKey)
        ref.on('value', (data) => {

            //fixes refire error
            setAmount(data.val() == null ? 0 : parseFloat(data.val().amount).toFixed(2))
            setMembers(data.val() == null ? 0 : data.val().members)

            /*
            this.setState({
                
                amount: parseFloat(data.val().amount).toFixed(2),
                members: data.val().members

            })
            */
        })

        /*
        this.setState({
            amount: this.props.location.state.amount,
            roomKey: this.props.location.state.roomKey
        })
        */


    }, [])


    const addUser = () => {

        let invitedID = prompt('Enter the ID of the user you would like to invite')

        //search users ref for uid

        let userRef = firebase.database().ref('users/' + invitedID + '/rooms/')

        //if found, add roomId to users rooms list
        if (userRef) {
            let updates = {}
            updates[roomId] = { id: props.location.state.id, name: props.location.state.name }
            userRef.update(updates)
        }
        else {
            console.log('id not found')
        }


        let counter = 0
        let peoplearray
        //then add user id to room list
        let roomRef = firebase.database().ref('rooms/' + roomId + '/members/')
        roomRef.once('value', data => {
            peoplearray = (data.val())
        })

        if (!peoplearray.includes(invitedID)) {
            //if uid is not in room list
            roomRef.once('value', data => {
                counter = data.val().length
            })
            let updates = {}
            updates[counter] = invitedID
            roomRef.update(updates)
        }
        else {
            return alert('user already added')
        }

        //if not found return error



    }

    const leaveRoom = () => {
        props.history.push('/')

        //delete instance of roomId in currentUser id
        let userRef = firebase.database().ref('users/' + currentUser.uid + '/rooms/' + roomId)
        userRef.remove()

        //delete instance of current user id in room id
        let roomRef = firebase.database().ref('rooms/' + roomId + '/members/')
        //find the ref of the pair in member that contains the user's id


        let removeToken = 0
        roomRef.orderByValue().equalTo(currentUser.uid).once('value', (data) => {
            data.forEach(element => {
                removeToken = (element.ref.getKey())
            })
        })


        roomRef.child(removeToken).remove()

    }

    const deleteRoom = () => {

        props.history.push('/')

        //find every key of every member, then search for them in users, then go in and delete roomId in each of them
        let idArray = []
        let roomMembersRef = firebase.database().ref('rooms/' + roomId + '/members')
        roomMembersRef.once('value', (data) => {
            let roomMembers = data.val()
            roomMembers.forEach((uId) => {
                //gets each individual member key in this room
                idArray.push(uId)
            })
        })
        //for each member, go into that member and delete roomid from rooms folder
        for (let i = 0; i < idArray.length; i++) {
            let id = idArray[i]
            let ref = firebase.database().ref('users/' + id + '/rooms/' + roomId);
            ref.remove()
        }

        //find the room id in roomref and delete it

        let roomRef = firebase.database().ref('rooms/' + roomId)
        roomRef.remove()






    }
    return (
        <>

            <h1 className='amountpretext'>The total cost is</h1>
            <h2 className='amount'>{amount}</h2>
            <div className='memberlist'>
                {members.map(member => (
                    <li key={member.uid}>{member}</li>
                ))}
            </div>
            <button onClick={addUser} className='invitebutton'>Invite members</button>
            <button onClick={deleteRoom} className='deleteroombutton'>Delete Room</button>
            <button onClick={leaveRoom} className='leaveroombutton'>Leave Room</button>
            <Link to='/'>Go Back</Link>
            {console.log('room page')}


        </>
    )
}


export default RoomPage
