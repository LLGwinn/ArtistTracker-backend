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

    const remove = async (e) => {
        const message = await ArtistTrackerApi.removeEventFromUser(currUser.id, e.id, token);
        alert(message.deleteMessage);
        const res = await ArtistTrackerApi.getEventsForUser(currUser.id);
        setUserEvents(res.events);
    }

    if (!token) return <UnauthorizedMessage />;
    if (!userEvents) return (
        <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    )
    return (
        <div>
            <p className="display-6 mt-4 mb-5">Your Saved Events</p>
            {(userEvents.length)
                ? <table className='table text-light'>
                    <thead>
                        <tr className="text-dark">
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
                                        <td><Button size="sm" variant="dark" 
                                                onClick={() => window.open(e.event_url,'_blank')}>Tickets</Button></td>
                                    }
                                    <td><button className="ArtistItem-button mt-1" onClick={() => remove(e)}>X</button></td>
                                </tr>)
                    })
                    }     
                    </tbody>
                </table>
                : <p>NO SAVED EVENTS</p>
            }
            <Button variant="dark" href="/">Home</Button>
        </div>
    )
}

export default SavedEvents;