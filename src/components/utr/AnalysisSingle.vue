<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import MatchResults from "./MatchResults.vue";
import SingleComparation from "./SingleComparation.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import CardFooter from "../ui/card-footer.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

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

interface AnalysisResult {
    player1: Player;
    player2: Player;
    pastMatches: any[];
    matchesWithSamePlayer: any[][];
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const query1 = ref('');
const query2 = ref('');
const result = ref<AnalysisResult>({} as AnalysisResult);
const players1 = ref<Player[]>([]);
const players2 = ref<Player[]>([]);
const playerId1 = ref('');
const playerId2 = ref('');
const loading = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const compareSingle = async () => {
    if (!playerId1.value || !playerId2.value) {
        return;
    }
    
    loading.value = true;
    
    const url = getBaseURL() + "/analysis/single/player1/" + playerId1.value + "/player2/" + playerId2.value;
    try {
        const response = await axios.get(url);
        result.value = response.data;
    } catch (error) {
        console.error("Error comparing players:", error);
    } finally {
        loading.value = false;
    }
};

const searchPlayer1 = async () => {
    if (!query1.value) return;
    
    const url = getBaseURL() + "/search/players?query=" + query1.value;
    try {
        const response = await axios.get(url);
        players1.value = response.data;
        if (players1.value.length > 0) {
            playerId1.value = players1.value[0].id;
        }
    } catch (error) {
        console.error("Error searching player 1:", error);
        players1.value = [];
    }
};

const searchPlayer2 = async () => {
    if (!query2.value) return;
    
    const url = getBaseURL() + "/search/players?query=" + query2.value;
    try {
        const response = await axios.get(url);
        players2.value = response.data;
        if (players2.value.length > 0) {
            playerId2.value = players2.value[0].id;
        }
    } catch (error) {
        console.error("Error searching player 2:", error);
        players2.value = [];
    }
};
</script>

<template>
    <div class="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Player Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Player 1 Search -->
                    <div class="space-y-4">
                        <div class="grid gap-2">
                            <label for="player1-search" class="text-sm font-medium leading-none">
                                Player 1
                            </label>
                            <div class="flex gap-2">
                                <input 
                                    id="player1-search"
                                    v-model="query1" 
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter player name"
                                    @keyup.enter="searchPlayer1"
                                />
                                <Button @click="searchPlayer1">Search</Button>
                            </div>
                        </div>
                        
                        <div v-if="players1.length > 0" class="relative overflow-x-auto rounded-md border">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs uppercase bg-muted">
                                    <tr>
                                        <th scope="col" class="px-4 py-3 w-1/6"></th>
                                        <th scope="col" class="px-4 py-3">Player</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(player, index) in players1" :key="index" class="border-b hover:bg-muted/50">
                                        <td class="px-4 py-3">
                                            <input 
                                                type="radio" 
                                                :value="player.id" 
                                                v-model="playerId1"
                                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td class="px-4 py-3">
                                            <div>{{ player.name }} <span class="ml-2">{{ player.gender }}</span></div>
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
                    
                    <!-- Player 2 Search -->
                    <div class="space-y-4">
                        <div class="grid gap-2">
                            <label for="player2-search" class="text-sm font-medium leading-none">
                                Player 2
                            </label>
                            <div class="flex gap-2">
                                <input 
                                    id="player2-search"
                                    v-model="query2" 
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter player name"
                                    @keyup.enter="searchPlayer2"
                                />
                                <Button @click="searchPlayer2">Search</Button>
                            </div>
                        </div>
                        
                        <div v-if="players2.length > 0" class="relative overflow-x-auto rounded-md border">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs uppercase bg-muted">
                                    <tr>
                                        <th scope="col" class="px-4 py-3 w-1/6"></th>
                                        <th scope="col" class="px-4 py-3">Player</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(player, index) in players2" :key="index" class="border-b hover:bg-muted/50">
                                        <td class="px-4 py-3">
                                            <input 
                                                type="radio" 
                                                :value="player.id" 
                                                v-model="playerId2"
                                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td class="px-4 py-3">
                                            <div>{{ player.name }} <span class="ml-2">{{ player.gender }}</span></div>
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
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    @click="compareSingle" 
                    :disabled="!playerId1 || !playerId2"
                    class="ml-auto"
                >
                    Compare Players
                </Button>
            </CardFooter>
        </Card>
        
        <!-- Loading Indicator -->
        <div v-if="loading" class="flex justify-center items-center h-20">
            <div class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        
        <!-- Results -->
        <div v-else-if="result.player1" class="space-y-6">
            <!-- Player Comparison -->
            <SingleComparation :player1="result.player1" :player2="result.player2" />
            
            <!-- Past Matches -->
            <Card>
                <CardHeader>
                    <CardTitle>Past Matches</CardTitle>
                </CardHeader>
                <CardContent>
                    <MatchResults :matches="result.pastMatches" singlemode="single" :player="result.player1.name"/>
                </CardContent>
            </Card>
            
            <!-- Matches with Same Opponents -->
            <Card>
                <CardHeader>
                    <CardTitle>Matches with Same Opponents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-for="(matches, index) in result.matchesWithSamePlayer" :key="index" class="mb-4">
                        <MatchResults :matches="matches" singlemode="single" :player="result.player1.name"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
