<script>
import axios from "axios";
import USTACompTeamLinesStat from "./USTACompTeamLinesStat.vue";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';


export default {

    props: {
        team1: { type: Object},
        team2: { type: Object},
    },

    mounted() {
    },

    data() {
        return {
        }
    },

    components: {
        USTATeamBrief,
    }
};
</script>

<template>
    <div v-if="team1.id" class="m-2 flex flow-row min-w-full">
        <USTACompTeamLinesStat :team="team1" :matchType="matchType"/>
        <USTACompTeamLinesStat :team="team2" :matchType="matchType"/>
    </div>
</template>

