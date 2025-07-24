<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import USTAPlayer from "./USTAPlayer.vue";
import USTAPlayerList from "./USTAPlayerList.vue";
import Button from '../ui/button.vue';
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const route = useRoute();

const players = ref([]);
const currentPlayer = ref({});
const loading = ref(false);
const ustaRating = ref('');
const playertype = ref('double');
const utr = ref('');
const gender = ref('M');
const start = ref(0);
const pagesize = ref('10');
const agerange = ref('18+');
const ratedonly = ref(false);
const utrlimit = ref('');
const query = ref('');
const asc = ref('false');
const bayAreaOnly = ref('false');

function getBaseURL() {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
}

async function searchPlayer() {
    var url = getBaseURL() + "/players/search?name=" + query.value;
    try {
        const response = await axios.get(url);
        players.value = response.data;
        currentPlayer.value = players.value[0] || {};
    } catch(error) {
        players.value = [];
        currentPlayer.value = {};
    }
}

async function findPlayers() {
    var url = getBaseURL() + "/players/searchUTR?" +
        "gender=" + gender.value +
        "&USTARating=" + ustaRating.value +
        "&type=" + playertype.value +
        "&utr=" + utr.value +
        "&start=" + start.value +
        "&ageRange=" + agerange.value +
        "&ratedOnly=" + ratedonly.value +
        "&asc=" + asc.value +
        "&bayArea=" + bayAreaOnly.value +
        "&size=" + pagesize.value;
    if (utrlimit.value != null && utrlimit.value != '') {
        url = url + "&utrLimit=" + utrlimit.value;
    }
    try {
        const response = await axios.get(url);
        players.value = response.data;
        currentPlayer.value = {};
    } catch(error) {
        players.value = [];
        currentPlayer.value = {};
    }
}

function refreshPlayer(player) {
    currentPlayer.value = player;
}

function incPage() {
    start.value = start.value + 1;
    findPlayers();
}

function decPage() {
    start.value = start.value - 1;
    findPlayers();
}

onMounted(async () => {
    let ustaId = route.query.ustaId;

    if (ustaId == null) {
        return;
    }

    var url = getBaseURL() + "/players/usta/" + ustaId;
    try {
        const res = await axios.get(url);
        currentPlayer.value = res.data;
        players.value.push(currentPlayer.value);
        query.value = currentPlayer.value.name;
    } catch (error) {
        // Handle error
    }
});
</script>

<template>
  <div class="flex flex-row gap-4">
    <div class="w-full max-w-2xl">
      <Card class="mb-4">
        <CardHeader>
          <CardTitle>Quick search</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium" for="quick-search">Name/UTR:</label>
              <input 
                id="quick-search"
                v-model="query" 
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button @click="searchPlayer">Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card class="mb-4">
        <CardHeader>
          <CardTitle>Advanced search</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">USTA Rating:</label>
              <input 
                v-model="ustaRating" 
                class="col-span-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Match Type:</label>
              <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="single" v-model="playertype" value="single" class="h-4 w-4" />
                  <label for="single" class="text-sm">Single</label>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="double" v-model="playertype" value="double" class="h-4 w-4" />
                  <label for="double" class="text-sm">Double</label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">UTR Range:</label>
              <div class="col-span-2 flex items-center gap-2">
                <span class="text-sm">≥</span>
                <input 
                  v-model="utr" 
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <span class="text-sm">≤</span>
                <input 
                  v-model="utrlimit" 
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Gender:</label>
              <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="male" v-model="gender" value="M" class="h-4 w-4" />
                  <label for="male" class="text-sm">Male</label>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="female" v-model="gender" value="F" class="h-4 w-4" />
                  <label for="female" class="text-sm">Female</label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Rated Only:</label>
              <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="rated-yes" v-model="ratedonly" value="true" class="h-4 w-4" />
                  <label for="rated-yes" class="text-sm">Yes</label>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="rated-no" v-model="ratedonly" value="false" class="h-4 w-4" />
                  <label for="rated-no" class="text-sm">No</label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Age:</label>
              <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="age-18" v-model="agerange" value="18+" class="h-4 w-4" />
                  <label for="age-18" class="text-sm">18+</label>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="age-40" v-model="agerange" value="40+" class="h-4 w-4" />
                  <label for="age-40" class="text-sm">40+</label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Bay Area Only:</label>
              <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="bay-yes" v-model="bayAreaOnly" value="true" class="h-4 w-4" />
                  <label for="bay-yes" class="text-sm">Yes</label>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="bay-no" v-model="bayAreaOnly" value="false" class="h-4 w-4" />
                  <label for="bay-no" class="text-sm">No</label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Order:</label>
              <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="desc" v-model="asc" value="false" class="h-4 w-4" />
                  <label for="desc" class="text-sm">DESC</label>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="radio" id="asc" v-model="asc" value="true" class="h-4 w-4" />
                  <label for="asc" class="text-sm">ASC</label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center gap-2">
              <label class="text-sm font-medium">Page:</label>
              <div class="col-span-2 flex items-center gap-2">
                <Button v-if="start > 0" variant="outline" size="sm" @click="decPage">Prev</Button>
                <input 
                  v-model="start" 
                  class="flex h-10 w-16 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button variant="outline" size="sm" @click="incPage">Next</Button>
                <span class="text-sm font-medium">Total:</span>
                <input 
                  v-model="pagesize" 
                  class="flex h-10 w-16 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <Button @click="findPlayers">Search</Button>
          </div>
        </CardContent>
      </Card>

      <USTAPlayerList :players="players" v-model:currentPlayer="currentPlayer" showMode="parent" />
    </div>

    <div v-if="loading" class="flex items-center justify-center p-4">
      <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="currentPlayer.id" class="flex-1">
      <USTAPlayer :player="currentPlayer" @change="refreshPlayer" />
    </div>
  </div>
</template>
