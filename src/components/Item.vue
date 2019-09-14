<template>
    <div :id="item.id">
        <img v-if="item.image" v-on:click="$emit('item_clicked', item.id)" :src="item.image" width=64 height=64>
        <p v-on:click="$emit('item_clicked', item.id)">{{item.name}}</p>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: ['item']
}
</script>