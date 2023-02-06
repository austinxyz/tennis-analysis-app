<script>
import axios from "axios";
import USTACompTeamBrief from "./USTACompTeamBrief.vue";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';


export default {

    props: {
        team1: { type: Object},
        team2: { type: Object},
        matchType: {type: String},
    },

    mounted() {
    },

    data() {
        return {
        }
    },

    components: {
        USTACompTeamBrief,
    }
};
</script>

<template>
    <div v-if="team1.id" class="m-2 flex flow-row min-w-full">
        <USTACompTeamBrief :team="team1" :matchType="matchType"/>
        <USTACompTeamBrief :team="team2" :matchType="matchType"/>
    </div>
</template>

