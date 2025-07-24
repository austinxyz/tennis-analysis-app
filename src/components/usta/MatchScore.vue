<script setup>
import { ref } from 'vue';
import LineScore from "./LineScore.vue";
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";

const props = defineProps({
  match: { type: Object },
});

const emit = defineEmits(['change']);

const refreshScore = (score) => {
  emit('change', score);
};
</script>

<template>
  <Table v-if="match.lines">
    <TableHeader>
      <TableRow>
        <TableHead class="bg-primary-foreground">
          Match Type
        </TableHead>
        <TableHead class="bg-primary-foreground">
          <div class="flex flex-row items-center">
            <img v-if="match.homeWin" src="/cert.svg" alt="Win" class="h-6 w-6 mr-2"/>
            <span>Home Team - {{ match.homeTeamName }} - {{ match.homePoint }}</span>
          </div>
        </TableHead>
        <TableHead class="bg-primary-foreground">
          <div class="flex flex-row items-center">
            <img v-if="!match.homeWin" src="/cert.svg" alt="Win" class="h-6 w-6 mr-2"/>
            <span>Visitor Team - {{ match.guestTeamName }} - {{ match.guestPoint }}</span>
          </div>
        </TableHead>
        <TableHead class="bg-primary-foreground">
          Winners Score
        </TableHead>
        <TableHead class="bg-primary-foreground">
          Comment
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="lineScore in match.lines" 
        :key="lineScore.id"
      >
        <LineScore :lineScore="lineScore" @change="refreshScore"/>
      </TableRow>
    </TableBody>
  </Table>
</template>
