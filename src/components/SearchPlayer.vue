<script>
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";

export default {

    methods: {
        setPlayerResult(playerId, playerName) {
            this.playerName = playerName;
            axios.get("http://localhost:8080/playerresult/?id=" + playerId)
             .then(response => {
                 this.player = response.data;
             })
        },
        searchPlayer() {
            axios.get("http://localhost:8080/search/players?query=" + this.query)
             .then(response => {
                 this.players = response.data;
             })
        }
    },

    data() {
        return {
            query: '',
            players: [],
            player: {},
            playerName: '',
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
                <input v-model="query" class="border-b-2 border-gray-300" >
                <button
                        class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                        @click="searchPlayer"
                >
                 Search Player
                </button>
                <table  class="border-collapse border-spacing-0 border border-slate-400">
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
                     <tr v-for="(player, index) in players" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ index+1 }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a href="#" class="underline" @click="setPlayerResult(player.id, player.name)">
                            {{ player.name }}
                            </a>
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
              <div v-if="player">
                  <PlayerResult :result="player" :player="playerName"/>
              </div>
        </div>

</template>

