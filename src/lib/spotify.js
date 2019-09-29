import { Promise } from 'q'

var axios = require('axios')

export const spotify_search = (query, types=['artist', 'track', 'album', 'playlist'], limit=20) => {
    return new Promise((resolve, reject) => {
        axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: query,
                type: types.join(','),
                limit: limit,
                //market: 'from_token' // requires 'user-read-private' scope, but only for search (??)
            },
            headers: {
                'Authorization': 'Bearer ' + localStorage.access_token
            }
        }).then((response) => {
            if (response.status != 200) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            let results = {}
            for (let _type of ['artists', 'tracks', 'albums', 'playlists']) {
                if (response.data[_type]) {
                    results[_type] = response.data[_type].items
                }
            }
            resolve(results)
        }).catch((error) => {
            console.log(error)
        })
    })
}

export const spotify_recommend = (seed_artists, seed_tracks, settings) => {
    return new Promise((resolve, reject) => {
        let request_params = {
            market: 'from_token',
            seed_artists: seed_artists.join(','),
            seed_tracks: seed_tracks.join(',')
        }
        for (let setting in settings) {
            request_params[setting] = settings[setting]
        }
        axios.get("https://api.spotify.com/v1/recommendations", {
            params: request_params,
            headers: {
                'Authorization': 'Bearer ' + localStorage.access_token
            }
        }).then((response) => {
            if (response.status != 200) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            resolve(response.data.tracks)
        }).catch(function (error) {
            console.log(error)
        })
    })
}

export const spotify_user_profile = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.access_token
            }
        }).then((response) => {
            if (response.status != 200) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            let user_data = response.data
            resolve(user_data)
        }).catch((error) => {
            console.log(error)
        })
    })
}

export const spotify_create_playlist = (user_id, name, description) => {
    return new Promise((resolve, reject) => {
        axios.post('https://api.spotify.com/v1/users/' + user_id + '/playlists', 
            { 
                name: name, 
                public: false, 
                description: description
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.access_token,
                    'Content-Type': 'application/json'
                }
        }).then(function(response) {
            if (!(response.status == 200 || response.status == 201)) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            resolve(response.data)
        })
    })
}

export const spotify_playlist_add_tracks = (playlist_id, tracks) => {
    return new Promise((resolve, reject) => {
        axios.post('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', 
            { 
                uris: tracks 
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.access_token,
                    'Content-Type': 'application/json'
                }
        }).then((response) => {
            if (response.status != 201) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            console.log("Successfully added tracks to a new playlist.")
            resolve(true)
        })
    })
}

export const spotify_play_tracks = (uris) => {
    return new Promise((resolve, reject) => {
        axios.put('https://api.spotify.com/v1/me/player/play', {
            uris: uris
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.access_token,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status != 204) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            resolve(true)
        }).catch(() => {
            reject()
        })
    })
}

export const spotify_get_devices = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.access_token
            }
        }).then((response) => {
            if (response.status != 200) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            resolve(response.data.devices)
        }).catch(() => {
            reject()
        })
    })
}

export const spotify_artist_top_tracks = (uri) => {
    let id = uri.split(':').slice(-1)[0]
    return new Promise((resolve, reject) => {
        axios.get('https://api.spotify.com/v1/artists/' + id + '/top-tracks', {
            params: {
                country: 'from_token'
            },
            headers: {
                'Authorization': 'Bearer ' + localStorage.access_token
            }
        }).then((response) => {
            if (response.status != 200) {
                let error_string = handle_error(response)
                reject(error_string)
            }
            resolve(response.data.tracks)
        }).catch(() => {
            reject()
        })
    })
}

var handle_error = (response) => {
    let error_string = "Error: Return code " + response.status + " -- " + response.statusText
    console.log(error_string)
    return error_string
}
