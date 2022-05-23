import React, { useContext } from 'react';
import {Route, Routes} from 'react-router-dom';
import userContext from './userContext';
import HomeGuest from './HomeGuest';
import HomeUser from './HomeUser';
import Profile from './Profile';
import SavedEvents from './SavedEvents';
import SignupForm from './SignupForm';
import Login from './Login';
import NotFound from './NotFound';
import AddArtistForm from './AddArtistForm';

function AppRoutes( {signup, login, logout, add, removeArtist}) {
    const {currUser} = useContext(userContext);

    return (
        <>
            <Routes>
                <Route path='/'
                    element={currUser 
                                    ? <HomeUser logout={logout}/> 
                                    : <HomeGuest />}
                />
                <Route path='/profile/:id'
                    element={<Profile removeArtist={removeArtist} logout={logout} />}
                />
                <Route path='/signup'
                    element={<SignupForm signup={signup}/>}
                />
                <Route path='/login'
                    element={<Login login={login}/>}
                />
                <Route path='/events/:id'
                    element={<SavedEvents />}
                />
                <Route path='/addArtist'
                    element={<AddArtistForm add={add}/>}
                />
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;