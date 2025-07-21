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

        async createLeague() {
            try {
                const leagueName = this.league.name.replace("Norcal", "").trim();
                const requestBody = {
                    id: 0,
                    name: leagueName,
                    status: "Open",
                    year: this.league.year
                };
                
                const response = await axios.post('http://localhost:8080/usta/leagues', requestBody);
                if (response.status === 200 || response.status === 201) {
                    // Update the current league to show it's now in the database
                    this.league.inDB = true;
                    // Show success message or handle as needed
                    alert("League successfully created in database!");
                }
            } catch (error) {
                console.error("Error creating league:", error);
                alert("Failed to create league. Please try again.");
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

            <!-- League Information Display -->
            <div v-if="league && Object.keys(league).length > 0" class="bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
                <h3 class="text-lg font-semibold text-blue-800 mb-2">League Information</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="font-medium text-gray-700">Name:</div>
                    <div>{{ league.name }}</div>
                    <div class="font-medium text-gray-700">Year:</div>
                    <div>{{ league.year }}</div>
                    <div class="font-medium text-gray-700">In Database:</div>
                    <div>
                        <span v-if="league.inDB" class="text-green-600 font-medium">Yes</span>
                        <span v-else class="text-red-600 font-medium">No</span>
                    </div>
                    <div v-if="!league.inDB" class="col-span-2 mt-2">
                        <button 
                            @click="createLeague" 
                            class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors duration-200"
                        >
                            Create League in Database
                        </button>
                    </div>
                </div>
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
