<script>

export default {

    props: {
        scoreCard: { type: Object},
    },

};
</script>

<template>
        <table v-if="scoreCard.scores" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Type
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Home ({{scoreCard.homeTeamName}})
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Visit ({{scoreCard.guestTeamName}})
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Winners Score
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Winner
                </th>
            </tr>
          </thead>
          <tbody>
             <tr v-for="lineScore in scoreCard.scores" class="even:bg-slate-50 odd:bg-slate-400">
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
              </tr>
          </tbody>
        </table>
</template>

