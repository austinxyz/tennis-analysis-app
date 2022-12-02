<script>
import 'vue-select/dist/vue-select.css';

export default {
    props: {
        players: { type: Array},
        lineName: { type: String},
        player1: {type: String},
        player2: {type: String},
    },

    emits: ['update:player1','update:player2'],

    methods: {
        setPlayer1(value) {
            this.$emit('update:player1', value.name);
        },
        setPlayer2(value) {
            this.$emit('update:player2', value.name);
        },
    },
};
</script>

<template>
  <div class="md:flex">
    <div class="md:w-1/2 mb-2 md:mb-0">
      <label class="block tracking-wide text-grey-darker text-xs font-bold mb-2">
        {{lineName}} Player 1
      </label>
      <div class="block tracking-wide  text-grey-darker text-xs font-bold mb-2">
        <v-select label="label"
            :reduce="(option) => option.name"
            :options="players"
            :value="player1"
            @option:selected="setPlayer1"
           ></v-select>
      </div>
    </div>
    <div class="md:w-1/2 px-3">
      <label class="block tracking-wide text-grey-darker text-xs font-bold mb-2">
        {{lineName}}  Player 2
      </label>
      <div class="block tracking-wide text-grey-darker text-xs font-bold mb-2">
        <v-select label="label"
          :reduce="(option) => option.name"
          :options="players"
          :value="player2"
          @option:selected="setPlayer2"
         >
         </v-select>
      </div>
    </div>
  </div>
</template>

