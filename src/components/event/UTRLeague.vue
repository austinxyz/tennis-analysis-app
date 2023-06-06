<script>

import axios from "axios";
import 'vue-select/dist/vue-select.css';
import UTRTeam from "./UTRTeam.vue";
import UTRTeamList from "./UTRTeamList.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        var url = "http://localhost:8080/utr/leagues/26";
        const response = await axios.get(url);
        this.league = response.data;
        this.conferences = this.league.conferences;
        this.conferences.map(function (x){
           return x.label = x.name;
        });
        console.log(this.conferences);
        this.conference = this.conferences[0];
        this.sessions = this.conference.sessions;
        this.sessions.map(function (x){
           return x.label = x.name;
        });
        console.log(this.sessions);
        this.session = this.sessions[0];
        this.teams = this.session.teams;
        this.team = this.teams[0];
        console.log(this.team);
    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        selectConf(conf) {
            this.conf = conf;
            this.sessions = conf.sessions;
            this.sessions.map(function (x){
               return x.label = x.name;
            });
            this.session = this.sessions[0];
            this.teams = this.session.teams;
            this.team = this.teams[0];
        },

        selectSession(session) {
            this.session = session;
            this.teams = session.teams;
            this.team = this.teams[0];
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
  	        league: {},
  	        conferences: [],
  	        conference: {},
            sessions:[],
            session: {},
            teams: [],
            team: {},
	        loading: false,
  	    }
    },
    components: {
        UTRTeam,
        UTRTeamList
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <div v-if="league" class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                League - {{league.name}}
            </label>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Conferences
            </label>
            <div v-if="conferences.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="conferences => conferences.label"
                    :options="conferences"
                    :value="conference"
                    v-model="conference"
                    @option:selected="selectConf"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Sessions
            </label>

            <div v-if="sessions.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="sessions => sessions.label"
                    :options="sessions"
                    :value="session"
                    v-model="session"
                    @option:selected="selectSession"
                   ></v-select>
            </div>
            <UTRTeamList :teams="teams" v-model:team="team" />
        </div>

        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else class="m-2 flex flow-row">
            <UTRTeam v-model:team="team"/>
        </div>

    </div>

</template>

