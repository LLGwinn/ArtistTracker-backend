import React, {useEffect, useState, useCallback} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './GuestForm.css';
import EventList from './EventList';
import ArtistTrackerApi from './api';
const _ = require('lodash');
const {debounce} = _;

function GuestForm() {
    const [citySearch, setCitySearch] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState({id:"", name:"", region:""});
    const [cityOptionsDisplay, setCityOptionsDisplay] = useState(false);

    const [artistSearch, setArtistSearch] = useState("");
    const [autocompleteArtists, setAutocompleteArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState({name:""});
    const [artistOptionsDisplay, setArtistOptionsDisplay] = useState(false);

    const [radius, setRadius] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const debounceLoadCities = useCallback(
                                debounce(str => fetchCities(str), 1000), []);

    const debounceLoadArtists = useCallback(
        debounce(str => fetchArtists(str), 1000), []);

    async function fetchCities(str) {
        try {
            const res = await ArtistTrackerApi.getCitiesForAutocomplete(str);
            setAutocompleteCities(res.cities);
        } catch(err) {
            console.log(err);
        }  
    }

    async function fetchArtists(str) {
        try {
            const res = await ArtistTrackerApi.getArtistsForAutocomplete(str);
            console.log('fetchArtists', res)
            setAutocompleteArtists(res.artist);
        } catch(err) {
            console.log(err);
        }  
    }

    const artistSearchChange = evt => {
        setArtistSearch(evt.target.value);
        if(artistSearch && artistSearch.length >= 3){
            debounceLoadArtists(artistSearch);
        }
    }

    const citySearchChange = evt => {
        setCitySearch(evt.target.value);
        if(citySearch && citySearch.length >= 3){
            debounceLoadCities(citySearch);
        }
    }

    const radiusChange = evt => {
        setRadius(evt.target.value);
    }

    const setCitySelection = (citySelection) => {
        setCitySearch(`${citySelection.name}, ${citySelection.region}`);
        setSelectedCity(citySelection);
        console.log('citySelection', citySelection)
        setCityOptionsDisplay(false);
    }

    const setArtistSelection = (artistSelection) => {
        setArtistSearch(artistSelection.name);
        setSelectedArtist(artistSelection);
        setArtistOptionsDisplay(false);
    }

    const handleSubmit = evt => {
        evt.preventDefault();
        setSubmitted(true);
    }

    return (
        (submitted === false)
        ?
        <>
            <Form className="GuestForm" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Which artist would you like to see?</Form.Label>
                    <Form.Control id='artistSearch' 
                                type='text' 
                                name='selectedArtist' 
                                onClick={() => setArtistOptionsDisplay(!artistOptionsDisplay)}
                                onChange={artistSearchChange} 
                                value={artistSearch} 
                                className='artistSearch'/>
                    {artistOptionsDisplay && (
                        <div className='autocompleteContainer ps-3 mt-1'>
                            {autocompleteArtists.map(artist => {
                                return (
                                    <div className='autocompleteOption' 
                                        key={artist.id} 
                                        onClick={() => setArtistSelection(artist)}>
                                        <span>{artist.name}</span>
                                    </div>
                                )
                            })}

                        </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Enter a city:</Form.Label>
                    <Form.Control id='citySearch' 
                                  type='text' 
                                  name='selectedCity' 
                                  onClick={() => setCityOptionsDisplay(!cityOptionsDisplay)}
                                  onChange={citySearchChange} 
                                  value={citySearch} 
                                  className='citySearch'/>
                    {cityOptionsDisplay && (
                        <div className='autocompleteContainer ps-3 mt-1'>
                            {autocompleteCities.map(city => {
                                return (
                                    <div className='autocompleteOption' 
                                        key={city.id} 
                                        onClick={() => setCitySelection(city)}>
                                        <span>{city.name}, {city.region}</span>
                                    </div>
                                )
                            })}

                        </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDistance">
                    <Form.Label>Search radius</Form.Label>
                    <Form.Control type="number"
                                  name="radius" 
                                  value={radius ?? ""} 
                                  onChange={radiusChange} />
                </Form.Group>

                <Button type="submit">Find my artist!</Button>
            </Form>
        </>
        :
        <>
            <EventList artistInfo={selectedArtist} cityInfo={selectedCity} radius={radius} />
        </>
    )
}

export default GuestForm;



