"use strict"

const axios = require ('axios');

const tmURL = 'https://app.ticketmaster.com';
const citiesURL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const {TICKETMASTER_API_KEY, GEOCITIES_API_KEY} = require ('../config.js'); 

class ApiCalls {

    /**
     * Accepts name, which can be partial:
     *      ex: 'Don' might return Don Henley, Don Draper, Donica, etc.
     *  
     * Returns array of artists (with detail data) for artists matching given name.
     *  
     */

    static async getArtistsByKeyword(name) {
        if (!TICKETMASTER_API_KEY) {
            throw new Error('TICKETMASTER API KEY NOT FOUND');
        }
        // get artists matching name
        const artistRes = await axios.get(
           `${tmURL}/discovery/v2/attractions.json?keyword=${name}&apikey=${TICKETMASTER_API_KEY}`);
        // array of artists based on name
        const artists = artistRes.data._embedded ? artistRes.data._embedded.attractions : [];

        let homepage;
        if (artists.length && artists.externalLinks) {
            if (artists.externalLinks.homepage) {
                homepage = artists.externalLinks.homepage[0];
            }
        } else {homepage = ""};
        
        const allArtists = artists.map(a => {
            return {
                id: a.id,
                name: a.name,
                homepage,
                image: a.images[0].url ? a.images[0].url : 'no images to show',
                ticketsURL: a.url
            }
        })
    
        return allArtists;
    }

    /**
     * Returns details for artist with given id.
     *  
     */

    static async getArtistById(id) {
        if (!TICKETMASTER_API_KEY) {
            throw new Error('TICKETMASTER API KEY NOT FOUND');
        }
        // get artist matching id
        const artistRes = await axios.get(
           `${tmURL}/discovery/v2/attractions/${id}.json?apikey=${TICKETMASTER_API_KEY}`);
        const artist = artistRes.data ? artistRes.data : [];

        let homepage;
        if (artist !== [] && artist.externalLinks) {
            if (artist.externalLinks.homepage) {
                homepage = artist.externalLinks.homepage[0].url;
            }
        } else {homepage = ""};
        
        const foundArtist = {
                id: artist.id,
                name: artist.name,
                homepage,
                image: artist.images[0].url ? artist.images[0].url : '',
                ticketsURL: artist.url
        }
    
        return foundArtist;
    }

    /**
     * Returns array of events for given artist, within radius of city.
     *  
     */

    static async getEvents(artistId, geohash, radius) {
        if (!TICKETMASTER_API_KEY) {
            throw new Error('TICKETMASTER API KEY NOT FOUND');
        }
        const eventsRes = await axios.get(
            `${tmURL}/discovery/v2/events.json?attractionId=${artistId}&radius=${radius}&unit=miles&geoPoint=${geohash}&apikey=${TICKETMASTER_API_KEY}`);

        if(eventsRes.data._embedded) {
            const events = eventsRes.data._embedded.events;
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

    /** Returns array of city data objects to use in autocomplete,
     *  minimum population 20000, sorted by decreasing population.
     */

    static async getCities(str) {
        try {
            const url = citiesURL;
            const headers = { 'x-rapidapi-key':GEOCITIES_API_KEY };
            const res = await axios.get(
                `${url}?namePrefix=${str}&sort=-population&minPopulation=20000&apiKey=${GEOCITIES_API_KEY}&countryIds=US`,
                {headers}
            )
            return res.data.data;
        }catch (err) {
            console.log(err)
        }
    }

    /** Returns city data object based on id. */

    static async getCity(id) {
        try {
            const url = `${citiesURL}/${id}`;
            const headers = { 'x-rapidapi-key':GEOCITIES_API_KEY };

            const res = await axios.get(
                `${url}?cityId=${id}&apiKey=${GEOCITIES_API_KEY}&countryIds=US`,
                {headers}
            )
            return res.data.data;
        } catch(err) {
            console.log(err);
        }
    }

    /** Retrieve city's geohash to use with radius in TM API. */

    static async getGeohash(lat, long) {
        const res = await axios.get(
            `http://geohash.world/v1/encode/${lat},${long}?pre=9`
        );
        return res.data.geohash;
    }
}

module.exports = ApiCalls;