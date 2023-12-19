<script>

export default {

  props: {
    teamName1: { type: String},
    team1UTR: {type:Number},
    lineup1: { type: Object},
    teamName2: { type: String},
    team2UTR: {type:Number},
    lineup2: { type: Object},
  },

};
</script>

<template>
     <div class="flex flex-col md:flex-row md:transform md:scale-75 lg:scale-100 justify-center">

         <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl"> Team {{ teamName1 }} </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="team1UTR > team2UTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                </div>
           UTR : {{team1UTR.toFixed(2)}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="lineup1.D1.pair.totalUTR > lineup2.D1.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                </div>
           D1 : {{lineup1.D1.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="lineup1.D2.pair.totalUTR > lineup2.D2.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                </div>
           D2 : {{lineup1.D2.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
            <div>
                <img v-if="lineup1.D3.pair.totalUTR > lineup2.D3.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
            </div>
           D3 : {{lineup1.D3.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
            <div>
                <img v-if="lineup1.MD.pair.totalUTR > lineup2.MD.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
            </div>
           MD : {{lineup1.MD.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
            <div>
                <img v-if="lineup1.WD.pair.totalUTR > lineup2.WD.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
            </div>
           WD : {{lineup1.WD.pair.pairInfo}}</div>
           <hr />
         </div>
         <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-700 text-white font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl"> Team {{ teamName2 }} </div>
           <hr />
           <div class="text-sm my-3 flex flex-row">
                <div>
                    <img v-if="team2UTR > team1UTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                </div>
           UTR : {{team2UTR.toFixed(2)}}</div>
           <hr />
              <div class="text-sm my-3 flex flex-row">
                   <div>
                       <img v-if="lineup1.D1.pair.totalUTR < lineup2.D1.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                   </div>
              D1 : {{lineup2.D1.pair.pairInfo}}</div>
              <hr />
              <div class="text-sm my-3 flex flex-row">
                   <div>
                       <img v-if="lineup1.D2.pair.totalUTR < lineup2.D2.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
                   </div>
              D2 : {{lineup2.D2.pair.pairInfo}}</div>
              <hr />
              <div class="text-sm my-3 flex flex-row">
               <div>
                   <img v-if="lineup1.D3.pair.totalUTR < lineup2.D3.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
               </div>
              D3 : {{lineup2.D3.pair.pairInfo}}</div>
              <hr />
              <div class="text-sm my-3 flex flex-row">
               <div>
                   <img v-if="lineup1.MD.pair.totalUTR < lineup2.MD.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
               </div>
              MD : {{lineup2.MD.pair.pairInfo}}</div>
              <hr />
              <div class="text-sm my-3 flex flex-row">
               <div>
                   <img v-if="lineup1.WD.pair.totalUTR < lineup2.WD.pair.totalUTR " src="/cert.svg" alt="Win" class="h-8 w-10 pr-2"/>
               </div>
              WD : {{lineup2.WD.pair.pairInfo}}</div>
              <hr />
         </div>
     </div>
</template>

