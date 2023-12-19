<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        members: { type: Array},
        currentPlayer: {type: Object},
        showMode: {type: String},
    },

    emits: ['update:currentPlayer', 'update:members', 'changePlayer'],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },

        async setPlayer(member) {
            var url = this.getBaseURL() + "/players/" + member.playerId + "?action=fetch";
            const response = await axios.get(url);
            let player = response.data;

            this.$emit('update:currentPlayer', player);
            this.$emit('changePlayer', player);
        },

        async refreshUTR(member) {

            this.loading = true;

            if (member.utrId == null || member.utrId == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/utr/" + member.utrId + "?action=refreshUTRValue";
            const response = await axios.get(url);

            this.$emit('update:currentPlayer', response.data);

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

<div class="min-w-full mx-auto">
    <table v-if="members.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
        <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Team member
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    NTRP
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    W/L
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    DR
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    UTR
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    UTR WPct
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(member, index) in members" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td v-if="showMode=='parent'" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="setPlayer(member)">
                    {{ member.name }}
                    </a>
                    {{ member.gender }}
                </td>
                <td v-if="showMode=='jump'" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="'/usta/player?ustaId=' + member.ustaNorcalId" class="whitespace-no-wrap underline">
                      {{ member.name }} ({{ member.gender }})
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.ustaRating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.winNo}} / {{member.lostNo}}<span v-if="member.qualifiedPo">^</span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.dynamicRating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 flex flex-row align-middle">
                    <img v-if="member.utrrequriedRefresh" src="/Expired.svg" alt="Expried" class="h-5 w-5"/>
                    <span v-if="member.dutrstatus === 'Rated'" class="font-semibold" >
                        {{ member.dutr }} (D)
                    </span>
                    <span v-else class="font-light" >
                        {{ member.dutr }} (D)
                    </span> /
                    <span v-if="member.sutrstatus === 'Rated'" class="font-semibold" >
                        {{ member.sutr }} (S)
                    </span>
                    <span v-else class="font-light" >
                        {{ member.sutr }} (S)
                    </span>
                    <span v-if="!member.refreshedUTR && member.utrId!=null">
                         <a href="#" class="underline" @click="refreshUTR(member)">
                            Refresh UTR
                         </a>
                    </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ (member.successRate * 100).toFixed(2) }} % (Latest)/ {{ (member.wholeSuccessRate * 100).toFixed(2) }}%
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>
         <label class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="usta">
           No member are found!
         </label>
    </div>
    <div v-if="loading" class="px-5 py-5">
      <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
</div>

</template>

