<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

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
                            <a :href="'/usta/team?teamId=' + team.id" class="text-primary hover:underline" target="_blank">
                                {{ team.name }}
                            </a>
                        </h2>
                        
                        <div v-if="loading" class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                    
                    <div class="border-t pt-3">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <span class="text-sm font-medium text-muted-foreground">Area:</span>
                                <span class="ml-1">{{ team.area }}</span>
                            </div>
                            
                            <div>
                                <span class="text-sm font-medium text-muted-foreground">Flight:</span>
                                <span class="ml-1">{{ team.flight }}</span>
                            </div>
                            
                            <div>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    class="p-0 h-auto text-primary"
                                    @click="updatePlayers(team)"
                                >
                                    Update Players
                                </Button>
                            </div>
                            
                            <div>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    class="p-0 h-auto text-primary"
                                    @click="exportTeam(team)"
                                >
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap items-center justify-between border-t pt-3">
                        <div class="flex items-center space-x-4">
                            <div>
                                <span class="text-sm font-medium text-muted-foreground">Captain:</span>
                                <a 
                                    v-if="team.captain" 
                                    :href="'/usta/player?ustaId=' + team.captain.ustaNorcalId" 
                                    class="ml-1 text-primary hover:underline" 
                                    target="_blank"
                                >
                                    {{ team.captainName }}
                                </a>
                            </div>
                            
                            <div>
                                <a 
                                    :href="team.link" 
                                    class="text-primary hover:underline" 
                                    target="_blank"
                                >
                                    USTA Link
                                </a>
                            </div>
                            
                            <div>
                                <a 
                                    :href="team.tennisRecordLink" 
                                    class="text-primary hover:underline" 
                                    target="_blank"
                                >
                                    TR Link
                                </a>
                            </div>
                            
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-muted-foreground">Rating:</span>
                                <Badge variant="outline" class="ml-1">
                                    {{ team.teamRating?.toFixed(2) }}/{{ team.teamStrongestRating?.toFixed(2) }}
                                </Badge>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-2 mt-2 md:mt-0">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                title="Refresh DR"
                                @click="refreshTeamDRValue(team)"
                            >
                                <img src="/recruiting50x50.png" width="20" height="20" alt="Refresh DR" />
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="icon" 
                                title="Fetch UTR Value"
                                @click="refreshTeamUTRValue(team)"
                            >
                                <img src="/utr.svg" width="20" height="20" alt="Fetch UTR Value" />
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="icon" 
                                title="Fetch UTR ID"
                                @click="refreshTeamUTRId(team)"
                            >
                                <img src="/utr.svg" width="20" height="20" alt="Fetch UTR ID" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
