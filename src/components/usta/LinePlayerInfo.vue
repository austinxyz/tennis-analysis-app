<script setup>
const props = defineProps({
  player1: { type: Object },
  player2: { type: Object },
  winner: { type: Boolean },
  matchType: { type: String }
});
</script>

<template>
  <span v-if="player1" class="flex flex-row items-center">
    <img v-if="winner" src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
    <span v-if="matchType === 'S'" class="text-sm">
      <a :href="'player?ustaId=' + player1?.ustaNorcalId" class="text-primary hover:underline" target="_blank">
        {{ player1?.name || 'Unknown' }} 
        <span class="ml-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded-md">{{ player1?.gender || '?' }}</span>
        <span class="ml-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded-md">{{ player1?.ustaRating || '?' }}</span>
      </a>
      <span v-if="player1?.sutrstatus === 'Rated'" class="font-semibold ml-1">
        {{ player1?.sutr || 0 }} (S)
      </span>
      <span v-else class="font-light ml-1">
        {{ player1?.sutr || 0 }} (S)
      </span>
      <span class="ml-1"> / {{ player1?.dynamicRating || 0 }} (DR) </span>
    </span>
    <span v-else class="font-light flex flex-col">
      <span class="flex flex-row items-center text-sm">
        <a :href="'player?ustaId=' + player1?.ustaNorcalId" class="text-primary hover:underline" target="_blank">
          {{ player1?.name || 'Unknown' }}
          <span class="ml-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded-md">{{ player1?.gender || '?' }}</span>
          <span class="ml-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded-md">{{ player1?.ustaRating || '?' }}</span>
        </a>
        <span v-if="player1?.dutrstatus === 'Rated'" class="font-semibold ml-1">
          {{ player1?.dutr || 0 }} (D)
        </span>
        <span v-else class="font-light ml-1">
          {{ player1?.dutr || 0 }} (D)
        </span>
        <span class="ml-1"> / {{ player1?.dynamicRating || 0 }} (DR) </span>
      </span>
      <span v-if="player2" class="flex flex-row items-center text-sm mt-1">
        <a :href="'player?ustaId=' + player2?.ustaNorcalId" class="text-primary hover:underline" target="_blank">
          {{ player2?.name || 'Unknown' }}
          <span class="ml-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded-md">{{ player2?.gender || '?' }}</span>
          <span class="ml-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded-md">{{ player2?.ustaRating || '?' }}</span>
        </a>
        <span v-if="player2?.dutrstatus === 'Rated'" class="font-semibold ml-1">
          {{ player2?.dutr || 0 }} (D)
        </span>
        <span v-else class="font-light ml-1">
          {{ player2?.dutr || 0 }} (D)
        </span>
        <span class="ml-1"> / {{ player2?.dynamicRating || 0 }} (DR) </span>
      </span>
    </span>
  </span>
</template>
