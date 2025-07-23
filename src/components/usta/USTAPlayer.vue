<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import axios from "axios";
import USTAPlayerInfo from './USTAPlayerInfo.vue';
import USTAPlayerTeams from './USTAPlayerTeams.vue';
import USTAPlayerMatches from './USTAPlayerMatches.vue';
import PlayerResult from "../utr/PlayerResult.vue";
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import { cn } from "../../lib/utils/cn";

interface Player {
    id?: string | number;
    utrId?: string;
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    player: { type: Object as () => Player, required: true }
});

const emit = defineEmits(['update:player', 'change']);

const loading = ref(false);
const tab = ref('teams');
const teams = ref([]);
const team = ref({});
const currPlayer = ref<Player>({});
const scores = ref([]);
const playerresult = ref([]);

onMounted(async () => {
    if (currPlayer.value.id && props.player.id === currPlayer.value.id) {
        return;
    }

    if (!props.player?.utrId) {
        return;
    }

    try {
        const url = getBaseURL() + "/playerresult?id=" + props.player.utrId;
        const response = await axios.get(url);
        playerresult.value = response.data;
        tab.value = 'utrmatches';
    } catch (error) {
        console.error("Error fetching player result:", error);
    }
});

watch(() => props.player, (newPlayer) => {
    teams.value = [];
    team.value = {};
    currPlayer.value = newPlayer;
    scores.value = [];
    playerresult.value = [];

    if (tab.value === 'teams') {
        showTeams(newPlayer);
    }

    if (tab.value === 'matches') {
        showMatches(newPlayer);
    }

    if (tab.value === 'utrmatches') {
        showUTRMatches(newPlayer);
    }
}, { deep: true });

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const refreshPlayer = (player: Player) => {
    emit('update:player', player);
    emit('change', player);
};

const showTeams = async (player: Player) => {
    loading.value = true;
    tab.value = 'teams';

    if (!player.id) {
        loading.value = false;
        return;
    }

    if (player.id !== currPlayer.value.id) {
        teams.value = [];
        currPlayer.value = player;
    }

    if (teams.value.length > 0) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/players/" + player.id + "/teams";
        const response = await axios.get(url);
        teams.value = response.data;
    } catch (error) {
        console.error("Error fetching teams:", error);
    } finally {
        loading.value = false;
    }
};

const showMatches = async (player: Player) => {
    loading.value = true;
    tab.value = 'matches';

    if (!player.id) {
        loading.value = false;
        return;
    }

    if (player.id !== currPlayer.value.id) {
        scores.value = [];
        currPlayer.value = player;
    }

    if (scores.value.length > 0) {
        loading.value = false;
        return;
    }

    try {
        const url = getBaseURL() + "/usta/players/" + player.id + "/scores";
        const response = await axios.get(url);
        scores.value = response.data;
    } catch (error) {
        console.error("Error fetching scores:", error);
    } finally {
        loading.value = false;
    }
};

const refreshScores = async () => {
    loading.value = true;

    try {
        const url = getBaseURL() + "/usta/players/" + props.player.id + "/scores";
        const response = await axios.get(url);
        scores.value = response.data;
    } catch (error) {
        console.error("Error refreshing scores:", error);
    } finally {
        loading.value = false;
    }
};

const showUTRMatches = async (player: Player) => {
    loading.value = true;
    tab.value = 'utrmatches';

    if (!player.id) {
        loading.value = false;
        return;
    }

    if (player.id !== currPlayer.value.id) {
        playerresult.value = [];
        currPlayer.value = player;
    }

    try {
        const url = getBaseURL() + "/playerresult/?id=" + player.utrId;
        const response = await axios.get(url);
        playerresult.value = response.data;
    } catch (error) {
        console.error("Error fetching UTR matches:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div v-if="player.id" class="w-full">
        <Card class="mb-4">
            <CardContent class="pt-6">
                <USTAPlayerInfo :player="player" @change="refreshPlayer" />
            </CardContent>
        </Card>

        <Card>
            <div class="border-b px-4">
                <div class="flex flex-wrap -mb-px">
                    <Button 
                        variant="ghost" 
                        :class="cn(
                            'relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
                            tab === 'teams' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                        )"
                        @click="showTeams(player)"
                    >
                        USTA Teams
                    </Button>
                    <Button 
                        variant="ghost" 
                        :class="cn(
                            'relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
                            tab === 'matches' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                        )"
                        @click="showMatches(player)"
                    >
                        USTA Matches
                    </Button>
                    <Button 
                        variant="ghost" 
                        :class="cn(
                            'relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
                            tab === 'utrmatches' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                        )"
                        @click="showUTRMatches(player)"
                    >
                        UTR Matches
                    </Button>
                </div>
            </div>

            <CardContent>
                <div v-if="loading" class="flex justify-center py-4">
                    <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
                </div>
                
                <div v-else-if="tab === 'teams'" class="p-2">
                    <USTAPlayerTeams :teammembers="teams" />
                </div>
                
                <div v-else-if="tab === 'matches'" class="p-2">
                    <USTAPlayerMatches :scores="scores" />
                </div>
                
                <div v-else-if="tab === 'utrmatches'" class="p-2">
                    <PlayerResult :result="playerresult" />
                </div>
            </CardContent>
        </Card>
    </div>
</template>
