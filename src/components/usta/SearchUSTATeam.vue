<script>
import axios from "axios";
import USTATeam from "./USTATeam.vue";
import USTATeamList from "./USTATeamList.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        let teamId = this.$route.query.teamId;

        if (teamId == null) {
            return;
        }

        var url = this.getBaseURL() + "/usta/teams/" + teamId;
        try {
            const res = await axios.get(url);
            this.currentTeam = res.data;
            this.teams.push(this.currentTeam);
            this.query=this.currentTeam.name;
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

        async searchTeam() {
            var url = this.getBaseURL() + "/usta/search/teams?query=" + this.query;
            try {
                const response = await axios.get(url);
                this.teams = response.data;
                this.currentTeam = {};
            } catch(error) {
            };
        },

    },

    data() {
        return {
            query: '',
            teams: [],
            currentTeam: {},
            loading: false,
        }
    },

    components: {
        USTATeamList,
        USTATeam,
    }
}
</script>

<template>
    <div class="flex flow-row">
        <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
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
            <USTATeamList :teams="teams" v-model:team="currentTeam" />
        </div>
        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-if="currentTeam.id" class="m-2 flex flow-row">
            <USTATeam v-model:team="currentTeam"/>
        </div>
    </div>

</template>

