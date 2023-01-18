<script>
import axios from "axios";
import PlayerResult from "./PlayerResult.vue";
import PlayerInfo from "./PlayerInfo.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        team: {type: Object}
    },

    emits: ['update:team'],

    data() {
        return {
            loading: false,
            currentPlayer: {},
            playerName: '',
            playerresult: {},
            matches: [],
            scoreCard: {},
            homeTeam: '',
            guestTeam: '',
        };
    },

    methods: {

        showScoreDetail(match) {

            this.scoreCard = match.scoreCard;

            if (match.home) {
                this.homeTeam = match.teamName;
                this.guestTeam = match.opponentTeamName;
            } else {
                this.guestTeam = match.teamName;
                this.homeTeam = match.opponentTeamName;
            }

        },


        async changeTeam(teamId) {

            this.loading = true;

            var url = this.getBaseURL() + "/usta/teams/" + teamId ;
            const response = await axios.get(url);

            this.$emit('update:team', response.data);

            url = this.getBaseURL() + "/usta/teams/" + teamId + "/matches";
            const res = await axios.get(url);

            this.matches = res.data;

            this.currentPlayer= {},
            this.playerName = '',
            this.playerresult = {},
            this.scoreCard = {},
            this.homeTeam = '',
            this.guestTeam = '',

            this.loading = false;
        },

        async refreshScores(team) {

            this.loading = true;

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/matches?action=updateScore";
            const response = await axios.get(url);

            this.matches = response.data;

            this.loading = false;
        },

        async getMatches(team) {

            this.loading = true;

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/matches";
            const response = await axios.get(url);

            this.matches = response.data;

            this.loading = false;
        },

        async setPlayerResult(player) {

            this.loading = true;
            this.currentPlayer = player;
            this.playerName = player.name;

            try {

            var url = this.getBaseURL() + "/playerresult/?id=" + player.utrId;
            const response = await axios.get(url);

            this.playerresult = response.data;

            var url = this.getBaseURL() + "/usta/teams/" + this.team.id;
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            } catch (error) {
            }

            this.loading = false;
        },

        async refreshUTR(player) {

            this.loading = true;
            this.currentPlayer = player;
            this.playerName = player.name;

            if (player.utrId == null || player.utrId == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/utr/" + player.utrId + "?action=refreshUTR";
            const response = await axios.get(url);

            this.currentPlayer = response.data;

            var url = this.getBaseURL() + "/playerresult/?id=" + player.utrId;
            const res1 = await axios.get(url);

            this.playerresult = res1.data;

            var url = this.getBaseURL() + "/usta/teams/" + this.team.id;
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        async refreshTeamUTRId(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/teams/" + team.id + "/utrs?action=refresh";
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },
    },

  components: {
    PlayerResult,
    PlayerInfo,
  }
}
</script>

<template>
    <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <div v-if="team" class="border-transparent rounded-lg text-center px-4 pt-2 pb-1 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl text-left">
            <span class="w-1/2 text-left">Team :
                 <a :href="team.link" class="underline" target="_blank">
                    {{ team.name }}
                 </a>
             </span>
             <span v-if="team.alias" class="text-left">
             [{{team.alias}}]
             </span>
           </div>
           <div class="text-sm my-3 flex flex-row">
            <span class="w-1/2 text-left">Area : {{team.area}} </span>
            <span class="w-1/2 text-left">Flight : {{team.flight}}</span>
            <span class="w-1/2 text-left "><a href="#" class="underline" @click="getMatches(team)"> Matches </a></span>
            <span class="w-1/2 text-left "><a href="#" class="underline" @click="refreshScores(team)"> Refresh Score </a></span>
           </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
               <span class="w-1/2 text-left ">Captain :  {{team.captainName}}</span>
               <span class="w-1/2 text-left "><a :href="team.tennisRecordLink" class="underline" target="_blank"> TennisRecord Link </a></span>
               <span class="w-1/2 text-left "><a href="#" class="underline" @click="refreshTeamUTRId(team)"> Refresh UTR IDs </a></span>
           </div>
        </div>

        <table  class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Player
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    NTRP
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    UTR Rating
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    UTR Win Ratio
                </th>
            </tr>
          </thead>
          <tbody>
             <tr v-for="(player, index) in team.players" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="setPlayerResult(player)">
                    {{ player.name }} ({{ player.gender }})
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ player.ustaRating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span v-if="player.sUTRStatus === 'Rated'" class="font-semibold" >
                        {{ player.sUTR }} (S)
                    </span>
                    <span v-else class="font-light" >
                        {{ player.sUTR }} (S)
                    </span>  /
                    <span v-if="player.dUTRStatus === 'Rated'" class="font-semibold" >
                        {{ player.dUTR }} (D)
                    </span>
                    <span v-else class="font-light" >
                        {{ player.dUTR }} (D)
                    </span>
                    <span v-if="!player.refreshedUTR && player.utrId!=null">
                         <a href="#" class="underline" @click="refreshUTR(player)">
                            Refresh UTR
                         </a>
                    </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ (player.successRate * 100).toFixed(2) }} % (Latest)/ {{ (player.wholeSuccessRate * 100).toFixed(2) }}%
                </td>
              </tr>
          </tbody>
        </table>
        <table v-if="matches.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Date
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Opposite Team
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Home/Away
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Score
                </th>
            </tr>
          </thead>
          <tbody>
             <tr v-for="(match, index) in matches" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ match.matchDate }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                     <a href="#" class="underline" @click="changeTeam(match.opponentTeamId)">
                        {{match.opponentTeamName}}
                    </a>
                </td>
                <td v-if="match.home" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    Home
                </td>
                <td v-else class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    Away
                </td>
                <td v-if="match.scoreCard" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="showScoreDetail(match)">
                        {{match.point}} - {{match.opponentPoint}}
                    </a>
                </td>
                <td v-else class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    -
                </td>
              </tr>
          </tbody>
        </table>

        <table v-if="scoreCard" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Type
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Home ({{homeTeam}})
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Visit ({{guestTeam}})
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
                    <span class="flex flex row"> <img v-if="lineScore.homeTeamWin" src="/win_1262465.png" width="25" height="25" alt="Win"/>
                    <span v-if="lineScore.homeLine.type === 'S'">
                        <a :href="'playersearch?utr=' + lineScore.homeLine.player1.utrId" class="underline">
                           {{ lineScore.homeLine.player1.name }}({{lineScore.homeLine.player1.sUTR}}S)
                        </a>
                    </span>
                    <span v-else class="font-light" >
                        <a :href="'playersearch?utr=' + lineScore.homeLine.player1.utrId" class="underline">
                        {{ lineScore.homeLine.player1.name }}({{lineScore.homeLine.player1.dUTR}}D)</a>/
                         <a :href="'playersearch?utr=' + lineScore.homeLine.player2.utrId" class="underline">
                        {{ lineScore.homeLine.player2.name }}({{lineScore.homeLine.player2.dUTR}}D)</a>
                    </span>
                    </span>
                </td>
                <td class="px-3 py-2  border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span class="flex flex row"> <img v-if="!lineScore.homeTeamWin" src="/win_1262465.png" width="20" height="20" alt="Win"/>
                    <span v-if="lineScore.guestLine.type === 'S'" >
                        <a :href="'playersearch?utr=' + lineScore.guestLine.player1.utrId" class="underline">
                        {{ lineScore.guestLine.player1.name }} ({{lineScore.guestLine.player1.sUTR}}S)
                        </a>
                    </span>
                    <span v-else class="font-light" >
                        <a :href="'playersearch?utr=' + lineScore.guestLine.player1.utrId" class="underline">
                        {{ lineScore.guestLine.player1.name }}({{lineScore.guestLine.player1.dUTR}}D)</a> /
                        <a :href="'playersearch?utr=' + lineScore.guestLine.player2.utrId" class="underline">
                        {{ lineScore.guestLine.player2.name }}({{lineScore.guestLine.player2.dUTR}}D)</a>
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
    </div>
    <div v-if="loading" class="px-5 py-5">
      <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <PlayerInfo :player="currentPlayer" />
        <PlayerResult :result="playerresult"/>
      </div>
    </div>
</template>

