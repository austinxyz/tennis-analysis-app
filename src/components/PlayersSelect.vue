<script setup lang="ts">
import { computed } from 'vue';
import Select from "./ui/select.vue";

interface Player {
  id?: string;
  name: string;
  gender?: string;
  utr?: number;
  label?: string;
  [key: string]: any;
}

const props = defineProps({
  players: { 
    type: Array as () => Player[],
    required: true
  },
  lineName: { 
    type: String,
    required: true
  },
  player1: {
    type: String,
    default: ''
  },
  player2: {
    type: String,
    default: ''
  },
});

const emit = defineEmits(['update:player1', 'update:player2']);

const player1Object = computed(() => {
  return props.players.find(p => p.name === props.player1) || undefined;
});

const player2Object = computed(() => {
  return props.players.find(p => p.name === props.player2) || undefined;
});

const setPlayer1 = (value: Player) => {
  if (value) {
    emit('update:player1', value.name);
  } else {
    emit('update:player1', '');
  }
};

const setPlayer2 = (value: Player) => {
  if (value) {
    emit('update:player2', value.name);
  } else {
    emit('update:player2', '');
  }
};
</script>

<template>
  <div class="border rounded-md p-3">
    <div class="text-sm font-medium mb-3">{{ lineName }} Line</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="text-xs font-medium mb-1 block text-muted-foreground">
          {{ lineName }} Player 1
        </label>
        <Select
          :options="players"
          :modelValue="player1Object"
          labelKey="label"
          @option:selected="setPlayer1"
          placeholder="Select player 1"
        />
      </div>
      <div>
        <label class="text-xs font-medium mb-1 block text-muted-foreground">
          {{ lineName }} Player 2
        </label>
        <Select
          :options="players"
          :modelValue="player2Object"
          labelKey="label"
          @option:selected="setPlayer2"
          placeholder="Select player 2"
        />
      </div>
    </div>
  </div>
</template>
