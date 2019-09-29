<template>
    <div :id="item.id" class="mb-1">
        <div class="row mb-0 rounded-lg spotify-item clickable px-3">
            <!-- Artist or track image -->
            <img v-bind:class="['col-auto', 'p-0', 'spotify-' + item.type + '-image']" :src="item.image" v-on:click="$emit('item_clicked', item)">
            <!-- Artist name or track name and its artists -->
            <div class="col spotify-item-content" v-on:click="$emit('item_clicked', item)">
                <div class="pr-3">
                    <p class="mb-0 hide-overflow">{{item.name}}</p>
                    <small v-if="item.type == 'track' || item.type == 'pl_track'" class="mb-0 text-muted hide-overflow">{{item.artists}}</small>
                </div>
            </div>
            <!-- Play button to play the item -->
            <div v-if="item.type == 'artist' || item.type == 'track'" class="col-auto spotify-item-content play-button-container p-0">
                <p class="play-button m-0 p-0" v-on:click="play_item(item)">&#9654;</p>
            </div>
        </div>
        <!-- Hidden error message that is shown if there are errors playing a track on Spotify -->
        <div class="row mb-0 px-3">
            <div class="col-auto" style="width:64px;"></div>
            <div class="col" v-if="play_error">
                <small class="mb-0 text-danger">Cannot play this. Launch Spotify and listen to something, then it should work.</small>
            </div>
        </div>
    </div>
</template>

<script>
import { play_artist_top_tracks } from '../lib/common.js'
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
        play_item (item) {
            if (item.uri.startsWith("spotify:artist:")) {
                play_artist_top_tracks(item.uri).then(() => {
                    console.log("Should now be playing top tracks of " + item.uri)
                    this.play_error = false
                }).catch(() => {
                    console.log("Could not play " + item.uri)
                    this.play_error = true
                })
            } else if (item.uri.startsWith("spotify:track:")) {
                spotify_play_tracks([item.uri]).then(() => {
                    console.log("Should now be playing " + item.uri)
                    this.play_error = false
                }).catch(() => {
                    console.log("Could not play " + item.uri)
                    this.play_error = true
                })
            }
        }
    }
}
</script>

<style scoped lang='scss'>
@import "../scss/_variables.scss";
$item-size: 64px;
$play-button-size: 48px;
.spotify-item {
    height: $item-size;
    transition: background-color .3s;
}
.spotify-item:hover {
    background-color: $color-global-grey;
}
.spotify-item-content {
    height: $item-size;
    position: relative;
}
.spotify-item-content > div, .spotify-item-content > p {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0, -50%);
}
.play-button-container {
    width: $play-button-size;
}
.play-button {
    height: $play-button-size;
    line-height: $play-button-size;
    width: $play-button-size;
    padding-left: 0;
    padding-right: 0;
    font-family:'Courier New', Courier, monospace;
    color: $color-global-darkgreen;
    border-radius: 50%;
    text-align: center;
    transition: background-color .5s, color .5s;
}
.play-button:hover {
    background-color: $color-global-darkgreen;
    color: $color-global-grey;
}
.spotify-track-image, .spotify-artist-image {
    width: $item-size;
    height: 100%;
    object-fit: cover;
}
.spotify-artist-image {
    border-radius: 50%;
}
.hide-overflow {
    display: block;
    width: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>