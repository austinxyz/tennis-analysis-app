<script setup lang="ts">
import { ref } from 'vue';
import TeamSelect from "./TeamSelect.vue";
import LineupCompTable from "./LineupCompTable.vue";
import Card from "./ui/card.vue";
import CardHeader from "./ui/card-header.vue";
import CardTitle from "./ui/card-title.vue";
import CardContent from "./ui/card-content.vue";
import { Scale } from "lucide-vue-next";

interface Pair {
  pairInfo: string;
  totalUTR: number;
  [key: string]: any;
}

interface LineupItem {
  pair: Pair;
  [key: string]: any;
}

interface Lineup {
  D1: LineupItem;
  D2: LineupItem;
  D3: LineupItem;
  WD: LineupItem;
  MD: LineupItem;
  [key: string]: any;
}

const teamName1 = ref('');
const teamName2 = ref('');
const team1UTR = ref(0);
const team2UTR = ref(0);
const lineup1 = ref<Lineup>({
  D1: { pair: { pairInfo: '', totalUTR: 0 } },
  D2: { pair: { pairInfo: '', totalUTR: 0 } },
  D3: { pair: { pairInfo: '', totalUTR: 0 } },
  WD: { pair: { pairInfo: '', totalUTR: 0 } },
  MD: { pair: { pairInfo: '', totalUTR: 0 } },
});
const lineup2 = ref<Lineup>({
  D1: { pair: { pairInfo: '', totalUTR: 0 } },
  D2: { pair: { pairInfo: '', totalUTR: 0 } },
  D3: { pair: { pairInfo: '', totalUTR: 0 } },
  WD: { pair: { pairInfo: '', totalUTR: 0 } },
  MD: { pair: { pairInfo: '', totalUTR: 0 } },
});
</script>

<template>
  <div>
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center">
          <Scale class="mr-2 h-5 w-5 text-primary" />
          Team Comparison
        </CardTitle>
      </CardHeader>
    </Card>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent class="pt-6">
          <TeamSelect 
            v-model:vTeamName="teamName1" 
            v-model:vLineup="lineup1" 
            v-model:vTeamUTR="team1UTR"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="pt-6">
          <LineupCompTable 
            :teamName1="teamName1" 
            :teamName2="teamName2" 
            :lineup1="lineup1" 
            :lineup2="lineup2" 
            :team1UTR="team1UTR" 
            :team2UTR="team2UTR"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="pt-6">
          <TeamSelect 
            v-model:vTeamName="teamName2" 
            v-model:vLineup="lineup2" 
            v-model:vTeamUTR="team2UTR"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
