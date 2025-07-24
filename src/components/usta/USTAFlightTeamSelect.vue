<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import 'vue-select/dist/vue-select.css';
import USTACompTeam from "./USTACompTeam.vue";
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';
import CardFooter from '../ui/card-footer.vue';
import Button from '../ui/button.vue';
import { Loader2, Users, Filter, CheckSquare } from 'lucide-vue-next';

const route = useRoute();
const divisions = ref([]);
const division = ref({});
const flights = ref([]);
const flight1 = ref({});
const flight2 = ref({});
const teams1 = ref([]);
const teams2 = ref([]);
const loading = ref(false);
const selectedTeam1 = ref([]);
const selectedTeam2 = ref([]);
const matchType = ref('');
const result = ref({});
const team1 = ref(null);
const team2 = ref(null);
const divName = ref('');

onMounted(async () => {
  const team1Id = route.query.team1;
  const team2Id = route.query.team2;

  if (team1Id != null && team2Id != null) {
    loading.value = true;
    
    try {
      const url = `http://localhost:8080/usta/analysis/team/team1/${team1Id}/team2/${team2Id}`;
      const res1 = await axios.get(url);
      result.value = res1.data;
      team1.value = result.value.team1.team;
      team2.value = result.value.team2.team;

      if (team1.value.name.indexOf("40A") > 0) {
        matchType.value = "40+Adult";
      } else if (team1.value.name.indexOf("18A") > 0) {
        matchType.value = "18+Adult";
      } else {
        matchType.value = "Mixed";
      }
    } catch (error) {
      console.error("Error fetching team comparison data:", error);
      alert("Failed to load team comparison data. Please try again.");
    } finally {
      loading.value = false;
    }
  } else {
    try {
      const res2 = await axios.get("http://localhost:8080/usta/open/divisions/");
      divisions.value = res2.data.map(x => {
        x.label = x.name;
        return x;
      });
    } catch (error) {
      console.error("Error fetching divisions:", error);
      alert("Failed to load divisions. Please try again.");
    }
  }
});

const compareTeams = async () => {
  loading.value = true;
  if (selectedTeam1.value.length + selectedTeam2.value.length < 2) {
    loading.value = false;
    alert("Please select two teams to compare");
    return;
  }
  
  let team1Obj = null;
  let team2Obj = null;

  if (selectedTeam1.value.length >= 2) {
    team1Obj = teams1.value[selectedTeam1.value[0]];
    team2Obj = teams1.value[selectedTeam1.value[1]];
  } else if (selectedTeam1.value.length == 1) {
    team1Obj = teams1.value[selectedTeam1.value[0]];
  }

  if (team1Obj == null) {
    team1Obj = teams2.value[selectedTeam2.value[0]];
    team2Obj = teams2.value[selectedTeam2.value[1]];
  } else if (team2Obj == null) {
    team2Obj = teams2.value[selectedTeam2.value[0]];
  }

  try {
    // Make API call to get comparison data
    const url = `http://localhost:8080/usta/analysis/team/team1/${team1Obj.id}/team2/${team2Obj.id}`;
    const response = await axios.get(url);
    result.value = response.data;
    team1.value = result.value.team1.team;
    team2.value = result.value.team2.team;

    // Determine match type based on team name
    if (team1.value.name.indexOf("40A") > 0) {
      matchType.value = "40+Adult";
    } else if (team1.value.name.indexOf("18A") > 0) {
      matchType.value = "18+Adult";
    } else {
      matchType.value = "Mixed";
    }

    // Emit the selected team and match type to the parent component
    emit('team-selected', team1Obj, 1);
    emit('team-selected', team2Obj, 2);
    emit('match-type-selected', matchType.value);
  } catch (error) {
    console.error("Error fetching team comparison data:", error);
    alert("Failed to load comparison data. Please try again.");
  } finally {
    loading.value = false;
  }
};

const selectDiv = async (div) => {
  loading.value = true;
  divName.value = div.name;
  try {
    const url = `http://localhost:8080/usta/divisions/${div.id}/flights`;
    const response = await axios.get(url);
    flights.value = response.data.map(x => {
      x.label = `${x.area}-${x.flightNo}`;
      return x;
    });
    flight1.value = {};
    teams1.value = [];
    result.value = {};
    selectedTeam1.value = [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    alert("Failed to load flights. Please try again.");
  } finally {
    loading.value = false;
  }
};

const selectFlight1 = async (flight) => {
  loading.value = true;
  try {
    const url = `http://localhost:8080/usta/flights/${flight.id}/teams`;
    const response = await axios.get(url);
    teams1.value = response.data;
    result.value = {};
    selectedTeam1.value = [];
  } catch (error) {
    console.error("Error fetching teams for flight 1:", error);
    alert("Failed to load teams for flight 1. Please try again.");
  } finally {
    loading.value = false;
  }
};

const selectFlight2 = async (flight) => {
  loading.value = true;
  try {
    const url = `http://localhost:8080/usta/flights/${flight.id}/teams`;
    const response = await axios.get(url);
    teams2.value = response.data;
    result.value = {};
    selectedTeam2.value = [];
  } catch (error) {
    console.error("Error fetching teams for flight 2:", error);
    alert("Failed to load teams for flight 2. Please try again.");
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(['team-selected', 'match-type-selected']);
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full bg-background text-foreground">
    <div v-if="divisions.length > 0" class="w-full md:w-1/3 lg:w-1/4 p-4">
      <Card class="h-full">
        <CardHeader>
          <CardTitle class="flex items-center">
            <Filter class="mr-2 h-5 w-5" />
            Team Selection
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div class="space-y-4">
            <!-- Division Selection -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Division:
              </label>
              <v-select
                class="w-full"
                :getOptionLabel="division => division.label"
                :reduce="(option) => option.name"
                :options="divisions"
                :value="division"
                v-model="division"
                @option:selected="selectDiv"
              ></v-select>
            </div>
            
            <!-- Flight 1 Selection -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Flight 1:
              </label>
              <v-select
                v-if="flights.length > 0"
                class="w-full"
                label="label"
                :getOptionLabel="flight => flight.label"
                :reduce="(option) => option.label"
                :options="flights"
                :value="flight1"
                v-model="flight1"
                @option:selected="selectFlight1"
              ></v-select>
            </div>
            
            <!-- Teams 1 List -->
            <div v-if="teams1.length > 0" class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Teams from Flight 1:
              </label>
              <div class="rounded-md border p-2 bg-muted/50 max-h-60 overflow-y-auto">
                <div 
                  v-for="(team, index) in teams1" 
                  :key="'team1-' + index"
                  class="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                >
                  <input 
                    type="checkbox" 
                    v-model="selectedTeam1" 
                    :value="index"
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                  />
                  <div class="text-sm">
                    <span v-if="team.alias" class="text-muted-foreground">[{{ team.alias }}]</span>
                    <span class="ml-1">{{ team.name }}</span>
                    <span v-if="team.captain" class="text-muted-foreground ml-1">[{{ team.captain.name }}]</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Flight 2 Selection -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Flight 2:
              </label>
              <v-select
                v-if="flights.length > 0"
                class="w-full"
                label="label"
                :getOptionLabel="flight => flight.label"
                :reduce="(option) => option.label"
                :options="flights"
                :value="flight2"
                v-model="flight2"
                @option:selected="selectFlight2"
              ></v-select>
            </div>
            
            <!-- Teams 2 List -->
            <div v-if="teams2.length > 0" class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Teams from Flight 2:
              </label>
              <div class="rounded-md border p-2 bg-muted/50 max-h-60 overflow-y-auto">
                <div 
                  v-for="(team, index) in teams2" 
                  :key="'team2-' + index"
                  class="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                >
                  <input 
                    type="checkbox" 
                    v-model="selectedTeam2" 
                    :value="index"
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                  />
                  <div class="text-sm">
                    <span v-if="team.alias" class="text-muted-foreground">[{{ team.alias }}]</span>
                    <span class="ml-1">{{ team.name }}</span>
                    <span v-if="team.captain" class="text-muted-foreground ml-1">[{{ team.captain.name }}]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            v-if="teams1.length > 0"
            class="w-full"
            @click="compareTeams"
            :disabled="loading"
          >
            <CheckSquare v-if="!loading" class="mr-2 h-4 w-4" />
            <Loader2 v-else class="mr-2 h-4 w-4 animate-spin" />
            Compare Teams
          </Button>
        </CardFooter>
      </Card>
    </div>

    <div v-if="loading" class="flex items-center justify-center p-4 flex-grow">
      <div class="flex flex-col items-center space-y-2">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>

    <div v-if="result.team1" class="flex-grow p-4">
      <USTACompTeam :result="result" :matchType="matchType"/>
    </div>
  </div>
</template>
