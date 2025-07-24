<script setup lang="ts">
import { ref } from 'vue';

// Helper functions to handle external links
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
import axios from "axios";
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";

interface Team {
    id?: string | number;
    name?: string;
    alias?: string;
    area?: string;
    flight?: string;
    captainName?: string;
    captain?: {
        ustaNorcalId?: string;
    };
    link?: string;
    tennisRecordLink?: string;
    teamRating?: number;
    teamStrongestRating?: number;
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    team: { type: Object as () => Team, required: true }
});

const emit = defineEmits(['update:team', 'change']);

const loading = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const refreshTeamUTRId = async (team: Team) => {
    loading.value = true;

    if (!team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/teams/" + team.id + "/utrs?action=refreshID";
        const res = await axios.get(url);

        emit('update:team', res.data);
        emit('change', res.data);
    } catch (error) {
        console.error("Error refreshing team UTR ID:", error);
    } finally {
        loading.value = false;
    }
};

const refreshTeamUTRValue = async (team: Team) => {
    loading.value = true;

    if (!team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/teams/" + team.id + "/utrs?action=refreshValue";
        const res = await axios.get(url);

        emit('update:team', res.data);
        emit('change', res.data);
    } catch (error) {
        console.error("Error refreshing team UTR value:", error);
    } finally {
        loading.value = false;
    }
};

const updatePlayers = async (team: Team) => {
    loading.value = true;

    if (!team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/teams/" + team.id + "/players?action=refresh";
        const res = await axios.get(url);

        emit('update:team', res.data);
        emit('change', res.data);
    } catch (error) {
        console.error("Error updating players:", error);
    } finally {
        loading.value = false;
    }
};

const exportTeam = async (team: Team) => {
    loading.value = true;

    if (!team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/exportExcel/team/" + team.id;
        const res = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer',
        });

        forceFileDownload(res, team.name + ".xlsx");
    } catch (error) {
        console.error("Error exporting team:", error);
    } finally {
        loading.value = false;
    }
};

const forceFileDownload = (response: any, title: string) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
};

const refreshTeamDRValue = async (team: Team) => {
    loading.value = true;

    if (!team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/teams/" + team.id + "/drs?action=refresh";
        const res = await axios.get(url);

        emit('update:team', res.data);
    } catch (error) {
        console.error("Error refreshing team DR value:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div v-if="team.id">
        <Card>
            <CardContent class="p-4">
                <div class="space-y-4">
                    <!-- Team Header -->
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold">
                            <span v-if="team.alias" class="text-muted-foreground">[{{ team.alias }}]</span>
                            <Button 
                                variant="link" 
                                class="p-0 h-auto text-primary font-bold text-2xl"
                                @click="openInNewTab('/usta/team?teamId=' + team.id)"
                            >
                                {{ team.name }}
                            </Button>
                        </h2>
                        
                        <div v-if="loading" class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                    
                    <div class="border-t pt-3">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-muted-foreground">Area:</span>
                                <span class="ml-1">{{ team.area }}</span>
                            </div>
                            
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-muted-foreground">Flight:</span>
                                <span class="ml-1">{{ team.flight }}</span>
                            </div>
                            
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-muted-foreground">Captain:</span>
                                <Button 
                                    v-if="team.captain" 
                                    variant="link" 
                                    class="p-0 h-auto ml-1 text-primary"
                                    @click="openInNewTab('/usta/player?ustaId=' + team.captain?.ustaNorcalId)"
                                >
                                    {{ team.captainName }}
                                </Button>
                            </div>
                            
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-muted-foreground">Rating:</span>
                                <span class="ml-1 px-2 py-0.5 text-sm border border-gray-300 rounded-md">
                                    {{ team.teamRating?.toFixed(2) }}/{{ team.teamStrongestRating?.toFixed(2) }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-7 gap-2 mt-3">
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="updatePlayers(team)"
                                class="flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Update Players
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="exportTeam(team)"
                                class="flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="openInNewTab(team.link || '')"
                                class="flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                USTA Link
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="openInNewTab(team.tennisRecordLink || '')"
                                class="flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                TR Link
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="refreshTeamDRValue(team)"
                                class="flex items-center justify-center"
                            >
                                <img src="/recruiting50x50.png" width="16" height="16" alt="Refresh DR" class="mr-1" />
                                Refresh DR
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="refreshTeamUTRValue(team)"
                                class="flex items-center justify-center"
                            >
                                <img src="/utr.svg" width="16" height="16" alt="Fetch UTR Value" class="mr-1" />
                                Refresh UTR
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="refreshTeamUTRId(team)"
                                class="flex items-center justify-center"
                            >
                                <img src="/utr.svg" width="16" height="16" alt="Fetch UTR ID" class="mr-1" />
                                Fetch UTR ID
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
