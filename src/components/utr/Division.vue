<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";

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
    players: Player[];
    [key: string]: any;
}

const props = defineProps<{
    team: Team;
}>();

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const player = ref<Record<string, any>>({});
const playerName = ref('');
const loading = ref(false);

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
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    player.value = {};
    playerName.value = "";
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <Card class="w-full md:w-[32rem]">
            <CardHeader>
                <CardTitle>{{ team.name }}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader class="text-xs uppercase bg-muted">
                        <TableRow>
                            <TableHead class="w-1/6">#</TableHead>
                            <TableHead>Player</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(teamPlayer, index) in team.players" :key="index">
                            <TableCell>{{ index+1 }}</TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <Button 
                                        variant="link" 
                                        class="p-0 h-auto text-primary"
                                        @click="setPlayerResult(teamPlayer.id, teamPlayer.name)"
                                    >
                                        {{ teamPlayer.name }}
                                    </Button>
                                    <span>{{ teamPlayer.gender }}</span>
                                    <Badge variant="outline" :class="teamPlayer.sUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                        {{ teamPlayer.sUTR }} (S)
                                    </Badge>
                                    <Badge variant="outline" :class="teamPlayer.dUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                        {{ teamPlayer.dUTR }} (D)
                                    </Badge>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <div class="flex-1">
            <div v-if="loading" class="flex justify-center py-4">
                <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
            </div>
            <div v-else-if="Object.keys(player).length > 0" class="w-full">
                <PlayerResult :result="player" :player="playerName"/>
            </div>
        </div>
    </div>
</template>
