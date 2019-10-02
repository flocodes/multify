import {
    spotify_search,
    spotify_recommend,
    spotify_user_profile,
    spotify_create_playlist,
    spotify_playlist_add_tracks,
    spotify_artist_top_tracks,
    spotify_play_tracks
} from './spotify.js'

export const check_spotify_connection = () => {
    let expiration_date = new Date(localStorage.expiration_date)
      if (localStorage.access_token && (new Date() < expiration_date)) {
        return true
      }
    return false
}

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
                    uri: artist.uri,
                    type: 'artist',
                    name: artist.name,
                    image: get_image(artist)
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
                    uri: track.uri,
                    type: 'track',
                    name: track.name,
                    artists: track_artists.join(', '),
                    image: get_image(track)
                })
            }
            resolve(suggestions)
        })
    })
}

export const get_recommendations = (seeds, settings) => {
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
        spotify_recommend(seed_artists, seed_tracks, settings).then((tracks) => {
            let playlist = []
            for (let track of tracks) {
                let track_artists = []
                for (let artist of track.artists) {
                    track_artists.push(artist.name)
                }
                playlist.push({
                    key: "track-" + track.id,
                    id: track.id,
                    uri: track.uri,
                    type: 'pl_track',
                    name: track.name,
                    artists: track_artists.join(', '),
                    image: get_image(track)
                })
            }
            resolve(playlist)
        })
    })
}

export const add_playlist_to_account = (tracks, name, seeds, _public) => {
    return new Promise((resolve, reject) => {
        spotify_user_profile().then((user_profile) => {
            let user_id = user_profile.id
            console.log("User ID is " + user_id)
            let seed_names = []
            for (let seed of seeds) {
                seed_names.push(seed.name)
            }
            spotify_create_playlist(
                user_id,
                name, 
                'Generated playlist from Multify. Seeds: ' + seed_names.join(', '), 
                _public
                ).then((playlist_data) => {
                let playlist_id = playlist_data.id
                console.log("Playlist ID is " + playlist_id)
                let track_uris = []
                for (let track of tracks) {
                    track_uris.push(track.uri)
                }
                spotify_playlist_add_tracks(playlist_id, track_uris).then((success) => {
                    resolve(success)
                })
            })
        })
    })
}

export const play_artist_top_tracks = (uri) => {
    return new Promise((resolve, reject) => {
        spotify_artist_top_tracks(uri).then((tracks) => {
            let uris = []
            for (let track of tracks) {
                uris.push(track.uri)
            }
            spotify_play_tracks(uris).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        }).catch(() => {
            reject()
        })
    })
}

var get_image = (item) => {
    if (item.type == 'artist') {
        return get_best_image(item.images)
    } else if (item.type == 'track') {
        return get_best_image(item.album.images)
    } else {
        console.log("Error: Invalid item type to get image: " + item.type)
    }
}

var get_best_image = (images) => {
    let min_size = 1000
    let best_image = null
    for (let image of images) {
        if (image.height < min_size) {
            best_image = image.url
        }
    }
    return best_image
}