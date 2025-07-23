<script setup lang="ts">
import { ref } from "vue";
import SidebarNav from "../../components/ui/sidebar-nav.vue";
import { 
  LayoutGrid, 
  Users, 
  UserRound, 
  BarChart, 
  Trophy, 
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
    title: "League",
    href: "/usta/league",
    icon: LayoutGrid
  },
  {
    title: "Candidate Team",
    href: "/usta/candidateteam",
    icon: Users
  },
  {
    title: "Team",
    href: "/usta/team",
    icon: Users
  },
  {
    title: "Player",
    href: "/usta/player",
    icon: UserRound
  },
  {
    title: "Player Stat",
    href: "/usta/playerstat",
    icon: BarChart
  },
  {
    title: "Team Analysis",
    href: "/usta/teamanalysis",
    icon: Trophy
  }
];
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar for desktop -->
    <aside class="hidden md:flex w-64 flex-col bg-card border-r h-screen">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-primary">USTA</h2>
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
        <h2 class="text-2xl font-bold text-primary mb-6">USTA</h2>
        <SidebarNav :items="sidebarItems" @click="toggleMenu" />
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6 md:p-8">
      <router-view></router-view>
    </main>
  </div>
</template>
