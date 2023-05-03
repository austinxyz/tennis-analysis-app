<script>
import axios from "axios";
import Line from "../Line.vue";

export default {

    props: {
        candidateTeam: { type: Object},
    },

    components: {
        Line
    }
}
</script>

<template>
<div v-if="candidateTeam" class="min-w-full mx-auto">
    <div v-for="(line, key) in candidateTeam.lines" class="flex flex-row">
        <div class="w-50 min-w-fit">
            <Line :lineName="key" :pairs="line.topPairs" />
        </div>
    </div>
</div>
</template>

