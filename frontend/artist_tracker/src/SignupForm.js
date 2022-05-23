import React, {useState, useCallback} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArtistTrackerApi from './api';
import './SignupForm.css';
const _ = require('lodash');
const {debounce} = _;

function SignupForm( {signup} ) {
    const INITIAL_DATA = {
        username: "",
        password: "",
        firstName: "",
        email: "",
        city: "",
        radius: ""
    }
    const [formData, setFormData] = useState(INITIAL_DATA);
    const [citySearch, setCitySearch] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState({id:"", name:"", region:""});
    const [cityOptionsDisplay, setCityOptionsDisplay] = useState(false);

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

    const citySearchChange = evt => {
        setCitySearch(evt.target.value);
        if(citySearch && citySearch.length >= 3){
            debounceLoadCities(citySearch);
        }
    }

    const setCitySelection = (citySelection) => {
        setCitySearch(`${citySelection.name}, ${citySelection.region}`);
        setSelectedCity(citySelection);
        setCityOptionsDisplay(false);
    }

    const handleChange = evt => {
        const {name, value} = evt.target;
        setFormData(data => { 
            return {...data, [name]: value}
        });
    }

    const handleSubmit = evt => {
        evt.preventDefault();
        const newUser = {
                username:formData.username, 
                password:formData.password, 
                firstName:formData.firstName, 
                email:formData.email,
                city:selectedCity.id,
                radius: +formData.radius
            }
        signup(newUser);
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row py-2">
                    <p className="display-6">Create an Account</p>
                </div>
            <div className="row mb-3 py-4 border border-success">
                <div className="col-9 ">
                    <Form className="SignupForm" onSubmit={handleSubmit} autoComplete='off'>
                        <Form.Group as={Row} className="mb-3" controlId="username">
                            <Form.Label column sm={2}>Username</Form.Label>
                            <Col sm={4}>
                                <Form.Control type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}  />
                             </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="password">
                            <Form.Label column sm={2}>Password</Form.Label>
                            <Col sm={4}>
                                <Form.Control type="password"
                                            name="password" 
                                            value={formData.password}
                                            onChange={handleChange}  />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="firstName">
                            <Form.Label column sm={2}>First Name</Form.Label>
                            <Col sm={4}>
                                <Form.Control type="text"
                                            name="firstName" 
                                            value={formData.firstName}
                                            onChange={handleChange}  />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formEmail">
                            <Form.Label column sm={2}>Email</Form.Label>
                            <Col sm={4}>
                                <Form.Control type="email"
                                            name="email" 
                                            value={formData.email}
                                            onChange={handleChange}  />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>City:</Form.Label>
                            <Col sm={4}>
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
                        <Form.Group as={Row} className="mb-3" controlId="formDistance">
                            <Form.Label column sm={4}>Preferred search distance (miles)</Form.Label>
                            <Col sm={2}>
                                <Form.Control type="number"
                                            name="radius" 
                                            value={formData.radius}
                                            onChange={handleChange}  />
                            </Col>
                        </Form.Group>
                        <Button type="submit" variant="primary">Submit</Button>
                    </Form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default SignupForm;