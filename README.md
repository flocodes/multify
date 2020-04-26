# MULTIFY

[MULTIFY](https://multify.herokuapp.com/) creates personalized Spotify playlists based on your favorite artists and tracks.

It is built with [Vue](https://vuejs.org/), [Bootstrap](https://getbootstrap.com/) and the [Spotify WebAPI](https://developer.spotify.com/documentation/web-api/).

## Project setup

1. Run `npm install` in the directory you cloned this repository

2. Create a Spotify app in your [Spotify developer dashboard](https://developer.spotify.com/dashboard/) to get a client ID.
Then add the location you are running MULTIFY at to the list of redirect URIs.
If you are running it locally, use `http://localhost:8080`

3. Set up the app environment variables, for example in  `.env` file:

    * `VUE_APP_URL`: The same as the redirect URI you set up in the previous step
    * `VUE_APP_CLIENT_ID`: The Spotify client ID you obtained by creating a Spotify app

## Running MULTIFY

* To run this in your development environment with hot reloads, run `npm run serve`
* For production, first run `npm run build`, then `npm run start`
