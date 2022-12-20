<script>
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";

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
        PlayerResult
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
                    <div class="flex flex-col md:flex-row md:transform md:scale-75 lg:scale-100 ">
                        <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
                           <div class="font-bold text-2xl"> Player 1 {{ result.player1.name }} </div>
                           <hr />
                           <div class="text-sm my-3 flex flex-row">
                                <div>
                                    <img v-if="result.player1.sUTR > result.player2.sUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                                </div>
                           Single UTR : {{result.player1.sUTR}} ({{ result.player1.sUTRStatus}})</div>
                           <hr />
                           <div class="text-sm my-3 flex flex-row">
                                <div>
                                    <img v-if="result.player1.dUTR > result.player2.dUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                                </div>
                           Double UTR : {{result.player1.dUTR}} ({{ result.player1.dUTRStatus}})</div>
                           <hr />
                         </div>
                         <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-700 text-white font-medium z-10 shadow-lg">
                           <div class="font-bold text-2xl"> Player 2 {{ result.player2.name }} </div>
                           <hr />
                           <div class="text-sm my-3 flex flex-row">
                                <div>
                                    <img v-if="result.player2.sUTR > result.player1.sUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                                </div>
                           Single UTR : {{result.player2.sUTR}} ({{ result.player2.sUTRStatus}})</div>
                              <hr />
                              <div class="text-sm my-3 flex flex-row">
                                <div>
                                    <img v-if="result.player2.dUTR > result.player1.dUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                                </div>
                           Double UTR : {{result.player2.dUTR}} ({{ result.player2.dUTRStatus}})</div>
                              <hr />
                         </div>
                    </div>
                    <div  class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
                        <div class="font-bold text-2xl"> Past Matches </div>
                        <table class="w-full border-collapse border-spacing-0 border border-slate-100">
                              <thead>
                                <tr>
                                    <th class="w-1/3 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                        Match Name
                                    </th>
                                    <th class="w-1/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                        Time
                                    </th>
                                    <th class="w-2/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                        Winner
                                    </th>
                                    <th class="w-2/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                        Loser
                                    </th>
                                    <th class="w-1/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                        Score
                                    </th>
                                </tr>
                              </thead>
                              <tbody>
                                 <tr v-for="(match, index) in result.pastMatches" class="even:bg-slate-50 odd:bg-slate-200">
                                    <td class="w-1/3 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                        {{ match.name }}
                                    </td>
                                    <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                        {{ match.matchDate }}
                                    </td>
                                    <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                       <span v-if="match.winner" class="border-transparent rounded-lg text-center px-1 py-1 mx-auto md:mx-0 my-2 bg-gray-300 font-medium z-10 shadow-lg">
                                            {{match.winnerInfo}}
                                       </span>
                                       <span v-else>
                                            {{match.winnerInfo}}
                                       </span>
                                    </td>
                                    <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                       <span v-if="match.winner" >
                                            {{match.loserInfo}}
                                       </span>
                                       <span v-else class="border-transparent rounded-lg text-center px-1 py-1 mx-auto md:mx-0 my-2 bg-gray-300 font-medium z-10 shadow-lg">
                                            {{match.loserInfo}}
                                       </span>
                                    </td>
                                    <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                        {{ match.matchScore }}
                                    </td>
                                  </tr>
                              </tbody>
                            </table>
                    </div>
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
                            <div class="font-bold text-2xl"> Matches with same opponents </div>
                            <table v-for="matches in result.matchesWithSamePlayer" class="w-full border-collapse border-spacing-0 border border-slate-100">
                                  <thead>
                                    <tr>
                                        <th class="w-1/3 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                            Match Name
                                        </th>
                                        <th class="w-1/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                            Time
                                        </th>
                                        <th class="w-2/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                            Winner
                                        </th>
                                        <th class="w-2/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                            Loser
                                        </th>
                                        <th class="w-1/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                                            Score
                                        </th>
                                    </tr>
                                  </thead>
                                 <tbody>
                                 <tr v-for="(match, index) in matches" class="even:bg-slate-50 odd:bg-slate-200">
                                    <td class="w-1/3 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                        {{ match.name }}
                                    </td>
                                    <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                        {{ match.matchDate }}
                                    </td>
                                    <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                       <span v-if="match.winner" class="border-transparent rounded-lg text-center px-1 py-1 mx-auto md:mx-0 my-2 bg-gray-300 font-medium z-10 shadow-lg">
                                            {{match.winnerInfo}}
                                       </span>
                                       <span v-else>
                                            {{match.winnerInfo}}
                                       </span>
                                    </td>
                                    <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                       <span v-if="match.winner" >
                                            {{match.loserInfo}}
                                       </span>
                                       <span v-else class="border-transparent rounded-lg text-center px-1 py-1 mx-auto md:mx-0 my-2 bg-gray-300 font-medium z-10 shadow-lg">
                                            {{match.loserInfo}}
                                       </span>
                                    </td>
                                    <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                                        {{ match.matchScore }}
                                    </td>
                                  </tr>
                                </tbody>
                                </table>
                        </div>
                </div>
              </div>
        </div>

</template>

