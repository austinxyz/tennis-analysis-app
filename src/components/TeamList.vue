<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";
import { cn } from "../lib/utils/cn";
import { Users } from "lucide-vue-next";
import { RouterLink } from 'vue-router';

interface Team {
  name: string;
  displayName: string;
  [key: string]: any;
}

const teams = ref<Team[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  
  try {
    const url = "http://localhost:8080/teams";
    const response = await axios.get(url);
    teams.value = response.data;
  } catch(error) {
    console.error("Error fetching teams:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Teams</h3>
    
    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
    </div>
    
    <div v-else class="space-y-1">
      <RouterLink 
        v-for="team in teams" 
        :key="team.name"
        :to="{ path: '/zijing/team', query: { team: team.name } }"
        class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Users class="mr-2 h-4 w-4" />
        <span>{{ team.displayName }}</span>
      </RouterLink>
      
      <div v-if="teams.length === 0" class="text-sm text-muted-foreground px-3 py-2">
        No teams found
      </div>
    </div>
  </div>
</template>
