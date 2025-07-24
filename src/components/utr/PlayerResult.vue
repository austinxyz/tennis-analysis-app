<script setup lang="ts">
import { ref } from 'vue';
import MatchResults from "./MatchResults.vue";
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import Badge from "../ui/badge.vue";
import Button from "../ui/button.vue";

interface Player {
    name?: string;
    gender?: string;
    sUTR?: number;
    dUTR?: number;
    sUTRStatus?: string;
    dUTRStatus?: string;
    [key: string]: any;
}

interface Event {
    id?: string | number;
    name?: string;
    usta?: boolean;
    results?: any[];
    [key: string]: any;
}

interface Result {
    player?: Player;
    winsNumber?: number;
    lossesNumber?: number;
    playerEvents?: Event[];
    [key: string]: any;
}

const props = defineProps({
    result: { type: Object as () => Result, required: true },
    player: { type: String, required: false }
});

const ustamode = ref('true');
const singlemode = ref('all');

// Helper function to open links in a new tab
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <div v-if="result.player" class="w-full">
        <Card class="mb-4">
            <CardHeader>
                <CardTitle v-if="player" class="text-xl">
                    Player: {{ player }}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div v-if="player" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-muted-foreground">Gender</span>
                        <span>{{ result.player.gender }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-muted-foreground">Win/Loss</span>
                        <div class="flex items-center">
                            <Badge variant="outline">
                                {{ result.winsNumber || 0 }}/{{ result.lossesNumber || 0 }}
                            </Badge>
                            <span class="ml-2">
                                {{ (((result.winsNumber || 0) / ((result.winsNumber || 0) + (result.lossesNumber || 0) || 1)) * 100).toFixed(0) }}%
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-muted-foreground">Single UTR</span>
                        <Badge variant="outline" :class="result.player.sUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                            {{ result.player.sUTR }} ({{ result.player.sUTRStatus }})
                        </Badge>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-muted-foreground">Double UTR</span>
                        <Badge variant="outline" :class="result.player.dUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                            {{ result.player.dUTR }} ({{ result.player.dUTRStatus }})
                        </Badge>
                    </div>
                </div>
                
                <div class="border-t pt-4 mb-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-2">USTA Match?:</span>
                            <div class="flex items-center space-x-2">
                                <label class="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" v-model="ustamode" value="true" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                    <span>USTA only</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" v-model="ustamode" value="false" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                    <span>All</span>
                                </label>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-muted-foreground mr-2">Single or Double:</span>
                            <div class="flex items-center space-x-2">
                                <label class="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" v-model="singlemode" value="all" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                    <span>All</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" v-model="singlemode" value="single" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                    <span>Single</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" v-model="singlemode" value="double" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                    <span>Double</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div v-for="(event, index) in result.playerEvents" :key="index" class="mb-4">
            <div v-if="(ustamode === 'true' && event.usta) || (ustamode === 'false')">
                <div class="flex items-center mb-2 px-4">
                    <Button 
                        v-if="!event.usta" 
                        variant="link" 
                        class="p-0 h-auto text-primary"
                        @click="openInNewTab('/utr/event?event=' + event.id)"
                    >
                        {{ event.name }}
                    </Button>
                    <span v-else class="font-medium">{{ event.name }}</span>
                </div>
                <MatchResults :matches="event.results || []" :singlemode="singlemode || 'all'" :player="result.player?.name || ''"/>
            </div>
        </div>
    </div>
</template>
