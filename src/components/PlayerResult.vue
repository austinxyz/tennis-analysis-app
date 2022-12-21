<script>
import MatchResults from "./MatchResults.vue";

export default {

    props: {
        result: { type: Object},
        player: { type: String},
    },

    components: {
        MatchResults,
    }
};
</script>

<template>
      <div  v-if="player" class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <div class="font-bold text-2xl"> Player: {{ player }} W/L - ({{result.winsNumber}}/{{result.lossesNumber}}) </div>
        <div v-for="(event, index) in result.playerEvents" class="w-full border-collapse border-spacing-0 border border-slate-100">
            <div class="text-sm my-2 flex flex-row px-4">
            <a v-if="!event.usta" :href="'/event?event=' + event.id " class="underline">
            {{ event.name }}
            </a>
            <span v-else>
            {{ event.name }}
            </span>
            </div>
            <MatchResults :matches="event.results"/>
        </div>
      </div>
</template>

