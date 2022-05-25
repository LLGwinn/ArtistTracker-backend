# Artist Tracker

Click this link to starting experimenting with [Artist Tracker](https://my-artisttracker.surge.sh)!

![Landing Page](/static/screenshot-landing.jpg)
![User Homepage](static/screenshot-userhome.jpg)

The Artist Tracker app helps a user keep track of upcoming performances from their favorite artists in their area.

After entering an artist name, city, and search radius, user will be presented with a list of upcoming shows in the area. The list contains date, venue, location, and a button to purchase tickets. List data is drawn directly from the TicketMaster Discovery API listed below. Clicking on the artist name will open a tab to the artist's homepage. Ticket purchase button opens a tab for the event on the LiveNation website (or another, depending on event data), where they can make purchases directly. 

If a user chooses to create an account, they will be able to save their favorite artists and save individual upcoming events. When the user logs in, they will see upcoming events within their search radius for all of their favorite artists. They can click a button to see all of their saved events as well. And of course, the user can add and delete artists and events as needed.

### History:
This project was created as part of Springboard's Software Engineering Bootcamp in May 2022. The requirement was to create a database-driven React app that goes further than basic CRUD, and to deploy the app. The inspiration for Artist Tracker came from a desire to simplify the process of looking for shows in my area that I care about. It can be complicated to look through different venue websites, artist websites, various event promoters, etc. I wanted something that would do my personalized search automatically every time I log in. So easy!

The Ticketmaster Discovery API is free and gives access to a TON of data. Endpoints go to either the "attractions" (artists) data or to the "events" data. The response data is a little complicated to traverse because there is just so much for each artist or event, so it took some very careful attention to find the path to get exactly what I needed for this app. And not every artist/event has exactly the same data. But given the wealth of information, it leaves plenty of room to upgrade the app in the future.

To implement autocomplete for the city search box, I went with GeoDB Cities. I was initially running into 429 (Too Many Requests) errors for calls to this API, but once I learned how to debounce the input data, that quickly resolved.

But speaking of 429 errors, my server was returning these anytime I made multiple quick requests to the backend. For example, if there were multiple artist names to render in the Saved Artists section of the user's Profile page, there was a good chance that not all of them would render, and the backend would send me a 429 error. And certainly if I wanted to see all the events for all the user's favorite artists, that would overwhelm my backend server as well. After some fiddling with reducing API calls by making most of them from the App component, this issue seems to be resolved. 

Biggest challenge: autocomplete, of course. After much experimentation, I think I finally understand how to make it work! But the artist search doesn't always work as expected, and I think at least part of this is due to a bug in the Ticketmaster API. Sometimes no results are returned when there clearly should be. For example, a search for "Luke " will get some results, but "Luke Br" will not. Add the rest of the name - "Luke Bryan" - and you get results. Weird. If you have thoughts on that I'd love to hear them.
***
### Future:
At some point, I would like to implement the following additional improvements:  
- definitely need better styling, it's my Achilles heel
- notify user via email when a new show is added to their default search results

Thanks for taking a look! Feedback is welcome!
***
### External APIS:
[Ticketmaster Discovery]  
Detailed information for artists and events worldwide.

[GeoDB Cities]  
City location data for use in autocomplete.
***
### Tech Stack:
- React
- NodeJS/Express
- Javascript
- HTML
- CSS
***
### Testing:
To run all backend tests, use `jest -i` from the `tests` directory.<br>
To run the frontend tests, head over to the ArtistTracker-frontend git and use `npm test` from the `artist_tracker` directory.
***
### Database Schema
[Click here to see schema](https://docs.google.com/spreadsheets/d/13pP8Nzs6U3eVurl1PG3c_0opi2dEZCj3PXV9-BGEvNw/edit?usp=sharing)

[Ticketmaster Discovery]:<https://app.ticketmaster.com/discovery/v2>
[GeoDB Cities]:<https://wft-geo-db.p.rapidapi.com/v1/geo/cities>