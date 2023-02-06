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
        USTACompTeamLinesStat,
    }
};
</script>

<template>
    <div v-if="team1" style="min-width: 1600px" class="m-2 flex flow-row min-w-full">
        <USTACompTeamLinesStat :team="team1"/>
        <USTACompTeamLinesStat :team="team2"/>
    </div>
</template>

