<template>
    <div :id="item.id">
        <div class="row align-items-center mb-1 rounded-lg spotify-item clickable px-3" v-if="item.type === 'artist'">
            <img class="col-1 rounded-circle spotify-artist-image p-0" v-if="item.image" v-on:click="$emit('item_clicked', item)" :src="item.image" width="100%" height="auto">
            <p class="col my-0" v-on:click="$emit('item_clicked', item)">{{item.name}}</p>
        </div>
        <div class="row align-items-center mb-1 spotify-item rounded-lg px-3" v-else>
            <img class="col-1 clickable spotify-track-image p-0" v-if="item.image" v-on:click="$emit('item_clicked', item)" :src="item.image" width="100%" height="auto">
            <div class="col clickable">
                <p class="mb-0" v-on:click="$emit('item_clicked', item)">{{item.name}}</p>
                <p class="mb-0 text-muted" v-on:click="$emit('item_clicked', item)"><small>{{item.artists}}</small></p>
            </div>
            <div class="col-auto">
                <p class="mb-0 text-danger" v-if="play_error"><small>Cannot play this track because you do not have an active Spotify session.</small></p>
            </div>
            <div class="col-1 clickable">
                <p class="my-2 play-button" v-on:click="play_track(item.uri)">&#9654;</p>
            </div>
        </div>
    </div>
</template>

<script>
import { spotify_play_tracks } from '../lib/spotify.js'

export default {
    name: 'Item',
    props: ['item'],
    data: function () {
        return {
            play_error: false
        }
    },
    methods: {
        play_track (uri) {
            spotify_play_tracks([uri]).then(() => {
                console.log("Should now be playing " + uri)
                this.play_error = false
            }).catch(() => {
                console.log("Could not play " + uri)
                this.play_error = true
            })
        }
    }
}
</script>

<style scoped>
.clickable {
    cursor: pointer;
}
.spotify-item:hover {
    background-color: #EEE;
}
.play-button {
    font-family:'Courier New', Courier, monospace;
}
.play-button:hover {
    color: #1DB954;
}
.spotify-item {
    height: 64px;
}
.spotify-track-image,.spotify-artist-image {
    max-width: 64px;
    height: 100%;
    object-fit: cover;
}
</style>