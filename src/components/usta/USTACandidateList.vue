<script setup>
import { ref } from 'vue';
import axios from "axios";
import Table from "../ui/table.vue";
import TableHeader from "../ui/table-header.vue";
import TableBody from "../ui/table-body.vue";
import TableRow from "../ui/table-row.vue";
import TableHead from "../ui/table-head.vue";
import TableCell from "../ui/table-cell.vue";
import Button from "../ui/button.vue";

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    members: { type: Array },
    currentPlayer: { type: Object },
    showMode: { type: String },
    team: { type: Object }
});

const emit = defineEmits(['update:currentPlayer', 'update:members', 'changePlayer']);

const loading = ref(false);

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const setPlayer = async (member) => {
    var url = getBaseURL() + "/players/" + member.playerId + "?action=fetch";
    const response = await axios.get(url);
    let player = response.data;
    console.log(player);
    emit('update:currentPlayer', player);
    emit('changePlayer', player);
};

const refreshUTR = async (member) => {
    loading.value = true;

    if (member.utrId == null || member.utrId == '') {
        return;
    }

    var url = getBaseURL() + "/players/utr/" + member.utrId + "?action=refreshUTRValue";
    const response = await axios.get(url);

    emit('update:currentPlayer', response.data);

    loading.value = false;
};
</script>

<template>

<div class="min-w-full mx-auto">
    <Table v-if="members.length > 0" class="border">
        <TableHeader class="bg-muted">
            <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Candidate Name</TableHead>
                <TableHead>M/F</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>UTR WPct</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(member, index) in members" :key="index" class="even:bg-muted/10">
                <TableCell>{{ index+1 }}</TableCell>
                <TableCell v-if="showMode=='parent'">
                    <Button variant="link" class="p-0 h-auto" @click="setPlayer(member)">
                        {{ member.name }}
                    </Button>
                </TableCell>
                <TableCell v-if="showMode=='jump'">
                    <Button variant="link" class="p-0 h-auto" tag="a" :href="'/usta/player?ustaId=' + member.ustaNorcalId">
                        {{ member.name }}
                    </Button>
                </TableCell>
                <TableCell>{{ member.gender }}</TableCell>
                <TableCell>{{ member.ustaRating }}</TableCell>
                <TableCell>{{ member.requiredMatchNo }}</TableCell>
                <TableCell>
                    <div class="flex items-center gap-1">
                        <span :class="member.dutrstatus === 'Rated' ? 'font-semibold' : 'font-light'">
                            {{ member.dutr }} (D)
                        </span>
                        <span>/</span>
                        <span :class="member.sutrstatus === 'Rated' ? 'font-semibold' : 'font-light'">
                            {{ member.sutr }} (S)
                        </span>
                        <Button 
                            v-if="!member.refreshedUTR && member.utrId!=null" 
                            variant="link" 
                            class="p-0 h-auto text-xs ml-1" 
                            @click="refreshUTR(member)"
                        >
                            Refresh UTR
                        </Button>
                    </div>
                </TableCell>
                <TableCell>
                    {{ (member.successRate * 100).toFixed(2) }}% (Latest) / {{ (member.wholeSuccessRate * 100).toFixed(2) }}%
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                    Total Matches No (Male): {{team.requiredTotalMaleMatchesNo}}
                </TableCell>
                <TableCell>
                    Total Matches No (Female): {{team.requiredTotalFemaleMatchesNo}}
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
    <div v-else class="text-center py-8 text-muted-foreground">
        No candidates found!
    </div>
    <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
    </div>
</div>

</template>
