<script>
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScoreForm from "./LineScoreForm.vue";
import LineScoreView from "./LineScoreView.vue";

export default {

    props: {
        lineScore: { type: Object},
    },

    emits: ['update:lineScore'],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        refreshScore(score) {
            this.$emit('update:lineScore', score);
        },


        openScoreForm() {
            this.showScoreForm = true;
        },

        openScoreView() {
            this.showScoreComment = true;
        },
    },

    data() {
        return {
            showScoreForm: false,
            showScoreComment: false,
        }
    },

    components: {
        LinePlayerInfo,
        LineScoreForm,
        LineScoreView
    }
};
</script>

<template>
        <td class="w-1/20 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{ lineScore.homeLine.name }}
        </td>
        <td class="w-1/3 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <LinePlayerInfo :player1="lineScore.homeLine.player1" :player2="lineScore.homeLine.player2" :winner="lineScore.homeTeamWin" :matchType="lineScore.homeLine.type" />
        </td>
        <td class="w-1/3 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <LinePlayerInfo :player1="lineScore.guestLine.player1" :player2="lineScore.guestLine.player2" :winner="!lineScore.homeTeamWin" :matchType="lineScore.guestLine.type" />
        </td>
        <td class="w-1/10 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{lineScore.score}}
        </td>
        <td v-if="lineScore.homeTeamWin" class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            Home
        </td>
        <td v-else class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            Visitor
        </td>
        <td class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            <div class="flex item-center justify-center">
                <div v-if="lineScore.comment" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <a x-data="{ tooltip: 'View' }" href="#" @click="openScoreView">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </a>
                </div>
                <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <a x-data="{ tooltip: 'Edite' }" href="#" @click="openScoreForm">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </a>
                </div>
                <div v-if="lineScore.videoLink" class="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <a :href="lineScore.videoLink" target="_blank">
                        <img src="/play-button.png" width="30" height="30" alt="Play" title="Play"/>
                    </a>
                </div>

            </div>
        </td>
        <LineScoreForm v-model="showScoreForm" :score="lineScore" @change="refreshScore"/>
        <LineScoreView v-model="showScoreComment" :comment="lineScore.comment" />
</template>

