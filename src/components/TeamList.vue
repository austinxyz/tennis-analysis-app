<script>
export default {
    data() {
  	    return {
	        teams: [
              {
                id: 'BD',
                name: '北大',
              },
              {
                id: 'BFB',
                name: '北复伯',
              },
              {
                id: 'DHF',
                name: '大华附',
              },
              {
                id: 'DQH',
                name: '两岸清华',
              },
              {
                name: '华山',
                id: 'HS',
              },
              {
                name: '航燕伯',
                id: 'HYB',
              },
              {
                name: '交大',
                id: 'JD',
              },
              {
                name: '交吉队',
                id: 'JJ',
              },
              {
                name: '科大南加伯克利',
                id: 'KDB',
              },
              {
                name: '科大侨大Rutgers',
                id: 'KDQ',
              },
              {
                name: '清华MIT',
                id: 'QHM',
              },
              {
                name: '圣吉伯爱之星',
                id: 'SJB',
              },
              {
                name: '天南南',
                id: 'TNN',
              },
              {
                name: '台湾阿交伯',
                id: 'TW',
              },
              {
                name: '中大UCBD',
                id: 'ZDBD',
              },	              
	          {
                name: '浙大北高',
                id: 'ZJU_BYD',
              }
	        ]
  	    }
    }
}
</script>

<template>
  <nav class="flex flex-col bg-slate-700 w-60 px-2 py-2 text-gray-900 border border-purple-900">
    <ul class="ml-1">
          <li v-for="team in teams" class="mb-1 px-0 py-2 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
            <span>
               <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
               <path
                   d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6
                                4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6
                                4h4v-4h-4M4 8h4V4H4v4z"
                   ></path>
               </svg>
            </span>
            <a :href="'?team=' + team.id">
                <span class="ml-1">{{ team.name }}</span>
            </a>
          </li>
      </ul>
    </nav>
</template>

