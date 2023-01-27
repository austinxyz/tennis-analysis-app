<script>

export default {

    props: {
        lineScore: { type: Object},
    },

};
</script>

<template>
        <td class="px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{ lineScore.homeLine.name }}
        </td>
        <td class="px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <span v-if="lineScore.homeLine.player1 != null" class="flex flex row"> <img v-if="lineScore.homeTeamWin" src="/win_1262465.png" width="25" height="25" alt="Win"/>
                <span v-if="lineScore.homeLine.type === 'S'">
                    <a :href="'player?utr=' + lineScore.homeLine.player1.utrId" class="underline">
                       {{ lineScore.homeLine.player1.name }}({{lineScore.homeLine.player1.sutr}}S)
                    </a>
                </span>
                <span v-else class="font-light" >
                    <a :href="'player?utr=' + lineScore.homeLine.player1.utrId" class="underline">
                    {{ lineScore.homeLine.player1.name }}({{lineScore.homeLine.player1.dutr}}D)</a>/
                     <a :href="'player?utr=' + lineScore.homeLine.player2.utrId" class="underline">
                    {{ lineScore.homeLine.player2.name }}({{lineScore.homeLine.player2.dutr}}D)</a>
                </span>
            </span>
        </td>
        <td class="px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
            <span v-if="lineScore.guestLine.player1 != null" class="flex flex row"> <img v-if="!lineScore.homeTeamWin" src="/win_1262465.png" width="20" height="20" alt="Win"/>
                <span v-if="lineScore.guestLine.type === 'S'" >
                    <a :href="'player?utr=' + lineScore.guestLine.player1.utrId" class="underline">
                    {{ lineScore.guestLine.player1.name }} ({{lineScore.guestLine.player1.sutr}}S)
                    </a>
                </span>
                <span v-else class="font-light" >
                    <a :href="'player?utr=' + lineScore.guestLine.player1.utrId" class="underline">
                    {{ lineScore.guestLine.player1.name }}({{lineScore.guestLine.player1.dutr}}D)</a> /
                    <a :href="'player?utr=' + lineScore.guestLine.player2.utrId" class="underline">
                    {{ lineScore.guestLine.player2.name }}({{lineScore.guestLine.player2.dutr}}D)</a>
                </span>
            </span>
        </td>
        <td class="px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            {{lineScore.score}}
        </td>
        <td v-if="lineScore.homeTeamWin" class="px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            Home
        </td>
        <td v-else class="px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
            Visit
        </td>
</template>

