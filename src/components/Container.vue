<template>
    <div>
        <p>Connected to Spotify!</p>
        <input type="text" id="search" placeholder="Search for artists and tracks" v-on:input="search_timeout">
        <!-- TODO: Only add onclick listener to parent. This does not work currently as clicks on <p> are registered as such and I cannot get the div's ID -->
        <div v-for="suggestion in suggestions" v-on:click="add_seed" :id="suggestion.id"> <!-- v-bind:key="suggestion.id" (Cannot use as suggestions and seeds have same IDs)-->
            <img v-if="suggestion.image" :src="suggestion.image" width=64 height=64>
            <p>{{suggestion.name}}</p>
        </div>
        <h1>Seeds</h1>
        <div v-for="seed in seeds" v-on:click="remove_seed" :id="seed.id"> <!-- v-bind:key="seed.id" -->
            <img v-if="seed.image" :src="seed.image" width=64 height=64>
            <p>{{seed.name}}</p>
        </div>
        <a class="button" v-if="enough_seeds" v-on:click="generate_playlist">Generate playlist!</a>
        <h1>Playlist</h1>
        <input type="text" id="playlist_title" hint="Playlist name" value="Multify" v-if="playlist_generated">
        <div v-for="track in playlist" v-bind:key="track.id">
            <img v-if="track.image" src="track.image" width=64 height=64>
            <p>{{track.name}}</p>
        </div>
        <a class="button" v-if="playlist_generated" v-on:click="add_to_account">Add to my account!</a>
        <p v-if="playlist_added">Playlist was added to your account.</p>
    </div>
</template>

<script>
import { clearTimeout } from 'timers';
const axios = require('axios')
export default {
    name: 'Container',
    data: function () {
        return {
            suggestions: [],
            seeds: [],
            playlist: [],
            user_id: '',
            playlist_added: false,
            timer: null
        }
    },
    computed: {
        enough_seeds: function () {
            return this.seeds.length > 0
        },
        playlist_generated: function () {
            return this.playlist.length > 0
        }
    },
    methods: {
        search_timeout (event) {
            if (this.timer) {
                window.clearTimeout(this.timer)
                this.timer = null
            }
            this.timer = window.setTimeout(() => this.search(event), 500)
        },
        search (event) {
            let query = event.target.value
            if (query.length < 3) return
            axios.get("https://api.spotify.com/v1/search", {
                params: {
                        q: query,
                        type: 'artist,track',
                        limit: 3
                },
                headers: {
                    'Authorization': 'Bearer ' + localStorage.access_token
                }
            })
            .then(function (response) {
                console.log(response)
                if (response.status != 200) {
                    console.log("Error: Return code " + response.status + " -- " + response.statusText)
                    return
                }
                let artists = response.data.artists.items
                let tracks = response.data.tracks.items
                let suggestions = []
                for (let artist of artists) {
                    suggestions.push({
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
                        id: track.id,
                        type: 'track',
                        name: track_artists.join(', ') + " - " + track.name
                    })
                }
                console.log(suggestions)
                this.suggestions = suggestions
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
        },
        add_seed (event) {
            console.log(event)
            let id = event.target.id
            if (!id) {
                id = event.target.parentElement.id
            }
            console.log("Adding to seeds: " + id)
            for (let seed of this.seeds) {
                if (id == seed.id) {
                    console.log(id + " already in seeds")
                    return
                }
            }
            let seed = null
            for (let suggestion of this.suggestions) {
                if (id == suggestion.id) {
                    seed = suggestion
                    break
                }
            }
            if (!seed) {
                console.log("Could not find ID " + id + " in suggestions")
                return
            }
            this.seeds.push(seed)
        },
        remove_seed (event) {
            let id = event.target.id
            if (!id) {
                id = event.target.parentElement.id
            }
            console.log("Removing from seeds: " + id)
            let seeds = this.seeds.filter(function (item, index, arr) {
                return item.id != id
            })
            console.log(seeds)
            this.seeds = seeds
        },
        generate_playlist (event) {
            console.log("Generating a playlist from " + this.seeds.length + " seeds: " + this.seeds.join(", "))
            let seed_artists = []
            let seed_tracks = []
            for (let seed of this.seeds) {
                if (seed.type == 'artist') {
                    seed_artists.push(seed.id)
                } else if (seed.type == 'track') {
                    seed_tracks.push(seed.id)
                }
            }
            axios.get("https://api.spotify.com/v1/recommendations", {
                params: {
                        limit: 20,
                        seed_artists: seed_artists.join(','),
                        seed_tracks: seed_tracks.join(',')
                },
                headers: {
                    'Authorization': 'Bearer ' + localStorage.access_token
                }
            }).then(function (response) {
                if (response.status != 200) {
                    console.log("Error: Return code " + response.status + " -- " + response.statusText)
                    return
                }
                let tracks = []
                for (let track of response.data.tracks) {
                    let track_artists = []
                    for (let artist of track.artists) {
                        track_artists.push(artist.name)
                    }
                    tracks.push({
                        id: track.id,
                        name: track_artists.join(', ') + ' - ' + track.name
                    })
                }
                this.playlist = tracks
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
        },
        add_to_account (event) {
            console.log("Adding this playlist with " + this.playlist.length + " tracks to your account.")
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.access_token
                }
            }).then(function(response) {
                if (response.status != 200) {
                    console.log("Error: Return code " + response.status + " -- " + response.statusText)
                    return
                }
                let user_id = response.data.id
                console.log("User ID is " + user_id)
                this.id = user_id
                let description = []
                for (let seed of this.seeds) {
                    description.push(seed.name)
                }
                // TODO: Get playlist name from input
                axios.post('https://api.spotify.com/v1/users/' + user_id + '/playlists', 
                    { name: 'Multify', public: false, description: 'Seeds: ' + description.join(', ') }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    if (!(response.status == 200 || response.status == 201)) {
                        console.log("Error: Return code " + response.status + " -- " + response.statusText)
                        return
                    }
                    let playlist_id = response.data.id
                    console.log("playlist id is " + playlist_id)
                    let tracks = []
                    for (let track of this.playlist) {
                        tracks.push("spotify:track:" + track.id)
                    }
                    axios.post('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', 
                        { uris: tracks }, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.access_token,
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        if (response.status != 201) {
                            console.log("Error: Return code " + response.status + " -- " + response.statusText)
                            return
                        }
                        console.log("Successfully added tracks to a new playlist.")
                        this.playlist_added = true
                    }.bind(this))
                }.bind(this))
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
            
        }
    }
}
</script>

<style scoped>
</style>