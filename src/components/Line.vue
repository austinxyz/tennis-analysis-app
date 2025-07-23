<script setup lang="ts">
interface Pair {
  pairInfo: string;
  [key: string]: any;
}

defineProps({
  lineName: {
    type: String,
    required: true
  },
  pairs: {
    type: Array as () => Pair[],
    required: true
  },
});
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold mb-3">{{ lineName }} Top Pairs</h3>
    
    <div class="relative overflow-x-auto rounded-md border">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-muted/50 border-b">
            <th class="px-4 py-2 text-left font-medium">#</th>
            <th class="px-4 py-2 text-left font-medium">Pairs</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(pair, index) in pairs" 
            :key="index"
            class="border-b hover:bg-muted/50 transition-colors"
          >
            <td class="px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ pair.pairInfo }}</td>
          </tr>
          
          <tr v-if="pairs.length === 0">
            <td colspan="2" class="px-4 py-4 text-center text-muted-foreground">
              No pairs found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
