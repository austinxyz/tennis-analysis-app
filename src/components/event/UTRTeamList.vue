<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        teams: {type: Array},
        team: {type: Object},
    },

    emits: ["update:team"],

    methods: {
        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async getTeam(team) {
            var url = this.getBaseURL() + "/utr/teams/" + team.id;
            const res = await axios.get(url);
            this.$emit('update:team', res.data);
        },
    },

    data() {
        return {

        }
    },

    components: {
    }
};
</script>

<template>

<div class="max-w-2xl mx-auto">
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
                    Captain
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">

                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(team, index) in teams" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="getTeam(team)">
                     {{team.name}}
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span v-for="captain in team.captains">[{{ captain.name }}] </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="'https://leagues.universaltennis.com/teams/' + team.id" class="underline" target="_blank">
                    UTR Link
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
</div>

</template>

