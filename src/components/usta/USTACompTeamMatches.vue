<script>
import axios from "axios";
import MatchScore from "./MatchScore.vue";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';


export default {

    props: {
        result: { type: Object},
    },

    mounted() {
    },

    data() {
        return {
        }
    },

    components: {
        MatchScore,
    }
};
</script>

<template>
    <div v-if="result.team1" class="min-w-full  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <label class="block text-gray-700 font-bold mb-2 px-2 ">
            Past Matches
        </label>
        <div v-for="scorecard in result.pastScores" class="w-full border-collapse border-spacing-0 border border-slate-100">
            <MatchScore :scoreCard="scorecard" />
        </div>
        <hr/>
        <label class="block text-gray-700 font-bold mb-2 px-2 ">
            Matches with same team
        </label>

        <div v-for="(scorecards, key) in result.matchesWithSameTeam" class="w-full border-collapse border-spacing-0 border border-slate-100">
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Team: {{key}}
            </label>
            <div v-for="scorecard in scorecards">
                <MatchScore :scoreCard="scorecard" />
            </div>
        </div>
    </div>
</template>

