<template>
    <div>
        <div class="container">
            <input type="text" class="form-control mb-2" id="search" placeholder="Search for artists and tracks" v-on:input="search_timeout">
            <Item v-for="suggestion in suggestions" v-bind:item="suggestion" v-on:item_clicked="add_seed" :key="suggestion.key"/>
        </div>
        <div class="container">
            <h1 class="mt-3">Seeds</h1>
            <transition-group name="list">
                <Item v-for="seed in seeds" v-bind:item="seed" v-on:item_clicked="remove_seed" :key="seed.key"/>
            </transition-group>
            <p v-if="no_seeds">Add some seeds by searching for artists and tracks above.</p>
            <Recommender v-else class="mt-3" v-on:generate_playlist="generate_playlist"/>
        </div>
        <div class="flex-container hline-container my-3">
            <div id="hline-search-left"></div>
            <img src="../assets/hlines/hline1.png">
            <div id="hline-search-right"></div>
        </div>
        <div class="container">
            <h1 class="mb-2">Playlist</h1>
            <transition-group name="list">
                <Item v-for="track in playlist" v-bind:item="track" v-on:item_clicked="play_track" :key="track.key"/>
            </transition-group>
            <p v-if="no_playlist && no_seeds">Add some seeds to generate a playlist.</p>
            <p v-else-if="no_playlist">Generate a playlist from your seeds by clicking the button above.</p>
            <form class="form-inline my-3" v-if="playlist_generated">
                <div class="input-group mr-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Playlist name</span>
                    </div>
                    <input type="text" class="form-control" id="playlist_title" hint="Playlist name" v-model="playlist_name">
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="playlist_public" id="playlist-public-check">
                    <label class="form-check-label" for="playlist-public-check">Public</label>
                </div>
            </form>
            <div class="row align-items-center">
                <div class="col-auto">
                    <button class="btn btn-darkgreen btn-text-white" v-if="playlist_generated" v-on:click="play_playlist">Play on Spotify</button> 
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary" v-if="playlist_generated" v-on:click="add_to_account">Add to my account</button>
                </div>
                <div class="col-auto" v-if="playlist_added || play_error">
                    <p class="mb-0">
                        <small v-if="playlist_added">The playlist was added to your account.</small>
                        <small class="text-danger" v-else-if="play_error">Cannot play any tracks. <a class="text-danger" :href="play_error"><b>Launch Spotify</b></a> and listen to something, then it should work.</small>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { clearTimeout } from 'timers';
import Item from './Item.vue'
import Recommender from './Recommender.vue'
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
        Item,
        Recommender
    },
    data: function () {
        return {
            suggestions: [],
            seeds: [],
            playlist: [],
            user_id: '',
            playlist_added: false,
            timer: null,
            play_error: false,
            playlist_name: "Multify",
            playlist_public: false
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
                for (let suggestion of suggestions) {
                    suggestion['in_seeds'] = false
                    for (let seed of this.seeds) {
                        if (seed.uri == suggestion.uri) {
                            suggestion['in_seeds'] = true
                            break
                        }
                    }
                }
                console.log(suggestions)
                this.suggestions = suggestions
            })
        },
        add_seed (item) {
            console.log("Adding to seeds: " + item.name + " (" + item.uri + ")")
            for (let seed of this.seeds) {
                if (item.uri == seed.uri) {
                    console.log(item.uri + " already in seeds")
                    $("#toast-already-in-seeds").toast("show")
                    return
                }
            }

            if (this.seeds.length > 4) {
                console.log("Cannot have more than 5 seeds")
                $("#toast-too-many-seeds").toast('show')
                return
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
            item.in_seeds = true
            seed.key = 'seed-' + seed.id
            this.seeds.push(seed)
        },
        remove_seed (item) {
            console.log("Removing from seeds: " + item.name + " (" + item.uri + ")")
            let seeds = this.seeds.filter(function (seed, index, arr) {
                return seed.uri != item.uri
            })
            this.seeds = seeds
            for (let suggestion of this.suggestions) {
                if (suggestion.uri == item.uri) {
                    suggestion.in_seeds = false
                }
            }
        },
        generate_playlist (settings) {
            console.log("Generating a playlist from " + this.seeds.length + " seeds")
            get_recommendations(this.seeds, settings).then((playlist) => {
                this.playlist = playlist
            })
        },
        add_to_account (event) {
            let playlist_name = this.playlist_name
            if (!playlist_name) playlist_name = 'Multify'
            console.log("Adding this playlist with " + this.playlist.length + " tracks to your account.")
            add_playlist_to_account(this.playlist, playlist_name, this.seeds, this.playlist_public).then(() => {
                this.playlist_added = true
            })
        },
        play_track (item) {
            spotify_play_tracks([item.uri]).then(() => {
                this.play_error = false
            }).catch(() => {
                this.play_error = item.uri
            })
        },
        play_playlist () {
            let track_uris = []
            for (let track of this.playlist) {
                track_uris.push(track.uri)
            }
            spotify_play_tracks(track_uris).then(() => {
                this.play_error = false
            }).catch(() => {
                this.play_error = track_uris[0]
            })
        }
    }
}
</script>

<style scoped lang='scss'>
@import "../scss/_variables";
#hline-search-left {
    background-image: url("../assets/hlines/hline1-left.png");
}
#hline-search-right {
    background-image: url("../assets/hlines/hline1-right.png");
}
.list-enter-active, .list-leave-active {
    transition: height .5s, opacity .5s;
}
.list-enter-to, .list-leave {
    height: 64px;
    opacity: 1;
}
.list-enter, .list-leave-to {
    height: 0;
    opacity: 0;
}
</style>