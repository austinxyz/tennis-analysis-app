<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import Button from "./components/ui/button.vue";
import { Menu, X } from "lucide-vue-next";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navItems = [
  { name: "About", path: "/" },
  { name: "USTA", path: "/usta" },
  { name: "UTR", path: "/utr" },
  { name: "紫荆杯", path: "/zijing" },
  { name: "活动", path: "/event" },
];
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-background border-b">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-primary">网球分析系统</a>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden">
            <Button variant="ghost" size="icon" @click="toggleMenu">
              <Menu v-if="!isMenuOpen" class="h-6 w-6" />
              <X v-else class="h-6 w-6" />
            </Button>
          </div>
          
          <!-- Desktop navigation -->
          <nav class="hidden md:flex items-center space-x-4">
            <RouterLink 
              v-for="item in navItems" 
              :key="item.path" 
              :to="item.path"
              class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              :class="$route.path === item.path ? 'bg-accent text-accent-foreground' : 'text-foreground'"
            >
              {{ item.name }}
            </RouterLink>
          </nav>
        </div>
      </div>
      
      <!-- Mobile navigation -->
      <div v-if="isMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="$route.path === item.path ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </header>
    
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
