<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import Division from "./Division.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface Event {
    id: string;
    name: string;
    duration: string;
    year: string;
    [key: string]: any;
}

interface Club {
    name: string;
    events: Event[];
    [key: string]: any;
}

interface Player {
    id: string;
    name: string;
    gender: string;
    sUTR: number;
    dUTR: number;
    sUTRStatus: string;
    dUTRStatus: string;
    [key: string]: any;
}

interface Team {
    name: string;
    displayName?: string;
    players: Player[];
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const route = useRoute();
const club = ref<Club>({} as Club);
const divisions = ref<Team[]>([]);
const eventName = ref('');
const team = ref<Team>({ name: '', players: [] } as Team);
const loading = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const selectEvent = (event: Event) => {
    const url = getBaseURL() + "/event/" + event.id;
    
    loading.value = true;
    axios.get(url)
        .then(response => {
            divisions.value = response.data.divisions;
            eventName.value = response.data.name;
            team.value = { name: '', players: [] } as Team;
        })
        .catch((error) => {
            console.error("Error fetching event:", error);
            divisions.value = [];
            eventName.value = '';
            team.value = { name: '', players: [] } as Team;
        })
        .finally(() => {
            loading.value = false;
        });
};

const selectTeam = (selectedTeam: Team) => {
    team.value = selectedTeam;
};

onMounted(async () => {
    loading.value = true;
    
    let clubId = route.query.club as string;
    
    if (!clubId) {
        clubId = "3156"; // Default club ID
    }
    
    const url = getBaseURL() + "/club/" + clubId;
    
    try {
        const response = await axios.get(url);
        club.value = response.data;
        divisions.value = [];
        team.value = {} as Team;
    } catch(error) {
        console.error("Error fetching club:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <div v-if="loading" class="flex justify-center py-4 w-full">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        
        <div v-else class="flex flex-col md:flex-row gap-6 w-full">
            <!-- Club Card -->
            <Card class="w-full md:w-96">
                <CardHeader>
                    <CardTitle>{{ club.name || 'Club' }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="space-y-1">
                        <h3 class="text-sm font-medium">Events</h3>
                        <ul class="space-y-1">
                            <li v-for="(event, index) in club.events" :key="index">
                                <Button 
                                    variant="ghost" 
                                    class="w-full justify-start text-left h-auto py-1.5"
                                    @click="selectEvent(event)"
                                >
                                    <span class="truncate">{{ event.name }}: {{ event.duration }}, {{ event.year }}</span>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
            
            <!-- Divisions Card -->
            <Card v-if="divisions.length > 0" class="w-full md:w-96">
                <CardHeader>
                    <CardTitle>{{ eventName || 'Event' }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="space-y-1">
                        <h3 class="text-sm font-medium">Teams</h3>
                        <ul class="space-y-1">
                            <li v-for="(divTeam, index) in divisions" :key="index">
                                <Button 
                                    variant="ghost" 
                                    class="w-full justify-start text-left h-auto py-1.5"
                                    @click="selectTeam(divTeam)"
                                >
                                    <span class="truncate">
                                        {{ divTeam.displayName || divTeam.name }}
                                    </span>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
            
            <!-- Team Details -->
            <div v-if="team.name" class="flex-1">
                <Division :team="team" />
            </div>
        </div>
    </div>
</template>
