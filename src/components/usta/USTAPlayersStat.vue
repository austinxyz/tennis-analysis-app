<script>
import axios from "axios";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        async findPlayerStat() {
            var url = this.getBaseURL() + "/players/statUTR?" +
                "gender=" + this.gender +
                "&USTARating=" + this.ustaRating +
                "&type=" + this.playertype +
                "&ageRange=" + this.agerange +
                "&ratedOnly=" + this.ratedonly +
                "&ignoreZeroUTR=" + this.ignoreZeroUTR;
            try {
                const response = await axios.get(url);
                this.totalnumber = response.data.totalNumber;
                this.topplayer = response.data.topPlayer;
                this.midplayer = response.data.midPlayer;
            } catch(error) {
            };
        },

    },

    data() {
        return {
            totalnumber: '',
            topplayer: {},
            midplayer: {},
            loading: false,
            ustaRating:'',
            playertype:'double',
            gender: 'M',
            agerange:'18+',
            ratedonly: false,
            ignoreZeroUTR: false,
        }
    },

}
</script>

<template>
    <div class="flex flow-row">
        <div class="w-50  min-w-max  align-middle inline-block shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
            <label class="block text-gray-700 font-bold mb-2 px-2 ">
              USTA Player Stat:
            </label>
            <hr>
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
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    Gender:
                  </label>
                  <input type="radio" v-model="gender" value="M" /> <span class="px-2 text-sm"> Male</span>
                  <input type="radio" v-model="gender" value="F" /> <span class="px-2 text-sm">Female</span>
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
                    RatedOnly
                  </label>
                  <input type="radio" v-model="ratedonly" value="true" /> <span class="px-2 text-sm">Yes</span>
                  <input type="radio" v-model="ratedonly" value="false" /> <span class="px-2 text-sm">No</span>
                </div>
                <div class="mb-2 flex flow-row">
                  <label class="block text-gray-700 text-sm font-bold mb-2 px-2" for="type">
                    Ignore Zero UTR
                  </label>
                  <input type="radio" v-model="ignoreZeroUTR" value="true" /> <span class="px-2 text-sm">Yes</span>
                  <input type="radio" v-model="ignoreZeroUTR" value="false" /> <span class="px-2 text-sm">No</span>
                </div>
            </div>
            <button
                    class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    @click="findPlayerStat"
            >
             Search
            </button>
            <div v-if="loading" class="px-5 py-5">
                <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-else class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
               <div class="text-sm my-3 flex flex-row"> Total number : {{totalnumber}} </div>
               <hr />
               <div v-if="playertype=='single'" class="text-sm my-3 flex flex-row">
               Top player UTR : {{topplayer.sutr}}</div>
              <div v-if="playertype=='double'" class="text-sm my-3 flex flex-row">
              Top player UTR : {{topplayer.dutr}}</div>
               <hr />
               <div v-if="playertype=='single'" class="text-sm my-3 flex flex-row">
               Mid player UTR : {{midplayer.sutr}}</div>
              <div v-if="playertype=='double'" class="text-sm my-3 flex flex-row">
              Mid player UTR : {{midplayer.dutr}}</div>
               <hr />
             </div>
        </div>
    </div>

</template>

