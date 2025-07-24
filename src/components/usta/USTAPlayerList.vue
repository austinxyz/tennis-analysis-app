<script setup>
import axios from "axios";
import { ref } from 'vue';
import Card from '../ui/card.vue';
import Button from '../ui/button.vue';
import Badge from '../ui/badge.vue';
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";

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
      <Table>
        <TableHeader>
          <TableRow class="bg-muted/50">
            <TableHead>#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>NTRP</TableHead>
            <TableHead>DR</TableHead>
            <TableHead>UTR</TableHead>
            <TableHead>UTR WPct</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(player, index) in players" :key="player.id || index" class="text-sm even:bg-muted/20">
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>{{ player.ustaRating }}</TableCell>
            <TableCell>{{ player.dynamicRating }}</TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span>{{ (player.successRate * 100).toFixed(2) }}% (Latest)</span>
                <span>{{ (player.wholeSuccessRate * 100).toFixed(2) }}%</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
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
