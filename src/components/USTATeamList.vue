<script>

import axios from "axios";
import USTATeam from "./USTATeam.vue";

export default {

    mounted() {
        axios.get("http://localhost:8080/usta/teams")
            .then(response => {
                this.teams = response.data;
                this.team = this.teams[0];
            })
    },
    methods: {
        selectTeam(team) {
            this.team = team;
        },
    },
    data() {
  	    return {
	        teams: [],
	        team: {},
  	    }
    },
    components: {
        USTATeam,
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <div class="bg-white shadow-dashboard px-2 py-2 rounded-lg m-2">
          <nav class="flex flex-col bg-slate-700 w-60 px-2 py-2 text-gray-900 border border-purple-900">
            <ul class="ml-1">
                  <li v-for="team in teams" class="mb-1 px-0 py-2 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
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
                        <span class="ml-1">{{ team.name }}</span>
                    </a>
                  </li>
            </ul>
          </nav>
        </div>
        <div v-if="team" class="m-2 flex flow-row">
            <USTATeam :team="team" />
        </div>
    </div>

</template>

