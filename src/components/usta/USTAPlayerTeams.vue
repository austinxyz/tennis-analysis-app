<script>

export default {

    props: {
        teams: { type: Array},
        team: {type: Object},
    },

    emits: ["update:team"],

    methods: {

        getTeam(team) {
            this.$emit('update:team', team);
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
    <table v-if="teams.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
        <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Name
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Players
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Flight
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Captain
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    TR
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(team, index) in teams" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="'/usta/team?teamId=' + team.id" class="underline" target="_blank">
                        <span v-if="team.alias">[{{ team.alias }}] </span> {{team.name}}
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="getTeam(team)">
                        <span> Players </span>
                    </a>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ team.areaCode}}-{{team.flight}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ team.captainName}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="team.tennisRecordLink" class="underline" target="_blank">
                    TR Link
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="font-bold text-2xl text-left flex flex-row p-2">
        <div class="w-4/5 text-left">Team : <a :href="team.link" class="underline" target="_blank">{{team.name}}</a></div>
    </div>
    <table v-if="team.players" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
      <thead>
        <tr>
            <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                #
            </th>
            <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Player
            </th>
            <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                NTRP
            </th>
            <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                UTR Rating
            </th>
            <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                UTR Win Ratio
            </th>
            <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                DR
            </th>
        </tr>
      </thead>
      <tbody>
         <tr v-for="(player, index) in team.players" class="even:bg-slate-50 odd:bg-slate-400">
            <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                {{ index+1 }}
            </td>
            <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
               <a :href="'/usta/player?ustaId=' + player.ustaNorcalId" class="whitespace-no-wrap underline">
                  {{ player.name }} ({{ player.gender }})
              </a>
            </td>
            <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                {{ player.ustaRating}}
            </td>
            <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                <span v-if="player.dutrstatus === 'Rated'" class="font-semibold" >
                    {{ player.dutr }} (D)
                </span>
                <span v-else class="font-light" >
                    {{ player.dutr }} (D)
                </span>
                <span v-if="player.sutrstatus === 'Rated'" class="font-semibold" >
                    {{ player.sutr }} (S)
                </span>
                <span v-else class="font-light" >
                    {{ player.sutr }} (S)
                </span>  /
            </td>
            <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                {{ (player.successRate * 100).toFixed(2) }} % (Latest)/ {{ (player.wholeSuccessRate * 100).toFixed(2) }}%
            </td>
            <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                {{ player.dynamicRating}}
            </td>
          </tr>
      </tbody>
    </table>
</template>

