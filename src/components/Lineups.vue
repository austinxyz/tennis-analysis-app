<script setup lang="ts">
import { ref, watch } from 'vue';
import Card from "./ui/card.vue";
import CardHeader from "./ui/card-header.vue";
import CardTitle from "./ui/card-title.vue";
import CardContent from "./ui/card-content.vue";
import { ListChecks } from "lucide-vue-next";

interface Pair {
  pairInfo: string;
  totalUTR: number;
  [key: string]: any;
}

interface LineupItem {
  pair: Pair;
  [key: string]: any;
}

interface Lineup {
  D1: LineupItem;
  D2: LineupItem;
  D3: LineupItem;
  WD: LineupItem;
  MD: LineupItem;
  [key: string]: any;
}

const props = defineProps({
  lineups: { 
    type: Array as () => Lineup[],
    default: () => []
  },
  lineup: {
    type: Object as () => Lineup,
    required: true
  },
});

const emit = defineEmits(['update:lineup', 'change']);

const lineupIndex = ref(0);

watch(() => props.lineups, (newLineups) => {
  if (newLineups.length > 0) {
    lineupIndex.value = 0;
  }
}, { immediate: true });

const onChange = (index: number) => {
  lineupIndex.value = index;
  const selectedLineup = props.lineups[index];
  emit('update:lineup', selectedLineup);
  emit('change', selectedLineup);
};
</script>

<template>
  <Card v-if="lineups.length > 0" class="mt-6">
    <CardHeader>
      <CardTitle class="flex items-center text-base">
        <ListChecks class="mr-2 h-4 w-4" />
        Available Lineups
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="relative overflow-x-auto rounded-md border">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muted/50 border-b">
              <th class="px-4 py-2 text-left font-medium">#</th>
              <th class="px-4 py-2 text-left font-medium">D1</th>
              <th class="px-4 py-2 text-left font-medium">D2</th>
              <th class="px-4 py-2 text-left font-medium">D3</th>
              <th class="px-4 py-2 text-left font-medium">MD</th>
              <th class="px-4 py-2 text-left font-medium">WD</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(lineup, index) in lineups" 
              :key="index"
              class="border-b hover:bg-muted/50 transition-colors"
              :class="{ 'bg-muted/30': lineupIndex === index }"
            >
              <td class="px-4 py-2 whitespace-nowrap">
                <input 
                  type="radio" 
                  :value="index" 
                  :checked="lineupIndex === index"
                  @change="onChange(index)"
                  class="h-4 w-4 text-primary border-primary focus:ring-primary"
                />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">{{ lineup.D1.pair.pairInfo }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ lineup.D2.pair.pairInfo }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ lineup.D3.pair.pairInfo }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ lineup.MD.pair.pairInfo }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ lineup.WD.pair.pairInfo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
