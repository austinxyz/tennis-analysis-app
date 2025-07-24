<script setup>
import { ref } from 'vue';
import axios from "axios";
import Card from '../ui/card.vue';
import CardHeader from '../ui/card-header.vue';
import CardTitle from '../ui/card-title.vue';
import CardContent from '../ui/card-content.vue';
import CardFooter from '../ui/card-footer.vue';
import Button from '../ui/button.vue';
import { Search, Loader2, Users, BarChart2 } from 'lucide-vue-next';

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const totalnumber = ref('');
const topplayer = ref({});
const midplayer = ref({});
const loading = ref(false);
const ustaRating = ref('');
const playertype = ref('double');
const gender = ref('M');
const agerange = ref('18+');
const ratedonly = ref(false);
const ignoreZeroUTR = ref(false);

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return BASE_URL_PROD;
  } else {
    return BASE_URL;
  }
};

const findPlayerStat = async () => {
  loading.value = true;
  const url = `${getBaseURL()}/players/statUTR?gender=${gender.value}&USTARating=${ustaRating.value}&type=${playertype.value}&ageRange=${agerange.value}&ratedOnly=${ratedonly.value}&ignoreZeroUTR=${ignoreZeroUTR.value}`;
  
  try {
    const response = await axios.get(url);
    totalnumber.value = response.data.totalNumber;
    topplayer.value = response.data.topPlayer;
    midplayer.value = response.data.midPlayer;
  } catch (error) {
    console.error("Error fetching player stats:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle class="flex items-center">
        <Users class="mr-2 h-5 w-5" />
        USTA Player Statistics
      </CardTitle>
    </CardHeader>
    
    <CardContent>
      <div class="space-y-4">
        <!-- USTA Rating -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            USTA Rating:
          </label>
          <input 
            v-model="ustaRating"
            type="text"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter USTA rating"
          />
        </div>
        
        <!-- Match Type -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Match Type:</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="playertype" 
                value="single"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">Single</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="playertype" 
                value="double"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">Double</span>
            </label>
          </div>
        </div>
        
        <!-- Gender -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Gender:</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="gender" 
                value="M"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">Male</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="gender" 
                value="F"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">Female</span>
            </label>
          </div>
        </div>
        
        <!-- Age -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Age:</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="agerange" 
                value="18+"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">18+</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="agerange" 
                value="40+"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">40+</span>
            </label>
          </div>
        </div>
        
        <!-- Rated Only -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Rated Only:</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="ratedonly" 
                :value="true"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">Yes</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="ratedonly" 
                :value="false"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">No</span>
            </label>
          </div>
        </div>
        
        <!-- Ignore Zero UTR -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Ignore Zero UTR:</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="ignoreZeroUTR" 
                :value="true"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">Yes</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                v-model="ignoreZeroUTR" 
                :value="false"
                class="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
              />
              <span class="text-sm">No</span>
            </label>
          </div>
        </div>
      </div>
    </CardContent>
    
    <CardFooter class="flex justify-between">
      <Button 
        @click="findPlayerStat"
        class="w-full"
        :disabled="loading"
      >
        <Search v-if="!loading" class="mr-2 h-4 w-4" />
        <Loader2 v-else class="mr-2 h-4 w-4 animate-spin" />
        Search
      </Button>
    </CardFooter>
  </Card>
  
  <!-- Results Card -->
  <Card v-if="totalnumber || loading" class="w-full max-w-md mt-4">
    <CardHeader>
      <CardTitle class="flex items-center">
        <BarChart2 class="mr-2 h-5 w-5" />
        Results
      </CardTitle>
    </CardHeader>
    
    <CardContent>
      <div v-if="loading" class="flex justify-center py-8">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>
      
      <div v-else class="space-y-4">
        <div class="flex justify-between items-center py-2 border-b">
          <span class="font-medium">Total Players:</span>
          <span class="text-primary">{{ totalnumber }}</span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b">
          <span class="font-medium">Top Player UTR:</span>
          <span class="text-primary">
            {{ playertype === 'single' ? topplayer.sutr : topplayer.dutr }}
          </span>
        </div>
        
        <div class="flex justify-between items-center py-2">
          <span class="font-medium">Mid Player UTR:</span>
          <span class="text-primary">
            {{ playertype === 'single' ? midplayer.sutr : midplayer.dutr }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
