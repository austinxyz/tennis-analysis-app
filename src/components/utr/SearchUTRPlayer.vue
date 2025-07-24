<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface UTRPlayer {
    id: string;
    name: string;
    gender: string;
    sUTR: number;
    dUTR: number;
    sUTRStatus: string;
    dUTRStatus: string;
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const route = useRoute();
const utrquery = ref('');
const utrplayers = ref<UTRPlayer[]>([]);
const player = ref<Record<string, any>>({});
const playerName = ref('');
const loading = ref(false);
const showUTRSearch = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const setPlayerResult = async (playerId: string, name: string) => {
    loading.value = true;
    playerName.value = name;

    const url = getBaseURL() + "/playerresult/?id=" + playerId;
    try {
        const response = await axios.get(url);
        player.value = response.data;
    } catch(error) {
        console.error("Error fetching player result:", error);
    }
    loading.value = false;
};

const searchUTRPlayer = async () => {
    if (!utrquery.value) return;
    
    const url = getBaseURL() + "/search/players?query=" + utrquery.value;
    try {
        const response = await axios.get(url);
        utrplayers.value = response.data;
    } catch(error) {
        console.error("Error searching player:", error);
        utrplayers.value = [];
    }
};

onMounted(() => {
    const utrId = route.query.utr as string;
    
    if (!utrId) return;
    
    const url = getBaseURL() + "/playerresult?id=" + utrId;
    
    loading.value = true;
    axios.get(url)
        .then(response => {
            player.value = response.data;
            if (response.data.player && response.data.player.name) {
                playerName.value = response.data.player.name;
                utrquery.value = response.data.player.name;
            }
        })
        .catch(error => {
            console.error("Error fetching player data:", error);
        })
        .finally(() => {
            loading.value = false;
        });
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <Card class="w-full md:w-96">
            <CardHeader>
                <CardTitle>Search UTR Player</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col space-y-4">
                    <div class="grid gap-2">
                        <label for="utr-search" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Player Name
                        </label>
                        <div class="flex gap-2">
                            <input 
                                id="utr-search"
                                v-model="utrquery" 
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter player name"
                                @keyup.enter="searchUTRPlayer"
                            />
                            <Button @click="searchUTRPlayer">Search</Button>
                        </div>
                    </div>
                    
                    <div v-if="utrplayers.length > 0" class="relative overflow-x-auto rounded-md border">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs uppercase bg-muted">
                                <tr>
                                    <th scope="col" class="px-4 py-3 w-1/6">#</th>
                                    <th scope="col" class="px-4 py-3">Player</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(player, index) in utrplayers" :key="index" class="border-b hover:bg-muted/50">
                                    <td class="px-4 py-3">{{ index+1 }}</td>
                                    <td class="px-4 py-3">
                                        <Button 
                                            variant="link" 
                                            class="p-0 h-auto text-primary"
                                            @click="setPlayerResult(player.id, player.name)"
                                        >
                                            {{ player.name }}
                                        </Button>
                                        <span class="ml-2">{{ player.gender }}</span>
                                        <div class="flex gap-2 mt-1">
                                            <Badge variant="outline" :class="player.sUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                                {{ player.sUTR }} (S)
                                            </Badge>
                                            <Badge variant="outline" :class="player.dUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                                {{ player.dUTR }} (D)
                                            </Badge>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div class="flex-1">
            <div v-if="loading" class="flex justify-center items-center h-20">
                <div class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-else-if="Object.keys(player).length > 0" class="w-full">
                <PlayerResult :result="player" :player="playerName"/>
            </div>
        </div>
    </div>
</template>
