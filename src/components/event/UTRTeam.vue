<script>
import axios from "axios";
import USTAPlayer from "../usta/USTAPlayer.vue";
import UTRTeamMemberList from "./UTRTeamMemberList.vue";
import UTRTeamLines from "./UTRTeamLines.vue";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';
export default {
    props: {
        team: {type: Object}
    },
    emits: ['update:team'],
    data() {
        return {
            loading: false,
            currentPlayer: {},
            tab: 'players',
            currentTeamId: '',
        };
    },
    watch: {
        team(newTeam, oldTeam) {
            if (newTeam == null || newTeam.id == null || oldTeam == null) {
                return;
            }
            if (newTeam.id != oldTeam.id) {
                this.currentPlayer = {};
            }
        }
    },
    methods: {

        async refreshPlayer(player) {
            var url = this.getBaseURL() + "/usta/teams/" + this.team.id;
            try {
                const response = await axios.get(url);
                this.$emit('update:team', response.data);
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

        showPlayers(team) {
            this.tab = 'players';
            if (team.id == null || team.id == '') {
                return;
            }
            if (team.id != this.team.id) {
             this.currPlayer = {};
            }
        },

        showLines(team) {
            this.tab = 'lines';
            if (team.teamId == null || team.teamId == '') {
                return;
            }
            if (team.teamId != this.team.teamId) {
                this.currPlayer = {};
            }
        },

    },
    components: {
        USTAPlayer,
        UTRTeamMemberList,
        UTRTeamLines
    }
}
</script>

<template>
    <div v-if="team" style="min-width: 1000px" class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
       <div class="font-bold text-2xl text-left pb-2">
        <span class="w-1/2 text-left">Team :
           {{team.name}}
         </span>
       </div>

        <div  class="border-b border-gray-200 dark:border-gray-700 mb-2">
            <ul class="flex -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                <li class="mr-2" role="presentation">
                    <button v-if="tab=='players'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active"
                    id="players-tab" data-tabs-target="#players" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showPlayers(team)">
                    Players</button>
                    <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                    id="players-tab" data-tabs-target="#players" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showPlayers(team)">
                    Players</button>
                </li>
                <li class="mr-2" role="presentation">
                    <button v-if="tab=='lines'" class="inline-block text-blue-500 bg-gray-600 hover:text-blue-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active"
                    id="lines-tab" data-tabs-target="#lines" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showLines(team)">
                    Candidates</button>
                    <button v-else class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-2 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
                    id="lines-tab" data-tabs-target="#lines" type="button" role="tab" aria-controls="profile" aria-selected="false" @click="showLines(team)">
                    Lines</button>
                </li>
            </ul>
        </div>
        <div id="myTabContent">
            <div v-if="loading" class="px-5 py-5">
                <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-if="tab=='players'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="players" role="tabpanel" aria-labelledby="players-tab">
                    <UTRTeamMemberList v-if="team.players" :members="team.players" v-model:currentPlayer="currentPlayer" showMode="parent"/>
            </div>
            <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="teams" role="tabpanel" aria-labelledby="teams-tab">
                    <UTRTeamMemberList v-if="team.players" :members="team.players" v-model:currentPlayer="currentPlayer" showMode="parent"/>
            </div>
            <div v-if="tab=='lines'" class="bg-gray-50 p-2 rounded-lg dark:bg-gray-800" id="lines" role="tabpanel" aria-labelledby="lines-tab">
                    <UTRTeamLines v-if="team.lines" :team="team" />
            </div>
            <div v-else class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="lines" role="tabpanel" aria-labelledby="lines-tab">
                    <UTRTeamLines v-if="team.lines" :team="team" />
            </div>
        </div>
    </div>

    <div v-if="currentPlayer.id">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <USTAPlayer :player="currentPlayer" @change="refreshPlayer"/>
      </div>
    </div>
</template>
