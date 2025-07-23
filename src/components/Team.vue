<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import Players from "./Players.vue";
import Line from "./Line.vue";
import Card from "./ui/card.vue";
import CardHeader from "./ui/card-header.vue";
import CardTitle from "./ui/card-title.vue";
import CardContent from "./ui/card-content.vue";
import { Trophy } from "lucide-vue-next";

interface Player {
  id: string;
  name: string;
  gender: string;
  utr: number;
  dUTR: number;
  dUTRStatus: string;
  [key: string]: any;
}

interface Pair {
  pairInfo: string;
  [key: string]: any;
}

interface LineData {
  topPairs: Pair[];
  [key: string]: any;
}

const route = useRoute();
const teamName = ref('');
const teamUTR = ref(0);
const players = ref<Player[]>([]);
const d1 = ref<Pair[]>([]);
const d2 = ref<Pair[]>([]);
const d3 = ref<Pair[]>([]);
const md = ref<Pair[]>([]);
const wd = ref<Pair[]>([]);
const loading = ref(false);

const fetchTeamData = async (teamId: string) => {
  loading.value = true;
  
  try {
    const response = await axios.get(`http://localhost:8080/team?team=${teamId}`);
    const data = response.data;
    
    teamName.value = data.displayName;
    teamUTR.value = data.teamUTR;
    players.value = data.players;
    d1.value = data.d1.topPairs;
    d2.value = data.d2.topPairs;
    d3.value = data.d3.topPairs;
    md.value = data.md.topPairs;
    wd.value = data.wd.topPairs;
  } catch (error) {
    console.error("Error fetching team data:", error);
  } finally {
    loading.value = false;
  }
};

// Watch for route query changes to update the team data
watch(
  () => route.query.team,
  (newTeamId) => {
    if (newTeamId) {
      fetchTeamData(newTeamId as string);
    } else {
      fetchTeamData("ZJU"); // Default team
    }
  }
);

onMounted(() => {
  const teamId = route.query.team as string || "ZJU";
  fetchTeamData(teamId);
});
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-64">
    <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
  </div>
  
  <div v-else class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <Trophy class="mr-2 h-5 w-5 text-primary" />
          {{ teamName }} 
          <span class="ml-2 text-sm font-normal text-muted-foreground">
            Team UTR: {{ teamUTR.toFixed(2) }}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Players :teamName="teamName" :teamUTR="teamUTR" :players="players" />
      </CardContent>
    </Card>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent class="pt-6">
          <Line lineName="D1" :pairs="d1" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="pt-6">
          <Line lineName="D2" :pairs="d2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="pt-6">
          <Line lineName="D3" :pairs="d3" />
        </CardContent>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent class="pt-6">
          <Line lineName="MD" :pairs="md" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="pt-6">
          <Line lineName="WD" :pairs="wd" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
