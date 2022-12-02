<script>
import TeamSelect from "./TeamSelect.vue";
import LineupCompTable from "./LineupCompTable.vue";

export default {

  data() {
    return {
        teamName1: '',
        teamName2: '',
        lineups1: [],
        lineups2: [],
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

    methods: {
        selectLineup1(evt) {
            let index = 0;
            console.log(this.lineups1.length);
            if (evt.target.value != null && evt.target.value !=="") {
                index = parseInt(evt.target.value) -1;
            }

            if (this.lineups1 == null || index > this.lineups1.length-1) {
                return;
            }

            this.lineup1 = this.lineups1[index];
        },
        selectLineup2(evt) {
            let index = 0;
            console.log(this.lineups2.length);
            if (evt.target.value != null && evt.target.value !=="") {
                index = parseInt(evt.target.value) -1;
            }

            if (this.lineups2 == null || index > this.lineups2.length-1) {
                return;
            }

            this.lineup2 = this.lineups2[index];
        },
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
                        <TeamSelect v-model:vTeamName="teamName1" v-model:vLineups="lineups1"/>
                    </div>
                    <div>
                        <LineupCompTable :teamName1="teamName1" :teamName2="teamName2" :lineup1="lineup1" :lineup2="lineup2"/>
                        <div class="flex flex-col md:flex-row md:transform md:scale-75 lg:scale-100 justify-center">
                            <div class="md:w-1/2 px-3">
                            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" >
                                Team 1 Lineup No. {{teamName1}}
                            </label>
                            <input class="appearance-none block bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-1 px-1"
                                @change="selectLineup1" />
                            </div>
                            <div class="md:w-1/2 px-3">
                            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" >
                                Team 2 Lineup No. {{teamName2}}
                            </label>
                            <input class="appearance-none block bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-1 px-1"
                                @change="selectLineup2" />
                            </div>
                        </div>
                    </div>
                    <div class="m-2 w-1/2 flow-row">
                        <TeamSelect v-model:vTeamName="teamName2" v-model:vLineups="lineups2"/>
                    </div>
                </div>
           </div>
        </div>
</template>

