import React from 'react'
import { Component } from 'react'


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

                <h1>The total cost is ${this.state.amount}</h1>
            </>
        )
    }

}

export default RoomPage