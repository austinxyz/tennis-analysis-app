<script>
import MatchResults from "./MatchResults.vue";

export default {

    props: {
        result: { type: Object},
        player: { type: String},
    },

    components: {
        MatchResults,
    },

    data() {
        return {
            ustamode: 'true',
            singlemode: 'all',
        };
    },
};
</script>

<template>
      <div  v-if="result.player" class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
           <div v-if="player" class="font-bold text-2xl text-left"> Player : {{ player }}  </div>
           <div class="text-sm my-3 flex flex-row">
            <span v-if="player" class="w-1/2 text-left">Gender : {{result.player.gender}} </span>
            <span class="w-1/2 text-left">Win/Loss : {{result.winsNumber}}/{{result.lossesNumber}}={{(result.winsNumber/(result.winsNumber + result.lossesNumber)*100).toFixed(2)}}%</span>
            <span class="w-1/2 text-left">Single UTR : {{result.player.sUTR}} ({{ result.player.sUTRStatus}})</span>
            <span class="w-1/2 text-left">Double UTR : {{result.player.dUTR}} ({{ result.player.dUTRStatus}})</span>
           </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
           <div class="w-1/2 text-left">
               <label>
                   USTA Match?:
               </label>
               <input type="radio" v-model="ustamode" value="true"/> USTA only
               <input type="radio" v-model="ustamode" value="false"/> All
           </div>
           <div class="w-1/2 text-left">
               <label>
                   Single or Double:
               </label>
               <input type="radio" v-model="singlemode" value="all"/> All
               <input type="radio" v-model="singlemode" value="single"/> Single
               <input type="radio" v-model="singlemode" value="double"/> Double
           </div>
           </div>
        </div>

        <div v-for="(event, index) in result.playerEvents" class="w-full border-collapse border-spacing-0 border border-slate-100">
            <div v-if=" (ustamode=='true' && event.usta) || (ustamode=='false')" >
                <div class="text-sm my-2 flex flex-row px-4">
                <a v-if="!event.usta" :href="'/utr/event?event=' + event.id " class="underline">
                {{ event.name }}
                </a>
                <span v-else>
                {{ event.name }}
                </span>
                </div>
                <MatchResults :matches="event.results" :singlemode="singlemode" :player="result.player.name"/>
            </div>
        </div>
      </div>
</template>

