<script setup lang="ts">
import TeamList from "../../components/TeamList.vue";
import Team from "../../components/Team.vue";
import Card from "../../components/ui/card.vue";
import CardContent from "../../components/ui/card-content.vue";
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 w-full">
    <Card class="w-full md:w-1/4">
      <CardContent class="pt-6">
        <TeamList />
      </CardContent>
    </Card>
    
    <div class="w-full md:flex-1">
      <Team />
    </div>
  </div>
</template>
