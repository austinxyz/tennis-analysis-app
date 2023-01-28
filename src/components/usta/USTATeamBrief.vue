<script>
import axios from "axios";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';
import USTAPlayerList from "./USTAPlayerList.vue";

export default {

    props: {
        team: {type: Object}
    },

    emits: ['update:team'],

    data() {
        return {
            loading: false,
            currentPlayer: {},
        };
    },

    methods: {

        async refreshUTR(player) {

            this.loading = true;

            if (player.utrId == null || player.utrId == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/utr/" + player.utrId + "?action=refreshUTR";
            const response = await axios.get(url);


            var url = this.getBaseURL() + "/usta/teams/" + this.team.id;
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        async refreshTeamUTRId(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/utrs?action=refreshID";
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        async refreshTeamUTRValue(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/utrs?action=refreshValue";
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        async refreshTeamDRValue(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/drs?action=refresh";
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },
    },

    components: {
        USTAPlayerList,
    }
}
</script>

<template>
    <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <div v-if="team.id" class="border-transparent rounded-lg text-center px-4 pt-2 pb-1 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl text-left">
            <span class="w-1/2 text-left">Team :
                 <a :href="team.link" class="underline" target="_blank">
                    {{ team.name }}
                 </a>
             </span>
             <span v-if="team.alias" class="text-left">
             [{{team.alias}}]
             </span>
           </div>
           <div class="text-sm my-3 flex flex-row">
            <span class="w-1/2 text-left">Area : {{team.area}} </span>
            <span class="w-1/2 text-left">Flight : {{team.flight}}</span>
            <span>
                <button type="button" @click="refreshTeamUTRId(team)">
                    <img src="/utr.svg" width="30" height="30" alt="Fetch UTR ID" title="fetch UTR ID"/>
                </button>
            </span>
           </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
               <span class="w-1/2 text-left ">Captain :  {{team.captainName}}</span>
               <span class="w-1/2 text-left "><a :href="team.tennisRecordLink" class="underline" target="_blank"> TennisRecord Link </a></span>
               <button type="button" @click="refreshTeamDRValue(team)" class="flex flex-row">
                  <img src="/recruiting50x50.png" width="25" height="25" alt="Refresh DR" title="Refresh DR"/>
               </button>
           </div>
        </div>

        <div v-if="team.id">
            <USTAPlayerList :players="team.players" v-model:currentPlayer="currentPlayer" showMode="jump"/>
        </div>
    </div>
</template>

