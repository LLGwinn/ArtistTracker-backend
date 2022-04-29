import React from 'react';
import GuestForm from './GuestForm';
import Button from 'react-bootstrap/Button';

function HomeGuest() {
    return (
        <div className="container-fluid">
            <div className="row justify-contents-center py-2">
                <h1>Your Artist Tracker!</h1>
            </div>
            <div className="row mb-3 py-4 border border-success">
                <div className="col-9 ">
                    <GuestForm />
                </div>
                <div className="col-3 p-4 justify-content-center border border-primary">
                    <p>Create an account to save your favorite artists!</p> 
                    <p>Every time you log in, you'll see
                        a list of their shows near you!
                    </p>
                    <Button className="col-7 p-3" variant="success" href="/">
                        Great idea! Sign me up!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HomeGuest;