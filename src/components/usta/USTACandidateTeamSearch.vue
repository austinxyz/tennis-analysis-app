<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";
import USTACandidateTeam from "./USTACandidateTeam.vue";
import 'vue-select/dist/vue-select.css';
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";
import Button from "../ui/button.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const leagues = ref([]);
const league = ref({});
const divisions = ref([]);
const division = ref({});
const candidateTeams = ref([]);
const candidateTeam = ref({});
const loading = ref(false);

onMounted(async () => {
    var url = "http://localhost:8080/usta/open/leagues";
    const response = await axios.get(url);
    leagues.value = response.data;
    leagues.value.map(function (x){
        return x.label = x.name;
    });
    divisions.value = [];
    candidateTeams.value = [];
});

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const selectLeague = async (selectedLeague) => {
    var url = "http://localhost:8080/usta/leagues/" + selectedLeague.id + "/divisions";
    const response = await axios.get(url);
    divisions.value = response.data;
    divisions.value.map(function (x){
        return x.label = x.name;
    });
    candidateTeams.value = [];
    candidateTeam.value = {};
};

const selectDiv = async (div) => {
    loading.value = true;
    var url = "http://localhost:8080/usta/divisions/" + div.id + "/candidateTeams";
    const response = await axios.get(url);
    candidateTeams.value = response.data;
    candidateTeams.value.map(function (x){
        return x.label = x.name;
    });
    candidateTeam.value = candidateTeams.value[0];
    loading.value = false;
};

const getTeam = (team) => {
    candidateTeam.value = team;
};
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">

        <div v-if="leagues.length >0" class="bg-white shadow-dashboard w-90 px-2 py-2 rounded-lg m-2">

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Leagues
            </label>
            <div v-if="leagues.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="leagues => leagues.label"
                    :options="leagues"
                    :value="league"
                    v-model="league"
                    @option:selected="selectLeague"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Division
            </label>
            <div v-if="divisions.length >0" style="min-width: 300px" class="w-full block tracking-wide  text-grey-darker text-xs font-bold mb-2">
                <v-select
                    :getOptionLabel="division => division.label"
                    :options="divisions"
                    :value="division"
                    v-model="division"
                    @option:selected="selectDiv"
                   ></v-select>
            </div>

            <label class="block text-gray-700 font-bold mb-2 px-2 ">
                Team
            </label>
            <Table v-if="candidateTeams.length > 0" class="border">
                <TableHeader class="bg-muted">
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="(team, index) in candidateTeams" :key="index" class="even:bg-muted/10">
                        <TableCell>{{ index+1 }}</TableCell>
                        <TableCell>
                            <Button variant="link" class="p-0 h-auto" @click="getTeam(team)">
                                {{ team.name }}
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </div>

        <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        <div class="m-2 flex flow-row">
            <USTACandidateTeam v-model:candidateTeam="candidateTeam"/>
        </div>

    </div>

</template>
