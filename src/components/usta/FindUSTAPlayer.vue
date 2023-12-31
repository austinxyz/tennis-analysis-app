<script>
import axios from "axios";
import USTAPlayer from "./USTAPlayer.vue";
import USTAPlayerList from "./USTAPlayerList.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        let ustaId = this.$route.query.ustaId;

        if (ustaId == null) {
            return;
        }

        var url = this.getBaseURL() + "/players/usta/" + ustaId;
        try {
            const res = await axios.get(url);
            this.currentPlayer = res.data;
            this.players.push(this.currentPlayer);
            this.query=this.currentPlayer.name;
        } catch (error) {
        };

    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async searchPlayer() {
            var url = this.getBaseURL() + "/players/search?name=" + this.query;
            try {
                const response = await axios.get(url);
                this.players = response.data;
                this.team = {};
                this.teams = [];
                this.currentPlayer = this.players[0];
            } catch(error) {
                this.players = [];
                this.team = {};
                this.teams = [];
                this.currentPlayer = {};
            };
        },

        async findPlayers() {
            var url = this.getBaseURL() + "/players/searchUTR?" +
                "gender=" + this.gender +
                "&USTARating=" + this.ustaRating +
                "&type=" + this.playertype +
                "&utr=" + this.utr +
                "&start=" + this.start +
                "&ageRange=" + this.agerange +
                "&ratedOnly=" + this.ratedonly +
                "&asc=" + this.asc +
                "&size=" + this.pagesize;
            if (this.utrlimit !=null && this.utrlimit != '') {
                url = url + "&utrLimit=" + this.utrlimit;
            }
            try {
                const response = await axios.get(url);
                this.players = response.data;
                this.team = {};
                this.teams = [];
                this.currentPlayer = {};
            } catch(error) {
                this.players = [];
                this.team = {};
                this.teams = [];
                this.currentPlayer = {};
            };
        },

        async refreshPlayer(player) {

            this.currentPlayer = player;
        },

        async incPage() {
            this.start = this.start+1;
            this.findPlayers();
        },

        async decPage() {
            this.start = this.start-1;
            this.findPlayers();
        },
    },

    data() {
        return {
            players: [],
            currentPlayer: {},
            loading: false,
            ustaRating:'',
            playertype:'double',
            utr: '',
            gender: 'M',
            start:0,
            pagesize:'10',
            agerange:'18+',
            ratedonly: false,
            utrlimit:'',
            query: '',
            asc: 'false'
        }
    },

    components: {
        USTAPlayerList,
        USTAPlayer,
    }
}
</script>

<template>
    <div class="flex flow-row">
        <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
              Quick search
            </label>
            <div class="py-2 border border-gray-300">
                <div class="mb-2 flex flow-row">
                    <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="usta">
                        Name/UTR:
                    </label>
                    <input v-model="query" class="border-b-2 border-gray-300 mb-2 text-sm" >
                </div>
            </div>
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="searchPlayer"
            >
             Search
            </button>
            <hr />

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
              Advanced search
            </label>
            <hr />
            <div class="py-2 border border-gray-300">
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="usta">
                    USTA Rating:
                  </label>
                  <input class="border-b-2 border-gray-300 mb-2 text-sm"
                    type="text" v-model="ustaRating" />
                </div>
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    Match Type:
                  </label>
                  <input type="radio" v-model="playertype" value="single" /> <span class="px-2 text-sm">Single</span>
                  <input type="radio" v-model="playertype" value="double" /> <span class="px-2 text-sm">Double</span>
                </div>
                <div class="mb-2 flex flow-row">
                  <span class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="utr">
                    UTR : &gt;=
                  </span>
                  <input class="border-b-2 border-gray-300 mb-2 text-sm"
                    type="text" v-model="utr" />
                  <span class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="utr">
                    &lt;=
                  </span>
                  <input class="border-b-2 border-gray-300 mb-2 text-sm"
                    type="text" v-model="utrlimit" />
                </div>
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    Gender:
                  </label>
                  <input type="radio" v-model="gender" value="M" /> <span class="px-2 text-sm"> Male</span>
                  <input type="radio" v-model="gender" value="F" /> <span class="px-2 text-sm">Female</span>
                </div>
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    RatedOnly
                  </label>
                  <input type="radio" v-model="ratedonly" value="true" /> <span class="px-2 text-sm">Yes</span>
                  <input type="radio" v-model="ratedonly" value="false" /> <span class="px-2 text-sm">No</span>
                </div>
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    Age:
                  </label>
                  <input type="radio" v-model="agerange" value="18+" /> <span class="px-2 text-sm">18+</span>
                  <input type="radio" v-model="agerange" value="40+" /> <span class="px-2 text-sm">40+</span>
                </div>
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    Order:
                  </label>
                  <input type="radio" v-model="asc" value="false" /> <span class="px-2 text-sm">DESC</span>
                  <input type="radio" v-model="asc" value="true" /> <span class="px-2 text-sm">ASC</span>
                </div>
                <div class="mb-2 flex flow-row">
                    <span class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="from">
                      Page:
                    </span>
                    <a v-if="start>0" href="#" class="underline text-sm font-bold mb-2 px-2" @click="decPage">
                       Prev
                    </a>
                    <input class="border-b-2 border-gray-300 mb-2 text-sm w-10"
                        type="text" v-model="start"/>
                    <a href="#" class="underline text-sm font-bold mb-2 px-2" @click="incPage">
                       Next
                    </a>
                  <span class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="utr">
                    Total:
                  </span>
                  <input class="border-b-2 border-gray-300 mb-2 text-sm"
                    type="text" v-model="pagesize"/>
                </div>
            </div>
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="findPlayers"
            >
             Search
            </button>
            <USTAPlayerList :players="players" v-model:currentPlayer="currentPlayer" showMode="parent" />
        </div>
        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div v-if="currentPlayer.id">
            <USTAPlayer :player="currentPlayer" @change="refreshPlayer"/>
        </div>

    </div>

</template>

