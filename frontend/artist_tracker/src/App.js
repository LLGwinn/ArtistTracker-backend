import './App.css';
import { useState, useEffect } from 'react';
import NavbarComp from './Navbar';
import AppRoutes from './Routes';
import ArtistTrackerApi from './api';
import userContext from './userContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currUser, setCurrUser] = useState(JSON.parse(localStorage.getItem('currUser')));
  const [usersSavedArtists, setUsersSavedArtists] = useState([]);

  const navigate = useNavigate();

  useEffect(function saveCredentialsToLocalStorage() {
    localStorage.setItem('token', token);
    localStorage.setItem('currUser', JSON.stringify(currUser));
  }, [token, currUser])

  useEffect(function getUsersSavedArtists() {
    async function findSavedArtists() {
      const res = await ArtistTrackerApi.getArtistsForUser(currUser.id);
      if(currUser && res.artists) updateUserArtistsInState(res.artists);
    }
    if(currUser) findSavedArtists();
  }, [currUser])

  async function login(username, password) {
    try {
      const result = await ArtistTrackerApi.authenticateUser(username, password);
      if (result.token && result.user) {
        setToken(result.token);
        setCurrUser(result.user);
        navigate('/'); 
      } else throw new Error()
    } catch(err) {
      alert ('Invalid username/password.')
    }
  }

  async function signup(newUser) {
    const userCredentials = await ArtistTrackerApi.registerUser(newUser).catch((err) => {
      console.log(err);
    });
    setToken(userCredentials.token);
    setCurrUser(userCredentials.newUser);
    navigate('/');
  }

  function logout() {
    setToken('');
    setCurrUser(null);
    navigate('/');
  }

  async function addArtist(artistId, artistName, userId) {
    try {
      await ArtistTrackerApi.addArtistToUser(artistId, artistName, userId);
      const res = await ArtistTrackerApi.getArtistsForUser(currUser.id);
      setUsersSavedArtists([]);
      if(currUser && res.artists) updateUserArtistsInState(res.artists);
      navigate('/');
    } catch(err) {
        console.log(err);
    }
  }

  async function removeArtist(artistId) {
    const message = await ArtistTrackerApi.removeArtistFromUser(currUser.id, artistId, token);
    const res = await ArtistTrackerApi.getArtistsForUser(currUser.id);
    setUsersSavedArtists([]);
    if(res.artists) updateUserArtistsInState(res.artists);

    alert(message.deleteMessage);
  }

  async function updateUserArtistsInState(artistArray) {
    try {
      setUsersSavedArtists([]);
      for (let artist of artistArray) {
        const artistDetails = await ArtistTrackerApi.getArtistById(artist.id)

        const addArtistToState = artist => {
          setUsersSavedArtists(usersSavedArtists => [...usersSavedArtists, artist]);
        }
        addArtistToState(artistDetails);
      }
    } catch(err) {
      console.log(err)
    }
  }

  return (
      <div className="App">
          <userContext.Provider value={{currUser, setCurrUser, token, usersSavedArtists, setUsersSavedArtists}}>
              <NavbarComp logout={logout}/>
              <div className="App-main container-fluid">
                <AppRoutes signup={signup} 
                           login={login} 
                           logout={logout}
                           add={addArtist}
                           removeArtist={removeArtist}
                           updateUserArtistsInState={updateUserArtistsInState} />
              </div>
          </userContext.Provider>
      </div>
  );
}

export default App;
