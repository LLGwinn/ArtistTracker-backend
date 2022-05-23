import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistTrackerApi from './api';
import Button from 'react-bootstrap/Button';
import "./EventList.css";
import userContext from './userContext';

/** Renders a list of events in table format for an artist.
 * 
 *  If user is logged in, shows button to save an event to their account.
 */

function EventList( {artistDetails, cityInfo, radius} ) {
    const [events, setEvents] = useState(null);
    const {currUser} = useContext(userContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (artistDetails && cityInfo.latitude) getEvents();
    }, [])

    async function getEvents() {
        try {
            const eventsRes = await ArtistTrackerApi.getEventsForArtist(
                artistDetails.id, cityInfo.latitude, cityInfo.longitude, radius)
            if (eventsRes) setEvents(eventsRes.events);
        } catch(err) {
            console.log(err)
        }
    }

    async function saveEvent(e) {
        try {
            const res = await ArtistTrackerApi.addEventToUser(e, currUser.id);
            if (res) {
                alert(`'${e.name}' added to your saved events!`);
                navigate(`/events/${currUser.id}`);
            }
        } catch(err) {
            console.log(err);
        }
    }

    if(!events) return <div className="spinner-border text-primary mt-3" role="status"></div>

    return(
        <div className="EventList container">
            <div className="card mb-3">
                <div className="card-body">
                    <img className="img-fluid" src={artistDetails.image} alt="artist" />
                    <h5 className="card-title text-dark h1">
                        {(artistDetails.homepage !== '')
                            ? <a href={artistDetails.homepage} target="_blank">{artistDetails.name}</a>
                            : artistDetails.name
                        }
                    </h5>
                        
                    {(events.length)
                    ? <table className='table'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>City</th>
                                <th>State</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {events.map(e => {
                            return (<tr key={e.id}>
                                        <td>{new Date(e.datetime).toLocaleDateString()}</td>
                                        <td>{e.venue}</td>
                                        <td>{e.venueCity}</td>
                                        <td>{e.venueState}</td>
                                        {currUser &&
                                            <td><Button size="sm" onClick={() => saveEvent(e)}>Save</Button></td>
                                        }
                                        <td><Button size="sm" 
                                                onClick={() => window.open(e.url,'_blank')}>Tickets</Button></td>
                                    </tr>)
                        })
                        }     
                        </tbody>
                    </table>
                    :
                    <div className='text-dark'>NO EVENTS WITHIN SEARCH RADIUS</div>
                    }
                </div>
                {/* end card body */}
            </div>
            {/* end card */}
        </div> 
    )
}

export default EventList;

