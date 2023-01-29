<script>

export default {

    props: {
        player1: { type: Object},
        player2: { type: Object},
    },

}
</script>

<template>
    <div class="flex flex-col md:flex-row md:transform md:scale-75 lg:scale-100 ">
        <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl"> Player 1 {{ player1.name }} </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="player1.sUTR > player2.sUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                </div>
           Single UTR : {{player1.sUTR}} ({{ player1.sUTRStatus}})</div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="player1.dUTR > player2.dUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                </div>
           Double UTR : {{player1.dUTR}} ({{ player1.dUTRStatus}})</div>
           <hr />
         </div>
         <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-700 text-white font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl"> Player 2 {{ player2.name }} </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="player2.sUTR > player1.sUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                </div>
           Single UTR : {{player2.sUTR}} ({{ player2.sUTRStatus}})</div>
              <hr />
              <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="player2.dUTR > player1.dUTR " src="/win_1262465.png" width="30" height="30" alt="Win"/>
                </div>
           Double UTR : {{player2.dUTR}} ({{ player2.dUTRStatus}})</div>
              <hr />
         </div>
    </div>

</template>

