<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import Division from "./Division.vue";
import Card from "../ui/card.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import CardContent from "../ui/card-content.vue";
import Button from "../ui/button.vue";

interface Team {
    name: string;
    displayName?: string;
    players: any[];
    [key: string]: any;
}

interface Event {
    name: string;
    divisions: Team[];
    [key: string]: any;
}

const route = useRoute();
const event = ref<Event>({} as Event);
const eventId = ref('');
const team = ref<Team>({} as Team);
const loading = ref(false);

const selectTeam = (selectedTeam: Team) => {
    team.value = selectedTeam;
};

onMounted(() => {
    let id = route.query.event as string;
    
    if (!id) {
        id = "123233"; // Default event ID
    }
    
    eventId.value = id;
    loading.value = true;
    
    axios.get("http://localhost:8080/event/" + id)
        .then(response => {
            event.value = response.data;
            if (event.value.divisions && event.value.divisions.length > 0) {
                team.value = event.value.divisions[0];
            }
        })
        .catch(error => {
            console.error("Error fetching event:", error);
        })
        .finally(() => {
            loading.value = false;
        });
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <div v-if="loading" class="flex justify-center py-4 w-full">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        
        <div v-else class="flex flex-col md:flex-row gap-6 w-full">
            <!-- Event Card -->
            <Card class="w-full md:w-96">
                <CardHeader>
                    <CardTitle>{{ event.name || 'Event' }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="space-y-1">
                        <h3 class="text-sm font-medium">Teams</h3>
                        <ul class="space-y-1">
                            <li v-for="(divTeam, index) in event.divisions" :key="index">
                                <Button 
                                    variant="ghost" 
                                    class="w-full justify-start text-left h-auto py-1.5"
                                    @click="selectTeam(divTeam)"
                                >
                                    <span class="truncate">
                                        {{ divTeam.displayName || divTeam.name }}
                                    </span>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
            
            <!-- Team Details -->
            <div v-if="team.name" class="flex-1">
                <Division :team="team" />
            </div>
        </div>
    </div>
</template>
