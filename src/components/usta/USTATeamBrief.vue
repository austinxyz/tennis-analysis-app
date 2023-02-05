<script>
import axios from "axios";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';
import USTATeamInfo from "./USTATeamInfo.vue";
import USTAPlayerSummary from "./USTAPlayerSummary.vue";

export default {

    props: {
        team: {type: Object},
        matchType: {type: String}
    },

    emits: ['update:team'],

    mounted() {
        this.lineups= [
                    {name:'D1',
                    player1:{},
                    player2:{}},
                    {name:'D2',
                    player1:{},
                    player2:{}},
                    {name:'D3',
                    player1:{},
                    player2:{}}
                ];
        if (this.matchType == '40+Adult') {
            this.lineups.push(
                {name:'S1',
                player1:{},
                player2:{}}
            )
        }
    },

    data() {
        return {
            loading: false,
            currentPlayer: {},
            selectPlayers: [],
            lineups: []
        };
    },

    methods: {

        async refreshUTR(player) {

            this.loading = true;

            if (player.utrId == null || player.utrId == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/utr/" + player.utrId + "?action=refreshUTR";
            const response = await axios.get(url);


            var url = this.getBaseURL() + "/usta/teams/" + this.team.id;
            const res = await axios.get(url);

            this.$emit('update:team', res.data);

            this.loading = false;
        },

        setLineup() {
            var length = this.team.players.length;

            for (let i=0; i< length; i++ ) {
                if (this.selectPlayers[i] == 'd1') {
                    if (this.lineups[0].player1.id == null) {
                        this.lineups[0].player1 = this.team.players[i];
                    } else if (this.lineups[0].player1.id != this.team.players[i].id) {
                        this.lineups[0].player2 = this.team.players[i];
                    }
                }
                if (this.selectPlayers[i] == 'd2') {
                    if (this.lineups[1].player1.id == null) {
                     this.lineups[1].player1 = this.team.players[i];
                    } else if (this.lineups[1].player1.id != this.team.players[i].id) {
                     this.lineups[1].player2 = this.team.players[i];
                    }
                }
                if (this.selectPlayers[i] == 'd3') {
                    if (this.lineups[2].player1.id == null) {
                     this.lineups[2].player1 = this.team.players[i];
                    } else if (this.lineups[2].player1.id != this.team.players[i].id) {
                     this.lineups[2].player2 = this.team.players[i];
                    }
                }

                if (this.matchType == '40+Adult') {
                    if (this.lineups.length == 3) {
                        this.lineups.push(
                            {name:'S1',
                            player1:{},
                            player2:{}}
                        )
                    }
                    if (this.selectPlayers[i] == 's1') {
                        this.lineups[3].player1 = this.team.players[i];
                    }
                    if (this.selectPlayers[i] == 'None') {
                        this.lineups[3].player1 = {};
                    }
                }

                if (this.selectPlayers[i] == 'None') {
                    for (let j=0; j<3; j++) {
                        if (this.lineups[j].player1.id == this.team.players[i].id) {
                            this.lineups[j].player1 = this.lineups[j].player2;
                            this.lineups[j].player2 = {};
                        }
                        if (this.lineups[j].player2.id == this.team.players[i].id) {
                            this.lineups[j].player2 = {};
                        }
                    }
                }
            }

        },

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },

        teamRefresh(team) {
            this.$emit('update:team', team);
        },
    },

    components: {
        USTATeamInfo,
        USTAPlayerSummary,
    }
}
</script>

<template>
    <div v-if="team.id" class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <USTATeamInfo :team="team" @change="teamRefresh" />

        <div class="min-w-full mx-auto">
            <table v-if="team.players.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
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
                            DR
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            UTR
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            UTR WPct
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Lineup
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(player, index) in team.players" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ index+1 }}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <div class="flex item-center justify-center">
                                <a :href="'/usta/player?ustaId=' + player.ustaNorcalId" class="whitespace-no-wrap underline">
                                  {{ player.name }} ({{ player.gender }})
                                </a>
                                <div v-if="player.summary" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                    <USTAPlayerSummary :summary="player.summary" />
                                </div>
                            </div>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.ustaRating}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{ player.dynamicRating}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <span v-if="player.dutrstatus === 'Rated'" class="font-semibold" >
                                {{ player.dutr }} (D)
                            </span>
                            <span v-else class="font-light" >
                                {{ player.dutr }} (D)
                            </span> /
                            <span v-if="player.sutrstatus === 'Rated'" class="font-semibold" >
                                {{ player.sutr }} (S)
                            </span>
                            <span v-else class="font-light" >
                                {{ player.sutr }} (S)
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
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <select v-model="selectPlayers[index]" @change="setLineup"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full">
                                <option value="d1">D1</option>
                                <option value="d2">D2</option>
                                <option value="d3">D3</option>
                                <option v-if="matchType == '40+Adult'" value="s1">S1</option>
                                <option value="None">None</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="min-w-full border-collapse border-spacing-0 border border-slate-400">
                <thead>
                    <tr>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            #
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Player 1
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Player 2
                        </th>
                        <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                            Total UTR
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lineup in lineups" class="even:bg-slate-50 odd:bg-slate-400">
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {{lineup.name}}
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <span v-if="lineup.player1.id" class="text-sm leading-5"> {{lineup.player1.name}}
                                <span v-if="lineup.player1.dutrstatus === 'Rated'" class="font-semibold" >
                                    {{ lineup.player1.dutr }} (D)
                                </span>
                                <span v-else class="font-light" >
                                    {{ lineup.player1.dutr }} (D)
                                </span> /
                                <span v-if="lineup.player1.sutrstatus === 'Rated'" class="font-semibold" >
                                    {{ lineup.player1.sutr }} (S)
                                </span>
                                <span v-else class="font-light" >
                                    {{ lineup.player1.sutr }} (S)
                                </span>
                            </span>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <span v-if="lineup.player2.id" class="text-sm leading-5"> {{lineup.player2.name}}
                                <span v-if="lineup.player2.dutrstatus === 'Rated'" class="font-semibold" >
                                    {{ lineup.player2.dutr }} (D)
                                </span>
                                <span v-else class="font-light" >
                                    {{ lineup.player2.dutr }} (D)
                                </span> /
                                <span v-if="lineup.player2.sutrstatus === 'Rated'" class="font-semibold" >
                                    {{ lineup.player2.sutr }} (S)
                                </span>
                                <span v-else class="font-light" >
                                    {{ lineup.player2.sutr }} (S)
                                </span>
                            </span>
                        </td>
                        <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            <span v-if="lineup.player2.id" class="text-sm leading-5"> {{(lineup.player2.dutr + lineup.player1.dutr).toFixed(2)}}</span>
                            <span v-else-if="matchType == '40+Adult' && lineup.player1.id" class="text-sm leading-5"> {{lineup.player1.sutr}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

