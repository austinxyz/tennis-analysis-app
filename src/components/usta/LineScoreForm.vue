<script>
import axios from "axios";
import LinePlayerInfo from "./LinePlayerInfo.vue";

export default {

    mounted() {
        this.comment = this.score.comment;
        this.videoLink = this.score.videoLink;
    },

    props: {
        score: { type: Object},
    },

    emits: ['update:score', 'change', 'update:showScoreForm'],

    watch: {
        score(newScore, oldScore) {
            this.comment = newScore.comment;
            this.videoLink = newScore.videoLink;
        }
    },

    methods: {

        async saveScoreInfo() {
            const res = await axios.put('http://localhost:8080/usta/score/' + this.score.id,
                {
                   comment: this.comment,
                   videoLink: this.videoLink,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            this.$emit('update:score', res.data);
            this.$emit('change', res.data);

            this.showModal=false;
        },

        openScoreForm() {
            this.showModal = true;
        },
    },

    data() {
        return {
            comment: '',
            videoLink: '',
            showModal: false,
        }
    },

    components: {
        LinePlayerInfo,
    }
};
</script>

<template>
    <a x-data="{ tooltip: 'Edite' }" href="#" @click="openScoreForm">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </a>
    <Modal v-model="showModal" :title="score.homeLine.name">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-400 h-200">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="utrid">
                Home Player
              </label>
              <LinePlayerInfo :player1="score.homeLine.player1" :player2="score.homeLine.player2" :winner="score.homeTeamWin" :matchType="score.homeLine.type" />
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="ustaid">
                Vistor Player
              </label>
              <LinePlayerInfo :player1="score.guestLine.player1" :player2="score.guestLine.player2" :winner="!score.homeTeamWin" :matchType="score.guestLine.type" />
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Video Link
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" id="videoLink" v-model="videoLink">
            </div>
            <div class="mb-6">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comments</label>
                <textarea id="message" v-model="comment" rows="10" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    ></textarea>
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="saveScoreInfo">
                Save
              </button>
            </div>
          </form>
    </Modal>
</template>
