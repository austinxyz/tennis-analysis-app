<script>
import axios from "axios";
import LinePlayerInfo from "./LinePlayerInfo.vue";
import LineScore from "./LineScore.vue";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';


export default {

    props: {
        team: { type: Object},
    },

    mounted() {
    },

    watch: {
        teamName(newTeamName, oldTeamName) {
            this.scores =[];
            this.playerNames='';
        }
    },

    methods: {

        showScores(scores, playerNames) {
            this.scores = scores;
            this.playerNames = playerNames;
        },
    },

    data() {
        return {
            scores: [],
            playerNames: '',
        }
    },

    components: {
        LinePlayerInfo,
        LineScore,
    }
};
</script>

<template>
    <div class="w-1/2  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <label class="block text-gray-700 font-bold mb-2 px-2 ">
            Team : {{team.teamName}} <span v-if="team.team.alias"> ({{team.team.alias}}) </span> - W/L ({{team.currentWinMatchNo}}/{{team.totalMatchNo - team.currentWinMatchNo}}) - Score: {{team.currentScore}}
        </label>
        <div>
        <div v-for="(linestat, key) in team.doubleLineStats" class="w-full border-collapse border-spacing-0 border border-slate-100">
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Line: {{key}} (W:{{linestat.winMatchNo}} / L:{{linestat.lostMatchNo}})
            </label>
            <table class="min-w-full border-collapse border-spacing-0 border border-slate-400">
                <thead>
                    <tr>
                        <th class="w-1/2 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Pair
                        </th>
                        <th class="w-1/6 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            W/L
                        </th>
                        <th class="w-1/6 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Win Matches
                        </th>
                        <th class="w-1/6 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Lost Matches
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pair in linestat.pairs" class="even:bg-slate-50 odd:bg-slate-200">
                        <td class="w-1/2 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <LinePlayerInfo :player1="pair.player1" :player2="pair.player2" matchType="D" />
                        </td>
                        <td class="w-1/6 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{pair.winMatchNo}} / {{pair.lostMatchNo}}
                        </td>
                        <td class="w-1/6 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a v-if="pair.winMatchNo > 0" href="#" class="underline" @click="showScores(pair.winScores, pair.playerNames)">Win Matches</a>
                        </td>
                        <td class="w-1/6 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <a v-if="pair.lostMatchNo > 0" href="#" class="underline" @click="showScores(pair.lostScores, pair.playerNames)">Lost Matches</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
        <div v-if="team.singleLineStats">
         <div v-for="(linestat, key) in team.singleLineStats" class="w-full border-collapse border-spacing-0 border border-slate-100">
             <label class="block text-gray-700 font-bold mb-2 px-2 ">
                 Line: {{key}} (W:{{linestat.winMatchNo}} / L:{{linestat.lostMatchNo}})
             </label>
             <table class="min-w-full border-collapse border-spacing-0 border border-slate-400">
                 <thead>
                     <tr>
                         <th class="w-1/2 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                             Player
                         </th>
                         <th class="w-1/6 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                             W/L
                         </th>
                         <th class="w-1/6 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                             Win Matches
                         </th>
                         <th class="w-1/6 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                             Lost Matches
                         </th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr v-for="single in linestat.singlers" class="even:bg-slate-50 odd:bg-slate-200">
                         <td class="w-1/2 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                             <LinePlayerInfo :player1="single.player" matchType="S" />
                         </td>
                         <td class="w-1/6 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                             {{single.winMatchNo}} / {{single.lostMatchNo}}
                         </td>
                         <td class="w-1/6 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                             <a v-if="single.winMatchNo > 0" href="#" class="underline" @click="showScores(single.winScores, single.playerName)">Win Matches</a>
                         </td>
                         <td class="w-1/6 px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                             <a v-if="single.lostMatchNo >0" href="#" class="underline" @click="showScores(single.lostScores, single.playerName)">Lost Matches</a>
                         </td>
                     </tr>
                 </tbody>
             </table>
         </div>
         </div>
        <label v-if="playerNames" class="block text-gray-700 font-bold mb-2 px-2 ">
            {{playerNames}}'s Match
        </label>
        <table v-if="scores.length>0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
            <thead>
                <tr>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Match Type
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Home Players
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Visit Players
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
                <tr v-for="lineScore in scores" class="even:bg-slate-50 odd:bg-slate-400">
                    <LineScore :lineScore="lineScore" @change="refreshScores"/>
                </tr>
            </tbody>
        </table>
    </div>
</template>

