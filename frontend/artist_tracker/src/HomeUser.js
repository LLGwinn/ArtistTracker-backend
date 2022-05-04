import React, {useContext, useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import { Navigate } from 'react-router-dom';
import ArtistTrackerApi from './api';
import AuthContext from './authContext';
import './Home.css';

function HomeUser( {logout} ) {
    const {currUser, token} = useContext(AuthContext);
    const [user, setUser] = useState({id: "", username: "",
                    firstName: "", email: "", city: "", distancePref: 0});

    useEffect( () => {
        async function getUserDetails(userId) {
            try {
                const user = await ArtistTrackerApi.getUser(userId, token);
                setUser(user);
            } catch(err) {
                console.log(err)
            }
        }
        getUserDetails(+currUser.id)
    }, [currUser])

    function handleLogout(evt) {
        evt.preventDefault();
        logout();
    }
    
    return (
        <div className="container-fluid">
            <div className="row py-2">
                <p className="display-5">Hi there, {user.firstName}!</p>
            </div>
            <div className="row mb-3 py-4 border border-success">
                <div className="col-9 ">
                    <p className="h3">Check out these shows from your favorite artists:</p>
                    LIST OF SHOWS GOES HERE.
                </div>
                <div className="col-3 p-4 align-items-center">
                    <div className="row mb-3">
                        <Button variant="primary" className="col-6 ms-auto">Add an artist</Button>
                    </div>
                    <div className="row mb-3">
                        <Button variant="primary" href={`/profile/${currUser.id}`}
                                className="col-6 ms-auto">
                            Change my settings
                        </Button>
                    </div>
                    <div className="row mb-3">
                        <Button variant="outline-primary" onClick={handleLogout} className="col-6 ms-auto">
                            Log out
                        </Button>
                    </div>    
                </div>
            </div>
        </div>
    )
}

export default HomeUser;