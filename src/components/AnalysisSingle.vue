<script>
import axios from "axios";
import MatchResults from "./MatchResults.vue";
import SingleComparation from "./SingleComparation.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async compareSingle() {
            this.loading = true;

            var url = this.getBaseURL() + "/analysis/single/player1/" + this.playerId1 + "/player2/" + this.playerId2;
            const response = await axios.get(url);

            this.result = response.data;
            this.loading = false;
        },

        async searchPlayer1() {
            var url = this.getBaseURL() + "/search/players?query=" + this.query1;
            const response = await axios.get(url);
            this.players1 = response.data;
            if (this.players1.length > 0) {
                this.playerId1 = this.players1[0].id;
            }
        },

        async searchPlayer2() {
            var url = this.getBaseURL() + "/search/players?query=" + this.query2;
            const response = await axios.get(url);
            this.players2 = response.data;
            if (this.players2.length > 0) {
                this.playerId2 = this.players2[0].id;
            }
        }


    },

    data() {
        return {
            query1: '',
            query2: '',
            result: {},
            players1: [],
            players2: [],
            playerId1: '',
            playerId2: '',
            loading: false,
        }
    },

    components: {
        MatchResults,
        SingleComparation,
    }
}
</script>

<template>
        <div class="flex flow-row">
              <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
              <div>
                Player 1 : <input v-model="query1" class="border-b-2 border-gray-300" >
                <button
                        class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                        @click="searchPlayer1"
                >
                 Search
                </button>
                <table v-if="players1.length >0" class="border-collapse border-spacing-0 border border-slate-400">
                  <thead>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Player
                        </th>
                    </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(player, index) in players1" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <input type="radio" :value="player.id" v-model="playerId1"/>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.name }}
                            {{ player.gender }}
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
                      </tr>
                  </tbody>
                </table>
              </div>
              <div>
                Player 2 : <input v-model="query2" class="border-b-2 border-gray-300" >
                <button
                        class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                        @click="searchPlayer2"
                >
                 Search
                </button>
                <table v-if="players2.length >0" class="border-collapse border-spacing-0 border border-slate-400">
                  <thead>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Player
                        </th>
                    </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(player, index) in players2" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <input type="radio" :value="player.id" v-model="playerId2"/>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.name }}
                            {{ player.gender }}
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
                      </tr>
                  </tbody>
                </table>
                </div>
                  <button
                          class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                          @click="compareSingle"
                  >
                   Compare
                  </button>
              </div>

              <div v-if="loading" class="px-5 py-5">
                <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-else>
                <div v-if="result.player1"  >
                    <SingleComparation :player1="result.player1" :player2="result.player2" />
                    <div class="font-bold text-2xl"> Past Matches </div>
                    <MatchResults :matches="result.pastMatches" />
                    <div class="font-bold text-2xl"> Matches with same opponents </div>
                    <div v-for="matches in result.matchesWithSamePlayer" class="w-full border-collapse border-spacing-0 border border-slate-100">
                        <MatchResults :matches="matches" />
                    </div>
                </div>
              </div>
        </div>

</template>

