<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// Define types for our data structures
interface League {
  id?: number;
  name: string;
  label?: string;
  year: number;
  inDB?: boolean;
  divisions: Division[];
}

interface Division {
  id?: number;
  name: string;
  flights?: Flight[];
  [key: string]: any;
}

interface Flight {
  id?: number;
  name: string;
  [key: string]: any;
}

interface Team {
  id?: number;
  name: string;
  [key: string]: any;
}
import axios from "axios";
import USTALeagueDivList from "./USTALeagueDivList.vue";
import USTALeagueTeamList from "./USTALeagueTeamList.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";
import Select from "../ui/select.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const divisions = ref<Division[]>([]);
const division = ref<Division>({} as Division);
const leagues = ref<League[]>([]);
const league = ref<League>({} as League);
const teams = ref<Team[]>([]);
const loading = ref(false);
// Define a type for the USTALeagueDivList component ref
interface DivListRef {
  flights: Flight[];
  [key: string]: any;
}

const divListRef = ref<DivListRef | null>(null);

onMounted(async () => {
    const url = "http://localhost:8080/usta/current/leagues";
    const response = await axios.get<League[]>(url);
    leagues.value = response.data;
    leagues.value.forEach(function (x) {
        x.label = x.name;
    });
    if (leagues.value.length > 0) {
        league.value = leagues.value[0];
        divisions.value = leagues.value[0].divisions || [];
    }
});

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const selectDiv = (selectedLeague: League) => {
    divisions.value = selectedLeague.divisions || [];
    // Reset division and teams when a new league is selected
    division.value = {} as Division;
    teams.value = [];
    
    // Reset flights in the USTALeagueDivList component
    if (divListRef.value && divListRef.value.flights) {
        divListRef.value.flights = [];
    }
};

const refreshDivisions = (div: Division) => {
    for (let i = 0; i < divisions.value.length; i++) {
        if (divisions.value[i].name === div.name) {
            divisions.value[i] = div;
        }
    }
};

const refreshTeams = (team: Team) => {
    for (let i = 0; i < teams.value.length; i++) {
        if (teams.value[i].name === team.name) {
            teams.value[i].id = team.id;
        }
    }
};

const createLeague = async () => {
    try {
        const leagueName = league.value.name.replace("Norcal", "").trim();
        const requestBody = {
            id: 0,
            name: leagueName,
            status: "Open",
            year: league.value.year
        };
        
        const response = await axios.post('http://localhost:8080/usta/leagues', requestBody);
        if (response.status === 200 || response.status === 201) {
            // Update the current league to show it's now in the database
            league.value.inDB = true;
            // Show success message or handle as needed
            alert("League successfully created in database!");
        }
    } catch (error) {
        console.error("Error creating league:", error);
        alert("Failed to create league. Please try again.");
    }
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6 w-full">
        <Card v-if="leagues.length > 0" class="w-full md:w-1/2">
            <CardHeader>
                <CardTitle>USTA Leagues</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-if="leagues.length > 0" class="mb-6">
                    <label class="text-sm font-medium mb-2 block">Select League</label>
                    <Select
                        :options="leagues"
                        v-model="league"
                        labelKey="name"
                        @option:selected="selectDiv"
                        placeholder="Select a league"
                    />
                </div>

                <!-- League Information Display -->
                <Card v-if="league && Object.keys(league).length > 0" class="mb-6">
                    <CardHeader>
                        <CardTitle class="text-base">League Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="font-medium">Name:</div>
                            <div>{{ league.name }}</div>
                            <div class="font-medium">Year:</div>
                            <div>{{ league.year }}</div>
                            <div class="font-medium">In Database:</div>
                            <div>
                                <Badge v-if="league.inDB" variant="success">Yes</Badge>
                                <Badge v-else variant="destructive">No</Badge>
                            </div>
                            <div v-if="!league.inDB" class="col-span-2 mt-4">
                                <Button 
                                    @click="createLeague" 
                                    variant="default"
                                    size="sm"
                                >
                                    Create League in Database
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h3 class="text-base font-semibold mb-3">Divisions</h3>
                    <USTALeagueDivList 
                        ref="divListRef" 
                        :divisions="divisions" 
                        v-model:division="division" 
                        v-model:teams="teams" 
                        :leagueName="league.name" 
                        @refresh="refreshDivisions"
                    />
                </div>
            </CardContent>
        </Card>

        <div v-if="loading" class="flex items-center justify-center w-full md:w-1/2">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <Card v-else class="w-full md:w-1/2">
            <CardContent class="pt-6">
                <USTALeagueTeamList 
                    v-model:teams="teams" 
                    v-model:division="division" 
                    @refresh="refreshTeams"
                />
            </CardContent>
        </Card>
    </div>
</template>
