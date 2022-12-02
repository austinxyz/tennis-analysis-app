<script>

export default {

  props: {
    teamName1: { type: String},
    lineup1: { type: Object},
    teamName2: { type: String},
    lineup2: { type: Object},
  },

};
</script>

<template>
     <div class="flex flex-col md:flex-row md:transform md:scale-75 lg:scale-100 justify-center">
         <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-100 font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl"> Team {{ teamName1 }} </div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> D1 : {{lineup1.D1.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> D2 : {{lineup1.D2.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> D3 : {{lineup1.D3.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> MD : {{lineup1.MD.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> WD : {{lineup1.WD.pair.pairInfo}}</div>
           <hr />
         </div>
         <div class="border-transparent rounded-lg text-center p-5 mx-auto md:mx-0 my-2 bg-gray-700 text-white font-medium z-10 shadow-lg">
           <div class="font-bold text-2xl"> Team {{ teamName2 }} </div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> D1 : {{lineup2.D1.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> D2 : {{lineup2.D2.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> D3 : {{lineup2.D3.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> MD : {{lineup2.MD.pair.pairInfo}}</div>
           <hr />
           <div class="text-sm my-3 flex flex-row"> WD : {{lineup2.WD.pair.pairInfo}}</div>
           <hr />
         </div>
     </div>
</template>

