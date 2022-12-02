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

    data() {
        return {
            d_player2: '',
            d_player1: '',
        };
    },

    methods: {
        setPlayer1(value) {
            this.$emit('update:player1', this.d_player1);
        },
        setPlayer2(value) {
            this.$emit('update:player2', this.d_player2);
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
            v-model="d_player1"
            :reduce="(option) => option.name"
            :options="players"
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
          v-model="d_player2"
          :reduce="(option) => option.name"
          :options="players"
          @option:selected="setPlayer2"
         >
         </v-select>
      </div>
    </div>
  </div>
</template>

