<script>
import LineScore from "./LineScore.vue";
export default {

    props: {
        match: { type: Object},
    },

    emits: ['change'],

    methods: {

        refreshScore(score) {
            this.$emit('change', score);
        },

    },

    components: {
        LineScore,
    }
};
</script>

<template>
        <table v-if="match.lines" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="w-1/20 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Type
                </th>
                <th class="w-2/5 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                <div class="flex flex-row align-middle">
                    <img v-if="match.homeWin" src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                    <span class="align-middle"> Home Team - {{match.homeTeamName}} - {{match.homePoint}}</span>
                </div>
                </th>
                <th class="w-2/5 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                <div class="flex flex-row align-middle">
                    <img v-if="!match.homeWin" src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                    <span class="align-middle" > Visitor Team - {{match.guestTeamName}} - {{match.guestPoint}}  </span>
                </div>
                </th>
                <th class="w-1/10 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Winners Score
                </th>
                <th class="w-1/10 px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Comment
                </th>
            </tr>
          </thead>
          <tbody>
             <tr v-for="lineScore in match.lines" class="even:bg-slate-50 odd:bg-slate-200">
                <LineScore :lineScore="lineScore" @change="refreshScore"/>
              </tr>
          </tbody>
        </table>
</template>

