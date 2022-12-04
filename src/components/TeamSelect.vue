<script>
import 'vue-select/dist/vue-select.css';
import axios from "axios";
import PlayersSelect from "./PlayersSelect.vue";
import Lineups from "./Lineups.vue";

export default {

    props: {
        vTeamName: {type: String},
        vLineup: {type: Object},
    },

    emits: ['update:vTeamName', 'update:vLineup'],

    methods: {
        getLineString(player1, player2) {
            let players = [];
            if (player1 !=null && player1 != "") {
                players.push(player1);
            }
            if (player2 !=null && player2 != "") {
                players.push(player2);
            }
            return players.join(",");
        },
        setTeam(value) {
            axios.get("http://localhost:8080/team?team=" + this.team)
                .then(response => {
                    this.teamName = response.data.name;
                    this.players = response.data.players;
                    this.players.map(function (x){
                       return x.label = x.name + '(' + x.gender + ')-' + x.utr;
                    });
                    this.players.push({label:"Any", name:""});
                    this.$emit('update:vTeamName', this.teamName);
                    this.reset();
                    this.$emit('update:vLineup', this.lineup);
                })
        },

        setLineup(value) {
            this.$emit('update:vLineup', this.lineup);
        },

        analysisLineup() {
           let D1 = this.getLineString(this.d1player1, this.d1player2);
           let D2 = this.getLineString(this.d2player1, this.d2player2);
           let D3 = this.getLineString(this.d3player1, this.d3player2);
           let WD = this.getLineString(this.wdplayer1, this.wdplayer2);
           let MD = this.getLineString(this.mdplayer1, this.mdplayer2);
           this.selectedPairs = this.getSelectPairs(D1,D2,D3,MD,WD);
           axios.get("http://localhost:8080/fixedlineup?team=" + this.team
                + "&d1=" + D1
                + "&d2=" + D2
                + "&d3=" + D3
                + "&md=" + MD
                + "&wd=" + WD
                )
                .then(response => {
                   this.lineups = response.data;
                   if (this.lineups !=null && this.lineups.length > 0) {
                    this.lineup = this.lineups[0];
                    this.$emit('update:vLineup', this.lineup);
                   }
                })
        },

        getSelectPairs(d1, d2, d3, md, wd) {
            let pairString = "";
            if (d1 === "") {
                pairString = pairString + "D1: Any"
            } else {
                pairString = pairString + "D1: " + d1;
            }
            if (d2 === "") {
                pairString = pairString + " D2: Any"
            } else {
                pairString = pairString + " D2: " + d2;
            }
            if (d3 === "") {
                pairString = pairString + " D3: Any"
            } else {
                pairString = pairString + " D3: " + d3;
            }
            if (md === "") {
                pairString = pairString + " MD: Any"
            } else {
                pairString = pairString + " MD: " + md;
            }
            if (wd === "") {
                pairString = pairString + " WD: Any"
            } else {
                pairString = pairString + " WD: " + wd;
            }
            return pairString;
        },

        reset() {
            this.lineups= [];
            this.lineup={
                D1: {pair: {pairInfo: ''}},
                D2: {pair: {pairInfo: ''}},
                D3: {pair: {pairInfo: ''}},
                WD: {pair: {pairInfo: ''}},
                MD: {pair: {pairInfo: ''}},
            };
            this.d1player1= '';
            this.d1player2= '';
            this.d2player1= '';
            this.d2player2= '';
            this.d3player1= '';
            this.d3player2= '';
            this.mdplayer1= '';
            this.mdplayer2= '';
            this.wdplayer1= '';
            this.wdplayer2= '';
            this.selectedPairs= '';
        }
    },

    mounted() {
        axios.get("http://localhost:8080/teams")
            .then(response => {
                this.teams = response.data;
            })
        axios.get("http://localhost:8080/team?team=" + this.team)
            .then(response => {
                this.teamName = response.data.displayName;
                this.players = response.data.players;
                this.players.map(function (x){
                   return x.label = x.name + '(' + x.gender + ')-' + x.utr;
                });
                this.players.push({label:"Any", name:""});
            })
    },

    data() {
  	    return {
            teamName: '',
            players: [],
            lineups: [],
            lineup:{},
	        teams: [],
	        team: 'ZJU-BYD',
	        d1player1: '',
	        d1player2: '',
	        d2player1: '',
	        d2player2: '',
	        d3player1: '',
	        d3player2: '',
	        mdplayer1: '',
	        mdplayer2: '',
	        wdplayer1: '',
	        wdplayer2: '',
	        selectedPairs: '',
  	    }
    },
    components: {
        PlayersSelect,
        Lineups,
    }
}
</script>

<template>

<div class="w-1/2 align-middle inline-block min-w-fit shadow bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg">
    <div class="m-2 w-full flow-row">
        <div>
                <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                    <div class="py-2">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                            Team {{ teamName}}
                        </label>
                        <div class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                            <v-select label="displayName"
                                v-model="team"
                                :reduce="(option) => option.name"
                                :options="teams"
                                @option:selected="setTeam"></v-select>
                        </div>
                    </div>
                    <div class="w-full">
                        <PlayersSelect :players="players" lineName="D1"
                            v-model:player1="d1player1"
                            v-model:player2="d1player2" />
                    </div>
                    <div class="w-full">
                        <PlayersSelect :players="players" lineName="D2"
                            v-model:player1="d2player1"
                            v-model:player2="d2player2" />
                    </div>
                    <div class="w-full">
                        <PlayersSelect :players="players" lineName="D3"
                            v-model:player1="d3player1"
                            v-model:player2="d3player2" />
                    </div>
                    <div class="w-full">
                        <PlayersSelect :players="players" lineName="WD"
                            v-model:player1="wdplayer1"
                            v-model:player2="wdplayer2" />
                    </div>
                    <div class="w-full">
                        <PlayersSelect :players="players" lineName="MD"
                            v-model:player1="mdplayer1"
                            v-model:player2="mdplayer2" />
                    </div>
                </div>
        </div>
     </div>
    <button
            class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
            @click="analysisLineup"
    >
     Analysis Lineups
    </button>
    <span class="border-transparent rounded-lg text-center px-4 py-2 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
     {{ selectedPairs }}
    </span>
    <Lineups :lineups="lineups" v-model:lineup="lineup" @change="setLineup"/>
</div>

</template>

