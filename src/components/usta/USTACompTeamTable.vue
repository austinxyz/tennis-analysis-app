<script setup>
import LinePlayerInfo from "./LinePlayerInfo.vue";
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';
import { Scale, Trophy, Award } from 'lucide-vue-next';

const props = defineProps({
  team1: { type: Object },
  team2: { type: Object },
});
</script>

<template>
  <div class="w-full">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <Scale class="mr-2 h-5 w-5" />
          Team Comparison Table
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border overflow-hidden">
          <!-- Header Row -->
          <div class="flex items-center h-24 px-4 border-b bg-background">
            <div class="w-48"></div>
            <div class="flex-grow text-xl font-semibold text-center p-4">
              {{ team1?.teamName || 'Team 1' }} 
              <span v-if="team1?.alias" class="text-muted-foreground">({{team1.alias}})</span>
            </div>
            <div class="flex-grow text-xl font-semibold text-center p-4">
              {{ team2?.teamName || 'Team 2' }} 
              <span v-if="team2?.alias" class="text-muted-foreground">({{team2.alias}})</span>
            </div>
          </div>
          
          <!-- Captain Row -->
          <div class="flex items-center h-16 px-4 border-b bg-muted/50">
            <div class="w-48 font-medium">Captain:</div>
            <div class="flex justify-center flex-grow w-0">
              <span v-if="team1.captain">{{team1.captain.name}}</span>
            </div>
            <div class="flex justify-center flex-grow w-0">
              <span v-if="team2.captain">{{team2.captain.name}}</span>
            </div>
          </div>
          
          <!-- Win/Loss Row -->
          <div class="flex items-center h-16 px-4 border-b">
            <div class="w-48 font-medium">W/L:</div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="team1?.currentWinMatchNo > team2?.currentWinMatchNo" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{team1?.currentWinMatchNo || 0}} / {{(team1?.totalMatchNo || 0) - (team1?.currentWinMatchNo || 0)}}</span>
            </div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.currentWinMatchNo || 0) < (team2?.currentWinMatchNo || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{team2?.currentWinMatchNo || 0}} / {{(team2?.totalMatchNo || 0) - (team2?.currentWinMatchNo || 0)}}</span>
            </div>
          </div>
          
          <!-- Rating Row -->
          <div class="flex items-center h-16 px-4 border-b bg-muted/50">
            <div class="w-48 font-medium">Rating:</div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.teamRating || 0) > (team2?.teamRating || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{(team1?.teamRating || 0).toFixed(2)}}</span>
            </div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.teamRating || 0) < (team2?.teamRating || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{(team2?.teamRating || 0).toFixed(2)}}</span>
            </div>
          </div>
          
          <!-- Strongest Rating Row -->
          <div class="flex items-center h-16 px-4 border-b">
            <div class="w-48 font-medium">Strongest Rating:</div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.teamStrongestRating || 0) > (team2?.teamStrongestRating || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{(team1?.teamStrongestRating || 0).toFixed(2)}}</span>
            </div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.teamStrongestRating || 0) < (team2?.teamStrongestRating || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{(team2?.teamStrongestRating || 0).toFixed(2)}}</span>
            </div>
          </div>
          
          <!-- Score Row -->
          <div class="flex items-center h-16 px-4 border-b bg-muted/50">
            <div class="w-48 font-medium">Score:</div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.currentScore || 0) > (team2?.currentScore || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{team1?.currentScore || 0}}</span>
            </div>
            <div class="flex justify-center flex-grow w-0">
              <img v-if="(team1?.currentScore || 0) < (team2?.currentScore || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>{{team2?.currentScore || 0}}</span>
            </div>
          </div>
          
          <!-- Best Double by UTR Row -->
          <div class="flex items-center h-16 px-4 border-b">
            <div class="w-48 font-medium">Best double by UTR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestUTRDouble?.totalUTR || 0) > (team2?.bestUTRDouble?.totalUTR || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team1?.bestUTRDouble?.player1" :player1="team1.bestUTRDouble.player1" :player2="team1.bestUTRDouble.player2" matchType="D" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestUTRDouble?.totalUTR || 0) < (team2?.bestUTRDouble?.totalUTR || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team2?.bestUTRDouble?.player1" :player1="team2.bestUTRDouble.player1" :player2="team2.bestUTRDouble.player2" matchType="D" />
            </div>
          </div>
          
          <!-- Best Single by UTR Row -->
          <div v-if="team1.bestUTRSingle" class="flex items-center h-16 px-4 border-b bg-muted/50">
            <div class="w-48 font-medium">Best single by UTR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestUTRSingle?.sutr || 0) > (team2?.bestUTRSingle?.sutr || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team1?.bestUTRSingle" :player1="team1.bestUTRSingle" matchType="S" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestUTRSingle?.sutr || 0) < (team2?.bestUTRSingle?.sutr || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team2?.bestUTRSingle" :player1="team2.bestUTRSingle" matchType="S" />
            </div>
          </div>
          
          <!-- Best Double by DR Row -->
          <div class="flex items-center h-16 px-4 border-b">
            <div class="w-48 font-medium">Best double by DR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestDRDouble?.totalDR || 0) > (team2?.bestDRDouble?.totalDR || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team1?.bestDRDouble?.player1" :player1="team1.bestDRDouble.player1" :player2="team1.bestDRDouble.player2" matchType="D" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestDRDouble?.totalDR || 0) < (team2?.bestDRDouble?.totalDR || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team2?.bestDRDouble?.player1" :player1="team2.bestDRDouble.player1" :player2="team2.bestDRDouble.player2" matchType="D" />
            </div>
          </div>
          
          <!-- Best Single by DR Row -->
          <div v-if="team1.bestDRSingle" class="flex items-center h-16 px-4 border-b bg-muted/50">
            <div class="w-48 font-medium">Best single by DR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestDRSingle?.dynamicRating || 0) > (team2?.bestDRSingle?.dynamicRating || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team1?.bestDRSingle" :player1="team1.bestDRSingle" matchType="S" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
              <img v-if="(team1?.bestDRSingle?.dynamicRating || 0) < (team2?.bestDRSingle?.dynamicRating || 0)" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <LinePlayerInfo v-if="team2?.bestDRSingle" :player1="team2.bestDRSingle" matchType="S" />
            </div>
          </div>
          
          <!-- Lines Header -->
          <div class="flex items-center h-16 px-4 border-b bg-background">
            <div class="text-xl font-semibold flex items-center">
              <Trophy class="mr-2 h-5 w-5" />
              Lines
            </div>
          </div>
          
          <!-- Double Lines Stats -->
          <div v-if="team1.doubleLineStats">
            <template v-for="(doubleLineStat, index) in team1.doubleLineStats" :key="index">
              <!-- Best Line Row -->
              <div class="flex items-center h-16 px-4 border-b">
                <div class="w-48 font-medium">Best {{doubleLineStat.lineName}}:</div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="doubleLineStat.bestPair.totalUTR > team2.doubleLineStats[index].bestPair.totalUTR" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <LinePlayerInfo v-if="doubleLineStat?.bestPair?.player1" :player1="doubleLineStat.bestPair.player1" :player2="doubleLineStat.bestPair.player2" matchType="D" />
                </div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="doubleLineStat.bestPair.totalUTR < team2.doubleLineStats[index].bestPair.totalUTR" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <LinePlayerInfo v-if="team2?.doubleLineStats?.[index]?.bestPair?.player1" :player1="team2.doubleLineStats[index].bestPair.player1" :player2="team2.doubleLineStats[index].bestPair.player2" matchType="D" />
                </div>
              </div>
              
              <!-- W/L Row -->
              <div class="flex items-center h-16 px-4 border-b bg-muted/50">
                <div class="w-48 font-medium">{{doubleLineStat.lineName}} W/L:</div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="doubleLineStat.winPrecent > team2.doubleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{doubleLineStat.winMatchNo}} / {{doubleLineStat.lostMatchNo}} ({{(doubleLineStat.winPrecent*100).toFixed(2)}}%)</span>
                </div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="doubleLineStat.winPrecent < team2.doubleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{team2.doubleLineStats[index].winMatchNo}} / {{team2.doubleLineStats[index].lostMatchNo}} ({{(team2.doubleLineStats[index].winPrecent*100).toFixed(2)}}%)</span>
                </div>
              </div>
              
              <!-- Average UTR Row -->
              <div class="flex items-center h-16 px-4 border-b">
                <div class="w-48 font-medium">{{doubleLineStat.lineName}} Average UTR:</div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="doubleLineStat.averageUTRs > team2.doubleLineStats[index].averageUTRs" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{doubleLineStat.averageUTRs.toFixed(2)}}</span>
                </div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="doubleLineStat.averageUTRs < team2.doubleLineStats[index].averageUTRs" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{team2.doubleLineStats[index].averageUTRs.toFixed(2)}}</span>
                </div>
              </div>
            </template>
          </div>
          
          <!-- Single Lines Stats -->
          <div v-if="team1.singleLineStats">
            <template v-for="(singleLineStat, index) in team1.singleLineStats" :key="index">
              <!-- Best Line Row -->
              <div class="flex items-center h-16 px-4 border-b">
                <div class="w-48 font-medium">Best {{singleLineStat.lineName}}:</div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="singleLineStat.bestSingle.singleUTR > team2.singleLineStats[index].bestSingle.singleUTR" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <LinePlayerInfo v-if="singleLineStat?.bestSingle?.player" :player1="singleLineStat.bestSingle.player" matchType="S" />
                </div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="singleLineStat.bestSingle.singleUTR < team2.singleLineStats[index].bestSingle.singleUTR" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <LinePlayerInfo v-if="team2?.singleLineStats?.[index]?.bestSingle?.player" :player1="team2.singleLineStats[index].bestSingle.player" matchType="S" />
                </div>
              </div>
              
              <!-- W/L Row -->
              <div class="flex items-center h-16 px-4 border-b bg-muted/50">
                <div class="w-48 font-medium">{{singleLineStat.lineName}} W/L:</div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="singleLineStat.winPrecent > team2.singleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{singleLineStat.winMatchNo}} / {{singleLineStat.lostMatchNo}} ({{(singleLineStat.winPrecent*100).toFixed(2)}}%)</span>
                </div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="singleLineStat.winPrecent < team2.singleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{team2.singleLineStats[index].winMatchNo}} / {{team2.singleLineStats[index].lostMatchNo}} ({{(team2.singleLineStats[index].winPrecent*100).toFixed(2)}}%)</span>
                </div>
              </div>
              
              <!-- Average UTR Row -->
              <div class="flex items-center h-16 px-4 border-b">
                <div class="w-48 font-medium">{{singleLineStat.lineName}} Average UTR:</div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="singleLineStat.averageUTR > team2.singleLineStats[index].averageUTR" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{singleLineStat.averageUTR.toFixed(2)}}</span>
                </div>
                <div class="flex justify-center flex-grow w-0 text-sm">
                  <img v-if="singleLineStat.averageUTR < team2.singleLineStats[index].averageUTR" src="/pass.svg" alt="Win" class="h-6 w-6 mr-2"/>
                  <span>{{team2.singleLineStats[index].averageUTR.toFixed(2)}}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
