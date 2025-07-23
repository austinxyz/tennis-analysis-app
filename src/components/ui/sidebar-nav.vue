<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../lib/utils/cn";
import { useRoute } from "vue-router";

const props = defineProps({
  items: {
    type: Array as () => { title: string; href: string; icon?: any }[],
    required: true,
  },
  class: {
    type: String,
    default: "",
  },
});

const route = useRoute();

const isActive = (href: string) => {
  return route.path === href;
};
</script>

<template>
  <nav :class="cn('flex flex-col space-y-1', props.class)">
    <router-link
      v-for="item in props.items"
      :key="item.href"
      :to="item.href"
      :class="cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive(item.href)
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )"
    >
      <component
        v-if="item.icon"
        :is="item.icon"
        class="mr-2 h-4 w-4"
      />
      <span>{{ item.title }}</span>
    </router-link>
  </nav>
</template>
