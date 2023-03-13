<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        divisions: {type: Array},
        teams: {type: Array},
        leagueName: {type: String},
        division: {type: Object}
    },

    emits: ["update:teams", "refresh", "update:division"],

    methods: {
        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async getDivision(div) {
            var url = this.getBaseURL() + "/usta/site/divisions/" + div.ustaleagueId + "/teams";
            const res = await axios.get(url);
            this.$emit('update:teams', res.data);
            this.$emit('update:division', div);
        },

        async importDivision(div) {
            var url = this.getBaseURL() + "/usta/site/divisions/";
            const res = await axios.post(url,
                {
                   link: div.link,
                   leagueName: this.leagueName,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            this.$emit('refresh', res.data);
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
    <table v-if="divisions.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
        <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Name
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    USTA Link
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Imported?
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(division, index) in divisions" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="getDivision(division)">
                     {{division.name}}
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="division.link" target="_blank" class="underline"> USTA Link</a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a v-if="!division.inDB" href="#" class="underline" @click="importDivision(division)">
                        Import
                    </a>
                    <span v-else> Imported </span>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>
         <label class="block text-gray-700 text-sm font-bold mb-2 px-2 ">
           No Divisions are found!
         </label>
    </div>
</div>

</template>

