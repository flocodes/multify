<template>
    <div :id="item.id">
        <div class="row align-items-center mb-1 spotify-item rounded-lg" v-if="item.type === 'artist'">
            <img class="col-1 rounded-circle" v-if="item.image" v-on:click="$emit('item_clicked', item.id)" :src="item.image">
            <p class="col my-0" v-on:click="$emit('item_clicked', item.id)">{{item.name}}</p>
        </div>
        <div class="row align-items-center mb-1 spotify-item rounded-lg" v-else>
            <img class="col-1" v-if="item.image" v-on:click="$emit('item_clicked', item.id)" :src="item.image">
            <div class="col">
                <p class="mb-0" v-on:click="$emit('item_clicked', item.id)">{{item.name}}</p>
                <p class="mb-0 text-muted" v-on:click="$emit('item_clicked', item.id)"><small>{{item.artists}}</small></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: ['item']
}
</script>

<style scoped>
.spotify-item {
    cursor: pointer;
}
.spotify-item:hover {
    background-color: #EEE;
}
</style>