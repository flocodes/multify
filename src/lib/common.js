import {
    spotify_search,
    spotify_recommend,
    spotify_user_profile,
    spotify_create_playlist,
    spotify_playlist_add_tracks
} from './spotify.js'

export const get_suggestions = (query) => {
    return new Promise((resolve, reject) => {
        spotify_search(query, ['artist', 'track'], 3).then((results) => {
            let artists = results.artists
            let tracks = results.tracks
            let suggestions = []
            for (let artist of artists) {
                suggestions.push({
                    key: "suggestion-" + artist.id,
                    id: artist.id,
                    type: 'artist',
                    name: artist.name
                })
            }
            for (let track of tracks) {
                let track_artists = []
                for (let artist of track.artists) {
                    track_artists.push(artist.name)
                }
                suggestions.push({
                    key: "suggestion-" + track.id,
                    id: track.id,
                    type: 'track',
                    name: track_artists.join(', ') + " - " + track.name
                })
            }
            console.log(suggestions)
            resolve(suggestions)
        })
    })
}

export const get_recommendations = (seeds) => {
    return new Promise((resolve, reject) => {
        let seed_artists = []
        let seed_tracks = []
        for (let seed of seeds) {
            if (seed.type == 'artist') {
                seed_artists.push(seed.id)
            } else if (seed.type == 'track') {
                seed_tracks.push(seed.id)
            } else {
                console.log("Error: Invalid seed type " + seed.type)
            }
        }
        spotify_recommend(seed_artists, seed_tracks).then((tracks) => {
            let playlist = []
            for (let track of tracks) {
                let track_artists = []
                for (let artist of track.artists) {
                    track_artists.push(artist.name)
                }
                playlist.push({
                    key: "track-" + track.id,
                    id: track.id,
                    name: track_artists.join(', ') + ' - ' + track.name
                })
            }
            resolve(playlist)
        })
    })
}

export const add_playlist_to_account = (tracks, name, seeds) => {
    return new Promise((resolve, reject) => {
        spotify_user_profile().then((user_profile) => {
            let user_id = user_profile.id
            console.log("User ID is " + user_id)
            let seed_names = []
            for (let seed of seeds) {
                seed_names.push(seed.name)
            }
            // TODO: Get playlist name from input
            spotify_create_playlist(user_id, name, 'Seeds: ' + seed_names.join(', ')).then((playlist_data) => {
                let playlist_id = playlist_data.id
                console.log("Playlist ID is " + playlist_id)
                let track_uris = []
                for (let track of tracks) {
                    track_uris.push("spotify:track:" + track.id)
                }
                spotify_playlist_add_tracks(playlist_id, track_uris).then((success) => {
                    resolve(success)
                })
            })
        })
    })
}