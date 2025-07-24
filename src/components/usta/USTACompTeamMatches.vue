<script setup>
import MatchScore from "./MatchScore.vue";
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';
import { Calendar, History } from 'lucide-vue-next';

const props = defineProps({
  result: { type: Object },
});
</script>

<template>
  <div v-if="result.team1" class="w-full">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <Calendar class="mr-2 h-5 w-5" />
          Match History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-8">
          <div>
            <h3 class="text-lg font-medium flex items-center mb-4">
              <History class="mr-2 h-4 w-4" />
              Past Matches
            </h3>
            <div class="space-y-4">
              <div v-for="match in result.pastScores" :key="match.id" class="border border-border rounded-md overflow-hidden">
                <MatchScore :match="match" />
              </div>
            </div>
          </div>
          
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium mb-4">Matches with same team</h3>
            <div class="space-y-6">
              <div v-for="(matches, key) in result.matchesWithSameTeam" :key="key" class="border border-border rounded-md p-6">
                <h4 class="font-medium mb-2">Team: {{ key }}</h4>
                <div class="space-y-4">
                  <div v-for="match in matches" :key="match.id" class="border border-border rounded-md overflow-hidden">
                    <MatchScore :match="match" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
