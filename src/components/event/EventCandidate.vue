<script>

import axios from "axios";
import CandidateTeam from "./CandidateTeam.vue";
import 'vue-select/dist/vue-select.css';
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    async mounted() {
        var url = "http://localhost:8080/utr/events";
        const response = await axios.get(url);
        this.events = response.data;
        this.events.map(function (x){
           return x.label = x.year + '-' + x.alias;
        });
        this.event = this.events[0];
        this.divisions=this.event.divisions;
        this.div = this.divisions[0];
    },

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },

        selectEvent(event) {
            this.event = event;
            this.divisions = event.divisions;
            this.div = {};
        },

        async selectDiv(div) {
            this.div = div;
            console.log(div);
            var url = "http://localhost:8080/utr/candidateTeams/"+div.id;
            try {
                console.log(url);
                const response = await axios.get(url);
                this.candidateTeam = response.data;
                console.log(this.candidateTeam);
            } catch (error) {
                console.log(error);
            };
        },

    },
    data() {
  	    return {
            events:[],
            event: {},
  	        divisions: [],
  	        div: {},
  	        candidateTeam: {},
  	        loading: false,
  	    }
    },
    components: {
        CandidateTeam,
    }
}
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">

        <div v-if="events.length >0" class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Events
            </label>
            <div v-if="events.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="event => event.label"
                    :options="events"
                    :value="event"
                    v-model="event"
                    @option:selected="selectEvent"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Teams
            </label>
            <div v-if="divisions.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="div => div.chineseName"
                    :options="divisions"
                    :value="div"
                    v-model="div"
                    @option:selected="selectDiv"
                   ></v-select>
            </div>
        </div>

        <div v-if="loading" class="px-5 py-5">
            <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else class="m-2 flex flow-row">
            <CandidateTeam v-model:candidateTeam="candidateTeam"/>
        </div>

    </div>

</template>

