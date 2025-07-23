<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface Division {
    id?: number;
    name: string;
    link?: string;
    ustaleagueId?: string;
    inDB?: boolean;
    [key: string]: any;
}

interface Flight {
    id?: number;
    area?: string;
    flightNo?: string;
    link?: string;
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    divisions: { type: Array as () => Division[], required: true },
    teams: { type: Array, required: true },
    leagueName: { type: String, required: true },
    division: { type: Object, required: true }
});

const emit = defineEmits(['update:teams', 'refresh', 'update:division']);

const flights = ref<Flight[]>([]);
const loading = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const getFlights = async (div: Division) => {
    if (!div.id) return;
    
    loading.value = true;
    try {
        var url = getBaseURL() + "/usta/divisions/" + div.id + "/flights";
        const res = await axios.get(url);
        flights.value = res.data;
        emit('update:division', div);
    } catch (error) {
        console.error("Error fetching flights:", error);
    } finally {
        loading.value = false;
    }
};

const getDivision = async (div: Division) => {
    if (!div.ustaleagueId) return;
    
    loading.value = true;
    try {
        var url = getBaseURL() + "/usta/site/divisions/" + div.ustaleagueId + "/teams";
        const res = await axios.get(url);
        emit('update:teams', res.data);
        emit('update:division', div);
        // Reset flights when a new division is selected
        flights.value = [];
    } catch (error) {
        console.error("Error fetching division teams:", error);
    } finally {
        loading.value = false;
    }
};

const importTeams = async (flight: Flight) => {
    if (!flight.link || !flight.id) return;
    
    loading.value = true;
    try {
        var url = getBaseURL() + "/usta/site/flight/teams";
        const res = await axios.post(url,
            {
                link: flight.link,
                id: flight.id,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        emit('update:teams', res.data);
    } catch (error) {
        console.error("Error importing teams:", error);
    } finally {
        loading.value = false;
    }
};

const importDivision = async (div: Division) => {
    if (!div.link) return;
    
    loading.value = true;
    try {
        var url = getBaseURL() + "/usta/site/divisions/";
        const res = await axios.post(url,
            {
                link: div.link,
                leagueName: props.leagueName,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        emit('refresh', res.data);
    } catch (error) {
        console.error("Error importing division:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="w-full">
        <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        
        <div v-else-if="divisions.length > 0" class="relative overflow-x-auto rounded-md border mb-6">
            <table class="w-full text-sm text-left">
                <thead class="text-xs uppercase bg-muted">
                    <tr>
                        <th scope="col" class="px-4 py-3">#</th>
                        <th scope="col" class="px-4 py-3">Name</th>
                        <th scope="col" class="px-4 py-3">USTA Link</th>
                        <th scope="col" class="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(division, index) in divisions" :key="index" class="border-b hover:bg-muted/50">
                        <td class="px-4 py-3">{{ index+1 }}</td>
                        <td class="px-4 py-3">
                            <button @click="getDivision(division)" class="text-primary hover:underline">
                                {{ division.name }}
                            </button>
                        </td>
                        <td class="px-4 py-3">
                            <a :href="division.link" target="_blank" class="text-primary hover:underline">
                                USTA Link
                            </a>
                        </td>
                        <td class="px-4 py-3">
                            <Button 
                                v-if="!division.inDB" 
                                variant="default" 
                                size="sm"
                                @click="importDivision(division)"
                            >
                                Import
                            </Button>
                            <Button 
                                v-else 
                                variant="outline" 
                                size="sm"
                                @click="getFlights(division)"
                            >
                                View Flights
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div v-else class="text-center py-8 text-muted-foreground border rounded-md bg-muted/10 mb-6">
            No divisions found for this league.
        </div>
        
        <div v-if="division && division.name">
            <h3 class="text-lg font-semibold mb-4">{{ division.name }} - Flights</h3>
            
            <div v-if="flights.length > 0" class="relative overflow-x-auto rounded-md border">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs uppercase bg-muted">
                        <tr>
                            <th scope="col" class="px-4 py-3">#</th>
                            <th scope="col" class="px-4 py-3">Name</th>
                            <th scope="col" class="px-4 py-3">USTA Link</th>
                            <th scope="col" class="px-4 py-3">Import Teams</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(flight, index) in flights" :key="index" class="border-b hover:bg-muted/50">
                            <td class="px-4 py-3">{{ index+1 }}</td>
                            <td class="px-4 py-3">
                                {{ flight.area }} - {{ flight.flightNo }}
                            </td>
                            <td class="px-4 py-3">
                                <a :href="flight.link" target="_blank" class="text-primary hover:underline">
                                    USTA Link
                                </a>
                            </td>
                            <td class="px-4 py-3">
                                <Button 
                                    v-if="flight.link" 
                                    variant="default" 
                                    size="sm"
                                    @click="importTeams(flight)"
                                >
                                    Import Teams
                                </Button>
                                <span v-else class="text-muted-foreground">N/A</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div v-else-if="division.name" class="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
                No flights found for this division.
            </div>
        </div>
    </div>
</template>
