<script setup lang="ts">
import { ref } from 'vue';
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface Winner {
    name?: string;
    utrId?: string;
    info?: string;
    [key: string]: any;
}

interface Loser {
    name?: string;
    utrId?: string;
    info?: string;
    [key: string]: any;
}

interface Match {
    name?: string;
    matchDate?: string;
    type?: string;
    winnerInfo?: Winner[];
    loserInfo?: Loser[];
    matchScore?: string;
    [key: string]: any;
}

const props = defineProps({
    matches: { type: Array as () => Match[], required: true },
    singlemode: { type: String, required: true },
    player: { type: String, required: true }
});

// Helper function to open links in a new tab
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <div v-if="matches.length > 0" class="relative overflow-x-auto rounded-md border">
        <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-muted">
                <tr>
                    <th scope="col" class="px-4 py-3 w-1/4">Match Name</th>
                    <th scope="col" class="px-4 py-3 w-1/8">Time</th>
                    <th scope="col" class="px-4 py-3 w-1/4">Winner</th>
                    <th scope="col" class="px-4 py-3 w-1/4">Loser</th>
                    <th scope="col" class="px-4 py-3 w-1/8">Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(match, index) in matches" :key="index" 
                    v-show="(singlemode === 'all') || (singlemode === match.type)"
                    class="border-b hover:bg-muted/50"
                >
                    <td class="px-4 py-3">{{ match.name }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">{{ match.matchDate }}</td>
                    <td class="px-4 py-3">
                        <div class="flex flex-wrap gap-1">
                            <div v-for="(winner, wIndex) in match.winnerInfo" :key="wIndex" class="inline-flex">
                                <Button 
                                    v-if="player === winner.name"
                                    variant="default" 
                                    size="sm"
                                    class="text-xs"
                                    @click="openInNewTab('/utr/player?utr=' + winner.utrId)"
                                >
                                    {{ winner.info }}
                                </Button>
                                <Button 
                                    v-else
                                    variant="outline" 
                                    size="sm"
                                    class="text-xs"
                                    @click="openInNewTab('/utr/player?utr=' + winner.utrId)"
                                >
                                    {{ winner.info }}
                                </Button>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="flex flex-wrap gap-1">
                            <div v-for="(loser, lIndex) in match.loserInfo" :key="lIndex" class="inline-flex">
                                <Button 
                                    v-if="player === loser.name"
                                    variant="secondary" 
                                    size="sm"
                                    class="text-xs"
                                    @click="openInNewTab('/utr/player?utr=' + loser.utrId)"
                                >
                                    {{ loser.info }}
                                </Button>
                                <Button 
                                    v-else
                                    variant="outline" 
                                    size="sm"
                                    class="text-xs"
                                    @click="openInNewTab('/utr/player?utr=' + loser.utrId)"
                                >
                                    {{ loser.info }}
                                </Button>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3 font-medium">{{ match.matchScore }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else class="text-center py-8 text-muted-foreground">
        No match results found!
    </div>
</template>
