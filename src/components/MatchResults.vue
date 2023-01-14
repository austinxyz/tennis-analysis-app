<script>

export default {

  props: {
    matches: { type: Array},
    singlemode: {tpye: String}
  },

};
</script>

<template>
      <div  v-if="matches.length > 0" class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <table class="w-full border-collapse border-spacing-0 border border-slate-100">
          <thead>
            <tr>
                <th class="w-1/3 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match Name
                </th>
                <th class="w-1/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Time
                </th>
                <th class="w-2/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Winner
                </th>
                <th class="w-2/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Loser
                </th>
                <th class="w-1/9 px-3 py-2 bg-slate-700 border-b-2 border-gray-100 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Score
                </th>
            </tr>
          </thead>
          <tbody v-for="(match, index) in matches">
             <tr v-if="(singlemode == 'all') || (singlemode == match.type)" class="even:bg-slate-50 odd:bg-slate-200">
                <td class="w-1/3 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                    {{ match.name }}
                </td>
                <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                    {{ match.matchDate }}
                </td>
                <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                   <span v-if="match.winner" class="border-transparent rounded-lg text-center px-1 py-1 mx-auto md:mx-0 my-2 bg-gray-300 font-medium z-10 shadow-lg">
                        {{match.winnerInfo}}
                   </span>
                   <span v-else>
                        {{match.winnerInfo}}
                   </span>
                </td>
                <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                   <span v-if="match.winner" >
                        {{match.loserInfo}}
                   </span>
                   <span v-else class="border-transparent rounded-lg text-center px-1 py-1 mx-auto md:mx-0 my-2 bg-gray-300 font-medium z-10 shadow-lg">
                        {{match.loserInfo}}
                   </span>
                </td>
                <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                    {{ match.matchScore }}
                </td>
              </tr>
          </tbody>
        </table>
      </div>
</template>

