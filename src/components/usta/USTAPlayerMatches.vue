<script>
import LineScore from "./LineScore.vue";

export default {

    props: {
        scores: { type: Array},
    },

    components: {
        LineScore,
    }
};
</script>

<template>
    <div v-if="scores.length > 0"  class="border-transparent rounded-lg text-center p-3 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
        <table class="min-w-full border-collapse border-spacing-0 border border-slate-400">
              <thead>
                <tr>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Match Type
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Home Players
                    </th>
                    <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                        Visit Players
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
                 <tr v-for="lineScore in scores" class="even:bg-slate-50 odd:bg-slate-400">
                    <LineScore :lineScore="lineScore" />
                  </tr>
              </tbody>
        </table>
    </div>
</template>

