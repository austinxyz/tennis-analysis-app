<script setup>
import axios from "axios";
import USTATeamInfo from "./USTATeamInfo.vue";
import USTAPlayerSummary from "./USTAPlayerSummary.vue";
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    team: {type: Object},
    matchType: {type: String}
});

const emit = defineEmits(['update:team']);

import { ref, onMounted } from 'vue';

const loading = ref(false);
const currentPlayer = ref({});
const selectPlayers = ref([]);
const lineups = ref([]);

onMounted(() => {
    if (lineups.value.length == 0) {
        lineups.value = [
            {name:'D1', player1:{}, player2:{}},
            {name:'D2', player1:{}, player2:{}},
            {name:'D3', player1:{}, player2:{}}
        ];
        
        if (props.matchType == '40+Adult') {
            lineups.value.push({name:'S1', player1:{}, player2:{}});
        }
        
        if (props.matchType == '18+Adult') {
            lineups.value.push({name:'S1', player1:{}, player2:{}});
            lineups.value.push({name:'S2', player1:{}, player2:{}});
        }
    }
});

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const refreshUTR = async (player) => {
    loading.value = true;

    if (player.utrId == null || player.utrId == '') {
        return;
    }

    var url = getBaseURL() + "/players/utr/" + player.utrId + "?action=refreshUTR";
    const response = await axios.get(url);

    var url = getBaseURL() + "/usta/teams/" + props.team.id;
    const res = await axios.get(url);

    emit('update:team', res.data);

    loading.value = false;
};

const setLineup = () => {
    var length = props.team.players.length;

    for (let i=0; i< length; i++ ) {
        if (selectPlayers.value[i] == 'd1') {
            if (lineups.value[0].player1.id == null) {
                lineups.value[0].player1 = props.team.players[i];
            } else if (lineups.value[0].player1.id != props.team.players[i].id) {
                lineups.value[0].player2 = props.team.players[i];
            }
        }
        if (selectPlayers.value[i] == 'd2') {
            if (lineups.value[1].player1.id == null) {
                lineups.value[1].player1 = props.team.players[i];
            } else if (lineups.value[1].player1.id != props.team.players[i].id) {
                lineups.value[1].player2 = props.team.players[i];
            }
        }
        if (selectPlayers.value[i] == 'd3') {
            if (lineups.value[2].player1.id == null) {
                lineups.value[2].player1 = props.team.players[i];
            } else if (lineups.value[2].player1.id != props.team.players[i].id) {
                lineups.value[2].player2 = props.team.players[i];
            }
        }

        if (props.matchType == '40+Adult') {
            if (lineups.value.length == 3) {
                lineups.value.push({name:'S1', player1:{}, player2:{}});
            }
            if (selectPlayers.value[i] == 's1') {
                lineups.value[3].player1 = props.team.players[i];
            }
            if (selectPlayers.value[i] == 'None') {
                lineups.value[3].player1 = {};
            }
        }

        if (props.matchType == '18+Adult') {
            if (lineups.value.length == 3) {
                lineups.value.push({name:'S1', player1:{}, player2:{}});
                lineups.value.push({name:'S2', player1:{}, player2:{}});
            }
            if (selectPlayers.value[i] == 's1') {
                lineups.value[3].player1 = props.team.players[i];
            }

            if (selectPlayers.value[i] == 's2') {
                lineups.value[4].player1 = props.team.players[i];
            }

            if (selectPlayers.value[i] == 'None') {
                if (lineups.value[3].player1.id == props.team.players[i].id) {
                    lineups.value[3].player1 = {};
                }
                if (lineups.value[4].player1.id == props.team.players[i].id) {
                    lineups.value[4].player1 = {};
                }
            }
        }

        if (selectPlayers.value[i] == 'None') {
            for (let j=0; j<3; j++) {
                if (lineups.value[j].player1.id == props.team.players[i].id) {
                    lineups.value[j].player1 = lineups.value[j].player2;
                    lineups.value[j].player2 = {};
                }
                if (lineups.value[j].player2.id == props.team.players[i].id) {
                    lineups.value[j].player2 = {};
                }
            }
        }
    }
};

const teamRefresh = (team) => {
    emit('update:team', team);
};
</script>

<template>
    <div v-if="team.id">
      <Card class="w-full">
        <CardHeader>
          <CardTitle>{{ team.name }}</CardTitle>
        </CardHeader>
        <CardContent>
          <USTATeamInfo :team="team" @change="teamRefresh" />
          
          <div class="w-full mt-8">
            <div v-if="loading" class="flex justify-center py-6">
              <div class="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
            </div>
            
            <div v-else-if="team.players.length > 0" class="relative rounded-md border mb-8">
              <table class="w-full text-sm text-left table-fixed">
                <thead class="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" class="px-4 py-4 w-[5%]">#</th>
                    <th scope="col" class="px-4 py-4 w-[25%]">Player</th>
                    <th scope="col" class="px-4 py-4 w-[8%]">NTRP</th>
                    <th scope="col" class="px-4 py-4 w-[8%]">DR</th>
                    <th scope="col" class="px-4 py-4 w-[8%]">W/L</th>
                    <th scope="col" class="px-4 py-4 w-[18%]">UTR</th>
                    <th scope="col" class="px-4 py-4 w-[13%]">UTR WPct</th>
                    <th scope="col" class="px-4 py-4 w-[15%]">Lineup</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(player, index) in team.players" :key="index" class="border-b hover:bg-muted/50">
                    <td class="px-4 py-4">{{ index+1 }}</td>
                    <td class="px-4 py-4">
                      <div class="flex items-center">
                        <a :href="'/usta/player?ustaId=' + player.ustaNorcalId" class="text-primary hover:underline">
                          {{ player.name }} ({{ player.gender }})
                        </a>
                        <div v-if="player.summary" class="ml-2 transform hover:text-purple-500 hover:scale-110">
                          <USTAPlayerSummary :summary="player.summary" />
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-4">{{ player.ustaRating }}</td>
                    <td class="px-4 py-4">{{ player.dynamicRating }}</td>
                    <td class="px-4 py-4">{{ player.winNo }}/{{ player.lostNo }}</td>
                    <td class="px-4 py-4">
                      <div class="flex items-center">
                        <span :class="player.dutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                          {{ player.dutr }}D
                        </span>
                        <span class="mx-1">/</span>
                        <span :class="player.sutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                          {{ player.sutr }}S
                        </span>
                        <span v-if="!player.refreshedUTR && player.utrId!=null" class="ml-2">
                          <a href="#" class="text-primary hover:underline text-xs" @click="refreshUTR(player)">
                            Refresh
                          </a>
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-4">
                      {{ (player.successRate * 100).toFixed(0) }}% / {{ (player.wholeSuccessRate * 100).toFixed(0) }}%
                    </td>
                    <td class="px-4 py-4">
                      <select v-model="selectPlayers[index]" @change="setLineup"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                        <option value="d1">D1</option>
                        <option value="d2">D2</option>
                        <option value="d3">D3</option>
                        <option v-if="props.matchType == '40+Adult'" value="s1">S1</option>
                        <option v-if="props.matchType == '18+Adult'" value="s1">S1</option>
                        <option v-if="props.matchType == '18+Adult'" value="s2">S2</option>
                        <option value="None">None</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="relative rounded-md border mt-8">
              <table class="w-full text-sm text-left table-fixed">
                <thead class="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" class="px-4 py-4 w-[10%]">Line</th>
                    <th scope="col" class="px-4 py-4 w-[35%]">Player 1</th>
                    <th scope="col" class="px-4 py-4 w-[35%]">Player 2</th>
                    <th scope="col" class="px-4 py-4 w-[20%]">Total UTR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="lineup in lineups" :key="lineup.name" class="border-b hover:bg-muted/50">
                    <td class="px-4 py-4 font-medium">{{ lineup.name }}</td>
                    <td class="px-4 py-4">
                      <span v-if="lineup.player1.id">
                        {{ lineup.player1.name }}
                        <div class="flex items-center text-xs mt-2">
                          <span :class="lineup.player1.dutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                            {{ lineup.player1.dutr }}D
                          </span>
                          <span class="mx-1">/</span>
                          <span :class="lineup.player1.sutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                            {{ lineup.player1.sutr }}S
                          </span>
                        </div>
                      </span>
                    </td>
                    <td class="px-4 py-4">
                      <span v-if="lineup.player2.id">
                        {{ lineup.player2.name }}
                        <div class="flex items-center text-xs mt-2">
                          <span :class="lineup.player2.dutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                            {{ lineup.player2.dutr }}D
                          </span>
                          <span class="mx-1">/</span>
                          <span :class="lineup.player2.sutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                            {{ lineup.player2.sutr }}S
                          </span>
                        </div>
                      </span>
                    </td>
                    <td class="px-4 py-4">
                      <span v-if="lineup.player2.id" class="font-medium">
                        {{ (lineup.player2.dutr + lineup.player1.dutr).toFixed(2) }}
                      </span>
                      <span v-else-if="props.matchType == '40+Adult' && lineup.player1.id" class="font-medium">
                        {{ lineup.player1.sutr }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
</template>
