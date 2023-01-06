<script>
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        team: {type: Object}
    },

    data() {
        return {
            loading: false,
            player: {},
            playerName: '',
        };
    },

    methods: {

        async setPlayerResult(playerId, playerName) {
            this.loading = true;
            this.playerName = playerName;

            var url = this.getBaseURL() + "/playerresult/?id=" + playerId;
            const response = await axios.get(url);

            this.player = response.data;
            this.loading = false;
        },

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },
    },

  components: {
    PlayerResult,
  }
}
</script>

<template>
    <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <table  class="border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th colspan="4" class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    <a :href="team.link" class="underline" target="_blank">
                       {{ team.name }} ({{team.alias}})
                    </a>
                </th>
            </tr>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Player
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Gender
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    USTA Rating
                </th>
            </tr>
          </thead>
          <tbody>
             <tr v-for="(player, index) in team.players" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="setPlayerResult(player.utrId, player.name)">
                    {{ player.name }}
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ player.gender }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ player.ustaRating}}
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
        <PlayerResult :result="player" :player="playerName"/>
    </div>
</template>

