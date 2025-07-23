<script setup lang="ts">
import { ref } from "vue";
import SidebarNav from "../../components/ui/sidebar-nav.vue";
import { 
  LayoutGrid, 
  Calendar, 
  UserRound, 
  BarChart, 
  Menu, 
  X 
} from "lucide-vue-next";
import Button from "../../components/ui/button.vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const sidebarItems = [
  {
    title: "BAT Club",
    href: "/utr/bat",
    icon: LayoutGrid
  },
  {
    title: "Event",
    href: "/utr/event",
    icon: Calendar
  },
  {
    title: "Player",
    href: "/utr/player",
    icon: UserRound
  },
  {
    title: "单打分析",
    href: "/utr/single",
    icon: BarChart
  }
];
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar for desktop -->
    <aside class="hidden md:flex w-64 flex-col bg-card border-r h-screen">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-primary">UTR</h2>
        <div class="mt-6">
          <SidebarNav :items="sidebarItems" />
        </div>
      </div>
    </aside>

    <!-- Mobile menu button -->
    <div class="md:hidden fixed top-4 left-4 z-50">
      <Button variant="outline" size="icon" @click="toggleMenu">
        <Menu v-if="!isMenuOpen" class="h-5 w-5" />
        <X v-else class="h-5 w-5" />
      </Button>
    </div>

    <!-- Mobile sidebar -->
    <aside 
      v-if="isMenuOpen" 
      class="fixed inset-0 z-40 md:hidden"
    >
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" @click="toggleMenu"></div>
      <div class="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card border-r p-6 shadow-lg">
        <h2 class="text-2xl font-bold text-primary mb-6">UTR</h2>
        <SidebarNav :items="sidebarItems" @click="toggleMenu" />
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6 md:p-8">
      <router-view></router-view>
    </main>
  </div>
</template>
