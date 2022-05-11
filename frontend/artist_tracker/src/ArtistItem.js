import React, {useEffect, useState} from 'react';
import ArtistTrackerApi from './api';
import './ArtistItem.css';

function ArtistItem( {artistId} ) {
    const [artist, setArtist] = useState({});

    useEffect(() => {
        async function findArtist(id) {
            try {
                const res = await ArtistTrackerApi.getArtistById(id);
                setArtist(res.artist);
            } catch(err) {
                console.log(err);
            }
        }
        findArtist(artistId); 
        console.log('AFTER THE CALL', artist)
    }, [])


    return (
        <div className='ArtistItem'>
            <img src={artist.image} alt='artist' className='img-fluid' />
            {artist.name}
        </div>
    )

}

export default ArtistItem;