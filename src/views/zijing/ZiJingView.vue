<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <div class="flex flex-no-wrap">
        <div style="min-height: 716px" class="min-h-max w-50 absolute sm:relative bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex">
            <nav class="px-2">
                <span class="w-40 flex px-4 py-2 font-large text-gray-100 text-center"> 紫荆杯 </span>
                <ul class="mt-12 flex flex-col">
                    <li class="w-full justify-between text-gray-300 cursor-pointer items-center mb-6">
                           <router-link to="/zijing/team" class="flex flex-row py-2 mt-2 text-normal font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-grid" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                     <path stroke="none" d="M0 0h24v24H0z"></path>
                                     <rect x="4" y="4" width="6" height="6" rx="1"></rect>
                                     <rect x="14" y="4" width="6" height="6" rx="1"></rect>
                                     <rect x="4" y="14" width="6" height="6" rx="1"></rect>
                                     <rect x="14" y="14" width="6" height="6" rx="1"></rect>
                                 </svg>
                                 <span class="px-2 text-sm font-semibold whitespace-no-wrap">
                                 队伍
                                 </span>
                            </router-link>
                    </li>
                    <li class="w-full justify-between text-gray-300 cursor-pointer items-center mb-6">
                           <router-link to="/zijing/analysis" class="flex flex-row py-2 mt-2 text-normal font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-grid" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                     <path stroke="none" d="M0 0h24v24H0z"></path>
                                     <rect x="4" y="4" width="6" height="6" rx="1"></rect>
                                     <rect x="14" y="4" width="6" height="6" rx="1"></rect>
                                     <rect x="4" y="14" width="6" height="6" rx="1"></rect>
                                     <rect x="14" y="14" width="6" height="6" rx="1"></rect>
                                 </svg>
                                 <span class="px-2 text-sm font-semibold whitespace-no-wrap">
                                 分析
                                 </span>
                            </router-link>
                    </li>
                </ul>
            </nav>
        </div>
        <router-view></router-view>
    </div>
</template>