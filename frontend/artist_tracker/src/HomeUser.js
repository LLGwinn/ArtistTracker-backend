import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import AuthContext from './authContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function HomeUser( {logout} ) {
    const {currUser} = useContext(AuthContext);
    const navigate = useNavigate();

    function addArtist(evt) {
        evt.preventDefault();
        console.log('clicked addArtist')
        navigate('/addArtist');
    }

    function handleLogout(evt) {
        evt.preventDefault();
        logout();
    }
    
    return (
        <div className="container-fluid">
            <div className="row py-2">
                <p className="display-5">Hi there, {currUser.firstName}!</p>
            </div>
            <div className="row mb-3 py-4 border border-success">
                <div className="col-9 ">
                    <p className="h3">Check out these shows from your favorite artists:</p>
                    LIST OF SHOWS GOES HERE.
                </div>
                <div className="col-3 p-4 align-items-center">
                    <div className="row mb-3">
                        <Button variant="primary" 
                                className="col-6 ms-auto"
                                onClick={addArtist}>Add an artist</Button>
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