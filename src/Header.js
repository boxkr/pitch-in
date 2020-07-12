import React from 'react'
import './headerstyles.css'

class Header extends React.Component {


    render(props) {
        return (
            <>
                <div className='Header'></div>
                <div>{this.props.children}</div>
            </>
        )
    }
}

export default Header