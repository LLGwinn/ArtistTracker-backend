import React from 'react';

function UnauthorizedMessage() {
    return(
        <>
            <div className='my-5 display-5'>Oops...</div> 
            <div className='mb-3 fs-4'>looks like you're not authorized to view this page...</div>
            <a className='btn btn-dark col col-2 mx-auto' href='/'>Home</a>
        </>       
    )
}

export default UnauthorizedMessage;