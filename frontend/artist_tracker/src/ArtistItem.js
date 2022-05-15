import React, {useEffect, useState, useContext} from 'react';
import ArtistTrackerApi from './api';
import userContext from './userContext';
import './ArtistItem.css';

function ArtistItem( {artist, remove} ) {
    //const {currUser} = useContext(userContext);

    const handleClick = async (evt) => {
        evt.preventDefault();
        await remove(artist.id)
    }

    return (
        <div className='border-bottom p-1'>
            {artist.name}
            <button className="ArtistItem-button mt-1" onClick={handleClick}>X</button>         
        </div>
    )

}

export default ArtistItem;