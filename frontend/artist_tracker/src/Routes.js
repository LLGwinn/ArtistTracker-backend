import React from 'react';
import {Route, Routes} from 'react-router-dom';
import HomeGuest from './HomeGuest';
import NotFound from './NotFound';

function AppRoutes() {
    console.log('in AppRoutes')
    return (
        <>
            {/* if user logged in '/' should render their page, else HomeGuest */}
            <Routes>
                <Route path='/'
                    element={<HomeGuest />}
                />
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;