<script setup lang="ts">
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScoreView from "./LineScoreView.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface Score {
    matchDate?: string;
    lineName?: string;
    homeTeamName?: string;
    guestTeamName?: string;
    homePlayer1?: any;
    homePlayer2?: any;
    guestPlayer1?: any;
    guestPlayer2?: any;
    homeTeamWin?: boolean;
    matchType?: string;
    score?: string;
    comment?: string;
    videoLink?: string;
    [key: string]: any;
}

const props = defineProps({
    scores: { type: Array as () => Score[], required: true }
});

// Helper function to open links in a new tab
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <div v-if="scores.length > 0">
        <div class="grid grid-cols-1 gap-4">
            <div v-for="(memberScore, index) in scores" :key="index" class="border rounded-md p-4 hover:bg-muted/10">
                <div class="flex flex-col space-y-3">
                    <!-- Header with date, line, and actions -->
                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-2">
                            <span class="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {{ index + 1 }}
                            </span>
                            <span class="font-medium">{{ memberScore.matchDate }}</span>
                            <Badge variant="outline">{{ memberScore.lineName }}</Badge>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div v-if="memberScore.comment">
                                <LineScoreView :comment="memberScore.comment" />
                            </div>
                            <div v-if="memberScore.videoLink">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    class="h-8 w-8" 
                                    @click="openInNewTab(memberScore.videoLink)"
                                    title="Watch Video"
                                >
                                    <img src="/play-button.png" width="24" height="24" alt="Play" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Match details -->
                    <div class="grid grid-cols-1 md:grid-cols-10 gap-4">
                        <!-- Home team -->
                        <div class="md:col-span-4 border-r pr-4">
                            <div class="text-sm font-medium text-muted-foreground mb-1">Home Team</div>
                            <div class="font-medium mb-2">{{ memberScore.homeTeamName }}</div>
                            <div class="bg-muted/20 p-3 rounded-md">
                                <LinePlayerInfo 
                                    :player1="memberScore.homePlayer1" 
                                    :player2="memberScore.homePlayer2" 
                                    :winner="memberScore.homeTeamWin" 
                                    :matchType="memberScore.matchType" 
                                />
                            </div>
                        </div>
                        
                        <!-- Visitor team -->
                        <div class="md:col-span-4 border-r pr-4">
                            <div class="text-sm font-medium text-muted-foreground mb-1">Visitor Team</div>
                            <div class="font-medium mb-2">{{ memberScore.guestTeamName }}</div>
                            <div class="bg-muted/20 p-3 rounded-md">
                                <LinePlayerInfo 
                                    :player1="memberScore.guestPlayer1" 
                                    :player2="memberScore.guestPlayer2" 
                                    :winner="!memberScore.homeTeamWin" 
                                    :matchType="memberScore.matchType" 
                                />
                            </div>
                        </div>
                        
                        <!-- Score -->
                        <div class="md:col-span-2 flex flex-col justify-center items-center">
                            <div class="text-sm font-medium text-muted-foreground mb-1">Score</div>
                            <div class="text-lg font-bold">{{ memberScore.score }}</div>
                            <Badge class="mt-2" :variant="memberScore.homeTeamWin ? 'default' : 'secondary'">
                                {{ memberScore.homeTeamWin ? 'Home Win' : 'Visitor Win' }}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="text-center py-8 text-muted-foreground">
        No match scores found!
    </div>
</template>
