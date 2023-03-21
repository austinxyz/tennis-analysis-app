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

        async getFlights(div) {
            var url = this.getBaseURL() + "/usta/divisions/" + div.id + "/flights";
            const res = await axios.get(url);
            this.flights = res.data;
            this.$emit('update:division', div);
        },

        async getDivision(div) {
            var url = this.getBaseURL() + "/usta/site/divisions/" + div.ustaleagueId + "/teams";
            const res = await axios.get(url);
            this.$emit('update:teams', res.data);
            this.$emit('update:division', div);
        },

        async importTeams(flight) {
            this.loading = true;
            var url = this.getBaseURL() + "/usta/site/flight/teams";
            const res = await axios.post(url,
                {
                   link: flight.link,
                   id: flight.id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            this.$emit('update:teams', res.data);
            this.loading = false;
        },

        async importDivision(div) {
            this.loading = true;
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
            this.loading = false;
        },
    },

    data() {
        return {
            flights: [],
            loading: false,
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
                    <a v-else href="#" class="underline" @click="getFlights(division)">
                        Flights
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>
         <label class="block text-gray-700 text-sm font-bold mb-2 px-2 ">
           No Divisions are found!
         </label>
    </div>
    <label v-if="division.name" class="block text-gray-700 font-bold mb-2 px-2 ">
        {{division.name}} - Flights
    </label>
    <table v-if="flights.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
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
                    Import Teams
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(flight, index) in flights" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                     {{flight.area}} - {{flight.flightNo}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="flight.link" target="_blank" class="underline"> USTA Link</a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a v-if="flight.link" href="#" class="underline" @click="importTeams(flight)">
                        Import Teams
                    </a>
                    <span v-else> N/A </span>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</div>

</template>

