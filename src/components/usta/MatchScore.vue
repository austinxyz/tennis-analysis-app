<script setup>
import { ref } from 'vue';
import LineScore from "./LineScore.vue";

const props = defineProps({
  match: { type: Object },
});

const emit = defineEmits(['change']);

const refreshScore = (score) => {
  emit('change', score);
};
</script>

<template>
  <div v-if="match.lines" class="w-full overflow-auto">
    <table class="w-full caption-bottom text-sm">
      <thead class="[&_tr]:border-b">
        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-primary-foreground">
            Match Type
          </th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-primary-foreground">
            <div class="flex flex-row items-center">
              <img v-if="match.homeWin" src="/cert.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>Home Team - {{ match.homeTeamName }} - {{ match.homePoint }}</span>
            </div>
          </th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-primary-foreground">
            <div class="flex flex-row items-center">
              <img v-if="!match.homeWin" src="/cert.svg" alt="Win" class="h-6 w-6 mr-2"/>
              <span>Visitor Team - {{ match.guestTeamName }} - {{ match.guestPoint }}</span>
            </div>
          </th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-primary-foreground">
            Winners Score
          </th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-primary-foreground">
            Comment
          </th>
        </tr>
      </thead>
      <tbody class="[&_tr:last-child]:border-0">
        <tr 
          v-for="lineScore in match.lines" 
          :key="lineScore.id"
          class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
        >
          <LineScore :lineScore="lineScore" @change="refreshScore"/>
        </tr>
      </tbody>
    </table>
  </div>
</template>
