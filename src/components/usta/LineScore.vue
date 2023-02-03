<script>
import LinePlayerInfo from "./LinePlayerInfo.vue";
export default {

    props: {
        lineScore: { type: Object},
    },

    components: {
        LinePlayerInfo,
    }
};
</script>

<template>
        <td class="w-1/20 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{ lineScore.homeLine.name }}
        </td>
        <td class="w-2/5 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <LinePlayerInfo :player1="lineScore.homeLine.player1" :player2="lineScore.homeLine.player2" :winner="lineScore.homeTeamWin" :matchType="lineScore.homeLine.type" />
        </td>
        <td class="w-2/5 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <LinePlayerInfo :player1="lineScore.guestLine.player1" :player2="lineScore.guestLine.player2" :winner="!lineScore.homeTeamWin" :matchType="lineScore.guestLine.type" />
        </td>
        <td class="w-1/10 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{lineScore.score}}
        </td>
        <td v-if="lineScore.homeTeamWin" class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            Home
        </td>
        <td v-else class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            Visit
        </td>
</template>

