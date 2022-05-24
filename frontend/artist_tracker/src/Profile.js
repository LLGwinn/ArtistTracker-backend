import React, { useState, useContext, useEffect, useCallback} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userContext from './userContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import UnauthorizedMessage from './UnauthorizedMessage';
import ArtistTrackerApi from './api';
import './Profile.css';
import ArtistItem from './ArtistItem';
const _ = require('lodash');
const {debounce} = _;


function Profile( {removeArtist, logout} ) {  
    const {id} = useParams();
    const {currUser, setCurrUser, token, usersSavedArtists, setUsersSavedArtists} = useContext(userContext);
    const [formData, setFormData] = useState(
                {username: currUser.username, firstName: currUser.firstName, 
                email: currUser.email, city: currUser.city, 
                radius: currUser.radius, password: ''}
    );
    const [citySearch, setCitySearch] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState({id:"", name:"", region:""});
    const [cityOptionsDisplay, setCityOptionsDisplay] = useState(false);
    const [artists, setArtists] = useState(usersSavedArtists);

    const navigate = useNavigate();

    const debounceLoadCities = useCallback(
        debounce(str => fetchCities(str), 1200), []);

    async function fetchCities(str) {
        try {
            const res = await ArtistTrackerApi.getCitiesForAutocomplete(str);
            setAutocompleteCities(res.cities);
        } catch(err) {
            console.log(err);
        }  
    }

    // change handler for city input
    const citySearchChange = evt => {
        setCitySearch(evt.target.value);
        if(citySearch && citySearch.length >= 3){
            debounceLoadCities(citySearch);
        }
    }

    // runs when user selects a city from autocomplete
    const setCitySelection = (citySelection) => {
        setCitySearch(`${citySelection.name}, ${citySelection.region}`);
        setSelectedCity(citySelection);
        setCityOptionsDisplay(false);
    }

    // get user's current city name, state when page loads (to show in form)
    useEffect(() => {
        async function getUserCityName() {
            const res = await ArtistTrackerApi.getCityById(currUser.city);
            setCitySearch(`${res.city.name}, ${res.city.region}`); 
            setSelectedCity(res.city);
        }
        getUserCityName();
    }, [])

    useEffect(() => {
        setArtists(usersSavedArtists);
    }, [usersSavedArtists])

    function handleChange(evt) {
        const {name, value} = evt.target;
        setFormData(data => { 
            return {...data, [name]: value}
        });
    }

    function addArtist(evt) {
        evt.preventDefault();
        navigate('/addArtist');
    }

    async function handleUpdate(evt) {

        try {
            evt.preventDefault();
            const user = {id,
                username: formData.username, 
                firstName: formData.firstName, 
                email: formData.email, 
                city: selectedCity.id, 
                radius: +formData.radius}
            if (formData.password !== '') user.password = formData.password;

          const updatedUser = await ArtistTrackerApi.updateUser(user, token);
          setCurrUser(updatedUser);
          navigate('/');
          alert(`User updated successfully.`)
        } catch(err) {
          console.log(err);
        }
      }

    async function deleteAccount(evt) {
        evt.preventDefault();
        if (window.confirm('Are you sure you want to delete your account?')) {
            const res = await ArtistTrackerApi.deleteUserAccount(currUser.id, token);
            if (res) alert('Account deleted. Thanks for playing!');
            logout();
        }
    }

    if (!token) return <UnauthorizedMessage />;

    return (
        <div className="container-fluid">
            <div className="row py-2">
                <p className='display-5'>{currUser.firstName}</p>
            </div>
            <div className="Profile-content row mb-3">
                <Form className="Profile-form col p-4 border border-dark" autoComplete='off'>
                    <h3 className="mb-4">User Info</h3>
                    <Form.Group as={Row} className="mb-3" controlId="username">
                        <Form.Label column sm={4}>Username</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="text"
                                        name="username" 
                                        value={formData.username}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="password">
                        <Form.Label column sm={4}>Password</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="password"
                                        name="password" 
                                        autoComplete='off'
                                        value={formData.password}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="firstName">
                        <Form.Label column sm={4}>First Name</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="text"
                                        name="firstName" 
                                        value={formData.firstName}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="email">
                        <Form.Label column sm={4}>Email</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="email"
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>City:</Form.Label>
                            <Col sm={8}>
                                <Form.Control id='citySearch' 
                                            type='text' 
                                            name='selectedCity' 
                                            onClick={() => setCityOptionsDisplay(true)}
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
                            </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="distancePref">
                        <Form.Label column sm={4}>Event search radius (miles)</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="number"
                                        name="radius" 
                                        value={formData.radius ?? ""}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Button type="submit"
                            className="border border-dark" 
                            onChange={handleChange} 
                            onClick={handleUpdate}>
                        Save changes
                    </Button>
                </Form>
                <div className="col p-4 border border-dark">
                    <h3 className="mb-4">Saved artists</h3>
                    <div className='Profile-artists mb-2 p-3'>
                        {(artists.length)
                            ? artists.map(a => <div key={a.artist.id}><ArtistItem 
                                                                    artist={a.artist} 
                                                                    remove={removeArtist}/>
                    </div>)
                            : <p>NO ARTISTS SAVED</p>
                        }
                    </div>                 
                    <Button variant="primary" 
                            className="col-6 ms-auto border border-dark"
                            onClick={addArtist}>Add an artist</Button>                        
                </div>
            </div> 
            {/* ^ end content row */}
            <div className="row">
                <Button variant="dark" href="/" className="Profile-homeBtn col-3 my-auto">Back to my homepage</Button>
                <Button variant="outline-dark" 
                        size="sm" 
                        className='col-1 ms-auto'
                        onClick={deleteAccount}>Delete My Account</Button>
            </div>
        </div>
    )
}

export default Profile;