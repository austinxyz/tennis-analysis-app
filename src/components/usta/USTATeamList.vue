<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
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
    name?: string;
    alias?: string;
    areaCode?: string;
    flight?: string;
    captainName?: string;
    captain?: {
        ustaNorcalId?: string;
    };
    teamRating?: number;
    tennisRecordLink?: string;
    [key: string]: any;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    teams: { type: Array as () => Team[], required: true },
    team: { type: Object as () => Team, required: false }
});

const emit = defineEmits(['update:team']);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const getTeam = async (team: Team) => {
    if (!team.id) return;
    
    try {
        const url = getBaseURL() + "/usta/teams/" + team.id;
        const res = await axios.get(url);
        emit('update:team', res.data);
    } catch (error) {
        console.error("Error fetching team:", error);
    }
};

// Helper function to open links in a new tab
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <Table v-if="teams.length > 0" class="max-w-3xl mx-auto">
        <TableHeader class="text-xs uppercase bg-muted">
            <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(team, index) in teams" :key="index">
                <TableCell>{{ index + 1 }}</TableCell>
                <TableCell>
                    <Button 
                        variant="link" 
                        class="p-0 h-auto text-primary"
                        @click="getTeam(team)"
                    >
                        <span v-if="team.alias" class="text-muted-foreground">[{{ team.alias }}]</span>
                        {{ team.name }}
                    </Button>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">
                        {{ team.areaCode }}-{{ team.flight }}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Button 
                        v-if="team.captain" 
                        variant="link" 
                        class="p-0 h-auto text-primary"
                        @click="openInNewTab('/usta/player?ustaId=' + team.captain?.ustaNorcalId)"
                    >
                        {{ team.captainName }}
                    </Button>
                </TableCell>
                <TableCell class="font-medium">
                    {{ team.teamRating?.toFixed(2) }}
                </TableCell>
                <TableCell>
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
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
    <div v-else class="text-center py-8 text-muted-foreground">
        No teams found!
    </div>
</template>
