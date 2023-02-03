<script>
import axios from "axios";
import USTAPlayerInfo from './USTAPlayerInfo.vue';
import USTAPlayerTeams from './USTAPlayerTeams.vue';
import USTAPlayerMatches from './USTAPlayerMatches.vue';
import PlayerResult from "../utr/PlayerResult.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        player: { type: Object},
    },

    emits: ["update:player"],

    async mounted() {

        var url = this.getBaseURL() + "/playerresult?id=" + this.player.utrId;

        try {
            const response = await axios.get(url);
            this.playerresult = response.data;
            this.tab = 'utrmatches';
        } catch (error) {
            console.log(error);
        };

    },

    watch: {
        player(newPlayer, oldPlayer) {
            this.teams= [];
            this.team= {};
            this.currPlayer=newPlayer;
            this.scores= [];
            this.playerresult= [];

            if (this.tab == 'teams') {
                this.showTeams(newPlayer);
            }

            if (this.tab == 'matches') {
                this.showMatches(newPlayer);
            }

            if (this.tab == 'utrmatches') {
                this.showUTRMatches(newPlayer);
            }
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

        async showTeams(player) {

            this.loading = true;
            this.tab = 'teams';

            if (player.id == null || player.id == '') {
                return;
            }

            if (player.id != this.currPlayer.id) {
                this.teams = [];
                this.currPlayer = player;
            }

            if (this.teams.length > 0) {
                this.loading = false;
                return;
            }

            var url = this.getBaseURL() + "/players/" + player.id + "/teams";
            try {
                const response = await axios.get(url);
                this.teams = response.data;
            } catch(error) {
            };
            this.loading = false;

        },

        async showMatches(player) {

            this.loading = true;
            this.tab = 'matches';

            if (player.id == null || player.id == '') {
                return;
            }

            if (player.id != this.currPlayer.id) {
                this.scores = [];
                this.currPlayer = player;
            }

            if (this.scores.length > 0) {
                this.loading = false;
                return;
            }

            var url = this.getBaseURL() + "/usta/players/" + player.id + "/scores";
            try {
                const response = await axios.get(url);
                this.scores = response.data;
            } catch(error) {

            };

            this.loading = false;

        },

        async showUTRMatches(player) {

            this.loading = true;
            this.tab = 'utrmatches';

            if (player.id == null || player.id == '') {
                return;
            }

            if (player.id != this.currPlayer.id) {
                this.playerresult = [];
                this.currPlayer = player;
            }

            var url = this.getBaseURL() + "/playerresult/?id=" + player.utrId;
            try {
                const response = await axios.get(url);
                this.playerresult = response.data;
            } catch(error) {
            };

            this.loading = false;

        },

    },

    data() {
        return {
            loading: false,
            tab:'teams',
            teams: [],
            team: {},
            currPlayer:{},
            scores: [],
            playerresult: [],
        }
    },

    components: {
        USTAPlayerInfo,
        USTAPlayerTeams,
        USTAPlayerMatches,
        PlayerResult,
    }
};
</script>

<template>

<div v-if="player.id" style="min-width: 1000px" class="min-w-full mx-auto">
    <USTAPlayerInfo :player="player" />
    <div  class="border-b border-gray-200 dark:border-gray-700 mb-2">
        <ul class="flex -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
            <li class="mr-2" role="presentation">
                <button v-if="tab=='teams'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active"
                id="team-tab" data-tabs-target="#teams" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showTeams(player)">
                USTA Teams</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="team-tab" data-tabs-target="#teams" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showTeams(player)">
                USTA Teams</button>
            </li>
            <li class="mr-2" role="presentation">
                <button v-if="tab=='matches'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="matches-tab" data-tabs-target="#matches" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showMatches(player)">
                USTA Matches</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="matches-tab" data-tabs-target="#matches" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showMatches(player)">
                USTA Matches</button>
            </li>
            <li class="mr-2" role="presentation">
                <button v-if="tab=='utrmatches'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="utrmatches-tab" data-tabs-target="#utrmatches" type="button" role="tab" aria-controls="settings" aria-selected="false" @click="showUTRMatches(player)">
                UTR Matches</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="utrmatches-tab" data-tabs-target="#utrmatches" type="button" role="tab" aria-controls="settings" aria-selected="false" @click="showUTRMatches(player)">
                UTR Matches</button>
            </li>
        </ul>
    </div>
    <div id="myTabContent">
        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-if="tab=='teams'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="teams" role="tabpanel" aria-labelledby="teams-tab">
                <USTAPlayerTeams v-model:team="team" :teams="teams"/>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="teams" role="tabpanel" aria-labelledby="teams-tab">
                <USTAPlayerTeams v-model:team="team" :teams="teams"/>
        </div>
        <div v-if="tab=='matches'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="matches" role="tabpanel" aria-labelledby="matches-tab">
                <USTAPlayerMatches :scores="scores"/>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="matches" role="tabpanel" aria-labelledby="matches-tab">
                <USTAPlayerMatches :scores="scores"/>
        </div>
        <div v-if="tab=='utrmatches'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="utrmatches" role="tabpanel" aria-labelledby="utrmatches-tab">
                <PlayerResult :result="playerresult"/>
        </div>
         <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="utrmatches" role="tabpanel" aria-labelledby="utrmatches-tab">
                <PlayerResult :result="playerresult"/>
         </div>
    </div>

</div>

</template>

