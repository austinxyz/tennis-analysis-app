<script>
import axios from "axios";

export default {

    props: {
        comment: { type: String},
        showScoreComment: {type: Boolean},
    },

};
</script>

<template>
    <Modal :showModal="showScoreComment" title="Match Memo" >
        <div class="min-w-full">
            {{comment}}
        </div>
    </Modal>
</template>
