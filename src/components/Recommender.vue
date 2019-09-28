<template>
    <form class="form-inline">
        <button class="btn btn-primary mr-3" role="button" v-on:click="generate_playlist">Generate playlist</button>
        <div class="input-group">
            <input type="number" class="form-control" id="limit" v-on:input="check_limit" v-model="limit" placeholder="20" min="1" step="1" max="100">
            <div class="input-group-append">
                <span class="input-group-text">tracks</span>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'Recommender',
    data: function () {
        return {
            limit: 20
        }
    },
    methods: {
        generate_playlist () {
            this.$emit('generate_playlist', {
                limit: this.limit
            })
        }
    }
}
</script>