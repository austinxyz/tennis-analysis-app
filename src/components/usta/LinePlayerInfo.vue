<script>

export default {

    props: {
        player1: {type: Object},
        player2: {type: Object},
        winner: {type: Boolean},
        matchType: {type: String}
    },

};
</script>

<template>
    <span v-if="player1" class="flex flex-row">
        <img v-if="winner" src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
        <span v-if="matchType === 'S'">
            <a :href="'player?ustaId=' + player1.ustaNorcalId" class="underline" target="_blank">
                {{ player1.name }} ({{player1.gender}}) </a>
                <span v-if="player1.sutrstatus === 'Rated'" class="font-semibold" >
                    - {{ player1.sutr }} (S)
                </span>
                <span v-else class="font-light" >
                    - {{ player1.sutr }} (S)
                </span>
                <span> / {{player1.dynamicRating}} (DR) </span>
        </span>
        <span v-else class="font-light flex flex-col" >
            <span class="flex flex-row">
            <a :href="'player?ustaId=' + player1.ustaNorcalId" class="underline" target="_blank">
                {{ player1.name }} ({{player1.gender}}) </a>
                <span v-if="player1.dutrstatus === 'Rated'" class="font-semibold" >
                    &nbsp- {{ player1.dutr }} (D)
                </span>
                <span v-else class="font-light" >
                    &nbsp- {{ player1.dutr }} (D)
                </span>
                <span> &nbsp/ {{player1.dynamicRating}} (DR) </span>
            </span>
            <span v-if="player2" class="flex flex-row">
            <a :href="'player?ustaId=' + player2.ustaNorcalId" class="underline" target="_blank">
                {{ player2.name }} ({{player2.gender}}) </a>
                <span v-if="player2.dutrstatus === 'Rated'" class="font-semibold" >
                    &nbsp- {{ player2.dutr }} (D)
                </span>
                <span v-else class="font-light" >
                    &nbsp- {{ player2.dutr }} (D)
                </span>
                <span> &nbsp/ {{player2.dynamicRating}} (DR) </span>
            </span>
        </span>
    </span>
</template>

