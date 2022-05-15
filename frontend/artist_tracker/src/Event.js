import React from 'react';

function Event( {artist, event} ) {
    

    return (
        <div class="card mb-3">
            <img class="card-img-left" src={artist.image} alt="artist" />
            <div class="card-body">
                <h5 class="card-title">{artist.name}</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
</div>
    )
}

export default Event;