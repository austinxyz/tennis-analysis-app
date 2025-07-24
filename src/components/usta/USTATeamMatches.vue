<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from "axios";
import MatchScore from "./MatchScore.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";

interface Team {
    id?: string | number;
    [key: string]: any;
}

interface Match {
    matchDate?: string;
    homeTeamId?: string | number;
    guestTeamId?: string | number;
    homeTeamName?: string;
    guestTeamName?: string;
    homePoint?: number;
    guestPoint?: number;
    lines?: any[];
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    team: { type: Object as () => Team, required: true },
    matches: { type: Array as () => Match[], required: true }
});

const emit = defineEmits(['update:team', 'update:matches', 'change']);

const loading = ref(false);
const match = ref<Match>({});

watch(() => props.matches, () => {
    match.value = {};
}, { deep: true });

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const refreshScores = async (team: Team) => {
    loading.value = true;

    if (!team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/teams/" + team.id + "/matches?action=updateScore";
        const response = await axios.get(url);
        emit('update:matches', response.data);
    } catch (error) {
        console.error("Error refreshing scores:", error);
    } finally {
        loading.value = false;
    }
};

const refreshScoreCard = async () => {
    loading.value = true;

    if (!props.team.id) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/teams/" + props.team.id + "/matches";
        const response = await axios.get(url);
        emit('update:matches', response.data);
    } catch (error) {
        console.error("Error refreshing score card:", error);
    } finally {
        loading.value = false;
    }
};

const changeTeam = async (teamId: string | number) => {
    loading.value = true;

    try {
        const url = getBaseURL() + "/usta/teams/" + teamId;
        const response = await axios.get(url);
        emit('update:team', response.data);

        const matchesUrl = getBaseURL() + "/usta/teams/" + teamId + "/matches";
        const res = await axios.get(matchesUrl);
        emit('update:matches', res.data);
        emit('change', response.data);
        
        match.value = {};
    } catch (error) {
        console.error("Error changing team:", error);
    } finally {
        loading.value = false;
    }
};

const showScoreDetail = (matchData: Match) => {
    match.value = matchData;
};
</script>

<template>
    <div class="w-full">
        <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        
        <Table>
            <TableHeader class="text-xs uppercase bg-muted">
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Match Date</TableHead>
                    <TableHead>Opposite Team</TableHead>
                    <TableHead>Home/Away</TableHead>
                    <TableHead>
                        <div class="flex items-center space-x-2">
                            <span>Score</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                class="h-6 w-6" 
                                title="Refresh Score"
                                @click="refreshScores(team)"
                            >
                                <img src="/updates-30.png" width="16" height="16" alt="Refresh Score" />
                            </Button>
                        </div>
                    </TableHead>
                    <TableHead>Compare</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody v-if="matches.length > 0">
                <TableRow v-for="(match, index) in matches" :key="index">
                    <TableCell>{{ index+1 }}</TableCell>
                    <TableCell>{{ match.matchDate }}</TableCell>
                    <TableCell>
                        <Button 
                            variant="link" 
                            class="p-0 h-auto text-primary"
                            @click="changeTeam(match.homeTeamId === team.id ? match.guestTeamId! : match.homeTeamId!)"
                        >
                            {{ match.homeTeamId === team.id ? match.guestTeamName : match.homeTeamName }}
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Badge :variant="match.homeTeamId === team.id ? 'default' : 'secondary'">
                            {{ match.homeTeamId === team.id ? 'Home' : 'Away' }}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Button 
                            v-if="match.lines && match.lines.length > 0" 
                            variant="link" 
                            class="p-0 h-auto text-primary"
                            @click="showScoreDetail(match)"
                            href="#score_anchor"
                        >
                            {{ match.homeTeamId === team.id ? 
                                `${match.homePoint} - ${match.guestPoint}` : 
                                `${match.guestPoint} - ${match.homePoint}` 
                            }}
                        </Button>
                        <span v-else class="text-muted-foreground">-</span>
                    </TableCell>
                    <TableCell>
                        <a 
                            :href="'/usta/teamanalysis?team1=' + match.homeTeamId + '&team2=' + match.guestTeamId" 
                            class="text-primary hover:underline" 
                            target="_blank"
                        >
                            Analysis
                        </a>
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableBody v-else>
                <TableRow>
                    <TableCell colspan="6" class="text-center py-6 text-muted-foreground">
                        No matches found
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        
        <div id="score_anchor" class="mt-6">
            <MatchScore :match="match" @change="refreshScoreCard" />
        </div>
    </div>
</template>
