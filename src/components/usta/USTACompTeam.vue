<script setup>
import { ref } from 'vue';
import Card from '../ui/card.vue';
import CardContent from '../ui/card-content.vue';
import Button from '../ui/button.vue';
import USTACompTeamInfo from './USTACompTeamInfo.vue';
import USTACompTeamMatches from './USTACompTeamMatches.vue';
import USTACompTeamLines from './USTACompTeamLines.vue';
import USTACompTeamTable from './USTACompTeamTable.vue';
import { Users, Calendar, BarChart2, Scale } from 'lucide-vue-next';

const props = defineProps({
  result: { type: Object },
  matchType: { type: String },
});

const loading = ref(false);
const tab = ref('teams');

const showTeams = () => {
  tab.value = 'teams';
};

const showMatches = () => {
  tab.value = 'matches';
};

const showLines = () => {
  tab.value = 'lines';
};

const showComp = () => {
  tab.value = 'comp';
};
</script>

<template>
  <div v-if="result.team1" class="w-full">
    <Card>
      <div class="flex border-b">
        <Button 
          variant="ghost" 
          :class="[
            'rounded-none border-b-2 border-transparent px-4 py-2',
            tab === 'teams' ? 'border-primary font-medium' : ''
          ]"
          @click="showTeams"
        >
          <Users class="mr-2 h-4 w-4" />
          Teams
        </Button>
        <Button 
          variant="ghost" 
          :class="[
            'rounded-none border-b-2 border-transparent px-4 py-2',
            tab === 'matches' ? 'border-primary font-medium' : ''
          ]"
          @click="showMatches"
        >
          <Calendar class="mr-2 h-4 w-4" />
          Matches
        </Button>
        <Button 
          variant="ghost" 
          :class="[
            'rounded-none border-b-2 border-transparent px-4 py-2',
            tab === 'lines' ? 'border-primary font-medium' : ''
          ]"
          @click="showLines"
        >
          <BarChart2 class="mr-2 h-4 w-4" />
          Lines
        </Button>
        <Button 
          variant="ghost" 
          :class="[
            'rounded-none border-b-2 border-transparent px-4 py-2',
            tab === 'comp' ? 'border-primary font-medium' : ''
          ]"
          @click="showComp"
        >
          <Scale class="mr-2 h-4 w-4" />
          Comparison
        </Button>
      </div>
      
      <CardContent class="p-4">
        <div v-if="loading" class="flex justify-center p-4">
          <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
        
        <div v-else-if="tab === 'teams'">
          <USTACompTeamInfo :team1="result.team1" :team2="result.team2" :matchType="matchType" />
        </div>
        
        <div v-else-if="tab === 'matches'">
          <USTACompTeamMatches :result="result" />
        </div>
        
        <div v-else-if="tab === 'lines'">
          <USTACompTeamLines :team1="result.team1" :team2="result.team2" :matchType="matchType" />
        </div>
        
        <div v-else-if="tab === 'comp'">
          <USTACompTeamTable :team1="result.team1" :team2="result.team2" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
