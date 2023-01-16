<script>
import PlayerForm from './PlayerForm.vue'

export default {

    props: {
        player: { type: Object},
    },

    emits: ["update:player"],

    components: {
        PlayerForm,
    }
};
</script>

<template>
    <div v-if="player.name" class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
       <div class="font-bold text-2xl text-left flex flex-row">
        <div class="w-5/6 text-left">Player : {{ player.name }} </div>
        <PlayerForm :player="player" v-model:utrId="player.utrId" v-model:ustaId="player.ustaId" @change="$emit('update:player', $event.target)"/>
       </div>
       <div class="text-sm my-3 flex flex-row">
        <span class="w-1/2 text-left">Gender : {{player.gender}} </span>
        <span class="w-1/2 text-left">Area : {{player.area}}</span>
        <span class="w-1/2 text-left ">UTR ID : <a :href="'https://app.universaltennis.com/profiles/' + player.utrId" class="underline" target="_blank"> {{player.utrId}}</a></span>
       </div>
       <hr />
       <div class="text-sm my-3 flex flex-row">
           <span class="w-1/2 text-left ">USTA Rating :  {{player.ustaRating}}</span>
           <span class="w-1/2 text-left">USTA ID : <a :href="player.tennisLinkURL" class="underline" target="_blank"> {{player.ustaId}}</a></span>
           <span class="w-1/2 text-left"><a :href="player.noncalLink" class="underline" target="_blank"> USTA NonCal Link</a></span>
           <span class="w-1/2 text-left"><a :href="player.tennisRecordLink" class="underline" target="_blank"> Tennis Record Link</a></span>
       </div>
    </div>
</template>

