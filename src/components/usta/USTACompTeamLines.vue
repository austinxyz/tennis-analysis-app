<script setup>
import USTATeamLinesStat from "./USTATeamLinesStat.vue";
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';
import { BarChart2 } from 'lucide-vue-next';

const props = defineProps({
  team1: { type: Object },
  team2: { type: Object },
  matchType: { type: String },
});
</script>

<template>
  <div v-if="team1" class="w-full">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <BarChart2 class="mr-2 h-5 w-5" />
          Team Lines Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <USTATeamLinesStat :team="team1" :matchType="matchType" />
          <USTATeamLinesStat :team="team2" :matchType="matchType" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
