<script>

import axios from "axios";
import USTATeam from "./USTATeam.vue";
import USTATeamList from "./USTATeamList.vue";
import 'vue-select/dist/vue-select.css';
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        var url = "http://localhost:8080/usta/2023/divisions/";
        const response = await axios.get(url);
        this.divisions = response.data;
        this.divisions.map(function (x){
           return x.label = x.name;
        });
        this.teams=[];

        let teamId = this.$route.query.teamId;

        if (teamId == null) {
            return;
        }

        var url = this.getBaseURL() + "/usta/teams/" + teamId;
        try {
            const res = await axios.get(url);
            this.team = res.data;
            this.teams.push(this.team);
            this.query=this.team.name;
        } catch (error) {
        };

    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async selectTeam(team) {
            this.loading = true;
            this.team = {};
            var url = "http://localhost:8080/usta/teams/" + team.id;
            const response = await axios.get(url);
            this.team = response.data;
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
            this.flight={};
            this.teams=[];
            this.team={};
        },

        async selectFlight(flight) {
            this.loading = true;
            this.flightName = flight.area + flight.flightNo;
            var url = "http://localhost:8080/usta/flights/" + flight.id + "/teams";
            const response = await axios.get(url);
            this.teams = response.data;
            this.team = this.teams[0];
            this.loading = false;
        },

        async searchTeam() {
            var url = this.getBaseURL() + "/usta/search/teams?query=" + this.query;
            try {
                const response = await axios.get(url);
                this.flight={};
                this.teams = response.data;
                this.team = {};
            } catch(error) {
            };
        },
    },
    data() {
  	    return {
  	        divisions: [],
  	        division: {},
            flights: [],
            flight: {},
	        teams: [],
	        team: {},
	        loading: false,
	        divName: '',
            query: '',
  	    }
    },
    components: {
        USTATeam,
        USTATeamList,
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <div v-if="divisions.length >0" class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">
            <label class="border-transparent rounded-lg text-center px-2 py-1 mx-auto md:mx-0 my-2 bg-gray-100 font-normal z-10 shadow-lg">
              USTA Team:
            </label>
            <input v-model="query" class="border-b-2 border-gray-300" >
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="searchTeam"
            >
             Search
            </button>

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
                Flight
            </label>
            <div v-if="flights.length > 0" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="flight => flight.label"
                    :reduce="(option) => option.label"
                    :options="flights"
                    :value="flight"
                    v-model="flight"
                    @option:selected="selectFlight"
                   ></v-select>
            </div>
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Teams
            </label>
            <USTATeamList :teams="teams" v-model:team="team" />
        </div>

        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else class="m-2 flex flow-row">
            <USTATeam v-model:team="team"/>
        </div>

    </div>

</template>

