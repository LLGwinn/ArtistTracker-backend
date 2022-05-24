import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/**
 * Connects methods used to get/send to to the internal API.
 */

class ArtistTrackerApi {
  // token for interaction with the API
  static token;

  static async request(endpoint, data = {}, method = "get") {
    //console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ArtistTrackerApi.token}` };
    const params = (method === "get") ? data : {};
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      const message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /***********************
   *    ARTIST ROUTES
   ***********************/

  /** Get details on an artist by name. */

  static async getArtistByName(artistName) {
    try {
      const res = await this.request(`search/artistsByName`, {artistName});
      return res;
    } catch(err) {
      console.log(err)
    }
  }

  /** Get details on an artist by id. */

  static async getArtistById(artistId) {
    try {
      const res = await this.request(`search/artistById`, {artistId});
      return res;
    } catch(err) {
      console.log(err)
    }
  }

  /** Returns an array of artist objects to use in autocomplete. */

  static async getArtistsForAutocomplete(str) {
    try {
      const res = await this.request('search/artistsByName', {artist: str});
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  /***********************
   *    USER ROUTES
   ***********************/

  /** Update user profile. */

  static async updateUser(user, token) {
    try {
      ArtistTrackerApi.token = token;
      const {id, username, password, firstName, email, city, radius} = user;
      const updateData = {username, password, firstName, email, city, radius}
      const res = await this.request(`users/${id}`, updateData, 'patch');
      return res.user;
    } catch(err) {
      console.log(err)
    }
  }

  /** Authenticate username/password and return token */

  static async authenticateUser(username, password) {
    try {
      const res = await this.request('auth/token', {username, password}, 'post');
      ArtistTrackerApi.token = res.token;
      return {token:res.token, user: res.user};
    } catch(err) {
      console.log(err)
    }
  }

  /** Register new user and return token */

  static async registerUser(user) {
    try {
      const {username, password, firstName, email, city, radius} = user;
      const res = await this.request('auth/register', 
                          {username, password, firstName, email, city, radius}, 'post');
      ArtistTrackerApi.token = res.token;
      const newUser = {id:res.newUser.id, username:res.newUser.username,
          firstName: res.newUser.firstName, email: res.newUser.email, 
          city: res.newUser.city, radius: res.newUser.radius}
      return {token: res.token, newUser};
    } catch(err) {
      console.log(err)
    }
  }

  /** Delete user account */

  static async deleteUserAccount(id, token) {
    try {
      ArtistTrackerApi.token = token;
      const res = await this.request(`users/${id}`, {}, 'delete');
      return res;
    } catch(err) {
      console.log(err)
    }
  }

  /***********************
   *    USER/ARTIST ROUTES
   ***********************/
 
  /** Add an artist to the db. */

  static async addArtistToUser(artistId, artistName, userId) {
    try {
      const res = await this.request(`artists/add`, {artistId, artistName, userId}, 'post');
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  /** Returns array of user's saved events. */

  static async getArtistsForUser(userId) {
    try {
      const res = await this.request(`users/${userId}/artists`);
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  
  /** Removes artist from users_artists for this user. */

  static async removeArtistFromUser(userId, artistId, token) {
    try {
      ArtistTrackerApi.token = token;
      const res = await this.request(`users/${userId}/artists`, {artistId}, 'delete')
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  /***********************
   *    USER/EVENT ROUTES
   ***********************/

  /** Add an event to the db */

  static async addEventToUser(event, userId) {
    try {
      const res = await this.request(`events/add`, {event, userId}, 'post');
      return res;
    } catch(err) {
      alert(err)
      console.log(err);
    }
  }
  
  /** Returns array of user's favorite artists. */

  static async getEventsForUser(userId) {
    try {
      const res = await this.request(`users/${userId}/events`);
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  /** Removes event from users_events for this user. */

  static async removeEventFromUser(userId, eventId, token) {
    try {
      ArtistTrackerApi.token = token;
      const res = await this.request(`users/${userId}/events`, {eventId}, 'delete')
      return res;
    } catch(err) {
      console.log(err);
    }
  }


  /***********************
   *    CITY ROUTES
   ***********************/

  /** Get details for city with id. */

  static async getCityById(id) {
    try {
      const res = await this.request(`search/city/${id}`);
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  /** Returns an array of city objects to use in autocomplete. */

  static async getCitiesForAutocomplete(str) {
    try {
      const res = await this.request('search/cities', {city:str});
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  /***********************
   *    EVENT ROUTES
   ***********************/

  /** Get list of events for an artist */
  
  static async getEventsForArtist(artistId, lat, long, radius) {
    try {
      const queryData = {id: artistId, lat, long, radius}
      const res = await this.request(`search/events`, queryData);

      return res;
    } catch(err) {
      console.log(err)
    }
  }

 }

export default ArtistTrackerApi;