<script setup lang="ts">
import { ref } from 'vue';
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScore from "./LineScore.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Badge from "../ui/badge.vue";

interface Team {
    id?: string | number;
    name?: string;
    alias?: string;
    currentWinMatchNo?: number;
    totalMatchNo?: number;
    currentScore?: number;
    doubleLineStats?: Record<string, LineStat>;
    singleLineStats?: Record<string, LineStat>;
    [key: string]: any;
}

interface LineStat {
    winMatchNo: number;
    lostMatchNo: number;
    winPrecent: number;
    surprisedWin: number;
    surprisedLost: number;
    pairs?: Pair[];
    singlers?: Single[];
    [key: string]: any;
}

interface Pair {
    player1: any;
    player2: any;
    winMatchNo: number;
    lostMatchNo: number;
    winScores: any[];
    lostScores: any[];
    playerNames: string;
    [key: string]: any;
}

interface Single {
    player: any;
    winMatchNo: number;
    lostMatchNo: number;
    winScores: any[];
    lostScores: any[];
    playerName: string;
    [key: string]: any;
}

const props = defineProps({
    team: { type: Object as () => Team, required: true }
});

const scores = ref<any[]>([]);
const playerNames = ref('');

const showScores = (scoreData: any[], names: string) => {
    scores.value = scoreData;
    playerNames.value = names;
};
</script>

<template>
    <div v-if="team.id" class="w-full space-y-6">
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center justify-between">
                    <div>
                        Team: {{ team.name }} 
                        <span v-if="team.alias" class="text-muted-foreground">({{ team.alias }})</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm">
                        <Badge variant="outline">
                            W/L: {{ team.currentWinMatchNo }}/{{ team.totalMatchNo && team.currentWinMatchNo ? team.totalMatchNo - team.currentWinMatchNo : 0 }}
                        </Badge>
                        <Badge variant="outline">
                            Score: {{ team.currentScore }}
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
        </Card>
        
        <!-- Double Line Stats -->
        <div v-if="team.doubleLineStats" class="space-y-6">
            <div v-for="(linestat, key) in team.doubleLineStats" :key="`double-${key}`">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">
                            Line: {{ key }} 
                            <span class="font-normal text-sm ml-2">
                                (W:{{ linestat.winMatchNo }} / L:{{ linestat.lostMatchNo }} - {{ (linestat.winPrecent*100).toFixed(2) }}%)
                            </span>
                        </CardTitle>
                        <div class="text-sm text-muted-foreground">
                            Normal W/L: {{ linestat.winMatchNo - linestat.surprisedWin }}/{{ linestat.lostMatchNo - linestat.surprisedLost }} 
                            vs. Surprised W/L: {{ linestat.surprisedWin }}/{{ linestat.surprisedLost }}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="relative overflow-x-auto rounded-md border">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs uppercase bg-muted">
                                    <tr>
                                        <th scope="col" class="px-4 py-3 w-1/2">Pair</th>
                                        <th scope="col" class="px-4 py-3 w-1/6">W/L</th>
                                        <th scope="col" class="px-4 py-3 w-1/6">Win Matches</th>
                                        <th scope="col" class="px-4 py-3 w-1/6">Lost Matches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(pair, pairIndex) in linestat.pairs" :key="`pair-${pairIndex}`" class="border-b hover:bg-muted/50">
                                        <td class="px-4 py-3 w-1/2">
                                            <LinePlayerInfo :player1="pair.player1" :player2="pair.player2" matchType="D" />
                                        </td>
                                        <td class="px-4 py-3 w-1/6">
                                            <Badge variant="outline">
                                                {{ pair.winMatchNo }} / {{ pair.lostMatchNo }}
                                            </Badge>
                                        </td>
                                        <td class="px-4 py-3 w-1/6">
                                            <button 
                                                v-if="pair.winMatchNo > 0" 
                                                class="text-primary hover:underline"
                                                @click="showScores(pair.winScores, pair.playerNames)"
                                            >
                                                Win Matches
                                            </button>
                                        </td>
                                        <td class="px-4 py-3 w-1/6">
                                            <button 
                                                v-if="pair.lostMatchNo > 0" 
                                                class="text-primary hover:underline"
                                                @click="showScores(pair.lostScores, pair.playerNames)"
                                            >
                                                Lost Matches
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        
        <!-- Single Line Stats -->
        <div v-if="team.singleLineStats" class="space-y-6">
            <div v-for="(linestat, key) in team.singleLineStats" :key="`single-${key}`">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">
                            Line: {{ key }} 
                            <span class="font-normal text-sm ml-2">
                                (W:{{ linestat.winMatchNo }} / L:{{ linestat.lostMatchNo }} - {{ (linestat.winPrecent*100).toFixed(2) }}%)
                            </span>
                        </CardTitle>
                        <div class="text-sm text-muted-foreground">
                            Normal W/L: {{ linestat.winMatchNo - linestat.surprisedWin }}/{{ linestat.lostMatchNo - linestat.surprisedLost }} 
                            vs. Surprised W/L: {{ linestat.surprisedWin }}/{{ linestat.surprisedLost }}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="relative overflow-x-auto rounded-md border">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs uppercase bg-muted">
                                    <tr>
                                        <th scope="col" class="px-4 py-3 w-1/2">Player</th>
                                        <th scope="col" class="px-4 py-3 w-1/6">W/L</th>
                                        <th scope="col" class="px-4 py-3 w-1/6">Win Matches</th>
                                        <th scope="col" class="px-4 py-3 w-1/6">Lost Matches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(single, singleIndex) in linestat.singlers" :key="`single-${singleIndex}`" class="border-b hover:bg-muted/50">
                                        <td class="px-4 py-3 w-1/2">
                                            <LinePlayerInfo :player1="single.player" matchType="S" />
                                        </td>
                                        <td class="px-4 py-3 w-1/6">
                                            <Badge variant="outline">
                                                {{ single.winMatchNo }} / {{ single.lostMatchNo }}
                                            </Badge>
                                        </td>
                                        <td class="px-4 py-3 w-1/6">
                                            <button 
                                                v-if="single.winMatchNo > 0" 
                                                class="text-primary hover:underline"
                                                @click="showScores(single.winScores, single.playerName)"
                                            >
                                                Win Matches
                                            </button>
                                        </td>
                                        <td class="px-4 py-3 w-1/6">
                                            <button 
                                                v-if="single.lostMatchNo > 0" 
                                                class="text-primary hover:underline"
                                                @click="showScores(single.lostScores, single.playerName)"
                                            >
                                                Lost Matches
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        
        <!-- Match Scores -->
        <div v-if="scores.length > 0" class="mt-6">
            <Card>
                <CardHeader v-if="playerNames">
                    <CardTitle class="text-base">{{ playerNames }}'s Matches</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="relative overflow-x-auto rounded-md border">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs uppercase bg-muted">
                                <tr>
                                    <th scope="col" class="px-4 py-3">Match Type</th>
                                    <th scope="col" class="px-4 py-3">Home Players</th>
                                    <th scope="col" class="px-4 py-3">Visit Players</th>
                                    <th scope="col" class="px-4 py-3">Winners Score</th>
                                    <th scope="col" class="px-4 py-3">Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(lineScore, index) in scores" :key="`score-${index}`" class="border-b hover:bg-muted/50">
                                    <LineScore :lineScore="lineScore" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
