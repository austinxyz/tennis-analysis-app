<script>

import axios from "axios";
import USTACompTeam from "./USTACompTeam.vue";
import 'vue-select/dist/vue-select.css';

export default {

    async mounted() {
        let team1Id = this.$route.query.team1;
        let team2Id = this.$route.query.team2;

        if (team1Id != null && team2Id !=null ) {
            this.loading = true;

            var url = "http://localhost:8080/usta/analysis/team/team1/" + team1Id + "/team2/" + team2Id;
            const res1 = await axios.get(url);
            this.result = res1.data;
            this.team1 = this.result.team1.team;
            this.team2 = this.result.team2.team;

            if (this.team1.name.indexOf("40A") > 0) {
                this.matchType = "40+Adult";
            } else if (this.team1.name.indexOf("18A") > 0) {
                this.matchType = "18+Adult";
            } else {
                this.matchType = "Mixed";
            }

            this.loading = false;
        } else {
            const res2 = await axios.get("http://localhost:8080/usta/open/divisions/");
            this.divisions = res2.data;
            this.divisions.map(function (x){
               return x.label = x.name;
            });
        }
    },

    methods: {

        async compareTeams() {
            this.loading = true;
            if (this.selectedTeam1.length + this.selectedTeam2.length <2 ) {
                this.loading = false;
                return;
            }
            var team1 = null;
            var team2 = null;

            if (this.selectedTeam1.length >=2) {
                team1 = this.teams1[this.selectedTeam1[0]];
                team2 = this.teams1[this.selectedTeam1[1]];
            } else if (this.selectedTeam1.length ==1) {
                team1 = this.teams1[this.selectedTeam1[0]];
            }

            if (team1 == null) {
                team1 = this.teams2[this.selectedTeam2[0]];
                team2 = this.teams2[this.selectedTeam2[1]];
            } else if (team2 == null) {
                team2 = this.teams2[this.selectedTeam2[0]];
            }

            if (team1.name.indexOf("40A") > 0) {
                this.matchType = "40+Adult";
            } else {
                this.matchType = "Mixed";
            }

            var url = "http://localhost:8080/usta/analysis/team/team1/" + team1.id + "/team2/" + team2.id;
            const response = await axios.get(url);
            this.result = response.data;

            this.loading = false;
        },

        async selectDiv(div) {
            this.loading = true;
            this.divName = div.name;
            var url = "http://localhost:8080/usta/divisions/" + div.id + "/flights";
            const response = await axios.get(url);
            this.flights = response.data;
            this.flights.map(function (x){
               return x.label = x.area + '-' + x.flightNo;
            });
            this.flight={};
            this.teams=[];
            this.result={};
            this.selectedTeam=[];
            this.loading = false;
        },

        async selectFlight1(flight) {
            this.loading = true;
            var url = "http://localhost:8080/usta/flights/" + flight.id + "/teams";
            const response = await axios.get(url);
            this.teams1 = response.data;
            this.result = {};
            this.selectedTeam1=[];
            this.loading = false;
        },

        async selectFlight2(flight) {
            this.loading = true;
            var url = "http://localhost:8080/usta/flights/" + flight.id + "/teams";
            const response = await axios.get(url);
            this.teams2 = response.data;
            this.result = {};
            this.selectedTeam2=[];
            this.loading = false;
        },
    },
    data() {
  	    return {
  	        divisions: [],
  	        division: {},
  	        flights: [],
  	        flight1: {},
  	        flight2: {},
	        teams1: [],
	        teams2: [],
	        loading: false,
	        selectedTeam1:[],
	        selectedTeam2:[],
	        matchType:'',
	        result: {}
  	    }
    },
    components: {
        USTACompTeam,
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
                    :getOptionLabel="division => division.label"
                    :reduce="(option) => option.name"
                    :options="divisions"
                    :value="division"
                    v-model="division"
                    @option:selected="selectDiv"
                   ></v-select>
            </div>
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Flight 1:
            </label>
            <div v-if="flights.length > 0" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select label="label"
                    :getOptionLabel="flight => flight.label"
                    :reduce="(option) => option.label"
                    :options="flights"
                    :value="flight1"
                    v-model="flight1"
                    @option:selected="selectFlight1"
                   ></v-select>
            </div>
            <nav v-if="teams1.length > 0" class="flex flex-col flex-nowrap bg-slate-700 px-2 py-1 my-2 text-gray-900 border border-purple-900">
              <ul class="ml-1">
                    <li v-for="(team, index) in teams1" class="mb-1 px-0 py-1 text-gray-100 flex flex-row  border-gray-300 rounded rounded-lg">
                        <input type="checkbox" v-model="selectedTeam1" :value="index"><span class="text-sm">
                            <span v-if="team.alias" class="ml-1 text-sm">[{{ team.alias }}]</span>
                            <span class="ml-1 text-sm">{{ team.name }}</span>
                            <span v-if="team.captain" class="ml-1 text-sm">[{{ team.captain.name }}]</span>
                        </span>
                    </li>
              </ul>
            </nav>
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Flight 2:
            </label>
            <div v-if="flights.length > 0" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select label="label"
                    :getOptionLabel="flight => flight.label"
                    :reduce="(option) => option.label"
                    :options="flights"
                    :value="flight2"
                    v-model="flight2"
                    @option:selected="selectFlight2"
                   ></v-select>
            </div>
            <nav v-if="teams2.length > 0" class="flex flex-col flex-nowrap bg-slate-700 px-2 py-1 my-2 text-gray-900 border border-purple-900">
              <ul class="ml-1">
                    <li v-for="(team, index) in teams2" class="mb-1 px-0 py-1 text-gray-100 flex flex-row  border-gray-300 rounded rounded-lg">
                        <input type="checkbox" v-model="selectedTeam2" :value="index"><span class="text-sm">
                            <span v-if="team.alias" class="ml-1 text-sm">[{{ team.alias }}]</span>
                            <span class="ml-1 text-sm">{{ team.name }}</span>
                            <span v-if="team.captain" class="ml-1 text-sm">[{{ team.captain.name }}]</span>
                        </span>
                    </li>
              </ul>
            </nav>
            <button v-if="teams1.length > 0"
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

        <div v-if="result.team1" class="m-2 flex flow-row">
            <USTACompTeam :result="result" :matchType="matchType"/>
        </div>

    </div>

</template>

