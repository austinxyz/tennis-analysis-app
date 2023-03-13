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
    <label class="block text-gray-700 font-bold mb-2 px-2 ">
        Teams
    </label>
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
                    Imported
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
                    <span v-if="team.inDB">Imported</span>
                    <a v-if="!team.inDB && division.inDB" href="#" class="underline" @click="importTeam(team)">
                        Import
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>
         <label class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="usta">
           No Teams are found!
         </label>
    </div>

    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</div>

</template>

