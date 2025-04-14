<script>
import axios from "axios";

export default {

    props: {
        candidateTeam: { type: Object},
    },

    data() {
        return {
            bglist: {
                D1:'text-white bg-blue-700 font-medium rounded-lg text-sm px-2 py-1',
                D2:'text-white bg-orange-500 font-medium rounded-lg text-sm px-2 py-1',
                D3:'text-white bg-yellow-500 font-medium rounded-lg text-sm px-2 py-1',
                D4:'text-white bg-green-500 font-medium rounded-lg text-sm px-2 py-1',
                WD:'text-white bg-red-500 font-medium rounded-lg text-sm px-2 py-1',
                MD:'text-white bg-teal-500 font-medium rounded-lg text-sm px-2 py-1',
            }
        }
    },

    components: {
    }
}
</script>

<template>
<div v-if="candidateTeam" class="min-w-full mx-auto">
    <table v-if="candidateTeam.candidates.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
        <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Match UTR
                </th>
                <th v-for="candidate in candidateTeam.candidates" class="px-3 py-2 bg-slate-700 whitespace-no-wrap border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    <span class="whitespace-nowrap" >{{candidate.name}}</span>
                </th>
            </tr>
            <tr>
                <td class="px-3 py-2 bg-slate-500 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-700 tracking-wider">
                </td>
                <td class="px-3 py-2 bg-slate-500 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-700 tracking-wider">
                </td>
                <td v-for="candidate in candidateTeam.candidates" class="px-3 py-2 bg-slate-500 border-b-2 border-gray-300 text-left text-sm leading-4 text-white tracking-wider">
                    {{candidate.utr}}
                </td>
            </tr>
            <tr v-for="candidate1 in candidateTeam.candidates" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span class="whitespace-nowrap" >{{ candidate1.name }}</span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm text-blue leading-5">
                    {{ candidate1.utr }}
                </td>
                <td v-for="candidate2 in candidateTeam.candidates" class="whitespace-no-wrap border-2 text-blue-900 border-gray-500 text-sm leading-5">
                    <div v-for="(line, key) in candidateTeam.lines" >
                        <button v-if="(candidate1!=candidate2) && (candidate1.utr+candidate2.utr) < line.utrLimit && (candidate1.utr+candidate2.utr) > line.utrLimit-1" :class="bglist[key]">
                            {{ (candidate1.utr+candidate2.utr).toFixed(2) }}
                        </button>
                    </div>
                </td>
            </tr>
        </thead>
    </table>
    <table class="my-5 border-collapse border-spacing-0 border border-slate-400">
        <tr v-for="(line, key) in candidateTeam.lines" class="px-3 py-2 whitespace-nowrap border-2 text-blue-900 border-gray-500 text-sm leading-5" >
            <td>{{key}}</td>
            <td :class="bglist[key]">{{line.utrLimit}}</td>
            <td v-for="pair in line.topPairs" class="whitespace-no-wrap border-2 text-blue-900 border-gray-500 text-sm leading-5">
                {{ pair.pairInfo }}
            </td>
        </tr>
    </table>
</div>
</template>

