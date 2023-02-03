<script>
import axios from "axios";
import MatchScore from "./MatchScore.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        team: { type: Object},
        matches: {type: Array},
    },

    emits: ["update:team", "update:matches", "change"],

    watch: {
        matches(newMatches, oldMatches) {
            this.scoreCard={};
        }
    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async refreshScores(team) {

            this.loading = true;

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/matches?action=updateScore";
            const response = await axios.get(url);

            this.$emit('update:matches', response.data);

            this.loading = false;
        },

        async changeTeam(teamId) {

            this.loading = true;

            var url = this.getBaseURL() + "/usta/teams/" + teamId ;
            const response = await axios.get(url);

            this.$emit('update:team', response.data);

            url = this.getBaseURL() + "/usta/teams/" + teamId + "/matches";
            const res = await axios.get(url);

            this.$emit('update:matches', res.data);

            this.$emit('change', response.data);

            this.scoreCard = {},

            this.loading = false;
        },

        showScoreDetail(match) {

            this.scoreCard = match.scoreCard;

        },

    },

    data() {
        return {
            loading: false,
            scoreCard: {},
        }
    },

    components: {
        MatchScore,
    }
};
</script>

<template>
        <table class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Date
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Opposite Team
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Home/Away
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider flex flex-row">
                    <span>Score</span><span>
                    <button type="button" @click="refreshScores(team)">
                        <img src="/updates-30.png" width="20" height="20" alt="Refresh Score" title="Refresh Score"/>
                    </button></span>
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Compare
                </th>
            </tr>
          </thead>
          <tbody v-if="matches.length >0" >
             <tr v-for="(match, index) in matches" class="even:bg-slate-50 odd:bg-slate-400">
                 <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                     {{ index+1 }}
                 </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ match.matchDate }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                     <a href="#" class="underline" @click="changeTeam(match.opponentTeamId)">
                        {{match.opponentTeamName}}
                    </a>
                </td>
                <td v-if="match.home" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    Home
                </td>
                <td v-else class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    Away
                </td>
                <td v-if="match.scoreCard" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#score_anchor" class="underline" @click="showScoreDetail(match)">
                        {{match.point}} - {{match.opponentPoint}}
                    </a>
                </td>
                <td v-else class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    -
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                     <a :href="'/usta/teamanalysis?team1=' + team.id + '&team2=' + match.opponentTeamId" class="underline" target="_blank">
                        Analysis
                    </a>
                </td>
              </tr>
          </tbody>
        </table>
        <MatchScore :scoreCard="scoreCard"/>
        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
</template>

