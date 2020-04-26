<template>
    <div class="container">
        <h3 class="mb-3">Create personalized playlists based on your music taste!</h3>
        <p class="mb-1">MULTIFY is your personal radio. Name some of your favorite artists and tracks, and MULTIFY will make a playlist just for you. </p>
        <p class="mb-1">You can listen to it right here or save it to your account so you can listen to it whenever you want.</p>
        <div class="row justify-content-center">
            <button class="btn btn-primary my-3" v-on:click="connect">Connect to Spotify</button>
        </div>
    </div>
</template>

<script>
var uuid = require("uuid")
export default {
    name: 'Connect',
    data () {
        return {
            client_id: process.env.VUE_APP_CLIENT_ID,
            redirect_uri: process.env.VUE_APP_URL,
            scope: 'playlist-modify-private playlist-modify-public user-modify-playback-state',
        }
    },
    methods: {
        connect () {
            let url = new URL('https://accounts.spotify.com/authorize')
            url.searchParams.set('client_id', this.client_id)
            url.searchParams.set('response_type', 'token')
            url.searchParams.set('redirect_uri', this.redirect_uri)
            let state = uuid.v4()
            localStorage.state = state
            url.searchParams.set('state', state)
            url.searchParams.set('scope', this.scope)
            console.log(url)
            window.location.href = url
        },
    },
    mounted: function () {
        console.log("LocalStorage state = " + localStorage.state)
        let hash = this.$route.hash
        console.log(hash)
        // TODO: Handle errors
        if (this.$route.query.error) {
            console.log("Error while authorizing at Spotify: " + this.$route.query.error)
            return
        }
        if (hash) {
            let data = {}
            for (let pair of hash.slice(1).split('&')) {
                let split = pair.split("=")
                let key = split[0]
                let value = split[1]
                data[key] = value
            }
            if (data.state == localStorage.state && data.access_token != localStorage.access_token) {
                localStorage.access_token = data.access_token
                let expiration_date = new Date()
                expiration_date.setSeconds(expiration_date.getSeconds() + parseInt(data.expires_in))
                localStorage.expiration_date = expiration_date
                console.log("Successfully authorized access. Redirecting to home.")
                this.$router.push('/')
                this.$router.go('/')
            }
        }
    }
}
</script>

<style scoped>
</style>
