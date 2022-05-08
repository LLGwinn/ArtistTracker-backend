import React, { useState, useEffect } from 'react';
import ArtistTrackerApi from './api';
import Button from 'react-bootstrap/Button';
import "./EventList.css";

/** Returns a list of events in table format for an artist.
 * 
 *  {data} = {artistId, city, distance}
 */

function EventList( {artistInfo, cityInfo, radius} ) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Get events for the artist
        const cityLat = cityInfo.latitude;
        const cityLong = cityInfo.longitude;

        async function getArtistEvents(artistId, cityLat, cityLong, radius) {
            const res = await ArtistTrackerApi.getEventsForArtist(
                artistId, cityLat, cityLong, radius)
            if (res.events) setEvents(res.events);
        }

        if (artistInfo.id !== '') getArtistEvents(artistInfo.id, cityLat, cityLong, radius);
        console.log('EVENTS', events)
    }, [])

    return(
        <>
            <div className="EventList container p-0 border border-light">
                <div className="row align-items-center">
                    <div className="col-2">
                        <img src={artistInfo.image} alt='artist' className='img-fluid'/>
                    </div>
                    <div className='EventList-title col-10'>
                        <div className='row'>
                            <p className="fs-2">{artistInfo.name}</p>
                        </div>
                    </div>
                    <div className='row'>
                        {(events.length)
                        ?
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Venue</th>
                                    <th>City</th>
                                    <th>State</th>
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
                                            <td><Button size="sm">Save</Button></td>
                                          </tr>)
                                    })
                                }     
                            </tbody>
                        </table>
                        :
                        <div className='p-5'>NO EVENTS AT THIS TIME</div>
                    }
                    </div>
                    
                </div>
            </div>
            

        </>
    )
}

export default EventList;