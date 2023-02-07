<script>
import axios from "axios";
import PlayerForm from '../PlayerForm.vue';
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        player: { type: Object},
    },

    mounted() {
        this.summary = this.player.summary;
    },

    emits: ['update:player', 'change'],

    watch: {
        player(newPlayer, oldPlayer) {
            this.summary=newPlayer.summary;
        }
    },

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
            this.$emit('change', res.data);
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
            this.$emit('change', res.data);
            this.loading = false;

        },

        async refreshPlayer(player) {
            this.$emit('update:player', player);
            this.$emit('change', player);
            this.summary=player.summary;
        }
    },

    data() {
        return {
            loading: false,
            summary: '',
        }
    },

    components: {
        PlayerForm,
    }
};
</script>

<template>
    <div v-if="player.name" class="min-w-full border-transparent rounded-lg text-center p-5 my-2 bg-gray-100 font-medium z-10 shadow-lg">
        <div class="font-bold text-2xl text-left flex flex-row pb-2">
            <div class="w-5/6 text-left"><a :href="'player?ustaId=' + player.ustaNorcalId" class="underline">Player : {{ player.name }} </a></div>
            <PlayerForm :player="player" @change="refreshPlayer" class="w-3/20 right-2"/>
        </div>
        <hr />
        <div class="text-sm my-2 flex flex-row">
            <span class="w-1/5 text-left">Gender : {{player.gender}} </span>
            <span class="w-1/5 text-left">Area : {{player.area}}</span>
            <span class="w-1/5 text-left">Age : {{player.ageRange}}</span>
            <span class="w-1/4 text-left">Lefty : {{player.lefty?'Yes':'No'}}</span>
            <div class="w-3/20 h-6">
               <button type="button" @click="refreshTeamUTRInfo(player)">
                   <img src="/utr.svg" class="w-6 h-5" alt="Fetch UTR" title="fetch UTR"/>
               </button>
               <button type="button" @click="refreshTeamUTRValue(player)">
                   <img src="/utr.svg" class="w-6 h-5"  alt="Fetch UTR Value" title="fetch UTR Value"/>
               </button>
            </div>
        </div>
        <hr />
        <div class="text-sm my-3 flex flex-row">
           <span class="w-1/5 text-left ">USTA Rating :  {{player.ustaRating}}</span>
           <span class="w-1/5 whitespace-no-wrap text-left">USTA ID : <a :href="player.tennisLinkURL" class="underline" target="_blank"> {{player.ustaId}}</a></span>
           <span class="w-1/5 text-left">USTA Norcal ID : <a :href="player.noncalLink" class="underline" target="_blank"> {{player.ustaNorcalId}}</a></span>
           <span class="w-2/5 text-left">Tennis Record DR : <a :href="player.tennisRecordLink" class="underline" target="_blank"> {{player.dynamicRating}}</a></span>
        </div>
        <hr />
        <div class="text-sm my-3 flex flex-row">
          <span class="w-1/5 text-left ">UTR ID : <a :href="'https://app.universaltennis.com/profiles/' + player.utrId" class="underline" target="_blank"> {{player.utrId}}</a></span>
          <span class="w-1/5 text-left ">Single UTR :  {{player.sutr}} ({{player.sutrstatus}})</span>
          <span class="w-1/5 text-left ">Double UTR :  {{player.dutr}} ({{player.dutrstatus}})</span>
          <span class="w-2/5 text-left ">WPct : {{ (player.successRate * 100).toFixed(2) }} % (Latest)/ {{ (player.wholeSuccessRate * 100).toFixed(2) }}%</span>
        </div>
        <hr />
        <div class="text-sm my-3 flex flex-row">
          <span class="w-full text-left ">Summary :  {{summary}} </span>
        </div>
    </div>
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

