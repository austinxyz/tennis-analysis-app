<script>
import axios from "axios";
import PlayerForm from './PlayerForm.vue'
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

            var url = this.getBaseURL() + "/usta/players/" + player.playerId + "/utrs?action=refreshValue";
            const res = await axios.get(url);

            this.$emit('update:player', res.data);

            this.loading = false;

        },
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
    <div v-if="player.name" class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
       <div class="font-bold text-2xl text-left flex flex-row">
        <div class="w-5/6 text-left"><a :href="'player?utr=' + player.utrId" class="underline">Player : {{ player.name }} </a></div>
        <PlayerForm :player="player" v-model:utrId="player.utrId" v-model:ustaId="player.ustaId" @change="$emit('update:player', $event.target)"/>
       </div>
       <div class="text-sm my-3 flex flex-row">
        <span class="w-1/2 text-left">Gender : {{player.gender}} </span>
        <span class="w-1/2 text-left">Area : {{player.area}}</span>
        <span class="w-1/2 text-left ">UTR ID : <a :href="'https://app.universaltennis.com/profiles/' + player.utrId" class="underline" target="_blank"> {{player.utrId}}</a></span>
       <span>
           <button type="button" @click="refreshTeamUTRInfo(player)">
               <img src="/utr.svg" width="30" height="30" alt="Fetch UTR" title="fetch UTR"/>
           </button>
       </span>
       </div>
       <hr />
       <div class="text-sm my-3 flex flex-row">
           <span class="w-1/2 text-left ">USTA Rating :  {{player.ustaRating}}</span>
           <span class="w-1/2 text-left">USTA ID : <a :href="player.tennisLinkURL" class="underline" target="_blank"> {{player.ustaId}}</a></span>
           <span class="w-1/2 text-left"><a :href="player.noncalLink" class="underline" target="_blank"> USTA NonCal Link</a></span>
           <span class="w-1/2 text-left"><a :href="player.tennisRecordLink" class="underline" target="_blank"> Tennis Record Link</a></span>
       </div>
    </div>
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

