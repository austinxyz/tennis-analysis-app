<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        team: { type: Object},
    },

    emits: ["update:team", "change"],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async refreshTeamUTRId(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/utrs?action=refreshID";
            const res = await axios.get(url);

            this.$emit('update:team', res.data);
            this.$emit('change', res.data);

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
            this.$emit('change', res.data);

            this.loading = false;
        },

        async updatePlayers(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/players?action=refresh";
            const res = await axios.get(url);

            this.$emit('update:team', res.data);
            this.$emit('change', res.data);

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
    <div v-if="team" class="border-transparent rounded-lg text-center px-4 pt-2 pb-1 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
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
        <span class="w-1/4 text-left">Area : {{team.area}} </span>
        <span class="w-1/4 text-left">Flight : {{team.flight}}</span>
        <span class="w-1/4 text-left">
            <a href="#" class="underline" @click="updatePlayers(team)"> Update Players </a>
        </span>
        <span class="w-1/4 text-right">
            <button type="button" @click="refreshTeamUTRValue(team)">
                <img src="/utr.svg" width="30" height="30" alt="Fetch UTR Value" title="fetch UTR Value"/>
            </button>
        </span>
        <span class="w-1/4 text-right">
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
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

