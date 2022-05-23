import React from 'react';
import './ArtistItem.css';

function ArtistItem( {artist, remove} ) {

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