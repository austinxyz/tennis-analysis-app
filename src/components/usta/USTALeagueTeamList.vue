<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        teams: {type: Array},
        division: {type: Object},
    },

    emits: ["update:team", "refresh"],

    methods: {
        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },


        async importTeam(team) {
            var url = this.getBaseURL() + "/usta/teams/";
            this.loading = true;
            const res = await axios.post(url,
                {
                   link: team.link,
                   name: team.name,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            this.$emit('refresh', res.data);
            this.loading = false;
        },
    },

    data() {
        return {
            loading: false,
        }
    },

    components: {
    }
};
</script>

<template>

<div class="max-w-2xl mx-auto px-2">
    <h3 class="text-lg font-semibold text-gray-800 mb-3 px-2">
        Teams
    </h3>
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
    <table v-if="teams.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
        <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Name
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Area
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Captain
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    USTA Link
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(team, index) in teams" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a v-if="team.id>0" :href="'/usta/team?teamId=' + team.id" class="underline" target="_blank">
                        {{team.name}}
                    </a>
                    <span v-else> {{team.name}} </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a v-if="team.flightLink" :href="team.flightLink" class="underline" target="_blank">
                        {{team.area}}
                    </a>
                    <span v-else> {{team.area}} </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ team.captainName}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="team.link" class="underline" target="_blank">
                    USTA Link
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <svg v-if="team.inDB" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <button 
                        v-if="!team.inDB && division.inDB" 
                        @click="importTeam(team)" 
                        class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition-colors duration-200"
                    >
                        Import
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else class="bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
        <p class="text-gray-600">No teams found for this division.</p>
    </div>


</div>

</template>
