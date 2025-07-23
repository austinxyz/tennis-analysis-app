<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface Team {
    id?: number;
    name: string;
    link?: string;
    area?: string;
    captainName?: string;
    flightLink?: string;
    inDB?: boolean;
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    teams: { type: Array as () => Team[], required: true },
    division: { type: Object, required: true }
});

const emit = defineEmits(['update:team', 'refresh']);

const loading = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const importTeam = async (team: Team) => {
    var url = getBaseURL() + "/usta/teams/";
    loading.value = true;
    
    try {
        const res = await axios.post(url,
            {
                link: team.link,
                name: team.name,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        emit('refresh', res.data);
    } catch (error) {
        console.error("Error importing team:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="w-full">
        <h3 class="text-lg font-semibold mb-4">Teams</h3>
        
        <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        
        <div v-else-if="teams.length > 0" class="relative overflow-x-auto rounded-md border">
            <table class="w-full text-sm text-left">
                <thead class="text-xs uppercase bg-muted">
                    <tr>
                        <th scope="col" class="px-4 py-3">#</th>
                        <th scope="col" class="px-4 py-3">Name</th>
                        <th scope="col" class="px-4 py-3">Area</th>
                        <th scope="col" class="px-4 py-3">Captain</th>
                        <th scope="col" class="px-4 py-3">USTA Link</th>
                        <th scope="col" class="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(team, index) in teams" :key="index" class="border-b hover:bg-muted/50">
                        <td class="px-4 py-3">{{ index+1 }}</td>
                        <td class="px-4 py-3">
                            <a v-if="team.id && team.id > 0" :href="'/usta/team?teamId=' + team.id" class="text-primary hover:underline" target="_blank">
                                {{ team.name }}
                            </a>
                            <span v-else>{{ team.name }}</span>
                        </td>
                        <td class="px-4 py-3">
                            <a v-if="team.flightLink" :href="team.flightLink" class="text-primary hover:underline" target="_blank">
                                {{ team.area }}
                            </a>
                            <span v-else>{{ team.area }}</span>
                        </td>
                        <td class="px-4 py-3">{{ team.captainName }}</td>
                        <td class="px-4 py-3">
                            <a :href="team.link" class="text-primary hover:underline" target="_blank">
                                USTA Link
                            </a>
                        </td>
                        <td class="px-4 py-3">
                            <Badge v-if="team.inDB" variant="success" class="flex items-center w-fit">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Imported
                            </Badge>
                            <Button 
                                v-else-if="division.inDB" 
                                variant="default" 
                                size="sm"
                                @click="importTeam(team)"
                            >
                                Import
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div v-else class="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
            No teams found for this division.
        </div>
    </div>
</template>
