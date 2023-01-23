<script>

import axios from "axios";
import USTATeam from "./USTATeam.vue";
import MatchScore from "./MatchScore.vue";
import 'vue-select/dist/vue-select.css';

export default {

    mounted() {
        axios.get("http://localhost:8080/usta/divisions/")
            .then(response => {
                this.divisions = response.data;
                this.divisions.map(function (x){
                   return x.label = x.name;
                });
            });
    },

    methods: {
        async selectTeam(team) {
            this.loading = true;
            this.team = {};
            var url = "http://localhost:8080/usta/teams/" + team.id;
            const response = await axios.get(url);
            this.team = response.data;
            this.loading = false;
        },

        async compareTeams() {
            this.loading = true;
            if (this.selectedTeam.length >=2 ) {
                this.team1 = this.teams[this.selectedTeam[0]];
                this.team2 = this.teams[this.selectedTeam[1]];
            }

            var url = "http://localhost:8080/usta/analysis/team/team1/" + this.team1.id + "/team2/" + this.team2.id;
            const response = await axios.get(url);
            this.result = response.data;

            this.loading = false;
        },

        async selectDiv(div) {
            this.divName = div.name;
            var url = "http://localhost:8080/usta/divisions/" + div.id + "/flights";
            const response = await axios.get(url);
            this.flights = response.data;
            this.flights.map(function (x){
               return x.label = x.area + '-' + x.flightNo;
            });
        },

        async selectFlight(flight) {
            this.flightName = flight.area + flight.flightNo;
            var url = "http://localhost:8080/usta/flights/" + flight.id + "/teams";
            const response = await axios.get(url);
            this.teams = response.data;
        },
    },
    data() {
  	    return {
  	        divisions: [],
  	        division: {},
  	        flights: [],
  	        flight: {},
	        teams: [],
	        team1: {},
	        team2: {},
	        loading: false,
	        divName: '',
	        flightName: '',
	        selectedTeam:[],
	        result: {}
  	    }
    },
    components: {
        USTATeam,
        MatchScore,
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <div v-if="divisions.length >0" class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Division:
            </label>
            <div style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :reduce="(option) => option.name"
                    :options="divisions"
                    :value="division"
                    v-model="division"
                    @option:selected="selectDiv"
                   ></v-select>
            </div>
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Flight:
            </label>
            <div v-if="flights.length > 0" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select label="label"
                    :reduce="(option) => option.area"
                    :options="flights"
                    :value="flight"
                    v-model="flight"
                    @option:selected="selectFlight"
                   ></v-select>
            </div>
            <nav v-if="teams.length > 0" class="flex flex-col flex-nowrap bg-slate-700 px-2 py-1 my-2 text-gray-900 border border-purple-900">
              <ul class="ml-1">
                    <li v-for="(team, index) in teams" class="mb-1 px-0 py-1 text-gray-100 flex flex-row  border-gray-300 hover:text-black hover:bg-gray-300  hover:font-bold rounded rounded-lg">
                        <input type="checkbox" v-model="selectedTeam" :value="index"><span class="text-sm">
                            [{{team.areaCode}}-{{team.flight}}]
                            <span v-if="team.alias" class="ml-1 text-sm">[{{ team.alias }}]</span>
                            <span class="ml-1 text-sm">{{ team.name }}</span>
                        </span>
                    </li>
              </ul>
            </nav>
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="compareTeams"
            >
             Compare
            </button>
        </div>

        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else class="m-2 flex flow-row">
            <USTATeam v-model:team="team1"/>
            <USTATeam v-model:team="team2"/>

            <div >
            <div class="font-bold text-2xl"> Past Matches </div>
            <div v-for="scorecard in result.pastScores" class="w-full border-collapse border-spacing-0 border border-slate-100">
                <MatchScore :scoreCard="scorecard"/>
            </div>
            <div class="font-bold text-2xl"> Matches with same team </div>
            <div v-for="scorecards in result.matchesWithSameTeam" class="w-full border-collapse border-spacing-0 border border-slate-100">
                <div v-for="scorecard in scorecards">
                    <MatchScore :scoreCard="scorecard"/>
                </div>
            </div>
            </div>
        </div>

    </div>

</template>

