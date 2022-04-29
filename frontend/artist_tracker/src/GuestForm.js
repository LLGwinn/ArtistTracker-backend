import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './GuestForm.css';

function GuestForm() {
    const INITIAL_DATA = {artist:"", city:"", distance:""};
    const [formData, setFormData] = useState(INITIAL_DATA);

    const handleChange = evt => {
        const {name, value} = evt.target;
        setFormData(data => { 
            return {...data, [name]: value}
        });
    }

    const handleSubmit = evt => {
        evt.preventDefault();
        console.log('GUEST FORM BUTTON CLICKED.')
        setFormData(INITIAL_DATA);
    }

    return (
        <>
            <Form className="GuestForm" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formArtist">
                    <Form.Label>Which artist would you like to see?</Form.Label>
                    <Form.Control type="text"
                                  name="artist" 
                                  value={formData.artist}
                                  onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCity">
                    <Form.Label>Enter your city:</Form.Label>
                    <Form.Control type="text"
                                  name="city" 
                                  value={formData.city}
                                  onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDistance">
                    <Form.Label>How far are you willing to travel to see this artist?</Form.Label>
                    <Form.Control type="number"
                                  name="distance" 
                                  value={formData.distance}
                                  onChange={handleChange} />
                </Form.Group>
                <Button type="submit">Find my artist!</Button>
            </Form>
        </>
    )
}

export default GuestForm;



