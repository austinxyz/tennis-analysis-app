<script>

export default {

    data() {
        return {
            showModal: false,
            utrId: "",
        };
    },

    props: {
        player: { type: Object},
    },

    methods: {
        openPlayer() {

            this.showModal = true;

        },
    },
};
</script>

<template>
    <a href="#"
            class="underline"
            @click="openPlayer"
    >
     Edit
    </a>
    <Modal v-model="showModal" :title="player.name" baseZindex=1500>
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            UTR ID
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="utrId" type="text" :value="player.utrId">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            USTA ID
          </label>
          <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="ustaId" type="text" :value="player.ustaId">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Save
          </button>
        </div>
      </form>
    </Modal>
</template>
