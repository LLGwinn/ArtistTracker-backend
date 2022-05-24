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
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Artist Tracker</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home&nbsp;&nbsp;&nbsp;|</Nav.Link>
                        {currUser 
                            ? <Nav.Link href={`profile/${currUser.id}`}>{currUser.username}&nbsp;&nbsp;&nbsp;|</Nav.Link>
                            : <Nav.Link href='/login'>Log In&nbsp;&nbsp;&nbsp;|</Nav.Link>
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