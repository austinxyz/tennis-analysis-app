<script>
import LinePlayerInfo from "./LinePlayerInfo.vue";

export default {

  props: {
    team1: { type: Object},
    team2: { type: Object},
  },

    components: {
        LinePlayerInfo,
    }
};
</script>

<template>
     <div class="p-5 flex flex-col w-full justify-center rounded-lg z-10 shadow-lg border border-gray-500">
        <div class="flex items-center h-20 px-4 border-b border-gray-500">
            <div class="w-40"></div>
            <div class="flex-grow text-lg font-semibold text-center justify-center">{{ team1.teamName }} <span v-if="team1.team.alias">({{team1.team.alias}}) </span></div>
            <div class="flex-grow text-lg font-semibold text-center justify-center">{{ team2.teamName }} <span v-if="team2.team.alias">({{team2.team.alias}}) </span></div>
        </div>
        <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold bg-slate-400">
            <div class="w-40">Captain:</div>
            <div class="flex justify-center flex-grow w-0">
                <span v-if="team1.team.captain">{{team1.team.captain.name}} </span>
            </div>
            <div class="flex justify-center flex-grow w-0 ">
                <span v-if="team2.team.captain">{{team2.team.captain.name}} </span>
            </div>
        </div>
        <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold">
            <div class="w-40">W/L:</div>
            <div class="flex justify-center flex-grow w-0">
                <img v-if="team1.currentWinMatchNo > team2.currentWinMatchNo" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                {{team1.currentWinMatchNo}} / {{team1.totalMatchNo - team1.currentWinMatchNo}}
            </div>
            <div class="flex justify-center flex-grow w-0 ">
                <img v-if="team1.currentWinMatchNo < team2.currentWinMatchNo" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                {{team2.currentWinMatchNo}} / {{team2.totalMatchNo - team2.currentWinMatchNo}}
            </div>
        </div>
        <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold bg-slate-400">
            <div class="w-40">Score:</div>
            <div class="flex justify-center flex-grow w-0">
                <img v-if="team1.currentScore > team2.currentScore" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                {{team1.currentScore}}
            </div>
            <div class="flex justify-center flex-grow w-0 ">
                <img v-if="team1.currentScore < team2.currentScore" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                {{team2.currentScore}}
            </div>
        </div>
        <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold">
            <div class="w-40">Best double by UTR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm">
                <img v-if="team1.bestUTRDouble.totalUTR > team2.bestUTRDouble.totalUTR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team1.bestUTRDouble.player1" :player2="team1.bestUTRDouble.player2" matchType="D" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
                <img v-if="team1.bestUTRDouble.totalUTR < team2.bestUTRDouble.totalUTR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team2.bestUTRDouble.player1" :player2="team2.bestUTRDouble.player2" matchType="D" />
            </div>
        </div>
        <div v-if="team1.bestUTRSingle" class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold bg-slate-400">
            <div class="w-40">Best single by UTR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm" >
                <img v-if="team1.bestUTRSingle.sutr > team2.bestUTRSingle.sutr" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team1.bestUTRSingle.player" matchType="S" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
                <img v-if="team1.bestUTRSingle.sutr < team2.bestUTRSingle.sutr" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team2.bestUTRSingle.player" matchType="S" />
            </div>
        </div>
        <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold">
            <div class="w-40">Best double by DR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm">
                <img v-if="team1.bestDRDouble.totalDR > team2.bestDRDouble.totalDR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team1.bestDRDouble.player1" :player2="team1.bestDRDouble.player2" matchType="D" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
                <img v-if="team1.bestDRDouble.totalDR < team2.bestDRDouble.totalDR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team2.bestDRDouble.player1" :player2="team2.bestDRDouble.player2" matchType="D" />
            </div>
        </div>
        <div v-if="team1.bestDRSingle" class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold bg-slate-400">
            <div class="w-40">Best single by DR:</div>
            <div class="flex justify-center flex-grow w-0 text-sm" >
                <img v-if="team1.bestDRSingle.dynamicRating > team2.bestUTRSingle.dynamicRating" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team1.bestDRSingle.player" matchType="S" />
            </div>
            <div class="flex justify-center flex-grow w-0 text-sm">
                <img v-if="team1.bestDRSingle.dynamicRating < team2.bestDRSingle.dynamicRating" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                <LinePlayerInfo :player1="team2.bestDRSingle.player" matchType="S" />
            </div>
        </div>
        <div class="flex items-center h-12 px-4 bg-gray-100 border-b border-gray-500">
            <div class="text-lg font-semibold">Lines</div>
        </div>
        <div v-if="team1.doubleLineStats">
            <div v-for="(doubleLineStat, index) in team1.doubleLineStats" >
                <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold">
                    <div class="w-40">Best {{doubleLineStat.lineName}} :</div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold" >
                        <img v-if="doubleLineStat.bestPair.totalUTR > team2.doubleLineStats[index].bestPair.totalUTR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        <LinePlayerInfo :player1="doubleLineStat.bestPair.player1" :player2="doubleLineStat.bestPair.player2" matchType="D" />
                    </div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold">
                        <img v-if="doubleLineStat.bestPair.totalUTR < team2.doubleLineStats[index].bestPair.totalUTR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        <LinePlayerInfo :player1="team2.doubleLineStats[index].bestPair.player1" :player2="team2.doubleLineStats[index].bestPair.player2" matchType="D" />
                    </div>
                </div>
                <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold bg-slate-400">
                    <div class="w-40">{{doubleLineStat.lineName}} W/L:</div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold" >
                        <img v-if="doubleLineStat.winPrecent > team2.doubleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        {{doubleLineStat.winMatchNo}} / {{doubleLineStat.lostMatchNo}} ({{(doubleLineStat.winPrecent*100).toFixed(2)}} %)
                    </div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold">
                        <img v-if="doubleLineStat.winPrecent < team2.doubleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        {{team2.doubleLineStats[index].winMatchNo}} / {{team2.doubleLineStats[index].lostMatchNo}} ({{(team2.doubleLineStats[index].winPrecent*100).toFixed(2)}} %)
                    </div>
                </div>
            </div>
        </div>
        <div v-if="team1.singleLineStats">
            <div v-for="(singleLineStat, index) in team1.singleLineStats" >
                <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold">
                    <div class="w-40">Best {{singleLineStat.lineName}} :</div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold" >
                        <img v-if="singleLineStat.bestSingle.singleUTR > team2.singleLineStats[index].bestSingle.singleUTR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        <LinePlayerInfo :player1="singleLineStat.bestSingle.player" matchType="S" />
                    </div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold">
                        <img v-if="singleLineStat.bestSingle.singleUTR < team2.singleLineStats[index].bestSingle.singleUTR" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        <LinePlayerInfo :player1="team2.singleLineStats[index].bestSingle.player" matchType="S" />
                    </div>
                </div>
                <div class="flex items-center h-12 px-4 border border-gray-500 font-medium font-semibold bg-slate-400">
                    <div class="w-40">{{singleLineStat.lineName}} W/L:</div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold" >
                        <img v-if="singleLineStat.winPrecent > team2.singleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        {{singleLineStat.winMatchNo}} / {{singleLineStat.lostMatchNo}} ({{(singleLineStat.winPrecent*100).toFixed(2)}} %)
                    </div>
                    <div class="flex justify-center flex-grow w-0 text-sm font-semibold">
                        <img v-if="singleLineStat.winPrecent < team2.singleLineStats[index].winPrecent" src="/pass.svg" alt="Win" class="h-8 w-10 pr-2"/>
                        {{team2.singleLineStats[index].winMatchNo}} / {{team2.singleLineStats[index].lostMatchNo}} ({{(team2.singleLineStats[index].winPrecent*100).toFixed(2)}} %)
                    </div>
                </div>
            </div>
        </div>
     </div>
</template>

