<script setup>
import { ref } from 'vue';
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScoreForm from "./LineScoreForm.vue";
import LineScoreView from "./LineScoreView.vue";

const props = defineProps({
  lineScore: { type: Object },
});

const emit = defineEmits(['update:lineScore', 'change']);

const refreshScore = (score) => {
  emit('update:lineScore', score);
  emit('change', score);
};

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return BASE_URL_PROD;
  } else {
    return BASE_URL;
  }
};
</script>

<template>
  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
    {{ lineScore.name }}
  </td>
  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
    <LinePlayerInfo 
      :player1="lineScore.homePlayer1" 
      :player2="lineScore.homePlayer2" 
      :winner="lineScore.homeTeamWin" 
      :matchType="lineScore.type" 
    />
  </td>
  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
    <LinePlayerInfo 
      :player1="lineScore.guestPlayer1" 
      :player2="lineScore.guestPlayer2" 
      :winner="!lineScore.homeTeamWin" 
      :matchType="lineScore.type" 
    />
  </td>
  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
    {{ lineScore.score }}
  </td>
  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
    <div class="flex items-center justify-center space-x-2">
      <div v-if="lineScore.comment" class="hover:text-primary transition-colors">
        <LineScoreView :comment="lineScore.comment" />
      </div>
      <div class="hover:text-primary transition-colors">
        <LineScoreForm :score="lineScore" @change="refreshScore"/>
      </div>
      <div v-if="lineScore.videoLink" class="hover:text-primary transition-colors">
        <a :href="lineScore.videoLink" target="_blank">
          <img src="/play-button.png" width="24" height="24" alt="Play" title="Play"/>
        </a>
      </div>
    </div>
  </td>
</template>
