"use strict"

const axios = require ('axios');

const baseURL = 'https://app.ticketmaster.com';
const {TICKETMASTER_API_KEY} = require ('../config.js');

class ApiCalls {

    /**
     * Accepts name, which can be partial:
     *      ex: 'Don' might return Don Henley, Don Draper, etc.
     *  
     * Returns array of artists (with details) for those matching given name.
     *  
     */

    static async getArtistsByKeyword(name) {
        if (!TICKETMASTER_API_KEY) {
            throw new Error('TICKETMASTER API KEY NOT FOUND');
        }
        // get artist info based on name
        const artistRes = await axios.get(
           `${baseURL}/discovery/v2/attractions.json?keyword=${name}&apikey=${TICKETMASTER_API_KEY}`);
        // array of artists based on keyword
        const artists = artistRes.data._embedded.attractions;
        
        const allArtists = artists.map(a => {
            return {
                id: a.id,
                name: a.name,
                url: a.externalLinks.homepage[0].url,
                image: a.images[0].url || null
            }
        })
    
        return allArtists;
    }

    /**
     * Returns array of events for given artist, within radius of city.
     * Results include (data._embedded.events.): 
     *      id, name, url, dates.start.dateTime, _embedded.venues[0].name,
     *      _embedded.venues.city.name, _embedded.venues.state.name
     *  
     *  
     */

    static async getEvents(artistId, city, radius) {
        if (!TICKETMASTER_API_KEY) {
            throw new Error('TICKETMASTER API KEY NOT FOUND');
        }

        const eventsRes = await axios.get(
            `${baseURL}/discovery/v2/events.json?attractionId=${artistId}&radius=${radius}&unit=miles&city=${city}&apikey=${TICKETMASTER_API_KEY}`);
        
            if(eventsRes.data._embedded) {
                const events = eventsRes.data._embedded.events;
                console.log('EVENTS', events)
                const allEvents = events.map(e => {
                    return {
                        id: e.id,
                        name: e.name,
                        url: e.url,
                        datetime: e.dates.start.dateTime,
                        venue: e._embedded.venues[0].name,
                        venueCity: e._embedded.venues[0].city.name,
                        venueState: e._embedded.venues[0].state.name,
                        artist: e._embedded.attractions[0].id
                    }
                })
                return allEvents;
            } else {
                return{};
            }
    }
}

module.exports = ApiCalls;