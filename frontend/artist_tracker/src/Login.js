import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login( {login} ) {
    const [formData, setFormData] = useState(
        {username: "",
         password: ""}
    );

    function handleChange(evt) {
        const {name, value} = evt.target;
        setFormData(data => (
             {...data, [name]:value}
        ))
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        login(formData.username, formData.password)
    }

    return(
        <div className="container-fluid">
            <div className="row py-2">
                <p className="display-5">Log in</p>
            </div>
            <div className="row justify-content-center py-2">
                <div className='col-sm-8 col-md-6'>
                    <Form onSubmit={handleSubmit} autoComplete='off'>
                        <Form.Group className="mx-auto mb-3 col-6">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='text' 
                                        value={formData.username} 
                                        name='username'
                                        onChange={handleChange} 
                                        required />
                        </Form.Group>
                        <Form.Group className="mx-auto mb-5 col-6">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' 
                                        value={formData.password} 
                                        name='password' 
                                        onChange={handleChange}
                                        required />
                        </Form.Group>
                        <Button variant="dark" type="submit">
                            Log in
                        </Button>
                    </Form>
                </div>

            </div>
        </div>
    )
}

export default Login;