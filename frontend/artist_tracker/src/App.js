import './App.css';
import { useState, useEffect } from 'react';
import NavbarComp from './Navbar';
import AppRoutes from './Routes';
import ArtistTrackerApi from './api';
import AuthContext from './authContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currUser, setCurrUser] = useState(JSON.parse(localStorage.getItem('currUser')));
  // try {
  //   if (currUser) {
  //     JSON.parse(localStorage.getItem('currUser'));
  //   }
  // } catch (err) {
  //   console.log('currUser is undefined', err);
  // }

  const navigate = useNavigate();

  useEffect(function saveCredentialsToLocalStorage() {
    localStorage.setItem('token', token);
    localStorage.setItem('currUser', JSON.stringify(currUser));
  }, [token, currUser])

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

  return (
      <div className="App">
          <AuthContext.Provider value={{currUser, setCurrUser, token}}>
              <NavbarComp logout={logout}/>
              <div className="App-main container-fluid">
                <AppRoutes signup={signup} login={login} logout={logout}/>
              </div>
          </AuthContext.Provider>
      </div>
  );
}

export default App;
