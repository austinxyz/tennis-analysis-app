<script>
import axios from "axios";

export default {

    data() {
        return {
            showModal: false,
        };
    },

    props: {
        player: { type: Object},
        utrId: {type: String},
        ustaId: {type: String},
    },

    emits: ['update:utrId', "update:ustaId", "update:player", "change"],

    methods: {
        openPlayer() {
            this.showModal = true;
        },

        async savePlayer() {
            const res = await axios.put('http://localhost:8080/players/' + this.player.id,
                {
                   utrId: this.utrId,
                   ustaId: this.ustaId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            this.$emit('update:player', res.data);
            this.$emit('change', res.data);
            this.showModal = false;
        }
    },
};
</script>

<template>
    <div>
      <button type="button" @click="openPlayer">
        <img src="/icons8-pencil-30.png" width="30" height="25" alt="Edit"/>
      </button>
    </div>
    <Modal v-model="showModal" :title="player.name">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                UTR ID
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="utrId" :value="utrId" @input="$emit('update:utrId', $event.target.value)">
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                USTA ID
              </label>
              <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="ustaId" :value="ustaId" @input="$emit('update:ustaId', $event.target.value)">
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="savePlayer">
                Save
              </button>
            </div>
          </form>
    </Modal>
</template>
