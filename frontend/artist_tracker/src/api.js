import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class connects methods used to get/send to to the API.
 * 
 */

class ArtistTrackerApi {
  // token for interaction with the API is stored here.
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

  // Individual API routes

  /** Get details on an artist by name. */

  static async getArtistByName(artistName) {
    try {
      const res = await this.request(`search/artists`, {artistName});
      return res;
    } catch(err) {
      console.log(err)
    }
  }

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

    /** Get details on a user by id. */

    static async getUser(id, token) {
      try {
        ArtistTrackerApi.token = token;
        const res = await this.request(`users/${id}`);
        return res.user;
      } catch(err) {
        console.log(err)
      }
    }

    /** Update user profile. */

    static async updateUser(user, token) {
      try {
        ArtistTrackerApi.token = token;
        const {id, username, password, firstName, email, city, distancePref} = user;
        const updateData = {username, password, firstName, email, city, distancePref}
        const res = await this.request(`users/${id}`, 
                    updateData, 'patch');
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
        const {username, password, firstName, email, city, distancePref} = user;
        const res = await this.request('auth/register', 
                            {username, password, firstName, email, city, distancePref}, 'post');
        ArtistTrackerApi.token = res.token;
        const newUser = {id:res.newUser.id, username:res.newUser.username,
            firstName: res.newUser.firstName, email: res.newUser.email, 
            city: res.newUser.city, distance: res.newUser.distancePref}
        return {token: res.token, newUser};
      } catch(err) {
        console.log(err)
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

    /** Returns an array of artist objects to use in autocomplete. */

    static async getArtistsForAutocomplete(str) {
      try {
        const res = await this.request('search/artists', {artist:str});

        return res;
      } catch(err) {
        console.log(err);
      }
    }

    // /** Apply to job */

    // static async applyToJob(username, id, token) {
    //   try {
    //     JoblyApi.token = token;
    //     const res = await this.request(`users/${username}/jobs/${id}`, {}, 'post');
    //     console.log(res)
    //     return res;
    //   } catch(err) {
    //     console.log(err)
    //   }
    // }

}

export default ArtistTrackerApi;