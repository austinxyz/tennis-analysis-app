<script>
import axios from "axios";

export default {

    mounted() {
        //this.utrId = this.player.utrId;
        //this.ustaId = this.player.ustaId;
        //this.ustaNorcalId = this.player.ustaNorcalId;
        //this.summary = this.player.summary;
        //this.memo = this.player.memo;
        //this.lefty = this.player.lefty;
    },

    props: {
        player: { type: Object},
    },

    emits: ['update:player', 'change'],

    watch: {
        player(newPlayer, oldPlayer) {
            this.utrId = newPlayer.utrId;
            this.ustaId = newPlayer.ustaId;
            this.ustaNorcalId = newPlayer.ustaNorcalId;
            this.ustaRating = newPlayer.ustaRating;
            this.dutr = newPlayer.dutr;
            this.summary = newPlayer.summary;
            this.memo = newPlayer.memo;
            this.lefty = newPlayer.lefty;
        }
    },

    methods: {
        openPlayer() {
            this.showModal = true;
        },

        async updateUTR() {
            var url = "http://localhost:8080/players/utr/" + this.player.utrId + "?action=updateUTRValue"
                + "&dutr=" + this.dutr + "&sutr=" + this.sutr;

            const res = await axios.get(url);

            this.$emit('update:player', res.data);
            this.$emit('change', res.data);
            this.showModal = false;
        },

        async savePlayer() {
            const res = await axios.put('http://localhost:8080/players/' + this.player.id,
                {
                   utrId: this.utrId,
                   ustaId: this.ustaId,
                   ustaNorcalId: this.ustaNorcalId,
                   ustaRating: this.ustaRating,
                   summary: this.summary,
                   memo: this.memo,
                   lefty: this.lefty
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

    data() {
        return {
            utrId: this.player.utrId,
            ustaId: this.player.ustaId,
            ustaNorcalId: this.player.ustaNorcalId,
            ustaRating: this.player.ustaRating,
            dutr: this.player.dutr,
            sutr: this.player.sutr,
            summary: this.player.summary,
            memo: this.player.memo,
            lefty: this.player.lefty,
            showModal: false,
        }
    },
};
</script>

<template>
    <div>
    <div>
        <a x-data="{ tooltip: 'Edite' }" href="#" @click="openPlayer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
            x-tooltip="tooltip"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </a>
    </div>
    <Modal v-model="showModal" :title="player.name">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-200 h-100">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="utrid">
                UTR ID
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="utrId" v-model="utrId" >
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="ustaid">
                USTA ID
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="ustaId" v-model="ustaId">
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="ustaid">
                USTA NORCAL ID
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="ustaNorcalId" v-model="ustaNorcalId">
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="ustarating">
                USTA Rating
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="ustaRating" v-model="ustaRating">
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="ustaid">
                Lefty
                </label>
                <input type="radio" v-model="lefty" value="true" /> <span class="px-2 text-sm"> Yes</span>
                <input type="radio" v-model="lefty" value="false" /> <span class="px-2 text-sm"> No</span>
            </div>
            <div class="mb-6">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Summary</label>
                <textarea id="message" v-model="summary" rows="10" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    ></textarea>
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="savePlayer">
                Save
              </button>
            </div>
            <div class="mb-6 flex py-2 content-center ">
              <label class="block text-gray-700 text-sm font-bold mb-2 pr-2" for="dutr">
                DUTR
              </label>
              <input class="border-b-2 border-gray-300" type="text" id="dutr" v-model="dutr"/>
              <label class="block text-gray-700 text-sm font-bold mb-2 pr-2" for="sutr">
                SUTR
              </label>
              <input class="border-b-2 border-gray-300" type="text" id="sutr" v-model="sutr"/>
            </div>
             <div class="flex items-center justify-between">
               <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="updateUTR">
                 Update UTR
               </button>
             </div>
          </form>
    </Modal>
    </div>
</template>
