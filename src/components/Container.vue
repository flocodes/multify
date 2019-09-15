<template>
    <div>
        <input type="text" class="form-control mb-2" id="search" placeholder="Search for artists and tracks" v-on:input="search_timeout">
        <Item v-for="suggestion in suggestions" v-bind:item="suggestion" v-on:item_clicked="add_seed" :key="suggestion.key"/>
        <h1 class="mt-2">Seeds</h1>
        <Item v-for="seed in seeds" v-bind:item="seed" v-on:item_clicked="remove_seed" :key="seed.key"/>
        <p v-if="no_seeds">Add some seeds by searching for artists and tracks above.</p>
        <button class="btn btn-primary my-2" v-if="enough_seeds" v-on:click="generate_playlist">Generate playlist</button>
        <h1 class="my-2">Playlist</h1>
        <Item v-for="track in playlist" v-bind:item="track" v-on:item_clicked="play_track" :key="track.key"/>
        <p v-if="no_playlist && no_seeds">Add some seeds to generate a playlist.</p>
        <p v-else-if="no_playlist">Generate a playlist from your seeds by clicking the button above.</p>
        <input type="text" class="form-control my-2" id="playlist_title" hint="Playlist name" value="Multify" v-if="playlist_generated">
        <div class="row align-items-center my-2">
            <div class="col-auto">
                <button class="btn btn-spotify" v-if="playlist_generated" v-on:click="play_playlist">Play on Spotify</button> 
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" v-if="playlist_generated" v-on:click="add_to_account">Add to my account</button>
            </div>
            <div class="col-auto" v-if="playlist_added || play_error">
                <p class="mb-0">
                    <small v-if="playlist_added">The playlist was added to your account.</small>
                    <small class="text-danger" v-else-if="play_error">{{play_error}}</small>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { clearTimeout } from 'timers';
import Item from './Item.vue'
import {
    get_suggestions,
    get_recommendations,
    add_playlist_to_account
} from '../lib/common.js'
import {
    spotify_play_tracks
} from '../lib/spotify.js'

export default {
    name: 'Container',
    components: {
        Item
    },
    data: function () {
        return {
            suggestions: [],
            seeds: [],
            playlist: [],
            user_id: '',
            playlist_added: false,
            timer: null,
            play_error: false
        }
    },
    computed: {
        no_seeds: function () {
            return this.seeds.length == 0
        },
        enough_seeds: function () {
            return this.seeds.length > 0
        },
        no_playlist: function () {
            return this.playlist.length == 0
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
            if (query.length < 3) {
                this.suggestions = []
                return
            }
            get_suggestions(query).then((suggestions) => {
                this.suggestions = suggestions
            })
        },
        add_seed (item) {
            console.log("Adding to seeds: " + item.name + " (" + item.uri + ")")
            let uri = item.uri
            if (this.seeds.length > 4) {
                console.log("Cannot have more than 5 seeds")
                return
            }
            for (let seed of this.seeds) {
                if (item.uri == seed.uri) {
                    console.log(item.uri + " already in seeds")
                    return
                }
            }
            let seed = {}
            for (let suggestion of this.suggestions) {
                if (item.uri == suggestion.uri) {
                    for (let key in suggestion) {
                        if (key != 'key') seed[key] = suggestion[key]
                    }
                    break
                }
            }
            if (!seed) {
                console.log("Could not find URI " + uri + " in suggestions")
                return
            }
            seed.key = 'seed-' + seed.id
            this.seeds.push(seed)
        },
        remove_seed (item) {
            console.log("Removing from seeds: " + item.name + " (" + item.uri + ")")
            let seeds = this.seeds.filter(function (seed, index, arr) {
                return seed.uri != item.uri
            })
            this.seeds = seeds
        },
        generate_playlist () {
            console.log("Generating a playlist from " + this.seeds.length + " seeds")
            get_recommendations(this.seeds).then((playlist) => {
                this.playlist = playlist
            })
        },
        add_to_account (event) {
            let playlist_name = document.querySelector('#playlist_title').value
            if (!playlist_name) playlist_name = 'Multify'
            console.log("Adding this playlist with " + this.playlist.length + " tracks to your account.")
            add_playlist_to_account(this.playlist, playlist_name, this.seeds).then(() => {
                this.playlist_added = true
            })
        },
        play_track (item) {
            spotify_play_tracks([item.uri]).then(() => {
                this.play_error = ""
            }).catch(() => {
                this.play_error = "Cannot play any tracks because you do not have an active Spotify session."
            })
        },
        play_playlist () {
            let track_uris = []
            for (let track of this.playlist) {
                track_uris.push(track.uri)
            }
            spotify_play_tracks(track_uris).then(() => {
                this.play_error = ""
            }).catch(() => {
                this.play_error = "Cannot play the playlist because you do not have an active Spotify session."
            })
        }
    }
}
</script>

<style scoped>
.btn-spotify {
    background-color: #1DB954;
    color: white;
}
.btn-spotify:hover {
    color: white;
    background-color: #1AA249;
}
</style>