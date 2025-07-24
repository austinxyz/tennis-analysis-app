<script setup lang="ts">
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Badge from "../ui/badge.vue";

interface Player {
    name: string;
    sUTR: number;
    dUTR: number;
    sUTRStatus: string;
    dUTRStatus: string;
    [key: string]: any;
}

defineProps<{
    player1: Player;
    player2: Player;
}>();
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Player 1 Card -->
        <Card class="w-full md:w-1/2">
            <CardHeader class="bg-background">
                <CardTitle>{{ player1.name }}</CardTitle>
            </CardHeader>
            <CardContent class="pt-6">
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Single UTR:</span>
                        <div class="flex items-center">
                            <img 
                                v-if="player1.sUTR > player2.sUTR" 
                                src="/cert.svg" 
                                alt="Win" 
                                class="h-5 w-5 mr-2"
                            />
                            <Badge variant="outline" :class="player1.sUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                {{ player1.sUTR }} ({{ player1.sUTRStatus }})
                            </Badge>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Double UTR:</span>
                        <div class="flex items-center">
                            <img 
                                v-if="player1.dUTR > player2.dUTR" 
                                src="/cert.svg" 
                                alt="Win" 
                                class="h-5 w-5 mr-2"
                            />
                            <Badge variant="outline" :class="player1.dUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                {{ player1.dUTR }} ({{ player1.dUTRStatus }})
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <!-- Player 2 Card -->
        <Card class="w-full md:w-1/2">
            <CardHeader class="bg-muted">
                <CardTitle>{{ player2.name }}</CardTitle>
            </CardHeader>
            <CardContent class="pt-6 bg-muted">
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Single UTR:</span>
                        <div class="flex items-center">
                            <img 
                                v-if="player2.sUTR > player1.sUTR" 
                                src="/cert.svg" 
                                alt="Win" 
                                class="h-5 w-5 mr-2"
                            />
                            <Badge variant="outline" :class="player2.sUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                {{ player2.sUTR }} ({{ player2.sUTRStatus }})
                            </Badge>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Double UTR:</span>
                        <div class="flex items-center">
                            <img 
                                v-if="player2.dUTR > player1.dUTR" 
                                src="/cert.svg" 
                                alt="Win" 
                                class="h-5 w-5 mr-2"
                            />
                            <Badge variant="outline" :class="player2.dUTRStatus === 'Rated' ? 'font-semibold' : 'text-muted-foreground'">
                                {{ player2.dUTR }} ({{ player2.dUTRStatus }})
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
