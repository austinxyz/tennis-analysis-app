<script setup lang="ts">
import { ref } from 'vue';
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface TeamMember {
    teamId?: string | number;
    teamName?: string;
    teamAlias?: string;
    divisionName?: string;
    flightName?: string;
    winNo?: number;
    lostNo?: number;
    [key: string]: any;
}

const props = defineProps({
    teammembers: { type: Array as () => TeamMember[], required: true }
});

const loading = ref(false);

// Helper function to open links in a new tab
const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <div v-if="teammembers.length > 0" class="relative overflow-x-auto rounded-md border">
        <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-muted">
                <tr>
                    <th scope="col" class="px-4 py-3">#</th>
                    <th scope="col" class="px-4 py-3">Division Name</th>
                    <th scope="col" class="px-4 py-3">Flight Name</th>
                    <th scope="col" class="px-4 py-3">Team Name</th>
                    <th scope="col" class="px-4 py-3">W/L</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(member, index) in teammembers" :key="index" class="border-b hover:bg-muted/50">
                    <td class="px-4 py-3">{{ index + 1 }}</td>
                    <td class="px-4 py-3">{{ member.divisionName }}</td>
                    <td class="px-4 py-3">{{ member.flightName }}</td>
                    <td class="px-4 py-3">
                        <Button 
                            variant="link" 
                            class="p-0 h-auto text-primary"
                            @click="openInNewTab('/usta/team?teamId=' + member.teamId)"
                        >
                            <span v-if="member.teamAlias" class="text-muted-foreground">[{{ member.teamAlias }}]</span>
                            {{ member.teamName }}
                        </Button>
                    </td>
                    <td class="px-4 py-3">
                        <Badge variant="outline">
                            {{ member.winNo }} / {{ member.lostNo }}
                        </Badge>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else class="text-center py-8 text-muted-foreground">
        No team memberships found!
    </div>
</template>
