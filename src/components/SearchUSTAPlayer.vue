<script>
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";
import PlayerInfo from "./PlayerInfo.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        let utrId = this.$route.query.utr;

        if (utrId == null) {
            return;
        }

        var url = this.getBaseURL() + "/playerresult/?id=" + utrId;

        try {
            const response = await axios.get(url);
            this.playerresult = response.data;
            this.teams = [];
            this.team = {},
            this.query = utrId;
            this.loading = false;
        } catch (error) {
            console.log(error);
        };

        url = this.getBaseURL() + "/players/utr/" + utrId;
        try {
            const res = await axios.get(url);
            this.currentPlayer = res.data;
            this.players.push(this.currentPlayer);
        } catch (error) {
        }''

    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async setPlayerResult(player) {
            this.loading = true;
            this.currentPlayer = player;

            var url = this.getBaseURL() + "/playerresult/?id=" + player.utrId;
            try {
                const response = await axios.get(url);
                this.playerresult = response.data;
            } catch(error) {
            };
            this.loading = false;
        },

        async searchPlayer() {
            var url = this.getBaseURL() + "/players/search?name=" + this.query;
            try {
                const response = await axios.get(url);
                this.players = response.data;
                this.team = {};
                this.teams = [];
                this.currentPlayer = {};
                this.playerresult = {};
            } catch(error) {
            };
        },

        async getTeams(player) {
            this.loading = true;

            var url = this.getBaseURL() + "/players/" + player.id + "/teams";
            try {
                const response = await axios.get(url);
                this.teams = response.data;
            } catch(error) {
            };
            this.loading = false;
        },

        async getTeam(team) {
            this.team = team;
        },
    },

    data() {
        return {
            query: '',
            players: [],
            playerresult: {},
            currentPlayer: {},
            teams: [],
            team: {},
            loading: false,
        }
    },

    components: {
        PlayerResult,
        PlayerInfo
    }
}
</script>

<template>
    <div class="flex flow-row">
        <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
            <label class="border-transparent rounded-lg text-center px-2 py-1 mx-auto md:mx-0 my-2 bg-gray-100 font-normal z-10 shadow-lg">
              USTA Player:
            </label>
            <input v-model="query" class="border-b-2 border-gray-300" >
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="searchPlayer"
            >
             Search
            </button>
            <table v-if="players.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
                <thead>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Player
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            NTRP
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            DR
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            UTR
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Teams
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(player, index) in players" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ index+1 }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a href="#" class="underline" @click="setPlayerResult(player)">
                            {{ player.firstName }} {{player.lastName}}
                            </a>
                            {{ player.gender }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.ustaRating}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.dynamicRating}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.sUTR}}S/{{ player.dUTR}}D
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a href="#" class="underline" @click="getTeams(player)">
                            Teams
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table v-if="teams.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
                <thead>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Name
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Flight
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Captain
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Tennis Record
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(team, index) in teams" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ index+1 }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a href="#" class="underline" @click="getTeam(team)">
                            <span v-if="team.alias">[{{ team.alias }}] </span> {{team.name}}
                            </a>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ team.areaCode}}-{{team.flight}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ team.captainName}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a :href="team.tennisRecordLink" class="underline" target="_blank">
                            Tennis Record
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <label v-if="team.players" class="border-transparent rounded-lg text-center px-2 py-1 mx-auto md:mx-0 my-2 bg-gray-100 font-normal z-10 shadow-lg">
              Team: <a :href="team.link" class="underline" >{{team.name}}</a>
            </label>
            <table v-if="team.players" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
              <thead>
                <tr>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        #
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Player
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        NTRP
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        UTR Rating
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        UTR Win Ratio
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        DR
                    </th>
                </tr>
              </thead>
              <tbody>
                 <tr v-for="(player, index) in team.players" class="even:bg-slate-50 odd:bg-slate-400">
                    <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ index+1 }}
                    </td>
                    <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        <a href="#" class="underline" @click="setPlayerResult(player)">
                        {{ player.name }} ({{ player.gender }})
                        </a>
                    </td>
                    <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ player.ustaRating}}
                    </td>
                    <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        <span v-if="player.sUTRStatus === 'Rated'" class="font-semibold" >
                            {{ player.sUTR }} (S)
                        </span>
                        <span v-else class="font-light" >
                            {{ player.sUTR }} (S)
                        </span>  /
                        <span v-if="player.dUTRStatus === 'Rated'" class="font-semibold" >
                            {{ player.dUTR }} (D)
                        </span>
                        <span v-else class="font-light" >
                            {{ player.dUTR }} (D)
                        </span>
                    </td>
                    <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ (player.successRate * 100).toFixed(2) }} % (Latest)/ {{ (player.wholeSuccessRate * 100).toFixed(2) }}%
                    </td>
                    <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ player.dynamicRating}}
                    </td>
                  </tr>
              </tbody>
            </table>
            </div>
            <div v-if="loading" class="px-5 py-5">
                <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-else>
                <PlayerInfo :player="currentPlayer" />
                <PlayerResult :result="playerresult"/>
            </div>
    </div>

</template>

