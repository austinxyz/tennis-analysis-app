<script>
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";

export default {

    props: {
        team: {type: Object}
    },

    methods: {
        setPlayerResult(playerId, playerName) {
            this.playerName = playerName;
            axios.get("http://localhost:8080/playerresult/?id=" + playerId)
             .then(response => {
                 this.player = response.data;
             })
        },
    },

    data() {
        return {
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
    <div class="m-2 flex flow-row">
        <div class="w-50 min-w-fit">
              <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
                <table  class="border-collapse border-spacing-0 border border-slate-400">
                  <thead>
                    <tr>
                        <th colspan="5" class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            {{ team.name }}
                        </th>
                    </tr>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Name
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Gender
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            UTR
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Latest UTR
                        </th>
                    </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(player, index) in team.players" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ index+1 }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a href="#" class="underline" @click="setPlayerResult(player.id, player.name)">
                            {{ player.name }}
                            </a>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.gender }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.utr }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.dUTR }} ({{player.dUTRStatus}})
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
        </div>
        <div v-if="player" class="w-full">
            <PlayerResult :result="player" :player="playerName"/>
        </div>
    </div>
</template>

