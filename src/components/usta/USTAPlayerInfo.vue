<script>
import axios from "axios";
import PlayerForm from '../PlayerForm.vue'
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        player: { type: Object},
    },

    emits: ["update:player"],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async refreshTeamUTRInfo(player) {

            this.loading = true;

            if (player.id == null || player.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/players/" + player.id + "/utrs?action=refreshValue";
            const res = await axios.get(url);

            this.$emit('update:player', res.data);

            this.loading = false;

        },

        async refreshTeamUTRValue(player) {

            this.loading = true;

            if (player.id == null || player.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/" + player.id + "?action=updateUTRId";
            const res = await axios.get(url);

            this.$emit('update:player', res.data);

            this.loading = false;

        },

        savePlayer(player) {
            $emit('update:player', player);
        }
    },

    data() {
        return {
            loading: false,
        }
    },

    components: {
        PlayerForm,
    }
};
</script>

<template>
    <div v-if="player.name" class="min-w-full border-transparent rounded-lg text-center p-5 my-2 bg-gray-100 font-medium z-10 shadow-lg">
        <div class="font-bold text-2xl text-left flex flex-row">
            <div class="w-5/6 text-left"><a :href="'player?ustaId=' + player.ustaNorcalId" class="underline">Player : {{ player.name }} </a></div>
            <PlayerForm :player="player" @change="savePlayer"/>
        </div>
        <div class="text-sm my-3 flex flex-row">
            <span class="w-1/2 text-left">Gender : {{player.gender}} </span>
            <span class="w-1/2 text-left">Area : {{player.area}}</span>
            <span class="w-1/2 text-left">Age : {{player.ageRange}}</span>
            <span>
               <button type="button" @click="refreshTeamUTRInfo(player)">
                   <img src="/utr.svg" width="30" height="30" alt="Fetch UTR" title="fetch UTR"/>
               </button>
            </span>
            <span>
               <button type="button" @click="refreshTeamUTRValue(player)">
                   <img src="/utr.svg" width="30" height="30" alt="Fetch UTR Value" title="fetch UTR Value"/>
               </button>
            </span>
        </div>
        <hr />
        <div class="text-sm my-3 flex flex-row">
           <span class="w-1/2 text-left ">USTA Rating :  {{player.ustaRating}}</span>
           <span class="w-1/2 whitespace-no-wrap text-left">USTA ID : <a :href="player.tennisLinkURL" class="underline" target="_blank"> {{player.ustaId}}</a></span>
           <span class="w-1/2 text-left">USTA Norcal ID : <a :href="player.noncalLink" class="underline" target="_blank"> {{player.ustaNorcalId}}</a></span>
           <span class="w-1/2 text-left">Tennis Record DR : <a :href="player.tennisRecordLink" class="underline" target="_blank"> {{player.dynamicRating}}</a></span>
        </div>
        <hr />
        <div class="text-sm my-3 flex flex-row">
          <span class="w-1/2 text-left ">UTR ID : <a :href="'https://app.universaltennis.com/profiles/' + player.utrId" class="underline" target="_blank"> {{player.utrId}}</a></span>
          <span class="w-1/2 text-left ">Single UTR :  {{player.sutr}} ({{player.sutrstatus}})</span>
          <span class="w-1/2 text-left ">Double UTR :  {{player.dutr}} ({{player.dutrstatus}})</span>
          <span class="w-1/2 text-left ">WPct : {{ (player.successRate * 100).toFixed(2) }} % (Latest)/ {{ (player.wholeSuccessRate * 100).toFixed(2) }}%</span>
        </div>
    </div>
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

