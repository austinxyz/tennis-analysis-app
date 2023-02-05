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

