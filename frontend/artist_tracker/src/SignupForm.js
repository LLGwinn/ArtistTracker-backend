import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SignupForm.css';

function SignupForm( {signup} ) {
    const INITIAL_DATA = {
        username: "",
        password: "",
        firstName: "",
        email: "",
        city: "",
        distancePref: ""
    }
    const [formData, setFormData] = useState(INITIAL_DATA);

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
                city:formData.city,
                distancePref: +formData.distancePref
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
                    <Form className="SignupForm" onSubmit={handleSubmit}>
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
                        <Form.Group as={Row} className="mb-3" controlId="formCity">
                            <Form.Label column sm={2}>City</Form.Label>
                            <Col sm={4}>
                                <Form.Control type="text"
                                            name="city" 
                                            value={formData.city}
                                            onChange={handleChange}  />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formDistance">
                            <Form.Label column sm={4}>Preferred search distance (miles)</Form.Label>
                            <Col sm={2}>
                                <Form.Control type="number"
                                            name="distancePref" 
                                            value={formData.distancePref}
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