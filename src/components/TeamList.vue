<script>

import axios from "axios";

export default {

    async mounted() {

        this.loading = true;

        var url = "http://localhost:8080/teams";
        try {
            const response = await axios.get(url);
            this.teams = response.data;

        } catch(error) {

        };

        this.loading = false;
    },

    data() {
  	    return {
	        teams: [],
            loading: false,
  	    }
    }
}
</script>

<template>
  <nav class="flex flex-col bg-slate-700 w-60 px-2 py-2 text-gray-900 border border-purple-900">
    <ul class="ml-1">
          <li v-for="team in teams" class="mb-1 px-0 py-2 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
            <span>
               <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
               <path
                   d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6
                                4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6
                                4h4v-4h-4M4 8h4V4H4v4z"
                   ></path>
               </svg>
            </span>
            <a :href="'?team=' + team.name">
                <span class="ml-1">{{ team.displayName }}</span>
            </a>
          </li>
      </ul>
    </nav>

    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

