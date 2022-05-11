import React, { useState, useContext, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from './authContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import UnauthorizedMessage from './UnauthorizedMessage';
import ArtistTrackerApi from './api';
import './Profile.css';
import ArtistItem from './ArtistItem';


function Profile() {  
    const {id} = useParams();
    const {currUser, setCurrUser, token} = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const [formData, setFormData] = useState(
                {username: currUser.username, firstName: currUser.firstName, 
                email: currUser.email, city: currUser.city, 
                distancePref: currUser.distance, password: ''}
    );
    const navigate = useNavigate();

    useEffect(() => {
        async function getTheArtists() {
            const res = await ArtistTrackerApi.getArtistsForUser(currUser.id);
            setArtists(res.artists);
        }
        getTheArtists();

    }, [])

    function handleChange(evt) {
        const {name, value} = evt.target;
        setFormData(data => { 
            return {...data, [name]: value}
        });
    }

    async function handleUpdate(evt) {
        try {
            evt.preventDefault();
            const user = {id,
                username: formData.username,
                password: formData.password, 
                firstName: formData.firstName, 
                email: formData.email, 
                city: formData.city, 
                distancePref: formData.distancePref}

          const updatedUser = await ArtistTrackerApi.updateUser(user, token);
          setCurrUser(updatedUser);
          navigate('/');
          alert(`User updated successfully.`)
        } catch(err) {
          console.log(err);
        }
      }

    
    if (!token) return <UnauthorizedMessage />;

    return (
        <div className="container-fluid">
            <div className="row py-2">
                <p className='display-5'>Profile for: {currUser.username}</p>
            </div>
            <div >
                <Form className="Profile row mb-3 py-4">
                <div className="col-5 p-4 border border-primary">
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
                    <Form.Group as={Row} className="mb-3" controlId="city">
                        <Form.Label column sm={4}>City</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="text"
                                        name="city" 
                                        value={formData.city}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="distancePref">
                        <Form.Label column sm={4}>Event search radius</Form.Label>
                        <Col sm={8}>
                            <Form.Control type="number"
                                        name="distancePref" 
                                        value={formData.distancePref}
                                        onChange={handleChange} />
                        </Col>
                    </Form.Group>
                </div>
                <div className="col-5 ms-5 p-4 justify-content-center border border-primary">
                        <ul>
                        {(artists.length)
                        ? artists.map(a => <li key={a.id}><ArtistItem artistId={a.id} /></li>)
                        : <p>NO ARTISTS SAVED</p>
                        }
                        </ul>
                </div>
                </Form>
                <Button type="submit" onChange={handleChange} onClick={handleUpdate}>
                    Save changes
                </Button>
                <Button variant="outline-primary" href="/" className="ms-4">Cancel</Button>
            </div>
        </div>
    )
}

export default Profile;