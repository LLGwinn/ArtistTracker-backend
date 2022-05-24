import React, {useContext, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import userContext from './userContext';
import { useNavigate } from 'react-router-dom';
import EventList from './EventList';
import ArtistTrackerApi from './api';
import './Home.css';
import UnauthorizedMessage from './UnauthorizedMessage';

function HomeUser( {logout} ) {
    const {currUser, token, usersSavedArtists} = useContext(userContext);
    const [city, setCity] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getCityDetails() {
            try{
                const cityRes = await ArtistTrackerApi.getCityById(currUser.city);
                setCity(cityRes.city);
            } catch (err) {
                console.log(err);
            }
        }
        getCityDetails();
    }, [])

    function addArtist(evt) {
        evt.preventDefault();
        navigate('/addArtist');
    }

    function handleLogout(evt) {
        evt.preventDefault();
        logout();
    }

    if (!token) return <UnauthorizedMessage />
    
    return (
        <div className="container-fluid">
            <div className="row py-2">
                <p className="display-5">Hi there, {currUser.firstName}!</p>
            </div>
            <div className="row py-3">
                <div className="col-10 ">
                    <p className="h3 pb-1 mb-2">Upcoming shows from your favorite artists:</p>
                    <div className='Home-eventList'>
                    {(usersSavedArtists.length)
                        ? usersSavedArtists.map(a => {
                            return <EventList key={a.artist.id} artistDetails={a.artist} cityInfo={city} radius={currUser.radius}/>;
                        
                        })
                        : <p className='mt-5'>Save artists to automatically see upcoming shows!</p>
                    }
                    </div>
                </div>
                <div className="col-2 p-2 align-items-center">
                    <div className="row mb-3">
                        <Button variant="dark" 
                                className="col-10 mt-5 mx-auto"
                                onClick={addArtist}>Add an artist</Button>
                    </div>
                    <div className="row mb-3">
                        <Button variant="dark" href={`/events/${currUser.id}`}
                                className="col-10 mx-auto">
                            My Saved Events
                        </Button>
                    </div>
                    <div className="row mb-3 mt-5">
                        <Button variant="dark" href={`/profile/${currUser.id}`}
                                className="col-10 mx-auto">
                            Change my settings
                        </Button>
                    </div>
                    <div className="row mb-3">
                        <Button variant="outline-dark" 
                                onClick={handleLogout} 
                                className="col-10 mx-auto ">
                            Log out
                        </Button>
                    </div>    
                </div>
            </div>
        </div>
    )
}

export default HomeUser;