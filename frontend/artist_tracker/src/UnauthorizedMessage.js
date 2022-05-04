import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './UnauthorizedMessage.css'

function UnauthorizedMessage() {
    return(
        <div className='UnauthorizedMessage'>
            <h2 >Oops... </h2>
            <p>You're not authorized to view this page.</p>
            <div>
                <Link to='/'><Button variant='primary'>Back Home</Button></Link>
            </div>
        </div>
        
    )
}

export default UnauthorizedMessage;