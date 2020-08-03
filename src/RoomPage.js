import React from 'react'
import { Component } from 'react'
import './roompagestyles.css'
import { Link } from 'react-router-dom'


class RoomPage extends Component {


    constructor() {
        super()
        this.state = {
            amount: 0
        }
    }

    componentDidMount() {

        this.setState({
            amount: this.props.location.state.amount
        })
    }
    render() {
        return (
            <>

                <h1 className='amountpretext'>The total cost is</h1>
                <h2 className='amount'>{this.state.amount}</h2>
                <div className='memberlist'></div>
                <button className='invitebutton'>Invite members</button>
                <Link to='/'>Go Back</Link>


            </>
        )
    }

}

export default RoomPage