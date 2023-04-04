<script>
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScoreForm from "./LineScoreForm.vue";
import LineScoreView from "./LineScoreView.vue";

export default {

    props: {
        lineScore: { type: Object},
    },

    emits: ['update:lineScore', 'change'],

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
            this.$emit('change', score);
        },

    },

    data() {
        return {
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
            {{ lineScore.name }}
        </td>
        <td class="w-1/3 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <LinePlayerInfo :player1="lineScore.homePlayer1" :player2="lineScore.homePlayer2" :winner="lineScore.homeTeamWin" :matchType="lineScore.type" />
        </td>
        <td class="w-1/3 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <LinePlayerInfo :player1="lineScore.guestPlayer1" :player2="lineScore.guestPlayer2" :winner="!lineScore.homeTeamWin" :matchType="lineScore.type" />
        </td>
        <td class="w-1/10 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{lineScore.score}}
        </td>
        <td class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            <div class="flex item-center justify-center">
                <div v-if="lineScore.comment" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <LineScoreView :comment="lineScore.comment" />
                </div>
                <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <LineScoreForm :score="lineScore" @change="refreshScore"/>
                </div>
                <div v-if="lineScore.videoLink" class="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <a :href="lineScore.videoLink" target="_blank">
                        <img src="/play-button.png" width="30" height="30" alt="Play" title="Play"/>
                    </a>
                </div>

            </div>
        </td>
</template>

