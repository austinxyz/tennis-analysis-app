<script>

import axios from "axios";
import Division from "./Division.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {

        this.loading = true;

        let clubId = this.$route.query.club;

        if (clubId == null) {
            clubId = "3156";
        }

        var url = this.getBaseURL() + "/club/" + clubId;

        try {
            const response = await axios.get(url);
            this.club = response.data;

        } catch(error) {

        };

        this.loading = false;
    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        selectEvent(event) {
            var url = this.getBaseURL() + "/event/" + event.id;

            axios.get(url)
                .then(response => {
                    this.divisions = response.data.divisions;
                    this.eventName = response.data.name;
                }).catch ((error) => {
                    this.divisions=[];
                    this.eventName= '';
                    this.team = {};
                });
        },

        selectTeam(team) {
            this.team = team;
        },
    },

    data() {
  	    return {
	        club: {},
            divisions: [],
            eventName: '',
            team: {},
            loading: false,
  	    }
    },

    components: {
        Division,
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="bg-white shadow-dashboard px-2 py-2 rounded-lg m-1">
            <span class="flex w-90 px-4 py-2 font-large bg-slate-700 text-gray-100 text-center"> {{ club.name}} </span>
            <nav class="flex flex-col bg-slate-700 w-60 px-2 py-1 text-gray-900 border border-purple-900">
                <ul class="ml-1">
                  <li v-for="event in club.events" class="mb-1 px-0 py-1 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
                    <span>
                    <svg class="fill-current h-5 w-5 " viewBox="0 0 8 8">
                      <path d="M8 8"/><circle cx="2" cy="6" r="1.5" fill="gray"/>
                    </svg>
                    </span>
                    <a href="#" @click="selectEvent(event)">
                        <span class="text-sm">{{ event.name }}: {{ event.duration }}, {{ event.year}}</span>
                    </a>
                  </li>
              </ul>
            </nav>
        </div>
        <div v-if="divisions.length > 0" class="px-2 bg-white shadow-dashboard py-2 rounded-lg m-1">
            <span class="flex w-60 px-4 py-2 font-large bg-slate-700 text-gray-100 text-center"> {{ eventName }} </span>
            <nav class="flex flex-col bg-slate-700 w-60 px-2 py-2 text-gray-900 border border-purple-900">
                <ul class="ml-1">
                  <li v-for="team in divisions" class="mb-1 px-1 py-2 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
                    <span>
                       <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
                       <path
                           d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6
                                        4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6
                                        4h4v-4h-4M4 8h4V4H4v4z"
                           ></path>
                       </svg>
                    </span>
                    <a href="#" @click="selectTeam(team)">
                        <span class="ml-1" v-if="team.displayName">{{ team.displayName }}</span>
                        <span class="ml-1" v-else>{{ team.name }}</span>
                    </a>
                  </li>
              </ul>
            </nav>
        </div>
        <div v-if="team.name" class="m-1 flex flow-row">
            <Division :team="team" />
        </div>
    </div>
</template>

