<script>

import axios from "axios";
import USTACandidateTeam from "./USTACandidateTeam.vue";
import 'vue-select/dist/vue-select.css';
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {

        var url = "http://localhost:8080/usta/2023/leagues";
        const response = await axios.get(url);
        this.leagues = response.data;
        this.leagues.map(function (x){
           return x.label = x.name;
        });
        this.divisions=[];
        this.candidateTeams = [];
    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async selectLeague(league) {
            var url = "http://localhost:8080/usta/leagues/" + league.id + "/divisions";
            const response = await axios.get(url);
            this.divisions = response.data;
            this.divisions.map(function (x){
               return x.label = x.name;
            });
            this.candidateTeams=[];
            this.candidateTeam={};
        },

        async selectDiv(div) {
            this.loading = true;
            var url = "http://localhost:8080/usta/divisions/" + div.id + "/candidateTeams";
            const response = await axios.get(url);
            this.candidateTeams = response.data;
            this.candidateTeams.map(function (x){
               return x.label = x.name;
            });
            this.candidateTeam=this.candidateTeams[0];
            this.loading = false;
        },

        getTeam(candidateTeam) {
            this.candidateTeam = candidateTeam;
        },
    },
    data() {
  	    return {
            leagues:[],
            league: {},
  	        divisions: [],
  	        division: {},
  	        candidateTeams: [],
  	        candidateTeam: {},
  	        loading: false,
  	    }
    },
    components: {
        USTACandidateTeam,
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">

        <div v-if="leagues.length >0" class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Leagues
            </label>
            <div v-if="leagues.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="leagues => leagues.label"
                    :options="leagues"
                    :value="league"
                    v-model="league"
                    @option:selected="selectLeague"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Division
            </label>
            <div v-if="divisions.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="division => division.label"
                    :options="divisions"
                    :value="division"
                    v-model="division"
                    @option:selected="selectDiv"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Team
            </label>
            <table v-if="candidateTeams.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
                <thead>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(candidateTeam, index) in candidateTeams" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ index+1 }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a href="#" class="underline" @click="getTeam(candidateTeam)">
                                {{candidateTeam.name}}
                            </a>
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
        <div class="m-2 flex flow-row">
            <USTACandidateTeam v-model:candidateTeam="candidateTeam"/>
        </div>

    </div>

</template>

