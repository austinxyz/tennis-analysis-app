<script>
import axios from "axios";
const BASE_URL = 'http://localhost:8080';
const BASE_URL_PROD = 'http://localhost:8080';

export default {

    props: {
        members: { type: Array},
        currentPlayer: {type: Object},
        showMode: {type: String},
    },

    emits: ['update:currentPlayer', 'update:members', 'changePlayer'],

    methods: {

        getBaseURL() {
            if (process.env.NODE_ENV === 'production') {
                return BASE_URL_PROD;
            } else {
                return BASE_URL;
            }

        },

        async setPlayer(member) {
            var url = this.getBaseURL() + "/players/" + member.playerId + "?action=fetch";
            const response = await axios.get(url);
            let player = response.data;

            this.$emit('update:currentPlayer', player);
            this.$emit('changePlayer', player);
        },

        async refreshUTRValue(member) {

            this.loading = true;

            if (member.utrId == null || member.utrId == '') {
                return;
            }

            var url = this.getBaseURL() + "/players/utr/" + member.utrId + "?action=refreshUTRValue";
            const response = await axios.get(url);

            this.$emit('update:currentPlayer', response.data);

            this.loading = false;
        },
        
        openUTREdit(member) {
            this.editingMember = member;
            this.editSutr = member.sutr;
            this.editDutr = member.dutr;
            this.showUTRModal = true;
        },
        
        async updateMemberUTR() {
            this.loading = true;
            
            if (this.editingMember.utrId == null || this.editingMember.utrId == '') {
                this.loading = false;
                this.showUTRModal = false;
                return;
            }
            
            // Determine which UTR values are being updated
            const originalDutr = this.editingMember.dutr;
            const originalSutr = this.editingMember.sutr;
            const dutrChanged = originalDutr !== this.editDutr;
            const sutrChanged = originalSutr !== this.editSutr;
            
            if (!dutrChanged && !sutrChanged) {
                this.loading = false;
                this.showUTRModal = false;
                return; // No changes made
            }
            
            var url = this.getBaseURL() + "/players/utr/" + this.editingMember.utrId + "?action=updateUTRValue"
                + "&dutr=" + this.editDutr + "&sutr=" + this.editSutr;
                
            try {
                const response = await axios.get(url);
                
                // Update the member in the members array
                const index = this.members.findIndex(m => m.playerId === this.editingMember.playerId);
                if (index !== -1) {
                    // Create a new array with the updated member
                    const updatedMembers = [...this.members];
                    updatedMembers[index] = {
                        ...updatedMembers[index],
                        sutr: this.editSutr,
                        dutr: this.editDutr,
                        utrrequriedRefresh: false // Clear the refresh indicator since values are now updated
                    };
                    
                    // Emit the updated members array
                    this.$emit('update:members', updatedMembers);
                    
                    // Set the updated member ID and type for the indicator
                    this.updatedMemberId = this.editingMember.playerId;
                    
                    if (dutrChanged && sutrChanged) {
                        this.updatedUTRType = 'both';
                    } else if (dutrChanged) {
                        this.updatedUTRType = 'doubles';
                    } else {
                        this.updatedUTRType = 'singles';
                    }
                    
                    this.showUpdateIndicator = true;
                    
                    // Clear the indicator after 3 seconds
                    setTimeout(() => {
                        this.showUpdateIndicator = false;
                        this.updatedMemberId = null;
                        this.updatedUTRType = null;
                    }, 3000);
                }
                
                // If this is the current player, update it
                if (this.currentPlayer && this.currentPlayer.id === response.data.id) {
                    this.$emit('update:currentPlayer', response.data);
                }
            } catch (error) {
                console.error("Error updating UTR:", error);
            }
            
            this.loading = false;
            this.showUTRModal = false;
        },
        
        toggleMemberSelection(member) {
            const index = this.selectedMembers.findIndex(m => m.playerId === member.playerId);
            if (index === -1) {
                // Member not selected, add to selection
                this.selectedMembers.push(member);
            } else {
                // Member already selected, remove from selection
                this.selectedMembers.splice(index, 1);
            }
        },
        
        openBatchUTREdit() {
            if (this.selectedMembers.length === 0) {
                return; // No members selected
            }
            
            // Initialize batch edit members with current UTR values
            this.batchEditMembers = this.selectedMembers.map(member => ({
                playerId: member.playerId,
                utrId: member.utrId,
                name: member.name,
                dutr: member.dutr,
                sutr: member.sutr,
                originalDutr: member.dutr,
                originalSutr: member.sutr
            }));
            
            this.showBatchUTRModal = true;
        },
        
        async updateBatchUTR() {
            this.loading = true;
            
            // Filter out members without utrId or without changes
            const membersToUpdate = this.batchEditMembers.filter(member => 
                member.utrId && 
                (member.dutr !== member.originalDutr || member.sutr !== member.originalSutr)
            );
            
            if (membersToUpdate.length === 0) {
                this.loading = false;
                this.showBatchUTRModal = false;
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
                const url = this.getBaseURL() + "/players/utr/batch-update";
                const response = await axios.post(url, updateData);
                
                // Update the members array with new UTR values
                const updatedMembers = [...this.members];
                const updatedMemberIds = [];
                const updatedTypes = {};
                
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
                        updatedMemberIds.push(editMember.playerId);
                        if (dutrChanged && sutrChanged) {
                            updatedTypes[editMember.playerId] = 'both';
                        } else if (dutrChanged) {
                            updatedTypes[editMember.playerId] = 'doubles';
                        } else if (sutrChanged) {
                            updatedTypes[editMember.playerId] = 'singles';
                        }
                    }
                });
                
                // Emit the updated members array
                this.$emit('update:members', updatedMembers);
                
                // Store updated member IDs and types for UI indicators
                this.updatedMemberIds = updatedMemberIds;
                this.updatedTypes = updatedTypes;
                
                // Show update indicators
                this.showUpdateIndicator = true;
                
                // Clear the indicators after 3 seconds
                setTimeout(() => {
                    this.showUpdateIndicator = false;
                    this.updatedMemberIds = [];
                    this.updatedTypes = {};
                }, 3000);
                
                // Clear selection
                this.selectedMembers = [];
            } catch (error) {
                console.error("Error updating batch UTR:", error);
            }
            
            this.loading = false;
            this.showBatchUTRModal = false;
        }
    },

    data() {
        return {
            loading: false,
            sutr:[],
            dutr:[],
            showUTRModal: false,
            showBatchUTRModal: false,
            editingMember: null,
            editSutr: null,
            editDutr: null,
            updatedMemberId: null,
            updatedUTRType: null, // 'both', 'singles', 'doubles'
            showUpdateIndicator: false,
            selectedMembers: [],
            batchEditMembers: [],
            updatedMemberIds: [],
            updatedTypes: {} // Maps playerId to update type ('both', 'singles', 'doubles')
        }
    },

    components: {
    }
};
</script>

<template>

<div class="min-w-full mx-auto">
    <div v-if="selectedMembers.length > 0" class="mb-4 flex justify-end">
        <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            @click="openBatchUTREdit"
        >
            Batch Update UTR ({{ selectedMembers.length }} selected)
        </button>
    </div>
    <table v-if="members.length >0" class="min-w-full border-collapse border-spacing-0 border border-slate-400">
        <thead>
            <tr>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    <input 
                        type="checkbox" 
                        class="form-checkbox h-4 w-4 text-blue-600"
                        :checked="selectedMembers.length === members.length"
                        @click="selectedMembers.length === members.length ? selectedMembers = [] : selectedMembers = [...members]"
                    />
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    #
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    Team member
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    NTRP
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    W/L
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    DR
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    UTR
                </th>
                <th class="px-3 py-2 bg-slate-700 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                    UTR WPct
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(member, index) in members" class="even:bg-slate-50 odd:bg-slate-400">
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <input 
                        type="checkbox" 
                        class="form-checkbox h-4 w-4 text-blue-600"
                        :checked="selectedMembers.some(m => m.playerId === member.playerId)"
                        @click="toggleMemberSelection(member)"
                    />
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ index+1 }}
                </td>
                <td v-if="showMode=='parent'" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a href="#" class="underline" @click="setPlayer(member)">
                    {{ member.name }}
                    </a>
                    {{ member.gender }}
                </td>
                <td v-else-if="showMode=='jump'" class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <a :href="'/usta/player?ustaId=' + member.ustaNorcalId" class="whitespace-no-wrap underline">
                      {{ member.name }} ({{ member.gender }})
                    </a>
                </td>
                <td v-else class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.name }} {{ member.gender }}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.rating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.winNo}} / {{member.lostNo}}<span v-if="member.qualifiedPo">^</span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ member.dynamicRating}}
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 flex flex-row align-middle">
                    <img v-if="member.utrrequriedRefresh" src="/Expired.svg" alt="Expried" class="h-5 w-5"/>
                    <div class="flex items-center">
                        <!-- Doubles UTR -->
                        <span 
                            v-if="member.dutrstatus === 'Rated'" 
                            :class="[
                                'font-semibold',
                                (showUpdateIndicator && updatedMemberId === member.playerId && 
                                (updatedUTRType === 'doubles' || updatedUTRType === 'both')) || 
                                (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                (updatedTypes[member.playerId] === 'doubles' || updatedTypes[member.playerId] === 'both')) ? 
                                'bg-green-200 px-1 rounded animate-pulse' : ''
                            ]"
                        >
                            {{ member.dutr }} (D)
                        </span>
                        <span 
                            v-else 
                            :class="[
                                'font-light',
                                (showUpdateIndicator && updatedMemberId === member.playerId && 
                                (updatedUTRType === 'doubles' || updatedUTRType === 'both')) || 
                                (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                (updatedTypes[member.playerId] === 'doubles' || updatedTypes[member.playerId] === 'both')) ? 
                                'bg-green-200 px-1 rounded animate-pulse' : ''
                            ]"
                        >
                            {{ member.dutr }} (D)
                        </span>
                        <span v-if="(showUpdateIndicator && updatedMemberId === member.playerId && 
                            (updatedUTRType === 'doubles' || updatedUTRType === 'both')) ||
                            (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                            (updatedTypes[member.playerId] === 'doubles' || updatedTypes[member.playerId] === 'both'))" 
                            class="ml-1 text-green-600 text-xs"
                        >
                            Updated!
                        </span>
                        
                        <span class="mx-1">/</span>
                        
                        <!-- Singles UTR -->
                        <span 
                            v-if="member.sutrstatus === 'Rated'" 
                            :class="[
                                'font-semibold',
                                (showUpdateIndicator && updatedMemberId === member.playerId && 
                                (updatedUTRType === 'singles' || updatedUTRType === 'both')) || 
                                (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                (updatedTypes[member.playerId] === 'singles' || updatedTypes[member.playerId] === 'both')) ? 
                                'bg-green-200 px-1 rounded animate-pulse' : ''
                            ]"
                        >
                            {{ member.sutr }} (S)
                        </span>
                        <span 
                            v-else 
                            :class="[
                                'font-light',
                                (showUpdateIndicator && updatedMemberId === member.playerId && 
                                (updatedUTRType === 'singles' || updatedUTRType === 'both')) || 
                                (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                                (updatedTypes[member.playerId] === 'singles' || updatedTypes[member.playerId] === 'both')) ? 
                                'bg-green-200 px-1 rounded animate-pulse' : ''
                            ]"
                        >
                            {{ member.sutr }} (S)
                        </span>
                        <span v-if="(showUpdateIndicator && updatedMemberId === member.playerId && 
                            (updatedUTRType === 'singles' || updatedUTRType === 'both')) ||
                            (showUpdateIndicator && updatedMemberIds.includes(member.playerId) && 
                            (updatedTypes[member.playerId] === 'singles' || updatedTypes[member.playerId] === 'both'))" 
                            class="ml-1 text-green-600 text-xs"
                        >
                            Updated!
                        </span>
                    </div>
                    <button 
                        class="ml-2 text-blue-500 hover:text-blue-700" 
                        @click.prevent="openUTREdit(member)"
                        title="Edit UTR"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    {{ (member.successRate * 100).toFixed(2) }} % (Latest)/ {{ (member.wholeSuccessRate * 100).toFixed(2) }}%
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>
         <label class="block text-gray-700 text-sm font-bold mb-2 px-2 " for="usta">
           No member are found!
         </label>
    </div>
    <div v-if="loading" class="px-5 py-5">
      <div class="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
</div>

<Modal v-model="showUTRModal" title="Update UTR Values">
    <div v-if="editingMember" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4 flex items-center space-x-4">
            <div class="w-1/2">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-dutr">
                    Doubles UTR for {{ editingMember.name }}
                </label>
                <input 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number" 
                    id="edit-dutr" 
                    v-model="editDutr" 
                    step="0.1" 
                    min="1.0" 
                    max="16.5"
                >
            </div>
            <div class="w-1/2">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-sutr">
                    Singles UTR for {{ editingMember.name }}
                </label>
                <input 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number" 
                    id="edit-sutr" 
                    v-model="editSutr" 
                    step="0.1" 
                    min="1.0" 
                    max="16.5"
                >
            </div>
        </div>
        <div class="flex items-center justify-end">
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                @click="updateMemberUTR"
            >
                Update UTR
            </button>
        </div>
    </div>
</Modal>

<Modal v-model="showBatchUTRModal" title="Batch Update UTR Values">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
            <h3 class="text-lg font-semibold mb-4">Update UTR values for {{ batchEditMembers.length }} players</h3>
            
            <div v-for="(member, index) in batchEditMembers" :key="member.playerId" class="mb-6 pb-4 border-b border-gray-200">
                <h4 class="font-medium text-gray-800 mb-2">{{ member.name }}</h4>
                <div class="flex items-center space-x-4">
                    <div class="w-1/2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" :for="'edit-dutr-' + index">
                            Doubles UTR
                        </label>
                        <input 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number" 
                            :id="'edit-dutr-' + index" 
                            v-model="batchEditMembers[index].dutr" 
                            step="0.1" 
                            min="1.0" 
                            max="16.5"
                        >
                    </div>
                    <div class="w-1/2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" :for="'edit-sutr-' + index">
                            Singles UTR
                        </label>
                        <input 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <div class="flex items-center justify-end">
            <button 
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" 
                type="button" 
                @click="showBatchUTRModal = false"
            >
                Cancel
            </button>
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                @click="updateBatchUTR"
            >
                Update All
            </button>
        </div>
    </div>
</Modal>

</template>
