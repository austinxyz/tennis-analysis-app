<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import Card from "../ui/card.vue";
import CardContent from "../ui/card-content.vue";
import CardHeader from "../ui/card-header.vue";
import CardTitle from "../ui/card-title.vue";
import Button from "../ui/button.vue";
import Badge from "../ui/badge.vue";

interface Member {
    playerId: string | number;
    name: string;
    utrId?: string;
    dutr?: number;
    sutr?: number;
    dutrstatus?: string;
    sutrstatus?: string;
    gender?: string;
    rating?: string;
    winNo?: number;
    lostNo?: number;
    qualifiedPo?: boolean;
    dynamicRating?: string;
    successRate?: number;
    wholeSuccessRate?: number;
    utrrequriedRefresh?: boolean;
    [key: string]: any;
}

interface EditingMember extends Member {
    originalDutr?: number;
    originalSutr?: number;
}

const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

const props = defineProps({
    members: { type: Array as () => Member[], required: true },
    currentPlayer: { type: Object, required: true },
    showMode: { type: String, default: 'parent' }
});

const emit = defineEmits(['update:currentPlayer', 'update:members', 'changePlayer']);

const loading = ref(false);
const showUTRModal = ref(false);
const showBatchUTRModal = ref(false);
const editingMember = ref<Member | null>(null);
const editSutr = ref<number | null>(null);
const editDutr = ref<number | null>(null);
const updatedMemberId = ref<string | number | null>(null);
const updatedUTRType = ref<string | null>(null); // 'both', 'singles', 'doubles'
const showUpdateIndicator = ref(false);
const selectedMembers = ref<Member[]>([]);
const batchEditMembers = ref<EditingMember[]>([]);
const updatedMemberIds = ref<(string | number)[]>([]);
const updatedTypes = ref<Record<string | number, string>>({});

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return BASE_URL_PROD;
    } else {
        return BASE_URL;
    }
};

const setPlayer = async (member: Member) => {
    loading.value = true;
    console.log("Fetching player:", member.playerId);
    var url = getBaseURL() + "/players/" + member.playerId + "?action=fetch";
    try {
        const response = await axios.get(url);
        let player = response.data;
        console.log("Player data received:", player);
        emit('update:currentPlayer', player);
        emit('changePlayer', player);
    } catch (error) {
        console.error("Error fetching player:", error);
    } finally {
        loading.value = false;
    }
};

const refreshUTRValue = async (member: Member) => {
    loading.value = true;

    if (!member.utrId) {
        loading.value = false;
        return;
    }

    var url = getBaseURL() + "/players/utr/" + member.utrId + "?action=refreshUTRValue";
    try {
        const response = await axios.get(url);
        emit('update:currentPlayer', response.data);
    } catch (error) {
        console.error("Error refreshing UTR value:", error);
    }

    loading.value = false;
};

const openUTREdit = (member: Member) => {
    editingMember.value = member;
    editSutr.value = member.sutr || null;
    editDutr.value = member.dutr || null;
    showUTRModal.value = true;
};

const updateMemberUTR = async () => {
    loading.value = true;
    
    if (!editingMember.value?.utrId || !editSutr.value || !editDutr.value) {
        loading.value = false;
        showUTRModal.value = false;
        return;
    }
    
    // Determine which UTR values are being updated
    const originalDutr = editingMember.value.dutr;
    const originalSutr = editingMember.value.sutr;
    const dutrChanged = originalDutr !== editDutr.value;
    const sutrChanged = originalSutr !== editSutr.value;
    
    if (!dutrChanged && !sutrChanged) {
        loading.value = false;
        showUTRModal.value = false;
        return; // No changes made
    }
    
    var url = getBaseURL() + "/players/utr/" + editingMember.value.utrId + "?action=updateUTRValue"
        + "&dutr=" + editDutr.value + "&sutr=" + editSutr.value;
        
    try {
        const response = await axios.get(url);
        
        // Update the member in the members array
        const index = props.members.findIndex(m => m.playerId === editingMember.value?.playerId);
        if (index !== -1) {
            // Create a new array with the updated member
            const updatedMembers = [...props.members];
            updatedMembers[index] = {
                ...updatedMembers[index],
                sutr: editSutr.value,
                dutr: editDutr.value,
                utrrequriedRefresh: false // Clear the refresh indicator since values are now updated
            };
            
            // Emit the updated members array
            emit('update:members', updatedMembers);
            
            // Set the updated member ID and type for the indicator
            updatedMemberId.value = editingMember.value.playerId;
            
            if (dutrChanged && sutrChanged) {
                updatedUTRType.value = 'both';
            } else if (dutrChanged) {
                updatedUTRType.value = 'doubles';
            } else {
                updatedUTRType.value = 'singles';
            }
            
            showUpdateIndicator.value = true;
            
            // Clear the indicator after 3 seconds
            setTimeout(() => {
                showUpdateIndicator.value = false;
                updatedMemberId.value = null;
                updatedUTRType.value = null;
            }, 3000);
        }
        
        // If this is the current player, update it
        if (props.currentPlayer && props.currentPlayer.id === response.data.id) {
            emit('update:currentPlayer', response.data);
        }
    } catch (error) {
        console.error("Error updating UTR:", error);
    }
    
    loading.value = false;
    showUTRModal.value = false;
};

const toggleMemberSelection = (member: Member) => {
    const index = selectedMembers.value.findIndex(m => m.playerId === member.playerId);
    if (index === -1) {
        // Member not selected, add to selection
        selectedMembers.value.push(member);
    } else {
        // Member already selected, remove from selection
        selectedMembers.value.splice(index, 1);
    }
};

const openBatchUTREdit = () => {
    if (selectedMembers.value.length === 0) {
        return; // No members selected
    }
    
    // Initialize batch edit members with current UTR values
    batchEditMembers.value = selectedMembers.value.map(member => ({
        ...member,
        originalDutr: member.dutr,
        originalSutr: member.sutr
    }));
    
    showBatchUTRModal.value = true;
};

const updateBatchUTR = async () => {
    loading.value = true;
    
    // Filter out members without utrId or without changes
    const membersToUpdate = batchEditMembers.value.filter(member => 
        member.utrId && 
        (member.dutr !== member.originalDutr || member.sutr !== member.originalSutr)
    );
    
    if (membersToUpdate.length === 0) {
        loading.value = false;
        showBatchUTRModal.value = false;
        return; // No changes to make
    }
    
    // Prepare data for batch update
    const updateData = membersToUpdate.map(member => ({
        utrId: member.utrId,
        dutr: member.dutr,
        sutr: member.sutr
    }));
    
    try {
        // Call the batch update endpoint
        const url = getBaseURL() + "/players/utr/batch-update";
        const response = await axios.post(url, updateData);
        
        // Update the members array with new UTR values
        const updatedMembers = [...props.members];
        const updatedMemberIdsArray: (string | number)[] = [];
        const updatedTypesObj: Record<string | number, string> = {};
        
        membersToUpdate.forEach(editMember => {
            const index = updatedMembers.findIndex(m => m.playerId === editMember.playerId);
            if (index !== -1) {
                // Determine which UTR values changed
                const dutrChanged = editMember.originalDutr !== editMember.dutr;
                const sutrChanged = editMember.originalSutr !== editMember.sutr;
                
                // Update the member in the array
                updatedMembers[index] = {
                    ...updatedMembers[index],
                    dutr: editMember.dutr,
                    sutr: editMember.sutr,
                    utrrequriedRefresh: false
                };
                
                // Track which members were updated and what type of update
                updatedMemberIdsArray.push(editMember.playerId);
                if (dutrChanged && sutrChanged) {
                    updatedTypesObj[editMember.playerId] = 'both';
                } else if (dutrChanged) {
                    updatedTypesObj[editMember.playerId] = 'doubles';
                } else if (sutrChanged) {
                    updatedTypesObj[editMember.playerId] = 'singles';
                }
            }
        });
        
        // Emit the updated members array
        emit('update:members', updatedMembers);
        
        // Store updated member IDs and types for UI indicators
        updatedMemberIds.value = updatedMemberIdsArray;
        updatedTypes.value = updatedTypesObj;
        
        // Show update indicators
        showUpdateIndicator.value = true;
        
        // Clear the indicators after 3 seconds
        setTimeout(() => {
            showUpdateIndicator.value = false;
            updatedMemberIds.value = [];
            updatedTypes.value = {};
        }, 3000);
        
        // Clear selection
        selectedMembers.value = [];
    } catch (error) {
        console.error("Error updating batch UTR:", error);
    }
    
    loading.value = false;
    showBatchUTRModal.value = false;
};

const toggleSelectAll = () => {
    if (selectedMembers.value.length === props.members.length) {
        selectedMembers.value = [];
    } else {
        selectedMembers.value = [...props.members];
    }
};
</script>

<template>
    <div class="w-full">
        <div v-if="selectedMembers.length > 0" class="mb-4 flex justify-end">
            <Button 
                variant="default"
                @click="openBatchUTREdit"
            >
                Batch Update UTR ({{ selectedMembers.length }} selected)
            </Button>
        </div>
        
        <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" aria-label="loading"></div>
        </div>
        
        <div v-else-if="members.length > 0" class="relative overflow-x-auto rounded-md border">
            <table class="w-full text-sm text-left">
                <thead class="text-xs uppercase bg-muted">
                    <tr>
                        <th scope="col" class="px-4 py-3">
                            <input 
                                type="checkbox" 
                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                :checked="selectedMembers.length === members.length"
                                @click="toggleSelectAll"
                            />
                        </th>
                        <th scope="col" class="px-4 py-3">#</th>
                        <th scope="col" class="px-4 py-3">Team member</th>
                        <th scope="col" class="px-4 py-3">NTRP</th>
                        <th scope="col" class="px-4 py-3">W/L</th>
                        <th scope="col" class="px-4 py-3">DR</th>
                        <th scope="col" class="px-4 py-3">UTR</th>
                        <th scope="col" class="px-4 py-3">UTR WPct</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(member, index) in members" :key="member.playerId" 
                        class="border-b hover:bg-muted/50">
                        <td class="px-4 py-3">
                            <input 
                                type="checkbox" 
                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                :checked="selectedMembers.some(m => m.playerId === member.playerId)"
                                @click="toggleMemberSelection(member)"
                            />
                        </td>
                        <td class="px-4 py-3">{{ index+1 }}</td>
                        <td class="px-4 py-3">
                            <a v-if="showMode=='parent'" href="#" class="text-primary hover:underline" @click.prevent="setPlayer(member)">
                                {{ member.name }}
                            </a>
                            <a v-else-if="showMode=='jump'" :href="'/usta/player?ustaId=' + member.ustaNorcalId" class="text-primary hover:underline">
                                {{ member.name }} ({{ member.gender }})
                            </a>
                            <span v-else>{{ member.name }} {{ member.gender }}</span>
                        </td>
                        <td class="px-4 py-3">{{ member.rating }}</td>
                        <td class="px-4 py-3">
                            {{ member.winNo }} / {{ member.lostNo }}
                            <Badge v-if="member.qualifiedPo" variant="secondary" class="ml-1">Q</Badge>
                        </td>
                        <td class="px-4 py-3">{{ member.dynamicRating }}</td>
                        <td class="px-4 py-3">
                            <div class="flex items-center">
                                <img v-if="member.utrrequriedRefresh" src="/Expired.svg" alt="Expired" class="h-5 w-5 mr-1"/>
                                <div class="flex items-center">
                                    <!-- Doubles UTR -->
                                    <span 
                                        :class="[
                                            member.dutrstatus === 'Rated' ? 'font-semibold' : 'font-normal text-muted-foreground',
                                            (showUpdateIndicator && updatedMemberId === member.playerId && 
                                            (updatedUTRType === 'doubles' || updatedUTRType === 'both')) || 
                                            (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                            (updatedTypes[member.playerId] === 'doubles' || updatedTypes[member.playerId] === 'both')) ? 
                                            'bg-green-100 dark:bg-green-900 px-1 rounded animate-pulse' : ''
                                        ]"
                                    >
                                        {{ member.dutr }} (D)
                                    </span>
                                    <span v-if="(showUpdateIndicator && updatedMemberId === member.playerId && 
                                        (updatedUTRType === 'doubles' || updatedUTRType === 'both')) ||
                                        (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                        (updatedTypes[member.playerId] === 'doubles' || updatedTypes[member.playerId] === 'both'))" 
                                        class="ml-1 text-green-600 dark:text-green-400 text-xs"
                                    >
                                        Updated!
                                    </span>
                                    
                                    <span class="mx-1">/</span>
                                    
                                    <!-- Singles UTR -->
                                    <span 
                                        :class="[
                                            member.sutrstatus === 'Rated' ? 'font-semibold' : 'font-normal text-muted-foreground',
                                            (showUpdateIndicator && updatedMemberId === member.playerId && 
                                            (updatedUTRType === 'singles' || updatedUTRType === 'both')) || 
                                            (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                            (updatedTypes[member.playerId] === 'singles' || updatedTypes[member.playerId] === 'both')) ? 
                                            'bg-green-100 dark:bg-green-900 px-1 rounded animate-pulse' : ''
                                        ]"
                                    >
                                        {{ member.sutr }} (S)
                                    </span>
                                    <span v-if="(showUpdateIndicator && updatedMemberId === member.playerId && 
                                        (updatedUTRType === 'singles' || updatedUTRType === 'both')) ||
                                        (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                        (updatedTypes[member.playerId] === 'singles' || updatedTypes[member.playerId] === 'both'))" 
                                        class="ml-1 text-green-600 dark:text-green-400 text-xs"
                                    >
                                        Updated!
                                    </span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    class="ml-2 h-8 w-8" 
                                    @click.prevent="openUTREdit(member)"
                                    title="Edit UTR"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </Button>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            {{ ((member.successRate || 0) * 100).toFixed(2) }}% (Latest) / {{ ((member.wholeSuccessRate || 0) * 100).toFixed(2) }}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div v-else class="text-center py-8 text-muted-foreground">
            No members found!
        </div>

        <!-- UTR Edit Modal -->
        <div v-if="showUTRModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card class="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Update UTR Values</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="editingMember" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1" for="edit-dutr">
                                    Doubles UTR for {{ editingMember.name }}
                                </label>
                                <input 
                                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="number" 
                                    id="edit-dutr" 
                                    v-model="editDutr" 
                                    step="0.1" 
                                    min="1.0" 
                                    max="16.5"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1" for="edit-sutr">
                                    Singles UTR for {{ editingMember.name }}
                                </label>
                                <input 
                                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="number" 
                                    id="edit-sutr" 
                                    v-model="editSutr" 
                                    step="0.1" 
                                    min="1.0" 
                                    max="16.5"
                                >
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2 mt-4">
                            <Button 
                                variant="outline" 
                                @click="showUTRModal = false"
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="default" 
                                @click="updateMemberUTR"
                            >
                                Update UTR
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Batch UTR Edit Modal -->
        <div v-if="showBatchUTRModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card class="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Batch Update UTR Values</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 class="text-lg font-medium mb-4">Update UTR values for {{ batchEditMembers.length }} players</h3>
                    
                    <div class="space-y-6">
                        <div v-for="(member, index) in batchEditMembers" :key="member.playerId" class="pb-4 border-b">
                            <h4 class="font-medium mb-2">{{ member.name }}</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1" :for="'edit-dutr-' + index">
                                        Doubles UTR
                                    </label>
                                    <input 
                                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        type="number" 
                                        :id="'edit-dutr-' + index" 
                                        v-model="batchEditMembers[index].dutr" 
                                        step="0.1" 
                                        min="1.0" 
                                        max="16.5"
                                    >
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1" :for="'edit-sutr-' + index">
                                        Singles UTR
                                    </label>
                                    <input 
                                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        type="number" 
                                        :id="'edit-sutr-' + index" 
                                        v-model="batchEditMembers[index].sutr" 
                                        step="0.1" 
                                        min="1.0" 
                                        max="16.5"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-2 mt-6">
                        <Button 
                            variant="outline" 
                            @click="showBatchUTRModal = false"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="default" 
                            @click="updateBatchUTR"
                        >
                            Update All
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
