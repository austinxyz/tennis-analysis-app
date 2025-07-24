<script setup>
import axios from "axios";
import { ref } from 'vue';
import Card from '../ui/card.vue';
import Button from '../ui/button.vue';
import Badge from '../ui/badge.vue';

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    players: { type: Array, default: () => [] },
    currentPlayer: { type: Object, default: () => ({}) },
    showMode: { type: String, default: 'parent' },
});

const emit = defineEmits(['update:currentPlayer', 'update:players', 'changePlayer']);

const loading = ref(false);

function getBaseURL() {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
}

async function setPlayer(player) {
    emit('update:currentPlayer', player);
    emit('changePlayer', player);
}

async function refreshUTR(player) {
    loading.value = true;

    if (player.utrId == null || player.utrId == '') {
        return;
    }

    var url = getBaseURL() + "/players/utr/" + player.utrId + "?action=refreshUTRValue";
    const response = await axios.get(url);

    emit('update:currentPlayer', response.data);

    loading.value = false;
}
</script>

<template>
  <div class="w-full">
    <Card v-if="players.length > 0" class="w-full">
      <div class="rounded-md border">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-muted/50 text-sm font-medium">
              <th class="p-2 text-left">#</th>
              <th class="p-2 text-left">Player</th>
              <th class="p-2 text-left">NTRP</th>
              <th class="p-2 text-left">DR</th>
              <th class="p-2 text-left">UTR</th>
              <th class="p-2 text-left">UTR WPct</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in players" :key="player.id || index" class="text-sm even:bg-muted/20">
              <td class="p-2">{{ index + 1 }}</td>
              <td class="p-2">
                <div v-if="showMode === 'parent'" class="flex items-center gap-2">
                  <Button variant="link" class="p-0 h-auto" @click="setPlayer(player)">
                    {{ player.name }}
                  </Button>
                  <Badge variant="secondary" class="ml-1">{{ player.gender }}</Badge>
                </div>
                <div v-if="showMode === 'jump'" class="flex items-center gap-2">
                  <Button variant="link" class="p-0 h-auto" tag="a" :href="'/usta/player?ustaId=' + player.ustaNorcalId">
                    {{ player.name }}
                  </Button>
                  <Badge variant="secondary" class="ml-1">{{ player.gender }}</Badge>
                </div>
              </td>
              <td class="p-2">{{ player.ustaRating }}</td>
              <td class="p-2">{{ player.dynamicRating }}</td>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <img v-if="player.utrrequriedRefresh" src="/Expired.svg" alt="Expired" class="h-5 w-5" />
                  <div class="flex flex-col">
                    <div class="flex items-center gap-1">
                      <span :class="player.dutrstatus === 'Rated' ? 'font-semibold' : 'font-light'">
                        {{ player.dutr }} (D)
                      </span>
                      /
                      <span :class="player.sutrstatus === 'Rated' ? 'font-semibold' : 'font-light'">
                        {{ player.sutr }} (S)
                      </span>
                    </div>
                    <Button 
                      v-if="!player.refreshedUTR && player.utrId != null" 
                      variant="link" 
                      class="p-0 h-auto text-xs" 
                      @click="refreshUTR(player)"
                    >
                      Refresh UTR
                    </Button>
                  </div>
                </div>
              </td>
              <td class="p-2">
                <div class="flex flex-col">
                  <span>{{ (player.successRate * 100).toFixed(2) }}% (Latest)</span>
                  <span>{{ (player.wholeSuccessRate * 100).toFixed(2) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
    
    <Card v-else class="p-4">
      <div class="text-center text-muted-foreground">No Players are found!</div>
    </Card>
    
    <div v-if="loading" class="flex justify-center p-4">
      <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>
