import React from "react";

function NotFound() {
    return(
        <>
            <div className='my-5 display-5'>Weird... we can't find this page...</div>
            <a className='btn btn-dark col col-2 mx-auto' href='/'>Home</a>
        </>
    )
}

export default NotFound;