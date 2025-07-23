<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import USTAPlayer from "./USTAPlayer.vue";
import USTATeamInfo from "./USTATeamInfo.vue";
import USTATeamMemberList from "./USTATeamMemberList.vue";
import USTATeamMatches from "./USTATeamMatches.vue";
import USTATeamLinesStat from "./USTATeamLinesStat.vue";
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";
import { cn } from "../../lib/utils/cn";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    team: { type: Object, required: true }
});

const emit = defineEmits(['update:team']);

const loading = ref(false);
interface Player {
    id?: string | number;
    [key: string]: any;
}

const currentPlayer = ref<Player>({});
const matches = ref([]);
const tab = ref('players');
const currentTeamId = ref('');

watch(() => props.team, (newTeam, oldTeam) => {
    if (newTeam == null || newTeam.id == null) {
        return;
    }
    if (newTeam.id != oldTeam?.id) {
        currentPlayer.value = {};
        matches.value = [];
    }
    if (tab.value == 'matches') {
        showMatches(newTeam);
    }
}, { deep: true });

const teamRefresh = (team) => {
    emit('update:team', team);
};

const changeTeam = (team) => {
    loading.value = true;
    emit('update:team', team);
    currentPlayer.value = {};
    loading.value = false;
};

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const refreshPlayer = async (player) => {
    console.log("Refreshing player in USTATeam:", player);
    loading.value = true;
    try {
        // First update the team data
        const teamUrl = getBaseURL() + "/usta/teams/" + props.team.id;
        const teamResponse = await axios.get(teamUrl);
        emit('update:team', teamResponse.data);
        
        // Then set the current player
        currentPlayer.value = player;
        console.log("Current player set:", currentPlayer.value);
    } catch(error) {
        console.error("Error refreshing player:", error);
    } finally {
        loading.value = false;
    }
};

const showPlayers = (team) => {
    tab.value = 'players';
    if (team.id == null || team.id == '') {
        return;
    }
    if (team.id != props.team.id) {
        currentPlayer.value = {};
    }
};

const showMatches = async (team) => {
    loading.value = true;
    tab.value = 'matches';
    if (team.id == null || team.id == '') {
        loading.value = false;
        return;
    }
    if (team.id != currentTeamId.value) {
        matches.value = [];
        currentPlayer.value = {};
        currentTeamId.value = team.id;
    }
    if (matches.value.length > 0) {
        loading.value = false;
        return;
    }
    var url = getBaseURL() + "/usta/teams/" + team.id + "/matches";
    try {
        const response = await axios.get(url);
        matches.value = response.data;
    } catch(error) {
        console.error("Error fetching matches:", error);
    }
    loading.value = false;
};

const showLines = async (team) => {
    loading.value = true;
    tab.value = 'lines';
    if (team.id == null || team.id == '') {
        loading.value = false;
        return;
    }
    if (team.id != currentTeamId.value) {
        matches.value = [];
        currentPlayer.value = {};
        currentTeamId.value = team.id;
    } else {
        if (team.doubleLineStats != null && team.doubleLineStats.D1 != null) {
            loading.value = false;
            return;
        }
    }
    var url = getBaseURL() + "/usta/teams/" + team.id + "/lineStat";
    try {
        const response = await axios.get(url);
        emit('update:team', response.data);
    } catch(error) {
        console.error("Error fetching line stats:", error);
    }
    loading.value = false;
};

const updateTeamMembers = (updatedMembers) => {
    // Create a new team object with the updated members
    const updatedTeam = {
        ...props.team,
        players: updatedMembers
    };
    
    // Emit the updated team
    emit('update:team', updatedTeam);
};
</script>

<template>
    <div v-if="team.id" class="w-full">
        <Card class="mb-4">
            <CardContent class="pt-6">
                <USTATeamInfo :team="team" @change="teamRefresh" />
            </CardContent>
        </Card>

        <Card>
            <div class="border-b px-4">
                <div class="flex flex-wrap -mb-px">
                    <Button 
                        variant="ghost" 
                        :class="cn(
                            'relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
                            tab === 'players' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                        )"
                        @click="showPlayers(team)"
                    >
                        Players
                    </Button>
                    <Button 
                        variant="ghost" 
                        :class="cn(
                            'relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
                            tab === 'matches' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                        )"
                        @click="showMatches(team)"
                    >
                        Matches
                    </Button>
                    <Button 
                        variant="ghost" 
                        :class="cn(
                            'relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
                            tab === 'lines' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                        )"
                        @click="showLines(team)"
                    >
                        Lines
                    </Button>
                </div>
            </div>

            <CardContent>
                <div v-if="loading" class="flex justify-center py-4">
                    <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
                </div>
                
                <div v-else-if="tab === 'players'" class="p-2">
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="w-full md:w-1/2">
                            <USTATeamMemberList 
                                v-if="team.players" 
                                :members="team.players" 
                                v-model:currentPlayer="currentPlayer" 
                                @update:members="updateTeamMembers"
                                @changePlayer="refreshPlayer"
                                showMode="parent"
                            />
                        </div>
                        
                        <div v-if="currentPlayer.id" class="w-full md:w-1/2">
                            <Card>
                                <CardContent class="pt-6">
                                    <USTAPlayer :player="currentPlayer" @change="refreshPlayer"/>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div v-else class="w-full md:w-1/2 flex items-center justify-center">
                            <div class="text-center p-8 text-muted-foreground border rounded-md bg-muted/10">
                                <p>Select a player from the list to view details</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-else-if="tab === 'matches'" class="p-2">
                    <USTATeamMatches :team="team" v-model:matches="matches" @change="changeTeam" />
                </div>
                
                <div v-else-if="tab === 'lines'" class="p-2">
                    <USTATeamLinesStat :team="team"/>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
