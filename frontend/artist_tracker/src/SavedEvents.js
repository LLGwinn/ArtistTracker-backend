import React, {useContext, useEffect, useState} from 'react';
import userContext from './userContext';
import UnauthorizedMessage from './UnauthorizedMessage';
import ArtistTrackerApi from './api';
import Button from 'react-bootstrap/Button';

function SavedEvents() {
    const {currUser, token} = useContext(userContext);
    const [userEvents, setUserEvents] = useState([]);

    useEffect(() => {
        async function getSavedEvents() {
            const res = await ArtistTrackerApi.getEventsForUser(currUser.id);
            setUserEvents(res.events);
        }
        getSavedEvents();
    }, [])

    const remove = (evt) => {
        console.log('clicked to remove event')
    }

    if (!token) return <UnauthorizedMessage />;

    return (
        <div>
            <p className="display-6 mt-4 mb-5">Your Saved Events</p>
            {(userEvents.length)
                ? <table className='table text-light'>
                    <thead>
                        <tr>
                            <th>Artist</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>City</th>
                            <th>State</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {userEvents.map(e => {
                        return (<tr key={e.id}>
                                    <td>{e.artist_name}</td>
                                    <td>{new Date(e.event_date).toLocaleDateString()}</td>
                                    <td>{e.venue}</td>
                                    <td>{e.venue_city}</td>
                                    <td>{e.venue_state}</td>
                                    {currUser &&
                                        <td><Button size="sm" 
                                                onClick={() => window.open(e.event_url,'_blank')}>Tickets</Button></td>
                                    }
                                    <td><button className="ArtistItem-button mt-1" onClick={remove}>X</button></td>
                                </tr>)
                    })
                    }     
                    </tbody>
                </table>
                : <p>NO SAVED EVENTS</p>
            }
            <Button href="/">Home</Button>
        </div>
    )
}

export default SavedEvents;