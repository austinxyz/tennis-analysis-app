<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        players: { type: Array},
        currentPlayer: {type: Object},
        showMode: {type: String},
    },

    emits: ['update:currentPlayer', 'update:players', 'changePlayer'],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },

        async setPlayer(player) {
            this.$emit('update:currentPlayer', player);
            this.$emit('changePlayer', player);
        },

        async refreshUTR(player) {

            this.loading = true;

            if (player.utrId == null || player.utrId == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/utr/" + player.utrId + "?action=refreshUTR";
            const response = await axios.get(url);

            this.$emit('update:currentPlayer', response.data);

            this.loading = false;
        },
    },

    data() {
        return {
            loading: false,
        }
    },

    components: {
    }
};
</script>

<template>

<div class="min-w-full mx-auto">
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
                    UTR WPct
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(player, index) in players" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td v-if="showMode=='parent'" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="setPlayer(player)">
                    {{ player.name }}
                    </a>
                    {{ player.gender }}
                </td>
                <td v-if="showMode=='jump'" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="'/usta/player?ustaId=' + player.ustaNorcalId" class="whitespace-no-wrap underline">
                      {{ player.name }} ({{ player.gender }})
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ player.ustaRating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ player.dynamicRating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span v-if="player.dutrstatus === 'Rated'" class="font-semibold" >
                        {{ player.dutr }} (D)
                    </span>
                    <span v-else class="font-light" >
                        {{ player.dutr }} (D)
                    </span> /
                    <span v-if="player.sutrstatus === 'Rated'" class="font-semibold" >
                        {{ player.sutr }} (S)
                    </span>
                    <span v-else class="font-light" >
                        {{ player.sutr }} (S)
                    </span>
                    <span v-if="!player.refreshedUTR && player.utrId!=null">
                         <a href="#" class="underline" @click="refreshUTR(player)">
                            Refresh UTR
                         </a>
                    </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ (player.successRate * 100).toFixed(2) }} % (Latest)/ {{ (player.wholeSuccessRate * 100).toFixed(2) }}%
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>
         <label class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="usta">
           No Players are found!
         </label>
    </div>
    <div v-if="loading" class="px-5 py-5">
      <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
</div>

</template>

