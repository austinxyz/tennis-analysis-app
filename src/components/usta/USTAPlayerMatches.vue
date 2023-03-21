<script>
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScoreView from "./LineScoreView.vue";

export default {

    props: {
        scores: { type: Array},
    },

    methods: {

    },

    components: {
        LinePlayerInfo,
        LineScoreView
    }
};
</script>

<template>
    <div v-if="scores.length > 0"  class="border-transparent rounded-lg text-center p-3 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
        <table class="min-w-full border-collapse border-spacing-0 border border-slate-400">
              <thead>
                <tr>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Match Date
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Match Line
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Home Team
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Home Players
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Visitor Team
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Visitor Players
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Winners Score
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Comment
                    </th>
                </tr>
              </thead>
              <tbody>
                 <tr v-for="(memberScore, index) in scores" class="even:bg-slate-50 odd:bg-slate-400">
                    <td class="w-1/20 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ index+1 }} - {{ memberScore.matchDate }}
                    </td>
                    <td class="w-1/20 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ memberScore.lineName }}
                    </td>
                    <td class="w-1/20 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ memberScore.homeTeamName }}
                    </td>
                    <td class="w-1/5 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                        <LinePlayerInfo :player1="memberScore.homePlayer1" :player2="memberScore.homePlayer2" :winner="memberScore.homeTeamWin" :matchType="memberScore.matchType" />
                    </td>
                    <td class="w-1/20 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{ memberScore.guestTeamName }}
                    </td>
                    <td class="w-1/5 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                        <LinePlayerInfo :player1="memberScore.guestPlayer1" :player2="memberScore.guestPlayer2" :winner="!memberScore.homeTeamWin" :matchType="memberScore.matchType" />
                    </td>
                    <td class="w-1/10 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {{memberScore.score}}
                    </td>
                    <td class="w-1/20 px-3 py-2 border-b text-blue-900 border-gray-500 text-sm leading-5">
                        <div class="flex item-center justify-center">
                            <div v-if="memberScore.comment" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                <LineScoreView :comment="memberScore.comment" />
                            </div>
                            <div v-if="memberScore.videoLink" class="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                                <a :href="memberScore.videoLink" target="_blank">
                                    <img src="/play-button.png" width="30" height="30" alt="Play" title="Play"/>
                                </a>
                            </div>
                        </div>
                    </td>
                  </tr>
              </tbody>
        </table>
    </div>
</template>

