<template>
    <div>
        <input type="text" id="search" placeholder="Search for artists and tracks" v-on:input="search_timeout">
        <Item v-for="suggestion in suggestions" v-bind:item="suggestion" v-on:item_clicked="add_seed" :key="suggestion.key"/>
        <h1>Seeds</h1>
        <Item v-for="seed in seeds" v-bind:item="seed" v-on:item_clicked="remove_seed" :key="seed.key"/>
        <a class="button" v-if="enough_seeds" v-on:click="generate_playlist">Generate playlist!</a>
        <h1>Playlist</h1>
        <input type="text" id="playlist_title" hint="Playlist name" value="Multify" v-if="playlist_generated">
        <Item v-for="track in playlist" v-bind:item="track" :key="track.key"/>
        <a class="button" v-if="playlist_generated" v-on:click="add_to_account">Add to my account!</a>
        <p v-if="playlist_added">Playlist was added to your account.</p>
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
            if (query.length < 3) {
                this.suggestions = []
                return
            }
            get_suggestions(query).then((suggestions) => {
                this.suggestions = suggestions
            })
        },
        add_seed (id) {
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
                    seed = {
                        key: "seed-" + suggestion.id,
                        id: id,
                        name: suggestion.name,
                        type: suggestion.type
                    }
                    break
                }
            }
            if (!seed) {
                console.log("Could not find ID " + id + " in suggestions")
                return
            }
            this.seeds.push(seed)
        },
        remove_seed (id) {
            console.log("Removing from seeds: " + id)
            let seeds = this.seeds.filter(function (item, index, arr) {
                return item.id != id
            })
            console.log(seeds)
            this.seeds = seeds
        },
        generate_playlist (event) {
            console.log("Generating a playlist from " + this.seeds.length + " seeds")
            get_recommendations(this.seeds).then((playlist) => {
                this.playlist = playlist
            })
        },
        // TODO: Get playlist name from input
        add_to_account (event) {
            console.log("Adding this playlist with " + this.playlist.length + " tracks to your account.")
            add_playlist_to_account(this.playlist, 'Multify', this.seeds).then(() => {
                this.playlist_added = true
            })
        }
    }
}
</script>

<style scoped>
</style>