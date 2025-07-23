<script setup lang="ts">
import { computed } from 'vue';
import Card from "./ui/card.vue";
import CardHeader from "./ui/card-header.vue";
import CardTitle from "./ui/card-title.vue";
import CardContent from "./ui/card-content.vue";
import Badge from "./ui/badge.vue";
import { Trophy, ArrowLeftRight } from "lucide-vue-next";

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

const props = defineProps({
  teamName1: { 
    type: String,
    default: ''
  },
  team1UTR: {
    type: Number,
    default: 0
  },
  lineup1: { 
    type: Object as () => Lineup,
    required: true
  },
  teamName2: { 
    type: String,
    default: ''
  },
  team2UTR: {
    type: Number,
    default: 0
  },
  lineup2: { 
    type: Object as () => Lineup,
    required: true
  },
});

const team1Wins = computed(() => {
  let wins = 0;
  if (props.team1UTR > props.team2UTR) wins++;
  if (props.lineup1.D1.pair.totalUTR > props.lineup2.D1.pair.totalUTR) wins++;
  if (props.lineup1.D2.pair.totalUTR > props.lineup2.D2.pair.totalUTR) wins++;
  if (props.lineup1.D3.pair.totalUTR > props.lineup2.D3.pair.totalUTR) wins++;
  if (props.lineup1.MD.pair.totalUTR > props.lineup2.MD.pair.totalUTR) wins++;
  if (props.lineup1.WD.pair.totalUTR > props.lineup2.WD.pair.totalUTR) wins++;
  return wins;
});

const team2Wins = computed(() => {
  let wins = 0;
  if (props.team2UTR > props.team1UTR) wins++;
  if (props.lineup2.D1.pair.totalUTR > props.lineup1.D1.pair.totalUTR) wins++;
  if (props.lineup2.D2.pair.totalUTR > props.lineup1.D2.pair.totalUTR) wins++;
  if (props.lineup2.D3.pair.totalUTR > props.lineup1.D3.pair.totalUTR) wins++;
  if (props.lineup2.MD.pair.totalUTR > props.lineup1.MD.pair.totalUTR) wins++;
  if (props.lineup2.WD.pair.totalUTR > props.lineup1.WD.pair.totalUTR) wins++;
  return wins;
});

const overallWinner = computed(() => {
  if (team1Wins.value > team2Wins.value) return 1;
  if (team2Wins.value > team1Wins.value) return 2;
  return 0; // Tie
});
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center text-base justify-center">
        <ArrowLeftRight class="mr-2 h-4 w-4" />
        Team Comparison
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <!-- Team 1 -->
        <div class="flex-1 rounded-lg overflow-hidden border">
          <div class="bg-primary text-primary-foreground p-4">
            <h3 class="font-bold text-lg">{{ teamName1 }}</h3>
            <div class="flex items-center mt-1">
              <Badge v-if="overallWinner === 1" variant="success" class="mr-2">Winner</Badge>
              <span>Wins: {{ team1Wins }}</span>
            </div>
          </div>
          
          <div class="p-4 space-y-3">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="font-medium">Team UTR</span>
              <div class="flex items-center">
                <Trophy v-if="team1UTR > team2UTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span>{{ team1UTR.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>D1</span>
              <div class="flex items-center">
                <Trophy v-if="lineup1.D1.pair.totalUTR > lineup2.D1.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup1.D1.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>D2</span>
              <div class="flex items-center">
                <Trophy v-if="lineup1.D2.pair.totalUTR > lineup2.D2.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup1.D2.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>D3</span>
              <div class="flex items-center">
                <Trophy v-if="lineup1.D3.pair.totalUTR > lineup2.D3.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup1.D3.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>MD</span>
              <div class="flex items-center">
                <Trophy v-if="lineup1.MD.pair.totalUTR > lineup2.MD.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup1.MD.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2">
              <span>WD</span>
              <div class="flex items-center">
                <Trophy v-if="lineup1.WD.pair.totalUTR > lineup2.WD.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup1.WD.pair.pairInfo }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Team 2 -->
        <div class="flex-1 rounded-lg overflow-hidden border">
          <div class="bg-secondary text-secondary-foreground p-4">
            <h3 class="font-bold text-lg">{{ teamName2 }}</h3>
            <div class="flex items-center mt-1">
              <Badge v-if="overallWinner === 2" variant="success" class="mr-2">Winner</Badge>
              <span>Wins: {{ team2Wins }}</span>
            </div>
          </div>
          
          <div class="p-4 space-y-3">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="font-medium">Team UTR</span>
              <div class="flex items-center">
                <Trophy v-if="team2UTR > team1UTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span>{{ team2UTR.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>D1</span>
              <div class="flex items-center">
                <Trophy v-if="lineup2.D1.pair.totalUTR > lineup1.D1.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup2.D1.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>D2</span>
              <div class="flex items-center">
                <Trophy v-if="lineup2.D2.pair.totalUTR > lineup1.D2.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup2.D2.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>D3</span>
              <div class="flex items-center">
                <Trophy v-if="lineup2.D3.pair.totalUTR > lineup1.D3.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup2.D3.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span>MD</span>
              <div class="flex items-center">
                <Trophy v-if="lineup2.MD.pair.totalUTR > lineup1.MD.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup2.MD.pair.pairInfo }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center py-2">
              <span>WD</span>
              <div class="flex items-center">
                <Trophy v-if="lineup2.WD.pair.totalUTR > lineup1.WD.pair.totalUTR" class="h-4 w-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ lineup2.WD.pair.pairInfo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
