<script setup lang="ts">
interface Player {
  id: string;
  name: string;
  gender: string;
  utr: number;
  dUTR: number;
  dUTRStatus: string;
  [key: string]: any;
}

defineProps({
  teamName: { 
    type: String,
    required: true
  },
  teamUTR: { 
    type: Number,
    required: true
  },
  players: { 
    type: Array as () => Player[],
    required: true
  },
});
</script>

<template>
  <div class="relative overflow-x-auto rounded-md border">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-muted/50 border-b">
          <th class="px-4 py-2 text-left font-medium">#</th>
          <th class="px-4 py-2 text-left font-medium">Name</th>
          <th class="px-4 py-2 text-left font-medium">Gender</th>
          <th class="px-4 py-2 text-left font-medium">UTR</th>
          <th class="px-4 py-2 text-left font-medium">Latest UTR</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(player, index) in players" 
          :key="player.id"
          class="border-b hover:bg-muted/50 transition-colors"
        >
          <td class="px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
          <td class="px-4 py-2 whitespace-nowrap">
            <a 
              :href="`https://app.universaltennis.com/profiles/${player.id}`" 
              class="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ player.name }}
            </a>
          </td>
          <td class="px-4 py-2 whitespace-nowrap">{{ player.gender }}</td>
          <td class="px-4 py-2 whitespace-nowrap">{{ player.utr }}</td>
          <td class="px-4 py-2 whitespace-nowrap">
            {{ player.dUTR }} 
            <span class="text-xs text-muted-foreground">({{ player.dUTRStatus }})</span>
          </td>
        </tr>
        
        <tr v-if="players.length === 0">
          <td colspan="5" class="px-4 py-4 text-center text-muted-foreground">
            No players found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
