import React, {useState, useCallback} from 'react';
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
                                debounce(str => fetchCities(str), 1200), []);

    const debounceLoadArtists = useCallback(
        debounce(str => fetchArtists(str), 750), []);

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
            setAutocompleteArtists(res.artists);
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
        setCityOptionsDisplay(false);
    }

    const setArtistSelection = (artistSelection) => {
        setArtistSearch(artistSelection.name);
        setSelectedArtist(artistSelection);
        setArtistOptionsDisplay(false);
    }

    const handleSubmit = evt => {
        evt.preventDefault();
        if (selectedArtist.name !== "" && 
            selectedCity.id !== "" && 
            radius) setSubmitted(true);
    }

    return (
        (submitted === false)
        ?
        <>
            <Form className="GuestForm" onSubmit={handleSubmit} autoComplete='off'>
                <Form.Group className="mb-3">
                    <Form.Label>Which artist would you like to see?</Form.Label>
                    <Form.Control id='artistSearch' 
                                type='text' 
                                name='selectedArtist' 
                                autoComplete='off'
                                onClick={() => setArtistOptionsDisplay(true)}
                                onChange={artistSearchChange} 
                                value={artistSearch} 
                                className='artistSearch'
                                required />
                    {artistOptionsDisplay && (
                        <div className='GuestForm-autocompleteContainer ps-3 mt-1'>
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
                                  autoComplete='off'
                                  onClick={() => setCityOptionsDisplay(true)}
                                  onChange={citySearchChange} 
                                  value={citySearch} 
                                  className='citySearch'
                                  required />
                    {cityOptionsDisplay && (
                        <div className='GuestForm-autocompleteContainer ps-3 mt-1'>
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
                <Form.Group className="GuestForm-radius mb-3" controlId="radius">
                    <Form.Label>Search radius (miles)</Form.Label>
                    <Form.Control type="number"
                                  name="radius" 
                                  value={radius ?? ""} 
                                  onChange={radiusChange} 
                                  required />
                </Form.Group>

                <Button type="submit" variant="dark" className="mt-3">Find my artist!</Button>
            </Form>
        </>
        :
        <>
            <EventList artistDetails={selectedArtist} cityInfo={selectedCity} radius={radius} />
            <Button href="/" variant="dark" className="mt-2">New Search</Button>
        </>
    )
}

export default GuestForm;



