<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from "axios";
import PlayersSelect from "./PlayersSelect.vue";
import Lineups from "./Lineups.vue";
import Card from "./ui/card.vue";
import CardHeader from "./ui/card-header.vue";
import CardTitle from "./ui/card-title.vue";
import CardContent from "./ui/card-content.vue";
import Button from "./ui/button.vue";
import Select from "./ui/select.vue";
import { Users, Calculator } from "lucide-vue-next";

interface Player {
  id: string;
  name: string;
  gender: string;
  utr: number;
  label?: string;
  [key: string]: any;
}

interface Team {
  name: string;
  displayName: string;
  [key: string]: any;
}

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
  vTeamName: { type: String },
  vLineup: { type: Object },
  vTeamUTR: { type: Number },
});

const emit = defineEmits(['update:vTeamName', 'update:vLineup', 'update:vTeamUTR']);

const teamName = ref('');
const teamUTR = ref(0);
const players = ref<Player[]>([]);
const lineups = ref<Lineup[]>([]);
const lineup = ref<Lineup>({
  D1: { pair: { pairInfo: '', totalUTR: 0 } },
  D2: { pair: { pairInfo: '', totalUTR: 0 } },
  D3: { pair: { pairInfo: '', totalUTR: 0 } },
  WD: { pair: { pairInfo: '', totalUTR: 0 } },
  MD: { pair: { pairInfo: '', totalUTR: 0 } },
});
const teams = ref<Team[]>([]);
const team = ref('ZJU-HQU-CMU');
const d1player1 = ref('');
const d1player2 = ref('');
const d2player1 = ref('');
const d2player2 = ref('');
const d3player1 = ref('');
const d3player2 = ref('');
const mdplayer1 = ref('');
const mdplayer2 = ref('');
const wdplayer1 = ref('');
const wdplayer2 = ref('');
const selectedPairs = ref('');
const utrmode = ref('true');

// Watch for changes in lineup and emit updates
watch(lineup, (newValue) => {
  emit('update:vLineup', newValue);
}, { deep: true });

const getLineString = (player1: string, player2: string) => {
  let playersList: string[] = [];
  if (player1 != null && player1 != "") {
    playersList.push(player1);
  }
  if (player2 != null && player2 != "") {
    playersList.push(player2);
  }
  return playersList.join(",");
};

const setTeam = (value: Team) => {
  if (!value) return;
  
  team.value = value.name;
  
  axios.get(`http://localhost:8080/team?team=${team.value}`)
    .then(response => {
      const data = response.data;
      teamName.value = data.displayName;
      players.value = data.players;
      teamUTR.value = data.teamUTR;
      
      players.value.forEach(player => {
        player.label = `${player.name}(${player.gender})-${player.utr}`;
      });
      
      players.value.push({ label: "Any", name: "" } as Player);
      
      emit('update:vTeamName', teamName.value);
      emit('update:vTeamUTR', teamUTR.value);
      
      reset();
      emit('update:vLineup', lineup.value);
    })
    .catch(error => {
      console.error("Error fetching team data:", error);
    });
};

const setLineup = (value: Lineup) => {
  emit('update:vLineup', value);
};

const analysisLineup = () => {
  const d1 = getLineString(d1player1.value, d1player2.value);
  const d2 = getLineString(d2player1.value, d2player2.value);
  const d3 = getLineString(d3player1.value, d3player2.value);
  const wd = getLineString(wdplayer1.value, wdplayer2.value);
  const md = getLineString(mdplayer1.value, mdplayer2.value);
  
  selectedPairs.value = getSelectPairs(d1, d2, d3, md, wd);
  
  axios.get(`http://localhost:8080/fixedlineup?team=${team.value}&d1=${d1}&d2=${d2}&d3=${d3}&md=${md}&wd=${wd}&grantUTR=${utrmode.value}`)
    .then(response => {
      lineups.value = response.data;
      if (lineups.value != null && lineups.value.length > 0) {
        lineup.value = lineups.value[0];
        emit('update:vLineup', lineup.value);
      }
    })
    .catch(error => {
      console.error("Error analyzing lineup:", error);
    });
};

const getSelectPairs = (d1: string, d2: string, d3: string, md: string, wd: string) => {
  let pairString = "";
  
  pairString += d1 === "" ? "D1: Any" : `D1: ${d1}`;
  pairString += d2 === "" ? " D2: Any" : ` D2: ${d2}`;
  pairString += d3 === "" ? " D3: Any" : ` D3: ${d3}`;
  pairString += md === "" ? " MD: Any" : ` MD: ${md}`;
  pairString += wd === "" ? " WD: Any" : ` WD: ${wd}`;
  
  return pairString;
};

const reset = () => {
  lineups.value = [];
  lineup.value = {
    D1: { pair: { pairInfo: '', totalUTR: 0 } },
    D2: { pair: { pairInfo: '', totalUTR: 0 } },
    D3: { pair: { pairInfo: '', totalUTR: 0 } },
    WD: { pair: { pairInfo: '', totalUTR: 0 } },
    MD: { pair: { pairInfo: '', totalUTR: 0 } },
  };
  d1player1.value = '';
  d1player2.value = '';
  d2player1.value = '';
  d2player2.value = '';
  d3player1.value = '';
  d3player2.value = '';
  mdplayer1.value = '';
  mdplayer2.value = '';
  wdplayer1.value = '';
  wdplayer2.value = '';
  selectedPairs.value = '';
};

onMounted(async () => {
  try {
    // Fetch teams
    const teamsResponse = await axios.get("http://localhost:8080/teams");
    teams.value = teamsResponse.data;
    
    // Fetch initial team data
    const teamResponse = await axios.get(`http://localhost:8080/team?team=${team.value}`);
    const data = teamResponse.data;
    
    teamName.value = data.displayName;
    players.value = data.players;
    teamUTR.value = data.teamUTR;
    
    players.value.forEach(player => {
      player.label = `${player.name}(${player.gender})-${player.utr}`;
    });
    
    players.value.push({ label: "Any", name: "" } as Player);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>

<template>
  <div>
    <Card class="mb-4">
      <CardHeader>
        <CardTitle class="flex items-center text-base">
          <Users class="mr-2 h-4 w-4" />
          Team {{ teamName }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Select Team</label>
            <Select
              :options="teams"
              v-model="team"
              labelKey="displayName"
              valueKey="name"
              @option:selected="setTeam"
              placeholder="Select a team"
            />
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="text-sm font-medium">Calculated by:</label>
            <div class="flex items-center space-x-2">
              <input type="radio" id="assigned" v-model="utrmode" value="true" class="h-4 w-4 text-primary" />
              <label for="assigned" class="text-sm">Assigned UTR</label>
            </div>
            <div class="flex items-center space-x-2">
              <input type="radio" id="latest" v-model="utrmode" value="false" class="h-4 w-4 text-primary" />
              <label for="latest" class="text-sm">Latest UTR</label>
            </div>
          </div>
          
          <div class="space-y-3">
            <PlayersSelect :players="players" lineName="D1"
              v-model:player1="d1player1"
              v-model:player2="d1player2" />
              
            <PlayersSelect :players="players" lineName="D2"
              v-model:player1="d2player1"
              v-model:player2="d2player2" />
              
            <PlayersSelect :players="players" lineName="D3"
              v-model:player1="d3player1"
              v-model:player2="d3player2" />
              
            <PlayersSelect :players="players" lineName="MD"
              v-model:player1="mdplayer1"
              v-model:player2="mdplayer2" />
              
            <PlayersSelect :players="players" lineName="WD"
              v-model:player1="wdplayer1"
              v-model:player2="wdplayer2" />
          </div>
          
          <div class="pt-2">
            <Button @click="analysisLineup" class="w-full">
              <Calculator class="mr-2 h-4 w-4" />
              Analysis Lineups
            </Button>
          </div>
          
          <div v-if="selectedPairs" class="p-3 bg-muted rounded-md text-sm">
            {{ selectedPairs }}
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Lineups 
      :lineups="lineups" 
      v-model:lineup="lineup" 
      @change="setLineup"
    />
  </div>
</template>
