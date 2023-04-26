<script>
import axios from "axios";
import USTAPlayer from "../usta/USTAPlayer.vue";
import DivisionInfo from "./DivisionInfo.vue";
import CandidateList from "./CandidateList.vue";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {
    props: {
        division: {type: Object}
    },
    emits: ['update:div'],
    data() {
        return {
            loading: false,
            currentPlayer: {},

            tab: 'candidates',
        };
    },
    watch: {
        team(newDiv, oldDiv) {
        }
    },
    methods: {

        async refreshPlayer(player) {

            try {
                this.currentPlayer = player;
            } catch(error) {
            };
        },

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        showCandidates(div) {
            this.tab = 'candidates';
            if (div.id == null || div.id == '') {
                return;
            }
            if (div.id != this.division.id) {
                this.currPlayer = {};
            }
        },

    },
    components: {
        USTAPlayer,
        DivisionInfo,
        CandidateList,
    }
}
</script>

<template>
    <div v-if="division.id" style="min-width: 1000px" class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <DivisionInfo :division="division" />

        <div  class="border-b border-gray-200 dark:border-gray-700 mb-2">
            <ul class="flex -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                <li class="mr-2" role="presentation">
                    <button v-if="tab=='candidates'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active"
                    id="candidates-tab" data-tabs-target="#candidates" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showCandidates(division)">
                    Candidates</button>
                    <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                    id="candidates-tab" data-tabs-target="#candidates" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showCandidates(division)">
                    Candidates</button>
                </li>
            </ul>
        </div>
        <div id="myTabContent">
            <div v-if="loading" class="px-5 py-5">
                <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-if="tab=='candidates'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="players" role="tabpanel" aria-labelledby="players-tab">
                    <CandidateList v-if="division.candidates" :members="division.candidates" v-model:currentPlayer="currentPlayer" showMode="parent"/>
            </div>
            <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="teams" role="tabpanel" aria-labelledby="teams-tab">
                    <CandidateList v-if="division.candidates" :members="division.candidates" v-model:currentPlayer="currentPlayer" showMode="parent"/>
            </div>
        </div>
    </div>

    <div v-if="currentPlayer.id">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <USTAPlayer :player="currentPlayer" @change="refreshPlayer"/>
      </div>
    </div>
</template>
