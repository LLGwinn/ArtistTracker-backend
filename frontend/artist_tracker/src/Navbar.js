import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import userContext from './userContext';

function NavbarComp( {logout} ) {
    const {currUser} = useContext(userContext);

    function handleLogout(evt) {
        evt.preventDefault();
        logout();
    }

    return (
        <>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand href="/">Artist Tracker</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        {currUser 
                            ? <Nav.Link href={`profile/${currUser.id}`}>{currUser.username}</Nav.Link>
                            : <Nav.Link href='/login'>Log In</Nav.Link>
                        }
                        {currUser 
                            ? <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
                            : <Nav.Link href='/signup'>Sign up</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarComp;