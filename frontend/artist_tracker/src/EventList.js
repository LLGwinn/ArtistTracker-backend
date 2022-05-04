import React, { useState, useEffect } from 'react';
import ArtistTrackerApi from './api';
import Button from 'react-bootstrap/Button';
import "./EventList.css";

/** Returns a list of events in table format for an artist.
 * 
 *  {data} = {artistId, city, distance}
 */

function EventList( {data} ) {
    const [artist, setArtist] = useState({id:"", name:"", url:"", image:""});
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Get details for the artist
        async function addArtistToState(name) {
            const res = await ArtistTrackerApi.getArtistByName(name);
            setArtist(res.artists[0])
        }
        addArtistToState(data.artistName);
    }, [])

    useEffect(() => {
        // Get events for the artist
        async function setEventsInState(artistId, city, distance) {
            const res = await ArtistTrackerApi.getEventsForArtist(
                artistId, city, distance)
            setEvents(res.events)
        }
        if (artist.id !== '') setEventsInState(artist.id, data.city, data.distance)
    }, [artist])

    return(
        <>
            <div className="EventList container p-0 border border-light">
                <div className="row align-items-center">
                    <div className="col-2">
                        <img src={artist.image} className='img-fluid'/>
                    </div>
                    <div className='EventList-title col-10'>
                        <div className='row'>
                            <p className="fs-2">{artist.name}</p>
                        </div>
                    </div>
                    <div className='row'>
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
                                })}                                
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
            

        </>
    )
}

export default EventList;