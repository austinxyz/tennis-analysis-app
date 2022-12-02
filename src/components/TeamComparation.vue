<script>
import TeamSelect from "./TeamSelect.vue";
import LineupCompTable from "./LineupCompTable.vue";

export default {

  data() {
    return {
        teamName1: '',
        teamName2: '',
        lineup1: {
            D1: {pair: {pairInfo: ''}},
            D2: {pair: {pairInfo: ''}},
            D3: {pair: {pairInfo: ''}},
            WD: {pair: {pairInfo: ''}},
            MD: {pair: {pairInfo: ''}},
        },
        lineup2: {
            D1: {pair: {pairInfo: ''}},
            D2: {pair: {pairInfo: ''}},
            D3: {pair: {pairInfo: ''}},
            WD: {pair: {pairInfo: ''}},
            MD: {pair: {pairInfo: ''}},
        },
    };
  },

  components: {
    TeamSelect,
    LineupCompTable,
  }
}
</script>

<template>
        <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
            <div class="w-1/2 align-middle inline-block min-w-fit shadow bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg">
                <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
                    <div class="m-2 w-1/2 flow-row">
                        <TeamSelect v-model:vTeamName="teamName1" v-model:vLineup="lineup1"/>
                    </div>
                    <div>
                        <LineupCompTable :teamName1="teamName1" :teamName2="teamName2" :lineup1="lineup1" :lineup2="lineup2"/>
                    </div>
                    <div class="m-2 w-1/2 flow-row">
                        <TeamSelect v-model:vTeamName="teamName2" v-model:vLineup="lineup2"/>
                    </div>
                </div>
           </div>
        </div>
</template>

