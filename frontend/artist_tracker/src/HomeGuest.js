import React from 'react';
import GuestForm from './GuestForm';
import Button from 'react-bootstrap/Button';
import './Home.css';

function HomeGuest() {
    return (
        <div className="container-fluid">
            <div className="row justify-content-center py-2">
                <h1>Your Artist Tracker!</h1>
            </div>
            <div className="row mb-3 py-4 align-items-center">
                <div className="Homeguest-box  col-9 ">
                    <GuestForm />
                </div>
                <div className="col-3 p-4">
                    <div className="Home-box row mb-3 justify-content-center">
                        <p>Already have an account?</p>
                        <Button className="col-6" href="/login">Log In</Button>
                    </div>
                    <div className="Home-box row mb-3 justify-content-center">
                        <p>Create an account to save your favorite artists!</p> 
                        <p>Every time you log in, you'll see a list of their shows near you!</p>
                        <Button className="col-6" href="/signup">
                            Sign me up!
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HomeGuest;

// AUTOCOMPLETE
// GeoDB Cities API
// https://wirefreethought.github.io/geodb-cities-api-docs/#operation--geo-countries-get
// https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=tampa&apiKey=853b9f4f9cmsh8a4230f74741b00p1a6d06jsn97aeefa48514&countryIds=US
// 1-handleChange updates city (namePrefix)
// 2-if(city && city.length >= 3 {
//    cities = make api call to above link
//})
// 3-map results to a new array
// 4-tie new array to the input field