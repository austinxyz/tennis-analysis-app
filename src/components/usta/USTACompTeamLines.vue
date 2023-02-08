<script>
import axios from "axios";
import USTATeamLinesStat from "./USTATeamLinesStat.vue";
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
        USTATeamLinesStat,
    }
};
</script>

<template>
    <div v-if="team1" style="min-width: 1600px" class="m-2 flex flow-row min-w-full">
        <USTATeamLinesStat :team="team1"/>
        <USTATeamLinesStat :team="team2"/>
    </div>
</template>

