<script>

export default {

  props: {
    result: { type: Object},
    player: { type: String},
  },

};
</script>

<template>
      <div  v-if="player" class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
        <div class="font-bold text-2xl"> Player: {{ player }} W/L - ({{result.winsNumber}}/{{result.lossesNumber}}) </div>
        <table v-for="(event, index) in result.playerEvents" class="w-full border-collapse border-spacing-0 border border-slate-100">
          <thead>
            <tr>
                <th colspan="5" class="px-3 py-2 bg-slate-400 border-b-2 border-gray-500 text-left text-sm leading-4 text-blue-500 tracking-wider">

                    <a v-if="!event.usta" :href="'/event?event=' + event.id " class="underline">
                    {{ event.name }}
                    </a>
                    <span v-else>
                    {{ event.name }}
                    </span>
                </th>
            </tr>
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
          <tbody>
             <tr v-for="(match, index) in event.results" class="even:bg-slate-50 odd:bg-slate-200">
                <td class="w-1/3 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                    {{ match.name }}
                </td>
                <td class="w-1/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                    {{ match.matchDate }}
                </td>
                <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                   <span v-if="match.type === 'single'">
                   {{ match.winner1.name }} ({{ match.winner1.sUTR }}) </span>
                   <span v-else>
                   {{ match.winner1.name }} ({{ match.winner1.dUTR }}) and
                   {{ match.winner2.name }} ({{ match.winner2.dUTR }})
                   </span>
                </td>
                <td class="w-2/9 px-3 py-2 whitespace-no-wrap border-b text-blue-700 border-gray-300 text-sm leading-5">
                   <span v-if="match.type === 'single'">
                   {{ match.loser1.name }} ({{ match.loser1.sUTR }}) </span>
                   <span v-else>
                   {{ match.loser1.name }} ({{ match.loser1.dUTR }}) and
                   {{ match.loser2.name }} ({{ match.loser2.dUTR }})
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

