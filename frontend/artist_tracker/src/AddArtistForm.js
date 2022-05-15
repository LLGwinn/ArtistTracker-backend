import React, {useState, useCallback, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ArtistTrackerApi from './api';
import userContext from './userContext';
import './AddArtistForm.css'

const _ = require('lodash');
const {debounce} = _;

function AddArtistForm( {add} ) {
    const [artistSearch, setArtistSearch] = useState("");
    const [autocompleteArtists, setAutocompleteArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState({name:""});
    const [artistOptionsDisplay, setArtistOptionsDisplay] = useState(false);

    const {currUser, setUsersSavedArtists} = useContext(userContext);
    const navigate = useNavigate();

    const debounceLoadArtists = useCallback(
        debounce(str => fetchArtists(str), 800), []);

    async function fetchArtists(str) {
        try {
            const res = await ArtistTrackerApi.getArtistsForAutocomplete(str);
            setAutocompleteArtists(res.artist);
        } catch(err) {
            console.log(err);
        }  
    }

    async function updateUserArtists(evt) {
        try {
            add(selectedArtist.id, selectedArtist.name, currUser.id);
            navigate('/');
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

    const setArtistSelection = (artistSelection) => {
        setArtistSearch(artistSelection.name);
        setSelectedArtist(artistSelection);
        setArtistOptionsDisplay(false);
    }

    return (
        <div className='AddArtistForm container-fluid'>
            <div>
                <p className="display-5 mb-5 mt-4">Add an artist to your account:</p>
            </div>
            <Form autoComplete='off'>
                <Form.Group>
                    <Form.Label>Artist name:</Form.Label>
                    <Form.Control id='artistSearch' 
                                  type='text' 
                                  name='selectedArtist' 
                                  onClick={() => setArtistOptionsDisplay(true)}
                                  onChange={artistSearchChange} 
                                  value={artistSearch} 
                                  className='artistSearch mb-3'/>
                    {artistOptionsDisplay && (
                        <div className='AddArtist-autocompleteContainer ps-3 mt-1'>
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
                <Button variant='success'
                        className='mt-5'
                        onClick={updateUserArtists}>Add this artist to my favorites!</Button>
            </Form>
        </div>
    )

}

export default AddArtistForm;