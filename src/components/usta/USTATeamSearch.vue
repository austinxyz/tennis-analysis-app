<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import USTATeam from "./USTATeam.vue";
import USTATeamList from "./USTATeamList.vue";
import 'vue-select/dist/vue-select.css';
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';
import CardFooter from '../ui/card-footer.vue';
import Button from '../ui/button.vue';
import { Search, Loader2, Users, Filter, List } from 'lucide-vue-next';

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const route = useRoute();
const leagues = ref([]);
const league = ref({});
const divisions = ref([]);
const division = ref({});
const flights = ref([]);
const flight = ref({});
const teams = ref([]);
const team = ref({});
const loading = ref(false);
const divName = ref('');
const query = ref('');
const flightName = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    const url = "http://localhost:8080/usta/open/leagues";
    const response = await axios.get(url);
    leagues.value = response.data.map(x => {
      x.label = x.name;
      return x;
    });
    
    const teamId = route.query.teamId;
    
    if (teamId) {
      const teamUrl = `${getBaseURL()}/usta/teams/${teamId}`;
      try {
        const res = await axios.get(teamUrl);
        team.value = res.data;
        teams.value = [team.value];
        query.value = team.value.name;
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching leagues:", error);
  } finally {
    loading.value = false;
  }
});

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return BASE_URL_PROD;
  } else {
    return BASE_URL;
  }
};

const selectTeam = async (selectedTeam) => {
  loading.value = true;
  team.value = {};
  try {
    const url = `http://localhost:8080/usta/teams/${selectedTeam.id}`;
    const response = await axios.get(url);
    team.value = response.data;
  } catch (error) {
    console.error("Error fetching team details:", error);
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
    teams.value = [];
    team.value = {};
  } catch (error) {
    console.error("Error fetching flights:", error);
  } finally {
    loading.value = false;
  }
};

const selectLeague = async (selectedLeague) => {
  loading.value = true;
  try {
    const url = `http://localhost:8080/usta/leagues/${selectedLeague.id}/divisions`;
    const response = await axios.get(url);
    divisions.value = response.data.map(x => {
      x.label = x.name;
      return x;
    });
    flights.value = [];
    flight.value = {};
    teams.value = [];
    team.value = {};
  } catch (error) {
    console.error("Error fetching divisions:", error);
  } finally {
    loading.value = false;
  }
};

const selectFlight = async (selectedFlight) => {
  loading.value = true;
  flightName.value = selectedFlight.area + selectedFlight.flightNo;
  try {
    const url = `http://localhost:8080/usta/flights/${selectedFlight.id}/teams`;
    const response = await axios.get(url);
    teams.value = response.data;
    if (teams.value.length > 0) {
      team.value = teams.value[0];
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  } finally {
    loading.value = false;
  }
};

const searchTeam = async () => {
  if (!query.value.trim()) return;
  
  loading.value = true;
  try {
    const url = `${getBaseURL()}/usta/search/teams?query=${query.value}`;
    const response = await axios.get(url);
    flight.value = {};
    teams.value = response.data;
    team.value = {};
  } catch (error) {
    console.error("Error searching teams:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full bg-background text-foreground">
    <!-- Search Panel -->
    <div v-if="leagues.length > 0" class="w-full md:w-1/3 lg:w-1/4 p-4">
      <Card class="h-full">
        <CardHeader>
          <CardTitle class="flex items-center">
            <Search class="mr-2 h-5 w-5" />
            USTA Team Search
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div class="space-y-6">
            <!-- Search by Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Search by Team Name:
              </label>
              <div class="flex space-x-2">
                <input 
                  v-model="query"
                  type="text"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter team name"
                  @keyup.enter="searchTeam"
                />
                <Button @click="searchTeam" size="sm" class="h-10">
                  <Search class="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div class="space-y-4">
              <!-- League Selection -->
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                  League:
                </label>
                <v-select
                  class="w-full"
                  :getOptionLabel="league => league.label"
                  :options="leagues"
                  :value="league"
                  v-model="league"
                  @option:selected="selectLeague"
                  placeholder="Select a league"
                ></v-select>
              </div>
              
              <!-- Division Selection -->
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                  Division:
                </label>
                <v-select
                  v-if="divisions.length > 0"
                  class="w-full"
                  :getOptionLabel="division => division.label"
                  :options="divisions"
                  :value="division"
                  v-model="division"
                  @option:selected="selectDiv"
                  placeholder="Select a division"
                ></v-select>
                <div v-else class="text-sm text-muted-foreground italic">
                  Select a league first
                </div>
              </div>
              
              <!-- Flight Selection -->
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                  Flight:
                </label>
                <v-select
                  v-if="flights.length > 0"
                  class="w-full"
                  :getOptionLabel="flight => flight.label"
                  :reduce="(option) => option.label"
                  :options="flights"
                  :value="flight"
                  v-model="flight"
                  @option:selected="selectFlight"
                  placeholder="Select a flight"
                ></v-select>
                <div v-else class="text-sm text-muted-foreground italic">
                  Select a division first
                </div>
              </div>
              
              <!-- Teams List -->
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none flex items-center">
                  <List class="mr-2 h-4 w-4" />
                  Teams:
                </label>
                <div v-if="teams.length > 0" class="border rounded-md overflow-hidden">
                  <USTATeamList :teams="teams" v-model:team="team" />
                </div>
                <div v-else class="text-sm text-muted-foreground italic p-2 border rounded-md bg-muted/20">
                  No teams found. Try searching or selecting a flight.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex items-center justify-center p-4 flex-grow">
      <div class="flex flex-col items-center space-y-2">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
    
    <!-- Team Details -->
    <div v-else class="flex-grow p-4">
      <USTATeam v-model:team="team" />
    </div>
  </div>
</template>
