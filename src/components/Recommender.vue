<template>
    <div>
        <div class="dropdown mt-3">
            <button class="btn btn-darkgreen btn-text-white dropdown-toggle" id="btn-filter-add" type="button" data-toggle="dropdown">
                Add filter
            </button>
            <div class="dropdown-menu">
                <button v-for="feature in features" :key="'feature-' + feature.name" v-on:click="add_filter(feature)" class="dropdown-item feature" type="button">
                    <p class="mb-0 capitalized">{{feature.name}}</p>
                    <small class="text-muted wrap">{{feature.description}}</small>
                </button>
            </div>
        </div>
        <form id="form-recommend">
            <div v-for="filter in filters" :key="'filter-' + filter.name" class="row align-items-center mt-3">
                <p class="col-auto capitalized mb-0">{{filter.name}}</p>
                <select class="col-auto form-control-sm mr-3" v-model="filter.type">
                    <option value="target">Target</option>
                    <option value="range">Range</option>
                </select>
                <input class="col-auto form-control-sm" v-if="filter.type == 'target'" v-model.number="filter.target" type="number" placeholder="Target" :min="filter.min" :max="filter.max" step="0.01">
                <div class="col-auto" v-else>
                    <input class="form-control-sm" v-model.number="filter.target_range.min" type="number" placeholder="Min" :min="filter.min" :max="filter.max" step="0.01">
                    <input class="form-control-sm" v-model.number="filter.target_range.max" type="number" placeholder="Max" :min="filter.min" :max="filter.max" step="0.01"> <!-- :step="filter.step" IS NOT WORKING -->
                </div>
                <p class="col-auto text-danger unicode clickable mr-3 mb-0" v-on:click="remove_filter(filter)">&#10006;</p>
            </div>
            <div class="row align-items-center mt-3">
                <div class="col-auto">
                    <button class="btn btn-primary" type="button" role="button" v-on:click="generate_playlist">Generate playlist</button>
                </div>
                <div class="col-auto">
                    <div class="input-group">
                        <input type="number" class="form-control" v-model.number="limit" placeholder="20" min="1" step="1" max="100">
                        <div class="input-group-append">
                            <span class="input-group-text">tracks</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Recommender',
    data: function () {
        return {
            limit: 20,
            features : [
                {
                    name: 'acousticness',
                    description: 'A confidence measure from 0 to 1 of whether the track is acoustic',
                    min: 0, max: 1, default: 0.5, step: 0.001
                },
                {
                    name: 'danceability',
                    description: 'A measure from 0 to 1 of how suitable a track is for dancing',
                    min: 0, max: 1, default: 0.5, step: 0.001
                },
                /*
                {
                    name: 'duration_ms',
                    description: 'The duration of the track in milliseconds.',
                    min: 0, max: 300000, default: 180000, step: 1000
                },
                */
                {
                    name: 'energy',
                    description: 'A measure from 0 to 1 that represents perceived intensity and activity',
                    min: 0, max: 1, default: 0.5, step: 0.001
                },
                {
                    name: 'instrumentalness',
                    description: 'A confidence measure from 0 to 1 of whether a track contains no vocals',
                    min: 0, max: 1, default: 0.5, step: 0.001
                },
                /*
                {
                    name: 'key',
                    description: 'The key the track is in. Integers map to pitches using standard Pitch Class notation',
                    min: 0, max: 11, default: 0, step: 1
                },
                */
                {
                    name: 'liveness',
                    description: 'A confidence measure from 0 to 1 of whether a track was performed live',
                    min: 0, max: 1, default: 0.5, step: 0.001
                },
                /*
                {
                    name: 'loudness',
                    description: 'Loudness of a track in decibels (dB)',
                    min: -60, max: 0, default: 0, step: 1
                },
                */
                {
                    name: 'popularity',
                    description: 'A measure from 0 to 100 of how popular a track is',
                    min: 0, max: 100, default: 50, step: 1
                },
                {
                    name: 'speechiness',
                    description: 'A measure from 0 to 1 of how many spoken words are present in a track',
                    min: 0, max: 1, default: 0.5, step: 0.001
                },
                {
                    name: 'tempo',
                    description: 'The overall estimated tempo of a track in beats per minute (BPM)',
                    min: 0, max: 300, default: 100, step: 1
                },
                {
                    name: 'valence',
                    description: 'A measure from 0 to 1 describing the musical positiveness conveyed by a track',
                    min: 0, max: 1, default: 0.5, step: 0.001
                }
            ],
            filters : []
        }
    },
    methods: {
        generate_playlist () {
            let settings = { limit: this.limit }
            for (let filter of this.filters) {
                if (filter.type == 'target') {
                    settings['target_' + filter.name] = filter.target
                } else if (filter.type == 'range') {
                    settings['min_' + filter.name] = filter.target_range.min
                    settings['max_' + filter.name] = filter.target_range.max
                }
            }
            this.$emit('generate_playlist', settings)
        },
        add_filter (feature) {
            console.log("Adding filter " + feature.name)
            for (let filter of this.filters) {
                if (filter.name == feature.name) {
                    console.log("Filter already used")
                    return
                }
            }
            this.filters.push({
                name: feature.name,
                type: 'target',
                target: feature.default,
                target_range: {
                    min: feature.min,
                    max: feature.max
                },
                min: feature.min,
                max: feature.max,
                step: feature.step
            })
        },
        remove_filter (filter) {
            console.log("Removing filter " + filter.name)
            this.filters = this.filters.filter(f => {
                return f.name != filter.name
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';
.capitalized {
    text-transform: capitalize;
}
.unicode {
    font-family:'Courier New', Courier, monospace;
}
.wrap {
    white-space: normal;
}
</style>
