useEffect( async() => {
    // get user's favorite artists
    async function fetchArtists(userId) {
        const artistsRes = await ArtistTrackerApi.getUsersArtists(userId);
        setArtists(artistsRes);
        console.log(artistsRes);
    }
    fetchArtists(currUser.id)
}, [])