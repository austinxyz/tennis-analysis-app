<script setup lang="ts">
import DivisionList from "../components/DivisionList.vue";
import Division from "../components/Division.vue";
</script>

<template>
    <div class="flex flex-row min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <div class="bg-white shadow-dashboard px-2 py-2 rounded-lg m-2">
            <DivisionList />
        </div>
        <div class="m-2 flex flow-row">
            <Division />
        </div>
    </div>
</template>