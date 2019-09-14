import { Promise } from 'q'

var axios = require('axios')

export const spotify_search = (query, types=['artist', 'track', 'album', 'playlist'], limit=20) => {
    return new Promise((resolve, reject) => {
        axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: query,
                type: types.join(','),
                limit: limit
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

export const spotify_recommend = (seed_artists, seed_tracks) => {
    return new Promise((resolve, reject) => {
        axios.get("https://api.spotify.com/v1/recommendations", {
            params: {
                limit: 20,
                seed_artists: seed_artists.join(','),
                seed_tracks: seed_tracks.join(',')
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

var handle_error = (response) => {
    let error_string = "Error: Return code " + response.status + " -- " + response.statusText
    console.log(error_string)
    return error_string
}
