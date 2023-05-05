<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        candidateTeam: { type: Object},
    },

    emits: ["update:candidateTeam", "change"],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }
        },


        async refreshCandidateTeamUTRValue(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/candidateTeams/" + team.id + "/utrs?action=refreshValue";
            const res = await axios.get(url);

            this.$emit('update:candidateTeam', res.data);
            this.$emit('change', res.data);

            this.loading = false;
        },

        async exportCandidateTeam(team) {

            this.loading = true;

            if (team.id == null || team.id == '') {
                return;
            }

            var url = this.getBaseURL() + "/usta/exportExcel/candidateTeam/" + team.id;
            const res = await axios({
              method: 'get',
              url,
              responseType: 'arraybuffer',
            });

            this.forceFileDownload(res, team.name + ".xlsx");

            this.loading = false;
        },

        forceFileDownload(response, title) {
              const url = window.URL.createObjectURL(new Blob([response.data]))
              const link = document.createElement('a')
              link.href = url;
              link.setAttribute('download', title)
              document.body.appendChild(link)
              link.click();
        },

    },

    data() {
        return {
            loading: false,
        }
    },

    components: {
    }
};
</script>

<template>
    <div v-if="candidateTeam.id" class="border-transparent rounded-lg text-center px-4 pt-2 pb-1 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
       <div class="font-bold text-2xl text-left pb-2">
        <span class="w-1/2 text-left">Team :
           {{candidateTeam.name}}
         </span>
       </div>
       <hr />
       <div class="text-sm my-3 flex flex-row">
        <span class="w-1/5 text-left">
            <a href="#" class="underline" @click="exportCandidateTeam(candidateTeam)"> Export </a>
        </span>
        <span class="w-1/5 text-right">
            <button type="button" @click="refreshCandidateTeamUTRValue(candidateTeam)">
                <img src="/utr.svg" width="30" height="30" alt="Fetch UTR Value" title="fetch UTR Value"/>
            </button>
        </span>
       </div>
    </div>
    <div v-if="loading" class="px-5 py-5">
        <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

