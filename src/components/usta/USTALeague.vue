<script>

import axios from "axios";
import 'vue-select/dist/vue-select.css';
import USTALeagueDivList from "./USTALeagueDivList.vue";
import USTALeagueTeamList from "./USTALeagueTeamList.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        var url = "http://localhost:8080/usta/current/leagues";
        const response = await axios.get(url);
        this.leagues = response.data;
        this.leagues.map(function (x){
           return x.label = x.name;
        });
        this.league= this.leagues[0];
        this.divisions = this.leagues[0].divisions;

    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        selectDiv(league) {
            this.divisions = league.divisions;
        },

        refreshDivisions(div) {
            for (let i = 0; i < this.divisions.length; i++) {
                if (this.divisions[i].name == div.name) {
                    this.divisions[i] = div;
                }
            }
        },

        refreshTeams(team) {
            for (let i = 0; i < this.teams.length; i++) {
                if (this.teams[i].name == team.name) {
                    this.teams[i].id = team.id;
                }
            }
        },
    },
    data() {
  	    return {
  	        divisions: [],
  	        division: {},
            leagues:[],
            league: {},
            teams: [],
	        loading: false,
  	    }
    },
    components: {
        USTALeagueDivList,
        USTALeagueTeamList
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
                    @option:selected="selectDiv"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Divisions
            </label>
            <USTALeagueDivList :divisions="divisions" v-model:division="division" v-model:teams="teams" :leagueName="league.name" @refresh="refreshDivisions"/>

        </div>

        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div v-else class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">
            <USTALeagueTeamList v-model:teams="teams" v-model:division="division" @refresh="refreshTeams"/>
        </div>

    </div>

</template>

