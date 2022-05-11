import React, { useContext } from 'react';
import {Route, Routes} from 'react-router-dom';
import AuthContext from './authContext';
import HomeGuest from './HomeGuest';
import HomeUser from './HomeUser';
import Profile from './Profile';
import RSVPs from './RSVPs';
import SignupForm from './SignupForm';
import Login from './Login';
import EventList from './EventList';
import NotFound from './NotFound';
import AddArtistForm from './AddArtistForm';

function AppRoutes( {signup, login, update, logout}) {
    const {currUser} = useContext(AuthContext);

    return (
        <>
            {/* if user logged in '/' should render HomeUser, else HomeGuest */}
            <Routes>
                <Route path='/'
                    element={currUser 
                                    ? <HomeUser logout={logout}/> 
                                    : <HomeGuest />}
                />
                <Route path='/profile/:id'
                    element={<Profile update={update} />}
                />
                <Route path='/rsvps'
                    element={<RSVPs />}
                />
                <Route path='/signup'
                    element={<SignupForm signup={signup}/>}
                />
                <Route path='/login'
                    element={<Login login={login}/>}
                />
                <Route path='/events'
                    element={<EventList />}
                />
                <Route path='/addArtist'
                    element={<AddArtistForm />}
                />
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;