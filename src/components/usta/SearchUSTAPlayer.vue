<script>
import axios from "axios";
import USTAPlayer from "./USTAPlayer.vue";
import USTAPlayerList from "./USTAPlayerList.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        let utrId = this.$route.query.utr;

        if (utrId == null) {
            return;
        }

        var url = this.getBaseURL() + "/players/utr/" + utrId;
        try {
            const res = await axios.get(url);
            this.currentPlayer = res.data;
            this.players.push(this.currentPlayer);
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
                this.currentPlayer = {};
            } catch(error) {
            };
        },

    },

    data() {
        return {
            query: '',
            players: [],
            currentPlayer: {},
            loading: false,
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
            <label class="border-transparent rounded-lg text-center px-2 py-1 mx-auto md:mx-0 my-2 bg-gray-100 font-normal z-10 shadow-lg">
              USTA Player:
            </label>
            <input v-model="query" class="border-b-2 border-gray-300" >
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="searchPlayer"
            >
             Search
            </button>
            <USTAPlayerList :players="players" v-model:currentPlayer="currentPlayer" />
        </div>
        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-if="currentPlayer.id">
            <USTAPlayer :player="currentPlayer" />
        </div>
    </div>

</template>

