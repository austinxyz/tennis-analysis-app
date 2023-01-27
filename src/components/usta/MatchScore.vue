<script>
import LineScore from "./LineScore.vue";
export default {

    props: {
        scoreCard: { type: Object},
    },

    components: {
        LineScore,
    }
};
</script>

<template>
        <table v-if="scoreCard.scores" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
          <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Type
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Home ({{scoreCard.homeTeamName}})
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Visit ({{scoreCard.guestTeamName}})
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Winners Score
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Winner
                </th>
            </tr>
          </thead>
          <tbody>
             <tr v-for="lineScore in scoreCard.scores" class="even:bg-slate-50 odd:bg-slate-400">
                <LineScore :lineScore="lineScore" />
              </tr>
          </tbody>
        </table>
</template>

