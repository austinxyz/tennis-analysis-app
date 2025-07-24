<script setup>
import USTACompTeamBrief from "./USTACompTeamBrief.vue";

const props = defineProps({
  team1: { type: Object },
  team2: { type: Object },
  matchType: { type: String },
});
</script>

<template>
  <div v-if="team1.id" class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
    <USTACompTeamBrief :team="team1" :matchType="matchType" />
    <USTACompTeamBrief :team="team2" :matchType="matchType" />
  </div>
</template>
