<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from "axios";
import PlayerForm from '../PlayerForm.vue';
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

interface Player {
    id?: string | number;
    name?: string;
    gender?: string;
    area?: string;
    ageRange?: string;
    lefty?: boolean;
    ustaRating?: string;
    ustaId?: string;
    ustaNorcalId?: string;
    registeredBayArea?: boolean;
    dynamicRating?: string;
    tennisLinkURL?: string;
    noncalLink?: string;
    tennisRecordLink?: string;
    utrId?: string;
    sutr?: number;
    dutr?: number;
    sutrstatus?: string;
    dutrstatus?: string;
    successRate?: number;
    wholeSuccessRate?: number;
    summary?: string;
    [key: string]: any;
}

const props = defineProps({
    player: { type: Object as () => Player, required: true }
});

const emit = defineEmits(['update:player', 'change']);

const loading = ref(false);
const summary = ref('');

watch(() => props.player, (newPlayer) => {
    summary.value = newPlayer.summary || '';
}, { deep: true });

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const refreshPlayerUTRValue = async (player: Player) => {
    loading.value = true;

    if (!player.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/players/" + player.id + "/utrs?action=refreshUTRValue";
        const res = await axios.get(url);

        emit('update:player', res.data);
        emit('change', res.data);
    } catch (error) {
        console.error("Error refreshing UTR value:", error);
    } finally {
        loading.value = false;
    }
};

const refreshPlayerUTRInfo = async (player: Player) => {
    loading.value = true;

    if (!player.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/players/" + player.id + "/utrs?action=refreshUTRId";
        const res = await axios.get(url);
        
        emit('update:player', res.data);
        emit('change', res.data);
    } catch (error) {
        console.error("Error refreshing UTR info:", error);
    } finally {
        loading.value = false;
    }
};

const refreshPlayerDR = async (player: Player) => {
    loading.value = true;

    if (!player.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/players/" + player.id + "/utrs?action=refreshDR";
        const res = await axios.get(url);

        emit('update:player', res.data);
        emit('change', res.data);
    } catch (error) {
        console.error("Error refreshing DR:", error);
    } finally {
        loading.value = false;
    }
};

const refreshPlayer = (player: Player) => {
    emit('update:player', player);
    emit('change', player);
    summary.value = player.summary || '';
};

// Helper function to open links in a new tab
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <div v-if="player.name" class="w-full">
        <Card>
            <CardContent class="p-4">
                <div class="space-y-4">
                    <!-- Player Header -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <h2 class="text-xl font-bold">
                                <Button 
                                    variant="link" 
                                    class="p-0 h-auto text-primary font-bold text-xl"
                                    @click="openInNewTab('player?ustaId=' + player.ustaNorcalId)"
                                >
                                    {{ player.name }}
                                </Button>
                            </h2>
                        </div>
                        <PlayerForm :player="player" @change="refreshPlayer" />
                    </div>
                    
                    <!-- Basic Info -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 border-t border-b py-2">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Gender:</span>
                            <span>{{ player.gender }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Area:</span>
                            <span>{{ player.area }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Age:</span>
                            <span>{{ player.ageRange }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Lefty:</span>
                            <Badge variant="outline">{{ player.lefty ? 'Yes' : 'No' }}</Badge>
                        </div>
                    </div>
                    
                    <!-- USTA Info -->
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-2 border-b py-2">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">USTA Rating:</span>
                            <Badge>{{ player.ustaRating }}</Badge>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">USTA ID:</span>
                            <Button 
                                variant="link" 
                                class="p-0 h-auto text-primary"
                                @click="openInNewTab(player.tennisLinkURL || '')"
                            >
                                {{ player.ustaId }}
                            </Button>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Norcal ID:</span>
                            <Button 
                                variant="link" 
                                class="p-0 h-auto text-primary"
                                @click="openInNewTab(player.noncalLink || '')"
                            >
                                {{ player.ustaNorcalId }}
                            </Button>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Bay Area:</span>
                            <Badge variant="outline">{{ player.registeredBayArea ? 'Yes' : 'No' }}</Badge>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Tennis Record DR:</span>
                            <Button 
                                variant="link" 
                                class="p-0 h-auto text-primary"
                                @click="openInNewTab(player.tennisRecordLink || '')"
                            >
                                {{ player.dynamicRating }}
                            </Button>
                            <Button 
                                v-if="player.tennisRecordLink" 
                                variant="ghost" 
                                size="icon" 
                                class="h-6 w-6 ml-1 p-0" 
                                @click="refreshPlayerDR(player)"
                                title="Refresh DR"
                            >
                                <img src="/recruiting50x50.png" width="16" height="16" alt="Refresh DR" />
                            </Button>
                        </div>
                    </div>
                    
                    <!-- UTR Info -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 border-b py-2">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">UTR ID:</span>
                            <div v-if="player.utrId" class="flex items-center">
                                <Button 
                                    variant="link" 
                                    class="p-0 h-auto text-primary"
                                    @click="openInNewTab('https://app.universaltennis.com/profiles/' + player.utrId)"
                                >
                                    {{ player.utrId }}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    class="h-6 w-6 ml-1 p-0" 
                                    @click="refreshPlayerUTRValue(player)"
                                    title="Refresh UTR Value"
                                >
                                    <img src="/utr.svg" width="16" height="16" alt="Refresh UTR Value" />
                                </Button>
                            </div>
                            <div v-else class="flex items-center">
                                <span class="text-muted-foreground">Not available</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    class="h-6 w-6 ml-1 p-0" 
                                    @click="refreshPlayerUTRInfo(player)"
                                    title="Fetch UTR ID"
                                >
                                    <img src="/utr.svg" width="16" height="16" alt="Fetch UTR ID" />
                                </Button>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Single UTR:</span>
                            <Badge variant="outline" :class="player.sutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                {{ player.sutr }} ({{ player.sutrstatus }})
                            </Badge>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Double UTR:</span>
                            <Badge variant="outline" :class="player.dutrstatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                {{ player.dutr }} ({{ player.dutrstatus }})
                            </Badge>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-1">WPct:</span>
                            <span>{{ ((player.successRate || 0) * 100).toFixed(0) }}% / {{ ((player.wholeSuccessRate || 0) * 100).toFixed(0) }}%</span>
                        </div>
                    </div>
                    
                    <!-- Summary -->
                    <div class="border-b py-2">
                        <div class="flex items-start">
                            <span class="text-sm font-medium text-muted-foreground mr-1">Summary:</span>
                            <span class="text-sm">{{ summary }}</span>
                        </div>
                    </div>
                    
                    <!-- Loading Indicator -->
                    <div v-if="loading" class="flex justify-center py-2">
                        <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
