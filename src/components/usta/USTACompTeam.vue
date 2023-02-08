<script>
import axios from "axios";
import USTACompTeamInfo from './USTACompTeamInfo.vue';
import USTACompTeamMatches from './USTACompTeamMatches.vue';
import USTACompTeamLines from './USTACompTeamLines.vue';
import USTACompTeamTable from './USTACompTeamTable.vue';

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        result: { type: Object},
        matchType: {type: String},
    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async showTeams(result) {

            this.tab = 'teams';

        },

        async showMatches(result) {

            this.tab = 'matches';
        },

        async showLines(result) {

            this.tab = 'lines';
        },

        async showComp(result) {

            this.tab = 'comp';
        },
    },

    data() {
        return {
            loading: false,
            tab: 'teams',
        }
    },

    components: {
        USTACompTeamInfo,
        USTACompTeamMatches,
        USTACompTeamLines,
        USTACompTeamTable,
    }
};
</script>

<template>

<div v-if="result.team1" style="min-width: 1000px" class="min-w-full mx-auto">
    <div  class="border-b border-gray-200 dark:border-gray-700 mb-2">
        <ul class="flex -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
            <li class="mr-2" role="presentation">
                <button v-if="tab=='teams'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active"
                id="team-tab" data-tabs-target="#teams" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showTeams(result)">
                Teams</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="team-tab" data-tabs-target="#teams" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showTeams(result)">
                Teams</button>
            </li>
            <li class="mr-2" role="presentation">
                <button v-if="tab=='matches'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="matches-tab" data-tabs-target="#matches" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showMatches(result)">
                Matches</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="matches-tab" data-tabs-target="#matches" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showMatches(result)">
                Matches</button>
            </li>
            <li class="mr-2" role="presentation">
                <button v-if="tab=='lines'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="lines-tab" data-tabs-target="#lines" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showLines(result)">
                Lines</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="lines-tab" data-tabs-target="#lines" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showLines(result)">
                Lines</button>
            </li>
            <li class="mr-2" role="presentation">
                <button v-if="tab=='comp'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="comp-tab" data-tabs-target="#comp" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showComp(result)">
                Comparation</button>
                <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                id="comp-tab" data-tabs-target="#comp" type="button" role="tab" aria-controls="dashboard" aria-selected="true" @click="showComp(result)">
                Comparation</button>
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
                <USTACompTeamInfo :team1="result.team1" :team2="result.team2" :matchType="matchType"/>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="teams" role="tabpanel" aria-labelledby="teams-tab">
                <USTACompTeamInfo :team1="result.team1" :team2="result.team2" :matchType="matchType"/>
        </div>
        <div v-if="tab=='matches'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="matches" role="tabpanel" aria-labelledby="matches-tab">
                <USTACompTeamMatches :result="result"/>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="matches" role="tabpanel" aria-labelledby="matches-tab">
                <USTACompTeamMatches :result="result"/>
        </div>
        <div v-if="tab=='lines'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="lines" role="tabpanel" aria-labelledby="lines-tab">
                <USTACompTeamLines :team1="result.team1" :team2="result.team2"/>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="lines" role="tabpanel" aria-labelledby="lines-tab">
                <USTACompTeamLines :team1="result.team1" :team2="result.team2"/>
        </div>
        <div v-if="tab=='comp'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="comp" role="tabpanel" aria-labelledby="comp-tab">
                <USTACompTeamTable :team1="result.team1" :team2="result.team2"/>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="comp" role="tabpanel" aria-labelledby="comp-tab">
                <USTACompTeamTable :team1="result.team1" :team2="result.team2"/>
        </div>
    </div>

</div>

</template>

