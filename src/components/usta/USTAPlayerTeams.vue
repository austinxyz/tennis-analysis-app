<script setup lang="ts">
import { ref } from 'vue';
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";

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
    <Table v-if="teammembers.length > 0">
        <TableHeader class="text-xs uppercase bg-muted">
            <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Division Name</TableHead>
                <TableHead>Flight Name</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>W/L</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(member, index) in teammembers" :key="index">
                <TableCell>{{ index + 1 }}</TableCell>
                <TableCell>{{ member.divisionName }}</TableCell>
                <TableCell>{{ member.flightName }}</TableCell>
                <TableCell>
                    <Button 
                        variant="link" 
                        class="p-0 h-auto text-primary"
                        @click="openInNewTab('/usta/team?teamId=' + member.teamId)"
                    >
                        <span v-if="member.teamAlias" class="text-muted-foreground">[{{ member.teamAlias }}]</span>
                        {{ member.teamName }}
                    </Button>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">
                        {{ member.winNo }} / {{ member.lostNo }}
                    </Badge>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
    <div v-else class="text-center py-8 text-muted-foreground">
        No team memberships found!
    </div>
</template>
